require('dotenv').config({ path: require('path').join(__dirname, '../../../.env') })

const fs   = require('fs')
const path = require('path')
const mysql = require('mysql2/promise')

async function seed() {
  const conn = await mysql.createConnection({
    host     : process.env.DB_HOST,
    port     : process.env.DB_PORT,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME,
    multipleStatements: true,
  })

  try {
    const sql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8')
    console.log('[Seed] Inserting seed data ...')
    await conn.query(sql)
    console.log('[Seed] ✓ Seed data inserted successfully')
  } finally {
    await conn.end()
  }
}

seed().catch(err => { console.error('[Seed] ✗', err.message); process.exit(1) })
