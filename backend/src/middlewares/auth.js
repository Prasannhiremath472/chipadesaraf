const jwt   = require('jsonwebtoken')
const pool  = require('../config/database')
const { JWT_SECRET } = require('../config/env')

async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization
    const token  = header?.startsWith('Bearer ') ? header.split(' ')[1] : req.cookies?.token

    if (!token) return res.status(401).json({ success: false, message: 'Authentication required' })

    const decoded = jwt.verify(token, JWT_SECRET)
    const [rows]  = await pool.query(
      'SELECT id, name, email, phone, role, is_active FROM users WHERE id = ?',
      [decoded.userId],
    )

    if (!rows.length || !rows[0].is_active) {
      return res.status(401).json({ success: false, message: 'Account not found or inactive' })
    }

    const { is_active, ...user } = rows[0]
    req.user = user
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired', code: 'TOKEN_EXPIRED' })
    }
    return res.status(401).json({ success: false, message: 'Invalid token' })
  }
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' })
  }
  next()
}

async function optionalAuth(req, res, next) {
  const header = req.headers.authorization
  const token  = header?.startsWith('Bearer ') ? header.split(' ')[1] : null

  if (!token) { next(); return }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    const [rows]  = await pool.query('SELECT id, role FROM users WHERE id = ? AND is_active = 1', [decoded.userId])
    if (rows.length) req.user = rows[0]
  } catch {}
  next()
}

module.exports = { authenticate, requireAdmin, optionalAuth }
