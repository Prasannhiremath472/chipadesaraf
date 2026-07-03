const router = require('express').Router()
const ctrl   = require('../controllers/blogController')
const { authenticate, requireAdmin } = require('../middlewares/auth')
const { createUploader } = require('../middlewares/upload')

const upload = createUploader('blogs').single('image')

router.get('/',        ctrl.getBlogs)
router.get('/:slug',   ctrl.getBlog)
router.post('/',       authenticate, requireAdmin, upload, ctrl.createBlog)
router.put('/:id',     authenticate, requireAdmin, ctrl.updateBlog)
router.delete('/:id',  authenticate, requireAdmin, ctrl.deleteBlog)

module.exports = router
