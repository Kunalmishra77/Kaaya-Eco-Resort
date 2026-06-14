import { Router } from 'express'
import { randomUUID } from 'crypto'
import pool from '../lib/db.js'
import { protect } from '../middleware/authMiddleware.js'

const router = Router()

// GET /api/reviews
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      `SELECT r.id, r.rating, r.title, r.comment, r.createdAt,
              u.firstName, u.lastName
       FROM Review r
       JOIN User u ON r.userId = u.id
       WHERE r.approved = 1
       ORDER BY r.createdAt DESC
       LIMIT 20`
    )
    const reviews = rows.map((r) => ({
      id: r.id, rating: r.rating, title: r.title, comment: r.comment, createdAt: r.createdAt,
      user: { firstName: r.firstName, lastName: r.lastName },
    }))
    res.json({ reviews })
  } catch (err) {
    next(err)
  }
})

// POST /api/reviews
router.post('/', protect, async (req, res, next) => {
  try {
    const { rating, title, comment } = req.body

    if (!rating || !comment) {
      return res.status(400).json({ message: 'Rating and comment are required' })
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' })
    }

    const id = randomUUID()
    await pool.execute(
      'INSERT INTO Review (id, userId, rating, title, comment, approved, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, 0, NOW(), NOW())',
      [id, req.user.id, Number(rating), title?.trim() || null, comment.trim()]
    )

    const review = {
      id, rating: Number(rating), title: title?.trim() || null, comment: comment.trim(),
      createdAt: new Date(),
      user: { firstName: req.user.firstName, lastName: req.user.lastName },
    }
    res.status(201).json({ review, message: 'Review submitted. It will appear once approved.' })
  } catch (err) {
    next(err)
  }
})

export default router
