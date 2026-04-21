// d:/kaaya eco resort/server/src/routes/gallery.js
import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

// GET /api/gallery?category=
router.get('/', async (req, res, next) => {
  try {
    const { category } = req.query

    const images = await prisma.galleryImage.findMany({
      where: {
        active: true,
        ...(category && category !== 'all' ? { category } : {}),
      },
      select: {
        id: true, url: true, publicId: true,
        category: true, caption: true, sortOrder: true,
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    })

    res.json({ images })
  } catch (err) {
    next(err)
  }
})

export default router
