const router = require('express').Router()
const ctrl   = require('../controllers/adminController')
const bannerCtrl = require('../controllers/bannerController')
const { authenticate, requireAdmin } = require('../middlewares/auth')
const { createUploader } = require('../middlewares/upload')

const bannerUpload = createUploader('banners').single('image')

router.use(authenticate, requireAdmin)

// Dashboard
router.get('/dashboard',  ctrl.getDashboard)

// Products
router.get('/products',   ctrl.getAdminProducts)

// Orders
router.get('/orders',           ctrl.getAllOrders)
router.patch('/orders/:id/status', ctrl.updateOrderStatus)

// Customers
router.get('/customers',              ctrl.getAdminCustomers)
router.patch('/customers/:id/status', ctrl.toggleCustomerStatus)

// Reviews
router.get('/reviews', require('../controllers/reviewController').getAllReviews)

// Coupons
router.get('/coupons', require('../controllers/couponController').getCoupons)

// Inventory
router.get('/inventory/low-stock', ctrl.getLowStock)

// Reports
router.get('/reports/sales', ctrl.getSalesReport)

// Banners
router.get('/banners',        bannerCtrl.getBanners)
router.post('/banners',       bannerUpload, bannerCtrl.createBanner)
router.put('/banners/:id',    bannerCtrl.updateBanner)
router.delete('/banners/:id', bannerCtrl.deleteBanner)

module.exports = router
