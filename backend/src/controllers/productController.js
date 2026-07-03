const pool     = require('../config/database')
const slugify  = require('slugify')
const { v4: uuidv4 } = require('uuid')
const { success, paginated } = require('../utils/response')
const { AppError } = require('../middlewares/errorHandler')
const { processAndSave, processMultiple } = require('../middlewares/upload')

/* ── List / Search products ── */
async function getProducts(req, res, next) {
  try {
    const {
      category, material, occasion, gender, purity,
      minPrice, maxPrice, sort = 'newest', search,
      page = 1, limit = 20, inStock, onSale, featured,
    } = req.query

    const offset = (parseInt(page) - 1) * parseInt(limit)
    const conditions = ['p.active = 1']
    const params     = []

    if (search)   { conditions.push('(p.name LIKE ? OR p.description LIKE ?)'); params.push(`%${search}%`, `%${search}%`) }
    if (category) { conditions.push('c.slug = ?');         params.push(category)  }
    if (material) { conditions.push('p.material = ?');     params.push(material)  }
    if (occasion) { conditions.push('p.occasion = ?');     params.push(occasion)  }
    if (gender)   { conditions.push('p.gender = ?');       params.push(gender)    }
    if (purity)   { conditions.push('p.purity = ?');       params.push(purity)    }
    if (minPrice) { conditions.push('p.price >= ?');       params.push(parseFloat(minPrice)) }
    if (maxPrice) { conditions.push('p.price <= ?');       params.push(parseFloat(maxPrice)) }
    if (inStock === 'true')  conditions.push('p.stock > 0')
    if (onSale === 'true')   conditions.push('p.mrp IS NOT NULL AND p.mrp > p.price')
    if (featured === 'true') conditions.push('p.is_featured = 1')

    const where   = `WHERE ${conditions.join(' AND ')}`

    const orderMap = {
      newest:     'p.created_at DESC',
      popular:    'p.sold_count DESC',
      price_asc:  'p.price ASC',
      price_desc: 'p.price DESC',
      rating:     'p.avg_rating DESC',
      discount:   '((p.mrp - p.price) / p.mrp) DESC',
    }
    const orderBy = orderMap[sort] || 'p.created_at DESC'

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) as total FROM products p LEFT JOIN categories c ON p.category_id = c.id ${where}`,
      params,
    )

    const [products] = await pool.query(
      `SELECT p.id, p.name, p.slug, p.sku, p.price, p.mrp, p.thumbnail,
              p.material, p.weight_gm, p.purity, p.is_new_arrival, p.is_bestseller,
              p.is_featured, p.stock, p.avg_rating, p.review_count, p.sold_count,
              p.gender, p.occasion,
              c.name as category, c.slug as category_slug
       FROM products p LEFT JOIN categories c ON p.category_id = c.id
       ${where} ORDER BY ${orderBy} LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset],
    )

    return paginated(res, { data: products, total, page: parseInt(page), limit: parseInt(limit) })
  } catch (err) { next(err) }
}

/* ── Search (autocomplete) ── */
async function searchProducts(req, res, next) {
  try {
    const { q = '', limit = 6 } = req.query
    if (q.length < 2) return res.json({ success: true, products: [] })

    const [products] = await pool.query(
      `SELECT p.id, p.name, p.slug, p.price, p.thumbnail, c.name as category
       FROM products p LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.active = 1 AND (p.name LIKE ? OR p.description LIKE ? OR c.name LIKE ?)
       ORDER BY p.sold_count DESC LIMIT ?`,
      [`%${q}%`, `%${q}%`, `%${q}%`, parseInt(limit)],
    )
    return res.json({ success: true, products })
  } catch (err) { next(err) }
}

/* ── Single product ── */
async function getProduct(req, res, next) {
  try {
    const { slug } = req.params

    const [rows] = await pool.query(
      `SELECT p.*, c.name as category, c.slug as category_slug
       FROM products p LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.slug = ? AND p.active = 1`,
      [slug],
    )
    if (!rows.length) throw new AppError('Product not found', 404)

    const product = rows[0]
    if (typeof product.images === 'string') { try { product.images = JSON.parse(product.images) } catch { product.images = [] } }
    if (typeof product.specs  === 'string') { try { product.specs  = JSON.parse(product.specs)  } catch { product.specs  = {} } }
    if (typeof product.tags   === 'string') { try { product.tags   = JSON.parse(product.tags)   } catch { product.tags   = [] } }

    const [related] = await pool.query(
      `SELECT id, name, slug, price, mrp, thumbnail, avg_rating, review_count, is_new_arrival, is_bestseller
       FROM products WHERE category_id = ? AND id != ? AND active = 1
       ORDER BY sold_count DESC LIMIT 4`,
      [product.category_id, product.id],
    )

    pool.query('UPDATE products SET sold_count = sold_count WHERE id = ?', [product.id]).catch(() => {})

    return success(res, { product, related })
  } catch (err) { next(err) }
}

/* ── Admin: Create product ── */
async function createProduct(req, res, next) {
  try {
    const {
      name, description, short_desc, category_id, price, mrp,
      material, weight_gm, purity, occasion, gender,
      stock, is_new_arrival, is_bestseller, is_featured,
      specs, tags, sku, meta_title, meta_desc,
    } = req.body

    if (!name || !price) throw new AppError('name and price are required', 400)

    const base = slugify(name, { lower: true, strict: true })
    const slug = `${base}-${uuidv4().slice(0, 8)}`

    let thumbnail = null
    let images    = []

    if (req.files?.thumbnail?.[0]) {
      thumbnail = await processAndSave(req.files.thumbnail[0].buffer, 'products', { width: 600, height: 600 })
    }
    if (req.files?.images?.length) {
      images = await processMultiple(req.files.images, 'products', { width: 800, height: 800 })
    }
    if (!thumbnail && images.length) thumbnail = images[0]

    const [result] = await pool.query(
      `INSERT INTO products
         (name, slug, sku, description, short_desc, category_id, price, mrp,
          thumbnail, images, material, weight_gm, purity, occasion, gender,
          stock, is_new_arrival, is_bestseller, is_featured,
          specs, tags, meta_title, meta_desc, active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        name, slug, sku || slug,
        description || null, short_desc || null,
        category_id || null,
        parseFloat(price), mrp ? parseFloat(mrp) : null,
        thumbnail, JSON.stringify(images),
        material || null, weight_gm || null, purity || null,
        occasion || null, gender || 'unisex',
        parseInt(stock || 0),
        is_new_arrival ? 1 : 0, is_bestseller ? 1 : 0, is_featured ? 1 : 0,
        specs ? JSON.stringify(specs) : '{}',
        tags  ? JSON.stringify(tags)  : '[]',
        meta_title || null, meta_desc || null,
      ],
    )

    return success(res, { productId: result.insertId, slug }, 'Product created', 201)
  } catch (err) { next(err) }
}

/* ── Admin: Update product ── */
async function updateProduct(req, res, next) {
  try {
    const { id } = req.params
    const updates = req.body

    const [existing] = await pool.query('SELECT id FROM products WHERE id = ?', [id])
    if (!existing.length) throw new AppError('Product not found', 404)

    const fields = []
    const values = []

    const allowed = [
      'name','description','short_desc','category_id','price','mrp',
      'material','weight_gm','purity','occasion','gender',
      'stock','is_new_arrival','is_bestseller','is_featured','active','sku',
      'meta_title','meta_desc',
    ]

    for (const field of allowed) {
      if (updates[field] !== undefined) { fields.push(`${field} = ?`); values.push(updates[field]) }
    }
    if (updates.specs) { fields.push('specs = ?'); values.push(JSON.stringify(updates.specs)) }
    if (updates.tags)  { fields.push('tags = ?');  values.push(JSON.stringify(updates.tags))  }

    if (req.files?.thumbnail?.[0]) {
      const thumb = await processAndSave(req.files.thumbnail[0].buffer, 'products', { width: 600, height: 600 })
      fields.push('thumbnail = ?'); values.push(thumb)
    }

    if (!fields.length) return success(res, {}, 'No changes')

    values.push(id)
    await pool.query(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`, values)
    return success(res, {}, 'Product updated')
  } catch (err) { next(err) }
}

/* ── Admin: Delete product (soft) ── */
async function deleteProduct(req, res, next) {
  try {
    await pool.query('UPDATE products SET active = 0 WHERE id = ?', [req.params.id])
    return success(res, {}, 'Product deleted')
  } catch (err) { next(err) }
}

/* ── Categories ── */
async function getCategories(req, res, next) {
  try {
    const [categories] = await pool.query(
      'SELECT id, name, slug, image, description, parent_id FROM categories WHERE is_active = 1 ORDER BY sort_order ASC',
    )
    return success(res, { categories })
  } catch (err) { next(err) }
}

module.exports = { getProducts, searchProducts, getProduct, createProduct, updateProduct, deleteProduct, getCategories }
