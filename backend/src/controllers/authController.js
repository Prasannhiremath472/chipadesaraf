const bcrypt  = require('bcryptjs')
const crypto  = require('crypto')
const pool    = require('../config/database')
const { signToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt')
const { sendEmail, welcomeHtml, passwordResetHtml } = require('../utils/email')
const { success } = require('../utils/response')
const { AppError } = require('../middlewares/errorHandler')
const { FRONTEND_URL, BCRYPT_ROUNDS, OTP_EXPIRES_MINUTES } = require('../config/env')

const ROUNDS = parseInt(BCRYPT_ROUNDS, 10) || 12
const OTP_TTL = parseInt(OTP_EXPIRES_MINUTES, 10) || 10

function setRefreshCookie(res, token) {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  })
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/* ── Register ── */
async function register(req, res, next) {
  try {
    const { name, email, phone, password } = req.body

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email])
    if (existing.length) throw new AppError('Email already registered', 409)

    const hash = await bcrypt.hash(password, ROUNDS)
    const [result] = await pool.query(
      'INSERT INTO users (name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone || null, hash, 'user'],
    )

    const user = { id: result.insertId, name, email, phone, role: 'user' }
    const token = signToken({ userId: user.id })
    const refreshToken = signRefreshToken({ userId: user.id })
    setRefreshCookie(res, refreshToken)

    sendEmail({ to: email, subject: `Welcome to Auraè, ${name}!`, html: welcomeHtml(user) }).catch(() => {})

    return success(res, { token, user }, 'Registration successful', 201)
  } catch (err) { next(err) }
}

/* ── Login ── */
async function login(req, res, next) {
  try {
    const { email, password } = req.body

    const [rows] = await pool.query(
      'SELECT id, name, email, phone, role, password_hash, is_active FROM users WHERE email = ?',
      [email],
    )
    if (!rows.length) throw new AppError('Invalid email or password', 401)

    const user = rows[0]
    if (!user.is_active) throw new AppError('Account is deactivated. Contact support.', 401)

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) throw new AppError('Invalid email or password', 401)

    await pool.query('UPDATE users SET last_login_at = NOW() WHERE id = ?', [user.id])

    delete user.password_hash
    delete user.is_active
    const token = signToken({ userId: user.id })
    const refreshToken = signRefreshToken({ userId: user.id })
    setRefreshCookie(res, refreshToken)

    return success(res, { token, user }, 'Login successful')
  } catch (err) { next(err) }
}

/* ── Me ── */
async function me(req, res) {
  return success(res, { user: req.user })
}

/* ── Refresh ── */
async function refresh(req, res, next) {
  try {
    const token = req.cookies?.refreshToken
    if (!token) throw new AppError('No refresh token', 401)

    const decoded = verifyRefreshToken(token)
    const [rows] = await pool.query(
      'SELECT id, name, email, phone, role FROM users WHERE id = ? AND is_active = 1',
      [decoded.userId],
    )
    if (!rows.length) throw new AppError('User not found', 401)

    const newToken = signToken({ userId: rows[0].id })
    return success(res, { token: newToken, user: rows[0] })
  } catch (err) { next(err) }
}

/* ── Logout ── */
async function logout(req, res) {
  res.clearCookie('refreshToken')
  return success(res, {}, 'Logged out')
}

/* ── Forgot Password (email link) ── */
async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body
    const [rows] = await pool.query('SELECT id, name FROM users WHERE email = ?', [email])

    if (!rows.length) return success(res, {}, 'If this email exists, a reset link has been sent.')

    const user  = rows[0]
    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 60 * 60 * 1000) // 1h

    await pool.query(
      `INSERT INTO password_resets (user_id, token, type, expires_at)
       VALUES (?, ?, 'reset', ?)
       ON DUPLICATE KEY UPDATE token = VALUES(token), expires_at = VALUES(expires_at), used_at = NULL`,
      [user.id, token, expires],
    )

    const resetUrl = `${FRONTEND_URL}/auth/reset-password?token=${token}`
    await sendEmail({ to: email, subject: 'Reset Your Auraè Password', html: passwordResetHtml(user, resetUrl) })

    return success(res, {}, 'Reset link sent to your email.')
  } catch (err) { next(err) }
}

/* ── Reset Password ── */
async function resetPassword(req, res, next) {
  try {
    const { token, password } = req.body

    const [rows] = await pool.query(
      `SELECT user_id FROM password_resets
       WHERE token = ? AND type = 'reset' AND expires_at > NOW() AND used_at IS NULL`,
      [token],
    )
    if (!rows.length) throw new AppError('Invalid or expired reset token', 400)

    const hash = await bcrypt.hash(password, ROUNDS)
    await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [hash, rows[0].user_id])
    await pool.query('UPDATE password_resets SET used_at = NOW() WHERE token = ?', [token])

    return success(res, {}, 'Password reset successfully')
  } catch (err) { next(err) }
}

/* ── Send OTP (email-based, for login / registration verification) ── */
async function sendOTP(req, res, next) {
  try {
    const { email } = req.body
    const [rows] = await pool.query('SELECT id, name FROM users WHERE email = ?', [email])
    if (!rows.length) throw new AppError('No account found with this email', 404)

    const user = rows[0]
    const otp  = generateOTP()
    const expires = new Date(Date.now() + OTP_TTL * 60 * 1000)

    await pool.query(
      `INSERT INTO password_resets (user_id, token, otp, type, expires_at)
       VALUES (?, ?, ?, 'otp', ?)
       ON DUPLICATE KEY UPDATE otp = VALUES(otp), expires_at = VALUES(expires_at), used_at = NULL`,
      [user.id, crypto.randomBytes(16).toString('hex'), otp, expires],
    )

    await sendEmail({
      to: email,
      subject: `${otp} is your Auraè verification code`,
      html: `
        <div style="font-family:Georgia,serif;max-width:480px;margin:0 auto;padding:32px;background:#0F0F0F;color:#F9F7F3;border-radius:8px">
          <h2 style="color:#C8A165;letter-spacing:0.1em;font-size:24px;margin-bottom:8px">Auraè</h2>
          <p style="color:#aaa;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:32px">Verification Code</p>
          <p style="font-size:15px;margin-bottom:24px">Hello ${user.name},</p>
          <div style="background:#1a1a1a;border:1px solid #C8A165;border-radius:6px;padding:24px;text-align:center;margin-bottom:24px">
            <span style="font-size:42px;letter-spacing:0.2em;color:#C8A165;font-family:monospace">${otp}</span>
          </div>
          <p style="font-size:13px;color:#888">This code expires in ${OTP_TTL} minutes. Do not share it with anyone.</p>
        </div>`,
    })

    return success(res, {}, `OTP sent to ${email}`)
  } catch (err) { next(err) }
}

/* ── Verify OTP ── */
async function verifyOTP(req, res, next) {
  try {
    const { email, otp } = req.body

    const [rows] = await pool.query(
      `SELECT pr.user_id, u.name, u.email, u.phone, u.role
       FROM password_resets pr
       JOIN users u ON u.id = pr.user_id
       WHERE u.email = ? AND pr.otp = ? AND pr.type = 'otp'
         AND pr.expires_at > NOW() AND pr.used_at IS NULL`,
      [email, otp],
    )
    if (!rows.length) throw new AppError('Invalid or expired OTP', 400)

    const user = { id: rows[0].user_id, name: rows[0].name, email: rows[0].email, phone: rows[0].phone, role: rows[0].role }

    // Mark OTP as used and verify email
    await pool.query(
      `UPDATE password_resets SET used_at = NOW() WHERE user_id = ? AND type = 'otp'`,
      [user.id],
    )
    await pool.query('UPDATE users SET email_verified = 1 WHERE id = ?', [user.id])

    const token = signToken({ userId: user.id })
    const refreshToken = signRefreshToken({ userId: user.id })
    setRefreshCookie(res, refreshToken)

    return success(res, { token, user }, 'OTP verified successfully')
  } catch (err) { next(err) }
}

/* ── Update Profile ── */
async function updateProfile(req, res, next) {
  try {
    const { name, phone } = req.body
    await pool.query('UPDATE users SET name = ?, phone = ? WHERE id = ?', [name, phone, req.user.id])
    const [rows] = await pool.query('SELECT id, name, email, phone, role FROM users WHERE id = ?', [req.user.id])
    return success(res, { user: rows[0] }, 'Profile updated')
  } catch (err) { next(err) }
}

/* ── Change Password ── */
async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body
    const [rows] = await pool.query('SELECT password_hash FROM users WHERE id = ?', [req.user.id])

    const valid = await bcrypt.compare(currentPassword, rows[0].password_hash)
    if (!valid) throw new AppError('Current password is incorrect', 400)

    const hash = await bcrypt.hash(newPassword, ROUNDS)
    await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [hash, req.user.id])

    return success(res, {}, 'Password changed successfully')
  } catch (err) { next(err) }
}

module.exports = {
  register, login, me, refresh, logout,
  forgotPassword, resetPassword,
  sendOTP, verifyOTP,
  updateProfile, changePassword,
}
