const pool = require('../config/database')
const { success } = require('../utils/response')
const { AppError } = require('../middlewares/errorHandler')

/* ── Validate coupon ── */
async function validateCoupon(req, res, next) {
  try {
    const { code, subtotal } = req.body
    if (!code) throw new AppError('Coupon code required', 400)

    const [rows] = await pool.query(
      `SELECT * FROM coupons WHERE code = ? AND active = 1
       AND (expiresAt IS NULL OR expiresAt > NOW())
       AND (usageLimit IS NULL OR usedCount < usageLimit)`,
      [code.toUpperCase()],
    )
    if (!rows.length) throw new AppError('Invalid or expired coupon code', 404)

    const coupon = rows[0]
    if (subtotal < (coupon.minOrder || 0)) {
      throw new AppError(`Minimum order value ₹${coupon.minOrder} required for this coupon`, 400)
    }

    const discount = coupon.type === 'percent'
      ? Math.min((subtotal * coupon.value) / 100, coupon.maxDiscount || Infinity)
      : coupon.value

    return success(res, {
      coupon: {
        id:       coupon.id,
        code:     coupon.code,
        type:     coupon.type,
        value:    coupon.value,
        discount: Math.round(discount),
      },
    }, 'Coupon applied')
  } catch (err) { next(err) }
}

/* ── Admin: Get all coupons ── */
async function getCoupons(req, res, next) {
  try {
    const [coupons] = await pool.query('SELECT * FROM coupons ORDER BY createdAt DESC')
    return success(res, { coupons })
  } catch (err) { next(err) }
}

/* ── Admin: Create coupon ── */
async function createCoupon(req, res, next) {
  try {
    const { code, type, value, minOrder, maxDiscount, usageLimit, expiresAt } = req.body

    const [existing] = await pool.query('SELECT id FROM coupons WHERE code = ?', [code.toUpperCase()])
    if (existing.length) throw new AppError('Coupon code already exists', 409)

    const [result] = await pool.query(
      `INSERT INTO coupons (code, type, value, minOrder, maxDiscount, usageLimit, expiresAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [code.toUpperCase(), type, parseFloat(value), minOrder || null,
       maxDiscount || null, usageLimit || null, expiresAt || null],
    )
    return success(res, { couponId: result.insertId }, 'Coupon created', 201)
  } catch (err) { next(err) }
}

/* ── Admin: Delete coupon ── */
async function deleteCoupon(req, res, next) {
  try {
    await pool.query('DELETE FROM coupons WHERE id = ?', [req.params.id])
    return success(res, {}, 'Coupon deleted')
  } catch (err) { next(err) }
}

/* ── Admin: Toggle coupon ── */
async function toggleCoupon(req, res, next) {
  try {
    await pool.query('UPDATE coupons SET active = NOT active WHERE id = ?', [req.params.id])
    return success(res, {}, 'Coupon toggled')
  } catch (err) { next(err) }
}

module.exports = { validateCoupon, getCoupons, createCoupon, deleteCoupon, toggleCoupon }
