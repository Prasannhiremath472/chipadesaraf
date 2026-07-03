const router = require('express').Router()
const ctrl   = require('../controllers/orderController')
const { authenticate, requireAdmin } = require('../middlewares/auth')

router.post('/',                   authenticate, ctrl.createOrder)
router.get('/mine',                authenticate, ctrl.getMyOrders)
router.get('/admin',               authenticate, requireAdmin, ctrl.getAllOrders)
router.get('/:id',                 authenticate, ctrl.getOrder)
router.post('/:id/cancel',         authenticate, ctrl.cancelOrder)
router.patch('/:id/status',        authenticate, requireAdmin, ctrl.updateOrderStatus)

module.exports = router
