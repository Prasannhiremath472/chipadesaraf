const Razorpay = require('razorpay')
const crypto   = require('crypto')
const pool     = require('../config/database')
const { success } = require('../utils/response')
const { AppError } = require('../middlewares/errorHandler')
const { sendEmail, orderConfirmationHtml } = require('../utils/email')
const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = require('../config/env')

const razorpay = new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET })

/* ── Create order ── */
async function createOrder(req, res, next) {
  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()

    const { items, shipping, payment, couponCode, notes, giftWrap } = req.body
    const userId = req.user.id

    if (!items?.length) throw new AppError('Cart is empty', 400)

    // Validate items and compute totals
    let subtotal = 0
    const orderItems = []

    for (const item of items) {
      const [rows] = await conn.query(
        'SELECT id, name, price, stock, thumbnail FROM products WHERE id = ? AND active = 1',
        [item.id],
      )
      if (!rows.length) throw new AppError(`Product ${item.id} not found`, 404)
      const product = rows[0]
      if (product.stock < item.qty) throw new AppError(`Insufficient stock for ${product.name}`, 400)

      subtotal += product.price * item.qty
      orderItems.push({ ...product, qty: item.qty })
    }

    // Coupon
    let discount   = 0
    let couponId   = null

    if (couponCode) {
      const [coupons] = await conn.query(
        'SELECT * FROM coupons WHERE code = ? AND active = 1 AND (expiresAt IS NULL OR expiresAt > NOW()) AND (usageLimit IS NULL OR usedCount < usageLimit)',
        [couponCode],
      )
      if (coupons.length) {
        const coupon = coupons[0]
        if (subtotal >= (coupon.minOrder || 0)) {
          discount = coupon.type === 'percent'
            ? Math.min((subtotal * coupon.value) / 100, coupon.maxDiscount || Infinity)
            : coupon.value
          couponId = coupon.id
        }
      }
    }

    const gst   = (subtotal - discount) * 0.03
    const total = subtotal - discount + gst + (giftWrap ? 500 : 0)

    // Create order record
    const [orderResult] = await conn.query(
      `INSERT INTO orders (userId, subtotal, discount, gst, total, status, paymentMethod, paymentStatus,
        couponId, notes, giftWrap, shippingAddress)
       VALUES (?, ?, ?, ?, ?, 'pending', ?, 'pending', ?, ?, ?, ?)`,
      [userId, subtotal, discount, gst, total, payment, couponId, notes || null,
       giftWrap ? 1 : 0, JSON.stringify(shipping)],
    )
    const orderId = orderResult.insertId

    // Insert order items & decrement stock
    for (const item of orderItems) {
      await conn.query(
        'INSERT INTO order_items (orderId, productId, name, price, qty, thumbnail) VALUES (?, ?, ?, ?, ?, ?)',
        [orderId, item.id, item.name, item.price, item.qty, item.thumbnail],
      )
      await conn.query(
        'UPDATE products SET stock = stock - ?, soldCount = soldCount + ? WHERE id = ?',
        [item.qty, item.qty, item.id],
      )
    }

    // Increment coupon usage
    if (couponId) {
      await conn.query('UPDATE coupons SET usedCount = usedCount + 1 WHERE id = ?', [couponId])
    }

    let razorpayOrderId  = null
    let razorpayAmount   = null

    if (payment === 'razorpay') {
      const rOrder = await razorpay.orders.create({
        amount:   Math.round(total * 100),
        currency: 'INR',
        receipt:  `order_${orderId}`,
        notes:    { orderId: String(orderId) },
      })
      razorpayOrderId = rOrder.id
      razorpayAmount  = rOrder.amount
      await conn.query('UPDATE orders SET razorpayOrderId = ? WHERE id = ?', [razorpayOrderId, orderId])
    }

    if (payment === 'cod') {
      await conn.query("UPDATE orders SET status = 'confirmed', paymentStatus = 'pending' WHERE id = ?", [orderId])
    }

    await conn.commit()

    // Send confirmation email async
    sendEmail({
      to:      req.user.email,
      subject: `Order Confirmed — #${orderId}`,
      html:    orderConfirmationHtml({ id: orderId, total }, req.user),
    }).catch(() => {})

    return success(res, { orderId, razorpayOrderId, razorpayAmount }, 'Order placed', 201)
  } catch (err) {
    await conn.rollback()
    next(err)
  } finally {
    conn.release()
  }
}

/* ── Verify Razorpay payment ── */
async function verifyPayment(req, res, next) {
  try {
    const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body

    const body      = razorpayOrderId + '|' + razorpayPaymentId
    const expected  = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET).update(body).digest('hex')

    if (expected !== razorpaySignature) throw new AppError('Payment verification failed', 400)

    await pool.query(
      `UPDATE orders SET paymentStatus = 'paid', status = 'confirmed',
       razorpayPaymentId = ? WHERE id = ?`,
      [razorpayPaymentId, orderId],
    )

    return success(res, { orderId }, 'Payment verified')
  } catch (err) { next(err) }
}

/* ── My orders ── */
async function getMyOrders(req, res, next) {
  try {
    const [orders] = await pool.query(
      `SELECT o.id, o.status, o.total, o.paymentStatus, o.paymentMethod, o.createdAt,
              COUNT(oi.id) as itemCount
       FROM orders o LEFT JOIN order_items oi ON o.id = oi.orderId
       WHERE o.userId = ? GROUP BY o.id ORDER BY o.createdAt DESC`,
      [req.user.id],
    )
    return success(res, { orders })
  } catch (err) { next(err) }
}

/* ── Single order (customer) ── */
async function getOrder(req, res, next) {
  try {
    const { id } = req.params
    const [orders] = await pool.query('SELECT * FROM orders WHERE id = ? AND userId = ?', [id, req.user.id])
    if (!orders.length) throw new AppError('Order not found', 404)

    const order    = orders[0]
    const [items]  = await pool.query('SELECT * FROM order_items WHERE orderId = ?', [id])

    try { order.shippingAddress = JSON.parse(order.shippingAddress || '{}') } catch {}
    order.items = items

    return success(res, { order })
  } catch (err) { next(err) }
}

/* ── Admin: All orders ── */
async function getAllOrders(req, res, next) {
  try {
    const { status, page = 1, limit = 25 } = req.query
    const offset = (parseInt(page) - 1) * parseInt(limit)

    const conditions = []
    const params     = []
    if (status) { conditions.push('o.status = ?'); params.push(status) }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

    const [orders] = await pool.query(
      `SELECT o.id, o.status, o.total, o.paymentStatus, o.paymentMethod, o.createdAt,
              u.firstName, u.lastName, u.email,
              CONCAT(u.firstName, ' ', u.lastName) as customer
       FROM orders o JOIN users u ON o.userId = u.id
       ${where} ORDER BY o.createdAt DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset],
    )

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) as total FROM orders o ${where}`, params,
    )

    return success(res, { orders, total })
  } catch (err) { next(err) }
}

/* ── Admin: Update order status ── */
async function updateOrderStatus(req, res, next) {
  try {
    const { id } = req.params
    const { status } = req.body

    const valid = ['pending','confirmed','processing','shipped','delivered','cancelled','refunded']
    if (!valid.includes(status)) throw new AppError('Invalid status', 400)

    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, id])

    // Restore stock if cancelled
    if (status === 'cancelled') {
      const [items] = await pool.query('SELECT productId, qty FROM order_items WHERE orderId = ?', [id])
      for (const item of items) {
        await pool.query('UPDATE products SET stock = stock + ?, soldCount = soldCount - ? WHERE id = ?',
          [item.qty, item.qty, item.productId])
      }
    }

    return success(res, {}, 'Order status updated')
  } catch (err) { next(err) }
}

/* ── Cancel order (customer) ── */
async function cancelOrder(req, res, next) {
  try {
    const { id } = req.params
    const [orders] = await pool.query('SELECT status FROM orders WHERE id = ? AND userId = ?', [id, req.user.id])
    if (!orders.length) throw new AppError('Order not found', 404)
    if (!['pending','confirmed'].includes(orders[0].status)) throw new AppError('Order cannot be cancelled at this stage', 400)

    await pool.query("UPDATE orders SET status = 'cancelled' WHERE id = ?", [id])
    return success(res, {}, 'Order cancelled')
  } catch (err) { next(err) }
}

module.exports = { createOrder, verifyPayment, getMyOrders, getOrder, getAllOrders, updateOrderStatus, cancelOrder }
