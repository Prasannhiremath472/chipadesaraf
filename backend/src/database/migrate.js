require('dotenv').config({ path: require('path').join(__dirname, '../../../.env') })

const fs   = require('fs')
const path = require('path')
const mysql = require('mysql2/promise')

async function migrate() {
  const conn = await mysql.createConnection({
    host     : process.env.DB_HOST,
    port     : process.env.DB_PORT,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    multipleStatements: true,
  })

  try {
    const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8')
    console.log('[Migrate] Running schema.sql ...')
    await conn.query(sql)
    console.log('[Migrate] ✓ Schema applied successfully')
  } finally {
    await conn.end()
  }
}

migrate().catch(err => { console.error('[Migrate] ✗', err.message); process.exit(1) })
