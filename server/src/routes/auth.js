import { Router } from 'express'
import { randomUUID } from 'crypto'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import rateLimit from 'express-rate-limit'
import pool from '../lib/db.js'
import { protect } from '../middleware/authMiddleware.js'

const router = Router()

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Too many login attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
})

function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

// POST /api/auth/register
router.post('/register', authLimiter, async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'All fields are required' })
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' })
    }

    const normalEmail = email.toLowerCase().trim()
    const [exists] = await pool.execute('SELECT id FROM User WHERE email = ? LIMIT 1', [normalEmail])
    if (exists.length) {
      return res.status(409).json({ message: 'An account with this email already exists' })
    }

    const id       = randomUUID()
    const hashedPw = await bcrypt.hash(password, 12)
    await pool.execute(
      'INSERT INTO User (id, email, password, firstName, lastName, phone, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [id, normalEmail, hashedPw, firstName.trim(), lastName.trim(), phone?.trim() || null, 'GUEST']
    )

    const user  = { id, email: normalEmail, firstName: firstName.trim(), lastName: lastName.trim(), role: 'GUEST', phone: phone?.trim() || null }
    const token = signToken(id)
    res.status(201).json({ token, user })
  } catch (err) {
    next(err)
  }
})

// POST /api/auth/login
router.post('/login', authLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const [rows] = await pool.execute(
      'SELECT id, email, firstName, lastName, role, phone, password FROM User WHERE email = ? LIMIT 1',
      [email.toLowerCase()]
    )

    const user = rows[0]
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const { password: _, ...userWithoutPassword } = user
    res.json({ token: signToken(user.id), user: userWithoutPassword })
  } catch (err) {
    next(err)
  }
})

// GET /api/auth/me
router.get('/me', protect, (req, res) => {
  res.json({ user: req.user })
})

// GET /api/auth/admin-exists
router.get('/admin-exists', async (_req, res, next) => {
  try {
    const [[{ count }]] = await pool.execute("SELECT COUNT(*) as count FROM User WHERE role = 'ADMIN'")
    res.json({ exists: Number(count) > 0 })
  } catch (err) {
    next(err)
  }
})

// POST /api/auth/claim-admin
router.post('/claim-admin', protect, async (req, res, next) => {
  try {
    const [[{ count }]] = await pool.execute("SELECT COUNT(*) as count FROM User WHERE role = 'ADMIN'")
    if (Number(count) > 0) {
      return res.status(403).json({ message: 'An admin already exists. Contact the existing admin to grant you access.' })
    }
    await pool.execute("UPDATE User SET role = 'ADMIN', updatedAt = NOW() WHERE id = ?", [req.user.id])
    res.json({ user: { ...req.user, role: 'ADMIN' }, message: 'You are now an admin!' })
  } catch (err) {
    next(err)
  }
})

export default router
