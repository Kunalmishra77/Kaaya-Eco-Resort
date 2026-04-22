// d:/kaaya eco resort/server/src/routes/auth.js
import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import rateLimit from 'express-rate-limit'
import { PrismaClient } from '@prisma/client'
import { protect } from '../middleware/authMiddleware.js'

const router = Router()
const prisma = new PrismaClient()

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

    const exists = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
    if (exists) {
      return res.status(409).json({ message: 'An account with this email already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: {
        email:     email.toLowerCase().trim(),
        password:  hashedPassword,
        firstName: firstName.trim(),
        lastName:  lastName.trim(),
        phone:     phone?.trim() || null,
      },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, phone: true },
    })

    const token = signToken(user.id)
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

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, phone: true, password: true },
    })

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const { password: _, ...userWithoutPassword } = user
    const token = signToken(user.id)
    res.json({ token, user: userWithoutPassword })
  } catch (err) {
    next(err)
  }
})

// GET /api/auth/me
router.get('/me', protect, (req, res) => {
  res.json({ user: req.user })
})

// GET /api/auth/admin-exists — public, tells client whether any admin exists yet
router.get('/admin-exists', async (_req, res, next) => {
  try {
    const count = await prisma.user.count({ where: { role: 'ADMIN' } })
    res.json({ exists: count > 0 })
  } catch (err) {
    next(err)
  }
})

// POST /api/auth/claim-admin — promotes the logged-in user to ADMIN
// Only works when zero ADMIN accounts exist in the database (first-time setup)
router.post('/claim-admin', protect, async (req, res, next) => {
  try {
    const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } })
    if (adminCount > 0) {
      return res.status(403).json({ message: 'An admin already exists. Contact the existing admin to grant you access.' })
    }
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data:  { role: 'ADMIN' },
      select: { id: true, email: true, firstName: true, lastName: true, role: true },
    })
    res.json({ user, message: 'You are now an admin!' })
  } catch (err) {
    next(err)
  }
})

export default router
