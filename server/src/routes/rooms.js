// d:/kaaya eco resort/server/src/routes/rooms.js
import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

// GET /api/rooms
router.get('/', async (req, res, next) => {
  try {
    const rooms = await prisma.room.findMany({
      where: { active: true },
      select: {
        id: true, name: true, slug: true, type: true, description: true,
        pricePerNight: true, maxAdults: true, maxChildren: true, bedCount: true,
        amenities: true, images: true, featured: true,
      },
      orderBy: [{ featured: 'desc' }, { pricePerNight: 'asc' }],
    })
    res.json({ rooms })
  } catch (err) {
    next(err)
  }
})

// GET /api/rooms/:id
router.get('/:id', async (req, res, next) => {
  try {
    const room = await prisma.room.findFirst({
      where: {
        active: true,
        OR: [{ id: req.params.id }, { slug: req.params.id }],
      },
      select: {
        id: true, name: true, slug: true, type: true,
        description: true, longDescription: true,
        pricePerNight: true, maxAdults: true, maxChildren: true,
        bedCount: true, amenities: true, images: true, featured: true,
      },
    })
    if (!room) return res.status(404).json({ message: 'Room not found' })
    res.json({ room })
  } catch (err) {
    next(err)
  }
})

// GET /api/rooms/:id/availability?checkIn=&checkOut=
router.get('/:id/availability', async (req, res, next) => {
  try {
    const { checkIn, checkOut } = req.query
    if (!checkIn || !checkOut) {
      return res.status(400).json({ message: 'checkIn and checkOut are required' })
    }

    const start = new Date(checkIn)
    const end   = new Date(checkOut)

    if (isNaN(start) || isNaN(end) || start >= end) {
      return res.status(400).json({ message: 'Invalid date range' })
    }

    // Check for overlapping confirmed/pending bookings
    const conflict = await prisma.booking.findFirst({
      where: {
        roomId: req.params.id,
        status: { in: ['CONFIRMED', 'PENDING', 'CHECKED_IN'] },
        AND: [
          { checkIn:  { lt: end   } },
          { checkOut: { gt: start } },
        ],
      },
      select: { id: true },
    })

    // Check blocked dates
    const blocked = await prisma.blockedDate.findFirst({
      where: {
        roomId: req.params.id,
        date:   { gte: start, lt: end },
      },
      select: { id: true },
    })

    res.json({ available: !conflict && !blocked })
  } catch (err) {
    next(err)
  }
})

export default router
