// d:/kaaya eco resort/server/src/routes/bookings.js
import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { protect } from '../middleware/authMiddleware.js'
import { sendBookingConfirmation } from '../services/emailService.js'

const router = Router()
const prisma = new PrismaClient()

const BOOKING_SELECT = {
  id: true, checkIn: true, checkOut: true, adults: true, children: true,
  totalPrice: true, status: true, specialRequests: true,
  guestName: true, guestEmail: true, guestPhone: true,
  createdAt: true,
  room: {
    select: { id: true, name: true, slug: true, type: true, images: true, pricePerNight: true },
  },
}

// POST /api/bookings
router.post('/', protect, async (req, res, next) => {
  try {
    const { roomId, checkIn, checkOut, adults, children, specialRequests, guestName, guestEmail, guestPhone } = req.body

    if (!roomId || !checkIn || !checkOut || !adults) {
      return res.status(400).json({ message: 'roomId, checkIn, checkOut, and adults are required' })
    }

    const start = new Date(checkIn)
    const end   = new Date(checkOut)

    if (isNaN(start) || isNaN(end) || start >= end) {
      return res.status(400).json({ message: 'Invalid date range' })
    }

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      select: { id: true, pricePerNight: true, maxAdults: true, active: true },
    })

    if (!room || !room.active) {
      return res.status(404).json({ message: 'Room not found' })
    }

    if (adults > room.maxAdults) {
      return res.status(400).json({ message: `This room accommodates up to ${room.maxAdults} adults` })
    }

    // Check availability
    const conflict = await prisma.booking.findFirst({
      where: {
        roomId,
        status: { in: ['CONFIRMED', 'PENDING', 'CHECKED_IN'] },
        AND: [{ checkIn: { lt: end } }, { checkOut: { gt: start } }],
      },
      select: { id: true },
    })

    if (conflict) {
      return res.status(409).json({ message: 'Room is not available for the selected dates' })
    }

    const nights     = Math.round((end - start) / (1000 * 60 * 60 * 24))
    const totalPrice = nights * room.pricePerNight

    const booking = await prisma.booking.create({
      data: {
        userId:          req.user.id,
        roomId,
        checkIn:         start,
        checkOut:        end,
        adults:          Number(adults),
        children:        Number(children) || 0,
        totalPrice,
        status:          'PENDING',
        specialRequests: specialRequests || null,
        guestName:       guestName  || `${req.user.firstName} ${req.user.lastName}`,
        guestEmail:      guestEmail || req.user.email,
        guestPhone:      guestPhone || req.user.phone || null,
      },
      select: BOOKING_SELECT,
    })

    // Send confirmation email (non-blocking)
    sendBookingConfirmation(booking).catch(() => {})

    res.status(201).json({ booking })
  } catch (err) {
    next(err)
  }
})

// GET /api/bookings/my
router.get('/my', protect, async (req, res, next) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.id },
      select: BOOKING_SELECT,
      orderBy: { createdAt: 'desc' },
    })
    res.json({ bookings })
  } catch (err) {
    next(err)
  }
})

// GET /api/bookings/:id
router.get('/:id', protect, async (req, res, next) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      select: BOOKING_SELECT,
    })

    if (!booking) return res.status(404).json({ message: 'Booking not found' })

    // Users can only view their own bookings; admins can view all
    if (req.user.role !== 'ADMIN' && booking.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' })
    }

    res.json({ booking })
  } catch (err) {
    next(err)
  }
})

export default router
