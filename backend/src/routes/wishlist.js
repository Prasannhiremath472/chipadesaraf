const router = require('express').Router()
const ctrl   = require('../controllers/wishlistController')
const { authenticate } = require('../middlewares/auth')

router.use(authenticate)
router.get('/',                    ctrl.getWishlist)
router.post('/toggle',             ctrl.toggleWishlist)
router.delete('/:productId',       ctrl.removeFromWishlist)

module.exports = router
