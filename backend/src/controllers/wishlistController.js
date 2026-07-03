const pool = require('../config/database')
const { success } = require('../utils/response')
const { AppError } = require('../middlewares/errorHandler')

async function getWishlist(req, res, next) {
  try {
    const [items] = await pool.query(
      `SELECT p.id, p.name, p.slug, p.price, p.thumbnail, p.rating, c.name as category
       FROM wishlists w JOIN products p ON w.productId = p.id
       LEFT JOIN categories c ON p.categoryId = c.id
       WHERE w.userId = ? ORDER BY w.createdAt DESC`,
      [req.user.id],
    )
    return success(res, { items })
  } catch (err) { next(err) }
}

async function toggleWishlist(req, res, next) {
  try {
    const { productId } = req.body
    const [existing] = await pool.query('SELECT id FROM wishlists WHERE userId = ? AND productId = ?', [req.user.id, productId])

    if (existing.length) {
      await pool.query('DELETE FROM wishlists WHERE userId = ? AND productId = ?', [req.user.id, productId])
      return success(res, { wishlisted: false }, 'Removed from wishlist')
    } else {
      await pool.query('INSERT IGNORE INTO wishlists (userId, productId) VALUES (?, ?)', [req.user.id, productId])
      return success(res, { wishlisted: true }, 'Added to wishlist')
    }
  } catch (err) { next(err) }
}

async function removeFromWishlist(req, res, next) {
  try {
    await pool.query('DELETE FROM wishlists WHERE userId = ? AND productId = ?', [req.user.id, req.params.productId])
    return success(res, {}, 'Removed from wishlist')
  } catch (err) { next(err) }
}

module.exports = { getWishlist, toggleWishlist, removeFromWishlist }
