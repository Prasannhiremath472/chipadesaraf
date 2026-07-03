require('dotenv').config()

const express     = require('express')
const cors        = require('cors')
const helmet      = require('helmet')
const compression = require('compression')
const rateLimit   = require('express-rate-limit')
const cookieParser= require('cookie-parser')
const morgan      = require('morgan')
const path        = require('path')
const fs          = require('fs')

const { PORT, FRONTEND_URL, NODE_ENV, UPLOAD_DIR } = require('./src/config/env')
const { errorHandler } = require('./src/middlewares/errorHandler')

const app = express()

/* ─────────────────────────────────────────
   Security & Utilities
───────────────────────────────────────── */
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow images from any origin
}))

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return cb(null, true)
    // Allow any localhost port in development
    if (/^http:\/\/localhost(:\d+)?$/.test(origin) || origin === FRONTEND_URL) {
      return cb(null, true)
    }
    cb(new Error(`CORS: origin ${origin} not allowed`))
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}))

app.use(compression())
app.use(cookieParser())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

/* ─────────────────────────────────────────
   Logging
───────────────────────────────────────── */
if (NODE_ENV !== 'test') {
  const logsDir = path.join(__dirname, 'logs')
  if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir)

  const logStream = fs.createWriteStream(path.join(logsDir, 'access.log'), { flags: 'a' })
  app.use(morgan('combined', { stream: logStream }))
  if (NODE_ENV !== 'production') app.use(morgan('dev'))
}

/* ─────────────────────────────────────────
   Rate Limiting
───────────────────────────────────────── */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many auth attempts. Try again in 15 minutes.' },
})

app.use('/api', globalLimiter)
app.use('/api/auth/login',    authLimiter)
app.use('/api/auth/register', authLimiter)

/* ─────────────────────────────────────────
   Static uploads
───────────────────────────────────────── */
const uploadsPath = path.join(__dirname, UPLOAD_DIR)
if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath, { recursive: true })
app.use('/uploads', express.static(uploadsPath))

/* ─────────────────────────────────────────
   Routes
───────────────────────────────────────── */
app.use('/api/auth',      require('./src/routes/auth'))
app.use('/api/products',  require('./src/routes/products'))
app.use('/api/orders',    require('./src/routes/orders'))
app.use('/api/payments',  require('./src/routes/payments'))
app.use('/api/coupons',   require('./src/routes/coupons'))
app.use('/api/reviews',   require('./src/routes/reviews'))
app.use('/api/wishlist',  require('./src/routes/wishlist'))
app.use('/api/blogs',     require('./src/routes/blogs'))
app.use('/api/admin',     require('./src/routes/admin'))
app.use('/api/contact',   require('./src/routes/contact'))

/* ─────────────────────────────────────────
   Health check
───────────────────────────────────────── */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', env: NODE_ENV, timestamp: new Date().toISOString() })
})

/* ─────────────────────────────────────────
   404 handler
───────────────────────────────────────── */
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` })
})

/* ─────────────────────────────────────────
   Global error handler
───────────────────────────────────────── */
app.use(errorHandler)

/* ─────────────────────────────────────────
   Start server
───────────────────────────────────────── */
const server = app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════╗
  ║        Auraè API Server               ║
  ║  Running on  : http://localhost:${PORT}  ║
  ║  Environment : ${NODE_ENV.padEnd(22)}║
  ╚═══════════════════════════════════════╝
  `)
})

server.on('error', (err) => {
  console.error('[Server Error]', err)
  process.exit(1)
})

process.on('SIGTERM', () => {
  console.log('[Server] SIGTERM received. Closing gracefully...')
  server.close(() => process.exit(0))
})

module.exports = app
