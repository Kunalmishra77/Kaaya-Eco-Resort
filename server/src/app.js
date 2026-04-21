// d:/kaaya eco resort/server/src/app.js
// Express app setup — no app.listen() so this can be imported by Vercel serverless
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'

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

// Security
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}))
app.use(cors({
  origin: (origin, cb) => {
    const allowed = [
      process.env.CLIENT_URL,
      'http://localhost:5173',
      'https://kaayaecoresort.com',
      'https://www.kaayaecoresort.com',
    ].filter(Boolean)
    // Allow Vercel preview URLs and same-origin requests (origin = undefined)
    if (!origin || allowed.includes(origin) || /\.vercel\.app$/.test(origin)) {
      return cb(null, true)
    }
    cb(new Error('Not allowed by CORS'))
  },
  credentials: true,
}))

// Stripe webhook needs raw body — mount BEFORE express.json()
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }))

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Utilities
app.use(compression())
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Routes
app.use('/api/auth',      authRoutes)
app.use('/api/rooms',     roomRoutes)
app.use('/api/bookings',  bookingRoutes)
app.use('/api/payments',  paymentRoutes)
app.use('/api/gallery',   galleryRoutes)
app.use('/api/reviews',   reviewRoutes)
app.use('/api/inquiries', inquiryRoutes)
app.use('/api/admin',     adminRoutes)

// 404
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// Error handler
app.use(errorHandler)

export default app
