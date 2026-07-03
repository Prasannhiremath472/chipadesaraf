const router = require('express').Router()
const ctrl   = require('../controllers/orderController')
const { authenticate } = require('../middlewares/auth')

router.post('/verify', authenticate, ctrl.verifyPayment)

module.exports = router
