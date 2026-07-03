const pool = require('../config/database')
const { success } = require('../utils/response')
const { processAndSave } = require('../middlewares/upload')

async function getBanners(req, res, next) {
  try {
    const { position } = req.query
    const where  = position ? 'WHERE position = ? AND active = 1' : 'WHERE active = 1'
    const params = position ? [position] : []
    const [banners] = await pool.query(
      `SELECT * FROM banners ${where} ORDER BY sortOrder ASC`, params,
    )
    return success(res, { banners })
  } catch (err) { next(err) }
}

async function createBanner(req, res, next) {
  try {
    const { title, subtitle, link, position, sortOrder } = req.body
    let image = null
    if (req.file) {
      image = await processAndSave(req.file.buffer, 'banners', { width: 1600, height: 700, fit: 'cover' })
    }
    const [result] = await pool.query(
      'INSERT INTO banners (title, subtitle, link, image, position, sortOrder) VALUES (?, ?, ?, ?, ?, ?)',
      [title, subtitle, link, image, position || 'home', sortOrder || 0],
    )
    return success(res, { bannerId: result.insertId }, 'Banner created', 201)
  } catch (err) { next(err) }
}

async function updateBanner(req, res, next) {
  try {
    const { id } = req.params
    const { title, subtitle, link, position, sortOrder, active } = req.body
    await pool.query(
      'UPDATE banners SET title=?, subtitle=?, link=?, position=?, sortOrder=?, active=? WHERE id=?',
      [title, subtitle, link, position, sortOrder, active ? 1 : 0, id],
    )
    return success(res, {}, 'Banner updated')
  } catch (err) { next(err) }
}

async function deleteBanner(req, res, next) {
  try {
    await pool.query('DELETE FROM banners WHERE id = ?', [req.params.id])
    return success(res, {}, 'Banner deleted')
  } catch (err) { next(err) }
}

module.exports = { getBanners, createBanner, updateBanner, deleteBanner }
