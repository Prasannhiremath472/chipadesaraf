const router = require('express').Router()
const ctrl   = require('../controllers/reviewController')
const { authenticate, requireAdmin } = require('../middlewares/auth')

router.get('/product/:productId',  ctrl.getProductReviews)
router.post('/',                   authenticate, ctrl.createReview)
router.get('/admin',               authenticate, requireAdmin, ctrl.getAllReviews)
router.patch('/:id/approve',       authenticate, requireAdmin, ctrl.approveReview)
router.delete('/:id',              authenticate, requireAdmin, ctrl.deleteReview)

module.exports = router
