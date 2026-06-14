import { Router } from 'express'
import { randomUUID } from 'crypto'
import pool from '../lib/db.js'
import { protect } from '../middleware/authMiddleware.js'
import { sendBookingConfirmation } from '../services/emailService.js'

const router = Router()

function parseBookingRow(row) {
  return {
    id:              row.id,
    checkIn:         row.checkIn,
    checkOut:        row.checkOut,
    adults:          row.adults,
    children:        row.children,
    totalPrice:      row.totalPrice,
    status:          row.status,
    specialRequests: row.specialRequests,
    guestName:       row.guestName,
    guestEmail:      row.guestEmail,
    guestPhone:      row.guestPhone,
    createdAt:       row.createdAt,
    room: {
      id:            row.room_id,
      name:          row.room_name,
      slug:          row.room_slug,
      type:          row.room_type,
      images:        typeof row.room_images === 'string' ? JSON.parse(row.room_images) : row.room_images,
      pricePerNight: row.room_price,
    },
  }
}

const BOOKING_JOIN = `
  SELECT b.id, b.checkIn, b.checkOut, b.adults, b.children, b.totalPrice, b.status,
         b.specialRequests, b.guestName, b.guestEmail, b.guestPhone, b.createdAt,
         b.userId,
         r.id AS room_id, r.name AS room_name, r.slug AS room_slug,
         r.type AS room_type, r.images AS room_images, r.pricePerNight AS room_price
  FROM Booking b
  JOIN Room r ON b.roomId = r.id
`

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

    const [[room]] = await pool.execute(
      'SELECT id, pricePerNight, maxAdults, active FROM Room WHERE id = ? LIMIT 1',
      [roomId]
    )

    if (!room || !room.active) return res.status(404).json({ message: 'Room not found' })
    if (Number(adults) > room.maxAdults) {
      return res.status(400).json({ message: `This room accommodates up to ${room.maxAdults} adults` })
    }

    const [conflict] = await pool.execute(
      `SELECT id FROM Booking WHERE roomId = ? AND status IN ('CONFIRMED','PENDING','CHECKED_IN')
       AND checkIn < ? AND checkOut > ? LIMIT 1`,
      [roomId, end, start]
    )
    if (conflict.length) {
      return res.status(409).json({ message: 'Room is not available for the selected dates' })
    }

    const nights     = Math.round((end - start) / (1000 * 60 * 60 * 24))
    const totalPrice = nights * room.pricePerNight
    const id         = randomUUID()

    await pool.execute(
      `INSERT INTO Booking (id, userId, roomId, checkIn, checkOut, adults, children, totalPrice,
        status, specialRequests, guestName, guestEmail, guestPhone, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', ?, ?, ?, ?, NOW(), NOW())`,
      [
        id, req.user.id, roomId, start, end,
        Number(adults), Number(children) || 0, totalPrice,
        specialRequests || null,
        guestName  || `${req.user.firstName} ${req.user.lastName}`,
        guestEmail || req.user.email,
        guestPhone || req.user.phone || null,
      ]
    )

    const [rows] = await pool.execute(BOOKING_JOIN + ' WHERE b.id = ?', [id])
    const booking = parseBookingRow(rows[0])

    sendBookingConfirmation(booking).catch(() => {})
    res.status(201).json({ booking })
  } catch (err) {
    next(err)
  }
})

// GET /api/bookings/my
router.get('/my', protect, async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      BOOKING_JOIN + ' WHERE b.userId = ? ORDER BY b.createdAt DESC',
      [req.user.id]
    )
    res.json({ bookings: rows.map(parseBookingRow) })
  } catch (err) {
    next(err)
  }
})

// GET /api/bookings/:id
router.get('/:id', protect, async (req, res, next) => {
  try {
    const [rows] = await pool.execute(BOOKING_JOIN + ' WHERE b.id = ? LIMIT 1', [req.params.id])
    if (!rows.length) return res.status(404).json({ message: 'Booking not found' })

    const booking = parseBookingRow(rows[0])
    if (req.user.role !== 'ADMIN' && rows[0].userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' })
    }

    res.json({ booking })
  } catch (err) {
    next(err)
  }
})

export default router
