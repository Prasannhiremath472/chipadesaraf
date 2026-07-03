require('dotenv').config()

module.exports = {
  NODE_ENV:       process.env.NODE_ENV        || 'development',
  PORT:           parseInt(process.env.PORT   || '5000'),
  JWT_SECRET:     process.env.JWT_SECRET      || 'aurae_super_secret_change_in_production_2025',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN  || '7d',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'aurae_refresh_secret_2025',

  DB_HOST:     process.env.DB_HOST     || 'localhost',
  DB_USER:     process.env.DB_USER     || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME:     process.env.DB_NAME     || 'aurae_db',
  DB_PORT:     parseInt(process.env.DB_PORT || '3306'),

  SMTP_HOST:   process.env.SMTP_HOST   || 'smtp.gmail.com',
  SMTP_PORT:   parseInt(process.env.SMTP_PORT || '587'),
  SMTP_USER:   process.env.SMTP_USER   || '',
  SMTP_PASS:   process.env.SMTP_PASS   || '',
  FROM_EMAIL:  process.env.FROM_EMAIL  || 'noreply@auraeworld.com',
  FROM_NAME:   process.env.FROM_NAME   || 'Auraè Jewellery',

  RAZORPAY_KEY_ID:     process.env.RAZORPAY_KEY_ID     || '',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || '',

  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  UPLOAD_DIR:   process.env.UPLOAD_DIR   || 'uploads',
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || String(10 * 1024 * 1024)),

  BCRYPT_ROUNDS:       process.env.BCRYPT_ROUNDS       || '12',
  OTP_EXPIRES_MINUTES: process.env.OTP_EXPIRES_MINUTES || '10',
}
