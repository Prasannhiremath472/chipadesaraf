const pool    = require('../config/database')
const slugify = require('slugify')
const { success } = require('../utils/response')
const { AppError } = require('../middlewares/errorHandler')
const { processAndSave } = require('../middlewares/upload')

async function getBlogs(req, res, next) {
  try {
    const { category, search, page = 1, limit = 12 } = req.query
    const offset = (parseInt(page) - 1) * parseInt(limit)
    const conds  = ['b.published = 1']
    const params = []

    if (category) { conds.push('b.category = ?'); params.push(category) }
    if (search)   { conds.push('(b.title LIKE ? OR b.excerpt LIKE ?)'); params.push(`%${search}%`, `%${search}%`) }

    const where = `WHERE ${conds.join(' AND ')}`

    const [blogs] = await pool.query(
      `SELECT b.id, b.title, b.slug, b.excerpt, b.category, b.image, b.readTime,
              b.featured, b.createdAt, u.firstName as authorFirst, u.lastName as authorLast
       FROM blogs b JOIN users u ON b.authorId = u.id
       ${where} ORDER BY b.createdAt DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset],
    )

    const mapped = blogs.map(b => ({ ...b, author: `${b.authorFirst} ${b.authorLast}`, date: b.createdAt }))
    return success(res, { blogs: mapped })
  } catch (err) { next(err) }
}

async function getBlog(req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT b.*, u.firstName as authorFirst, u.lastName as authorLast
       FROM blogs b JOIN users u ON b.authorId = u.id
       WHERE b.slug = ? AND b.published = 1`,
      [req.params.slug],
    )
    if (!rows.length) throw new AppError('Blog not found', 404)
    const blog = rows[0]
    blog.author = `${blog.authorFirst} ${blog.authorLast}`
    blog.date   = blog.createdAt

    pool.query('UPDATE blogs SET viewCount = viewCount + 1 WHERE id = ?', [blog.id]).catch(() => {})
    return success(res, { blog })
  } catch (err) { next(err) }
}

async function createBlog(req, res, next) {
  try {
    const { title, excerpt, content, category, readTime, featured } = req.body
    const slug = slugify(title, { lower: true, strict: true }) + '-' + Date.now()

    let image = null
    if (req.file) {
      image = await processAndSave(req.file.buffer, 'blogs', { width: 1200, height: 630, fit: 'cover' })
    }

    const [result] = await pool.query(
      `INSERT INTO blogs (title, slug, excerpt, content, category, image, readTime, featured, authorId, published)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [title, slug, excerpt, content, category, image, readTime || '5 min', featured ? 1 : 0, req.user.id],
    )
    return success(res, { blogId: result.insertId, slug }, 'Blog created', 201)
  } catch (err) { next(err) }
}

async function updateBlog(req, res, next) {
  try {
    const { id } = req.params
    const { title, excerpt, content, category, readTime, featured, published } = req.body
    await pool.query(
      `UPDATE blogs SET title=?, excerpt=?, content=?, category=?, readTime=?, featured=?, published=?
       WHERE id = ?`,
      [title, excerpt, content, category, readTime, featured ? 1 : 0, published ? 1 : 0, id],
    )
    return success(res, {}, 'Blog updated')
  } catch (err) { next(err) }
}

async function deleteBlog(req, res, next) {
  try {
    await pool.query('UPDATE blogs SET published = 0 WHERE id = ?', [req.params.id])
    return success(res, {}, 'Blog deleted')
  } catch (err) { next(err) }
}

module.exports = { getBlogs, getBlog, createBlog, updateBlog, deleteBlog }
