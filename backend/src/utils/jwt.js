const jwt = require('jsonwebtoken')
const { JWT_SECRET, JWT_EXPIRES_IN, JWT_REFRESH_SECRET } = require('../config/env')

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

function signRefreshToken(payload) {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '30d' })
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET)
}

function verifyRefreshToken(token) {
  return jwt.verify(token, JWT_REFRESH_SECRET)
}

module.exports = { signToken, signRefreshToken, verifyToken, verifyRefreshToken }
