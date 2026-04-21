// d:/kaaya eco resort/server/src/routes/reviews.js
import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { protect } from '../middleware/authMiddleware.js'

const router = Router()
const prisma = new PrismaClient()

const REVIEW_SELECT = {
  id: true, rating: true, title: true, comment: true, createdAt: true,
  user: { select: { firstName: true, lastName: true } },
}

// GET /api/reviews
router.get('/', async (req, res, next) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { approved: true },
      select: REVIEW_SELECT,
      orderBy: { createdAt: 'desc' },
      take: 20,
    })
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

    // Check if user has a completed booking (optional enforcement)
    const review = await prisma.review.create({
      data: {
        userId:  req.user.id,
        rating:  Number(rating),
        title:   title?.trim() || null,
        comment: comment.trim(),
        approved: false,
      },
      select: REVIEW_SELECT,
    })

    res.status(201).json({ review, message: 'Review submitted. It will appear once approved.' })
  } catch (err) {
    next(err)
  }
})

export default router
