import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import { existsSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

import authRoutes     from './routes/auth.js'
import roomRoutes     from './routes/rooms.js'
import bookingRoutes  from './routes/bookings.js'
import paymentRoutes  from './routes/payments.js'
import galleryRoutes  from './routes/gallery.js'
import reviewRoutes   from './routes/reviews.js'
import inquiryRoutes  from './routes/inquiries.js'
import adminRoutes    from './routes/admin.js'
import errorHandler   from './middleware/errorHandler.js'

const app = express()
const clientDist = path.join(__dirname, '../../client/dist')
const isProd     = process.env.NODE_ENV === 'production'

// ── 1. Static files — serve BEFORE any middleware (no CORS needed) ────────────
if (isProd && existsSync(clientDist)) {
  app.use(express.static(clientDist))
}

// ── 2. Security & CORS (API only) ─────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(compression())

// CORS: allow all origins — API is protected by JWT, not CORS
app.use('/api', cors({ origin: true, credentials: true }))

// ── 3. Stripe webhook needs raw body — mount BEFORE express.json() ────────────
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }))

// ── 4. Body parsing ───────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

if (!isProd) app.use(morgan('dev'))

// ── 5. Health check ───────────────────────────────────────────────────────────
app.get('/api/health', async (_req, res) => {
  const health = { status: 'ok', timestamp: new Date().toISOString(), db: 'unknown' }
  try {
    const { default: pool } = await import('./lib/db.js')
    await pool.execute('SELECT 1')
    health.db = 'connected'
  } catch (e) {
    health.db    = 'error: ' + e.message
    health.status = 'degraded'
  }
  res.json(health)
})

// ── 6. API routes ─────────────────────────────────────────────────────────────
app.use('/api/auth',      authRoutes)
app.use('/api/rooms',     roomRoutes)
app.use('/api/bookings',  bookingRoutes)
app.use('/api/payments',  paymentRoutes)
app.use('/api/gallery',   galleryRoutes)
app.use('/api/reviews',   reviewRoutes)
app.use('/api/inquiries', inquiryRoutes)
app.use('/api/admin',     adminRoutes)

// ── 7. SPA fallback for all non-API routes ────────────────────────────────────
if (isProd && existsSync(clientDist)) {
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
      res.status(404).json({ message: 'Route not found' })
    } else {
      res.sendFile(path.join(clientDist, 'index.html'))
    }
  })
} else {
  app.use((_req, res) => res.status(404).json({ message: 'Route not found' }))
}

// ── 8. Error handler ──────────────────────────────────────────────────────────
app.use(errorHandler)

export default app
