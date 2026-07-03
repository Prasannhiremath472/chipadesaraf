const pool = require('../config/database')
const { success } = require('../utils/response')
const { AppError } = require('../middlewares/errorHandler')

/* ── Get product reviews ── */
async function getProductReviews(req, res, next) {
  try {
    const { productId } = req.params
    const { page = 1, limit = 10 } = req.query
    const offset = (parseInt(page) - 1) * parseInt(limit)

    const [reviews] = await pool.query(
      `SELECT r.id, r.rating, r.comment, r.createdAt, r.verified,
              u.firstName, u.lastName
       FROM reviews r JOIN users u ON r.userId = u.id
       WHERE r.productId = ? AND r.approved = 1
       ORDER BY r.createdAt DESC LIMIT ? OFFSET ?`,
      [productId, parseInt(limit), offset],
    )

    const [[{ total }]] = await pool.query(
      'SELECT COUNT(*) as total FROM reviews WHERE productId = ? AND approved = 1',
      [productId],
    )

    return success(res, { reviews, total })
  } catch (err) { next(err) }
}

/* ── Create review ── */
async function createReview(req, res, next) {
  try {
    const { productId, rating, comment } = req.body
    const userId = req.user.id

    // Check if user has ordered this product
    const [ordered] = await pool.query(
      `SELECT oi.id FROM order_items oi
       JOIN orders o ON oi.orderId = o.id
       WHERE o.userId = ? AND oi.productId = ? AND o.status = 'delivered'`,
      [userId, productId],
    )

    // Check for duplicate review
    const [existing] = await pool.query(
      'SELECT id FROM reviews WHERE userId = ? AND productId = ?',
      [userId, productId],
    )
    if (existing.length) throw new AppError('You have already reviewed this product', 409)

    const [result] = await pool.query(
      'INSERT INTO reviews (userId, productId, rating, comment, verified, approved) VALUES (?, ?, ?, ?, ?, 0)',
      [userId, productId, Math.min(5, Math.max(1, parseInt(rating))), comment, ordered.length ? 1 : 0],
    )

    // Update product rating
    const [[stats]] = await pool.query(
      'SELECT AVG(rating) as avg, COUNT(*) as cnt FROM reviews WHERE productId = ? AND approved = 1',
      [productId],
    )
    await pool.query(
      'UPDATE products SET rating = ?, reviewCount = ? WHERE id = ?',
      [stats.avg || 0, stats.cnt, productId],
    )

    return success(res, { reviewId: result.insertId }, 'Review submitted and pending approval', 201)
  } catch (err) { next(err) }
}

/* ── Admin: All reviews ── */
async function getAllReviews(req, res, next) {
  try {
    const { approved, page = 1, limit = 25 } = req.query
    const offset = (parseInt(page) - 1) * parseInt(limit)

    const cond   = approved !== undefined ? 'WHERE r.approved = ?' : ''
    const params = approved !== undefined ? [parseInt(approved)] : []

    const [reviews] = await pool.query(
      `SELECT r.*, CONCAT(u.firstName, ' ', u.lastName) as userName, p.name as productName
       FROM reviews r JOIN users u ON r.userId = u.id JOIN products p ON r.productId = p.id
       ${cond} ORDER BY r.createdAt DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset],
    )
    return success(res, { reviews })
  } catch (err) { next(err) }
}

/* ── Admin: Approve review ── */
async function approveReview(req, res, next) {
  try {
    await pool.query('UPDATE reviews SET approved = 1 WHERE id = ?', [req.params.id])

    // Recalculate rating
    const [[{ productId }]] = await pool.query('SELECT productId FROM reviews WHERE id = ?', [req.params.id])
    const [[stats]] = await pool.query(
      'SELECT AVG(rating) as avg, COUNT(*) as cnt FROM reviews WHERE productId = ? AND approved = 1',
      [productId],
    )
    await pool.query('UPDATE products SET rating = ?, reviewCount = ? WHERE id = ?', [stats.avg, stats.cnt, productId])

    return success(res, {}, 'Review approved')
  } catch (err) { next(err) }
}

/* ── Admin: Delete review ── */
async function deleteReview(req, res, next) {
  try {
    await pool.query('DELETE FROM reviews WHERE id = ?', [req.params.id])
    return success(res, {}, 'Review deleted')
  } catch (err) { next(err) }
}

module.exports = { getProductReviews, createReview, getAllReviews, approveReview, deleteReview }
