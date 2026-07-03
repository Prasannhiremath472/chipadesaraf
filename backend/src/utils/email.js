const nodemailer = require('nodemailer')
const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL, FROM_NAME } = require('../config/env')

const transporter = nodemailer.createTransport({
  host:   SMTP_HOST,
  port:   SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth:   { user: SMTP_USER, pass: SMTP_PASS },
})

async function sendEmail({ to, subject, html, text }) {
  return transporter.sendMail({
    from:    `"${FROM_NAME}" <${FROM_EMAIL}>`,
    to,
    subject,
    html,
    text: text || html?.replace(/<[^>]*>/g, ''),
  })
}

function orderConfirmationHtml(order, user) {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"><title>Order Confirmed</title></head>
    <body style="font-family: 'Georgia', serif; background: #F9F7F3; padding: 40px 20px;">
      <div style="max-width: 560px; margin: 0 auto; background: #fff; padding: 48px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 28px; color: #0F0F0F; font-weight: normal; letter-spacing: 0.1em;">Auraè</h1>
          <div style="width: 40px; height: 1px; background: #C8A165; margin: 12px auto;"></div>
        </div>
        <h2 style="font-size: 22px; color: #0F0F0F; font-weight: normal;">Order Confirmed</h2>
        <p style="color: #666; font-size: 16px; font-style: italic;">Dear ${user.firstName},</p>
        <p style="color: #666; font-size: 15px;">Your order <strong>#${order.id}</strong> has been confirmed. We'll begin preparing your jewellery immediately.</p>
        <div style="background: #F9F7F3; padding: 20px; margin: 24px 0;">
          <p style="color: #0F0F0F; font-size: 14px; margin: 0; font-weight: 600;">Order Total: ₹${Number(order.total).toLocaleString('en-IN')}</p>
        </div>
        <p style="color: #999; font-size: 12px; text-align: center; margin-top: 40px; letter-spacing: 0.15em;">WHERE LUXURY MEETS LEGACY</p>
      </div>
    </body>
    </html>
  `
}

function welcomeHtml(user) {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="font-family: 'Georgia', serif; background: #F9F7F3; padding: 40px 20px;">
      <div style="max-width: 560px; margin: 0 auto; background: #fff; padding: 48px;">
        <h1 style="text-align: center; font-size: 28px; font-weight: normal; letter-spacing: 0.1em; color: #0F0F0F;">Auraè</h1>
        <div style="width: 40px; height: 1px; background: #C8A165; margin: 12px auto 32px;"></div>
        <h2 style="font-size: 22px; color: #0F0F0F; font-weight: normal;">Welcome, ${user.firstName}!</h2>
        <p style="color: #666; font-size: 16px; font-style: italic;">You've joined the Auraè family.</p>
        <p style="color: #666; font-size: 15px;">Explore our curated collections of luxury jewellery — crafted by master artisans for life's most precious moments.</p>
        <div style="text-align: center; margin-top: 32px;">
          <a href="${process.env.FRONTEND_URL}" style="background: #C8A165; color: #0F0F0F; padding: 14px 36px; text-decoration: none; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; font-family: sans-serif;">
            Shop Now
          </a>
        </div>
      </div>
    </body>
    </html>
  `
}

function passwordResetHtml(user, resetUrl) {
  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: 'Georgia', serif; background: #F9F7F3; padding: 40px 20px;">
      <div style="max-width: 560px; margin: 0 auto; background: #fff; padding: 48px;">
        <h1 style="text-align: center; font-size: 28px; font-weight: normal; letter-spacing: 0.1em; color: #0F0F0F;">Auraè</h1>
        <h2 style="font-size: 22px; color: #0F0F0F; font-weight: normal; margin-top: 32px;">Reset Your Password</h2>
        <p style="color: #666; font-size: 15px;">Hi ${user.firstName}, click the button below to reset your password. This link expires in 1 hour.</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetUrl}" style="background: #0F0F0F; color: #F9F7F3; padding: 14px 36px; text-decoration: none; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; font-family: sans-serif;">
            Reset Password
          </a>
        </div>
        <p style="color: #999; font-size: 12px;">If you didn't request this, ignore this email.</p>
      </div>
    </body>
    </html>
  `
}

module.exports = { sendEmail, orderConfirmationHtml, welcomeHtml, passwordResetHtml }
