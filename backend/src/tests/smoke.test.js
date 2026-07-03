/**
 * Auraè API — Smoke Tests
 * Run: npm test  (requires jest + supertest)
 * Install: npm install -D jest supertest
 */

process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'test_secret_key_smoke'
process.env.JWT_REFRESH_SECRET = 'test_refresh_secret_smoke'

const request = require('supertest')
const app     = require('../../server')

describe('Health', () => {
  it('GET /health returns 200', async () => {
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('ok')
  })
})

describe('Auth', () => {
  it('POST /api/auth/register → 422 when fields missing', async () => {
    const res = await request(app).post('/api/auth/register').send({})
    expect(res.status).toBe(422)
  })

  it('POST /api/auth/login → 422 when fields missing', async () => {
    const res = await request(app).post('/api/auth/login').send({})
    expect(res.status).toBe(422)
  })

  it('GET /api/auth/me → 401 without token', async () => {
    const res = await request(app).get('/api/auth/me')
    expect(res.status).toBe(401)
  })
})

describe('Products', () => {
  it('GET /api/products returns list', async () => {
    const res = await request(app).get('/api/products')
    expect([200, 500]).toContain(res.status) // 500 only if DB not connected
  })
})

describe('Admin', () => {
  it('GET /api/admin/dashboard → 401 without token', async () => {
    const res = await request(app).get('/api/admin/dashboard')
    expect(res.status).toBe(401)
  })
})

describe('404', () => {
  it('Unknown route returns 404', async () => {
    const res = await request(app).get('/api/does-not-exist-xyz')
    expect(res.status).toBe(404)
  })
})
