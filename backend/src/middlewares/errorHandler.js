const { NODE_ENV } = require('../config/env')

function errorHandler(err, req, res, next) {
  console.error('[Error]', err.message, err.stack?.split('\n')[1])

  const status  = err.status || err.statusCode || 500
  const message = err.message || 'Internal server error'

  res.status(status).json({
    success: false,
    message,
    ...(NODE_ENV === 'development' && { stack: err.stack }),
  })
}

class AppError extends Error {
  constructor(message, status = 400) {
    super(message)
    this.status = status
    this.name   = 'AppError'
  }
}

module.exports = { errorHandler, AppError }
