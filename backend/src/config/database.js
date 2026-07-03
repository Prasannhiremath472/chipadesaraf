const mysql = require('mysql2/promise')

const pool = mysql.createPool({
  host:            process.env.DB_HOST     || 'localhost',
  user:            process.env.DB_USER     || 'root',
  password:        process.env.DB_PASSWORD || '',
  database:        process.env.DB_NAME     || 'aurae_db',
  port:            parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit:    20,
  queueLimit:         0,
  charset:         'utf8mb4',
  timezone:        '+05:30',
})

pool.on('error', (err) => {
  console.error('[DB] Pool error:', err)
})

module.exports = pool
