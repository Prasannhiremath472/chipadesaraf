const pool = require('../config/database')
const { success } = require('../utils/response')

/* ── Dashboard stats ── */
async function getDashboard(req, res, next) {
  try {
    const days = parseInt(req.query.days || '30')
    const prevStart = `DATE_SUB(NOW(), INTERVAL ${days * 2} DAY)`
    const curStart  = `DATE_SUB(NOW(), INTERVAL ${days} DAY)`

    const [[revenue]]   = await pool.query(`SELECT COALESCE(SUM(total),0) as revenue FROM orders WHERE status != 'cancelled' AND createdAt >= ${curStart}`)
    const [[prevRev]]   = await pool.query(`SELECT COALESCE(SUM(total),0) as revenue FROM orders WHERE status != 'cancelled' AND createdAt >= ${prevStart} AND createdAt < ${curStart}`)
    const [[orders]]    = await pool.query(`SELECT COUNT(*) as orders FROM orders WHERE createdAt >= ${curStart}`)
    const [[prevOrd]]   = await pool.query(`SELECT COUNT(*) as orders FROM orders WHERE createdAt >= ${prevStart} AND createdAt < ${curStart}`)
    const [[customers]] = await pool.query("SELECT COUNT(*) as customers FROM users WHERE role = 'user'")
    const [[products]]  = await pool.query('SELECT COUNT(*) as products FROM products WHERE is_active = 1')

    const [recentOrders] = await pool.query(
      `SELECT o.id, o.status, o.total, o.created_at as createdAt,
              o.payment_status as paymentStatus,
              CONCAT(u.name) as customer, u.email
       FROM orders o JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC LIMIT 8`,
    )

    const [topProducts] = await pool.query(
      `SELECT p.id, p.name, p.thumbnail, SUM(oi.quantity) as sold, SUM(oi.quantity * oi.unit_price) as revenue
       FROM order_items oi JOIN products p ON oi.product_id = p.id
       JOIN orders o ON oi.order_id = o.id WHERE o.status != 'cancelled'
       GROUP BY p.id ORDER BY sold DESC LIMIT 5`,
    )

    const [monthlyRevenue] = await pool.query(
      `SELECT DATE_FORMAT(created_at,'%Y-%m') as month, SUM(total) as revenue, COUNT(*) as orders
       FROM orders WHERE status != 'cancelled' AND created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
       GROUP BY month ORDER BY month ASC`,
    )

    const [ordersByStatus] = await pool.query(
      `SELECT status, COUNT(*) as count FROM orders GROUP BY status ORDER BY count DESC`,
    )

    const [lowStock] = await pool.query(
      `SELECT id, name, sku, stock FROM products WHERE stock <= 5 AND is_active = 1 ORDER BY stock ASC LIMIT 8`,
    )

    return success(res, {
      stats: {
        revenue: revenue.revenue, orders: orders.orders,
        customers: customers.customers, products: products.products,
        prevRevenue: prevRev.revenue, prevOrders: prevOrd.orders,
      },
      recentOrders, topProducts, monthlyRevenue, ordersByStatus, lowStock,
    })
  } catch (err) { next(err) }
}

/* ── Admin products list ── */
async function getAdminProducts(req, res, next) {
  try {
    const { search = '', page = 1, limit = 20, category } = req.query
    const offset = (parseInt(page) - 1) * parseInt(limit)
    const conds  = ['1=1']
    const params = []

    if (search)   { conds.push('(p.name LIKE ? OR p.sku LIKE ?)'); params.push(`%${search}%`, `%${search}%`) }
    if (category) { conds.push('p.category = ?'); params.push(category) }

    const where = `WHERE ${conds.join(' AND ')}`

    const [products] = await pool.query(
      `SELECT p.id, p.name, p.slug, p.sku, p.price, p.mrp, p.stock,
              p.thumbnail, p.is_active as active, p.purity, p.weight_gm as weight,
              p.sold_count as sold, p.avg_rating as rating, p.review_count as reviews,
              p.material as category, p.created_at as createdAt
       FROM products p
       ${where} ORDER BY p.created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset],
    )

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) as total FROM products p ${where}`,
      params,
    )

    return success(res, { products, total })
  } catch (err) { next(err) }
}

/* ── Admin customers ── */
async function getAdminCustomers(req, res, next) {
  try {
    const { search = '', page = 1, limit = 20 } = req.query
    const offset = (parseInt(page) - 1) * parseInt(limit)
    const conds  = ["u.role = 'user'"]
    const params = []

    if (search) {
      conds.push('(u.name LIKE ? OR u.email LIKE ? OR u.phone LIKE ?)')
      params.push(`%${search}%`, `%${search}%`, `%${search}%`)
    }

    const where = `WHERE ${conds.join(' AND ')}`

    const [customers] = await pool.query(
      `SELECT u.id, u.name, u.email, u.phone, u.created_at as createdAt, u.is_active as isActive,
              COUNT(o.id) as orderCount, COALESCE(SUM(o.total),0) as totalSpent
       FROM users u LEFT JOIN orders o ON u.id = o.user_id
       ${where} GROUP BY u.id ORDER BY u.created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset],
    )

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) as total FROM users u ${where}`,
      params,
    )

    return success(res, { customers, total })
  } catch (err) { next(err) }
}

/* ── Toggle customer active status ── */
async function toggleCustomerStatus(req, res, next) {
  try {
    const { isActive } = req.body
    await pool.query('UPDATE users SET is_active = ? WHERE id = ?', [isActive ? 1 : 0, req.params.id])
    return success(res, {}, 'Customer status updated')
  } catch (err) { next(err) }
}

/* ── Inventory low-stock ── */
async function getLowStock(req, res, next) {
  try {
    const threshold = parseInt(req.query.threshold || '5')
    const [products] = await pool.query(
      `SELECT id, name, sku, stock, thumbnail FROM products WHERE stock <= ? AND is_active = 1 ORDER BY stock ASC`,
      [threshold],
    )
    return success(res, { products })
  } catch (err) { next(err) }
}

/* ── Sales report ── */
async function getSalesReport(req, res, next) {
  try {
    const { from, to } = req.query
    const conds  = ["status != 'cancelled'"]
    const params = []
    if (from) { conds.push('created_at >= ?'); params.push(from) }
    if (to)   { conds.push('created_at <= ?'); params.push(to) }

    const [rows] = await pool.query(
      `SELECT DATE(created_at) as date, COUNT(*) as orders, SUM(total) as revenue
       FROM orders WHERE ${conds.join(' AND ')}
       GROUP BY DATE(created_at) ORDER BY date ASC`,
      params,
    )
    return success(res, { report: rows })
  } catch (err) { next(err) }
}

/* ── Update order status ── */
async function updateOrderStatus(req, res, next) {
  try {
    const { status } = req.body
    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id])
    return success(res, {}, 'Order status updated')
  } catch (err) { next(err) }
}

/* ── Get all orders (admin) ── */
async function getAllOrders(req, res, next) {
  try {
    const { status = '', search = '', page = 1, limit = 20 } = req.query
    const offset = (parseInt(page) - 1) * parseInt(limit)
    const conds  = ['1=1']
    const params = []

    if (status) { conds.push('o.status = ?'); params.push(status) }
    if (search) {
      conds.push('(u.name LIKE ? OR CAST(o.id AS CHAR) LIKE ?)')
      params.push(`%${search}%`, `%${search}%`)
    }

    const where = `WHERE ${conds.join(' AND ')}`

    const [orders] = await pool.query(
      `SELECT o.id, o.status, o.total, o.payment_status as paymentStatus,
              o.shipping_address as shippingAddress, o.notes,
              o.created_at as createdAt, u.name as customer, u.email, u.phone,
              (SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = o.id) as itemCount,
              (SELECT JSON_ARRAYAGG(
                JSON_OBJECT('name', p.name, 'qty', oi.quantity, 'price', oi.unit_price, 'thumbnail', p.thumbnail)
              ) FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = o.id) as items
       FROM orders o JOIN users u ON o.user_id = u.id
       ${where} ORDER BY o.created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset],
    )

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) as total FROM orders o JOIN users u ON o.user_id = u.id ${where}`,
      params,
    )

    // Parse JSON items field
    const parsed = orders.map(o => ({
      ...o,
      items: typeof o.items === 'string' ? JSON.parse(o.items) : (o.items || []),
      shippingAddress: typeof o.shippingAddress === 'string' ? JSON.parse(o.shippingAddress) : o.shippingAddress,
    }))

    return success(res, { orders: parsed, total })
  } catch (err) { next(err) }
}

module.exports = {
  getDashboard, getAdminProducts, getAdminCustomers, toggleCustomerStatus,
  getLowStock, getSalesReport, updateOrderStatus, getAllOrders,
}
