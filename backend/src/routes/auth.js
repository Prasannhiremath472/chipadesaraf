const router = require('express').Router()
const { body } = require('express-validator')
const ctrl  = require('../controllers/authController')
const { authenticate } = require('../middlewares/auth')
const { validate }     = require('../middlewares/validate')

const passwordRules = body('password')
  .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')

router.post('/register',
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  passwordRules,
  validate,
  ctrl.register,
)

router.post('/login',
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  validate,
  ctrl.login,
)

router.get('/me',       authenticate, ctrl.me)
router.post('/refresh', ctrl.refresh)
router.post('/logout',  ctrl.logout)

router.post('/forgot-password',
  body('email').isEmail().normalizeEmail(),
  validate,
  ctrl.forgotPassword,
)

router.post('/reset-password',
  body('token').notEmpty(),
  passwordRules,
  validate,
  ctrl.resetPassword,
)

/* ─── OTP (email-based 2FA / verification) ─── */
router.post('/send-otp',
  body('email').isEmail().normalizeEmail(),
  validate,
  ctrl.sendOTP,
)

router.post('/verify-otp',
  body('email').isEmail().normalizeEmail(),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('Enter the 6-digit OTP'),
  validate,
  ctrl.verifyOTP,
)

/* ─── Profile ─── */
router.put('/profile',
  authenticate,
  body('name').trim().notEmpty().withMessage('Name is required'),
  validate,
  ctrl.updateProfile,
)

router.put('/change-password',
  authenticate,
  body('currentPassword').notEmpty(),
  passwordRules,
  validate,
  ctrl.changePassword,
)

module.exports = router
