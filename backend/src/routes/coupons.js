const router = require('express').Router()
const ctrl   = require('../controllers/couponController')
const { authenticate, requireAdmin } = require('../middlewares/auth')

router.post('/validate',    ctrl.validateCoupon)
router.get('/',             authenticate, requireAdmin, ctrl.getCoupons)
router.post('/',            authenticate, requireAdmin, ctrl.createCoupon)
router.delete('/:id',       authenticate, requireAdmin, ctrl.deleteCoupon)
router.patch('/:id/toggle', authenticate, requireAdmin, ctrl.toggleCoupon)

module.exports = router
