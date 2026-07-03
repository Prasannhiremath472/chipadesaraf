const router = require('express').Router()
const { body } = require('express-validator')
const { sendEmail } = require('../utils/email')
const { success } = require('../utils/response')
const { validate } = require('../middlewares/validate')
const { FROM_EMAIL } = require('../config/env')

router.post('/',
  body('name').trim().notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('message').trim().notEmpty(),
  validate,
  async (req, res, next) => {
    try {
      const { name, email, phone, subject, message } = req.body
      await sendEmail({
        to: FROM_EMAIL,
        subject: `[Contact] ${subject || 'New Enquiry'} from ${name}`,
        html: `<p><strong>From:</strong> ${name} (${email})<br>
               <strong>Phone:</strong> ${phone || 'N/A'}<br>
               <strong>Subject:</strong> ${subject || 'General'}</p>
               <hr/><p>${message.replace(/\n/g, '<br>')}</p>`,
      })
      return success(res, {}, 'Message sent successfully')
    } catch (err) { next(err) }
  },
)

module.exports = router
