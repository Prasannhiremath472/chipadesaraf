const router = require('express').Router()
const ctrl   = require('../controllers/productController')
const { authenticate, requireAdmin } = require('../middlewares/auth')
const { createUploader } = require('../middlewares/upload')

const upload = createUploader('products')
const productUpload = upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'images',    maxCount: 10 },
])

router.get('/',          ctrl.getProducts)
router.get('/search',    ctrl.searchProducts)
router.get('/categories', ctrl.getCategories)
router.get('/:slug',     ctrl.getProduct)

router.post('/',      authenticate, requireAdmin, productUpload, ctrl.createProduct)
router.put('/:id',    authenticate, requireAdmin, productUpload, ctrl.updateProduct)
router.delete('/:id', authenticate, requireAdmin, ctrl.deleteProduct)

module.exports = router
