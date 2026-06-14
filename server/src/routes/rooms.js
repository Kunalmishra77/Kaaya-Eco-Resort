import { Router } from 'express'
import pool from '../lib/db.js'

const router = Router()

function parseRoom(row) {
  return {
    ...row,
    amenities:  typeof row.amenities === 'string'  ? JSON.parse(row.amenities)  : row.amenities,
    images:     typeof row.images    === 'string'  ? JSON.parse(row.images)     : row.images,
    featured:   !!row.featured,
    active:     row.active !== undefined ? !!row.active : undefined,
  }
}

// GET /api/rooms
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      `SELECT id, name, slug, type, description, pricePerNight, maxAdults, maxChildren,
              bedCount, amenities, images, featured
       FROM Room WHERE active = 1
       ORDER BY featured DESC, pricePerNight ASC`
    )
    res.json({ rooms: rows.map(parseRoom) })
  } catch (err) {
    next(err)
  }
})

// GET /api/rooms/:id
router.get('/:id', async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      `SELECT id, name, slug, type, description, longDescription, pricePerNight,
              maxAdults, maxChildren, bedCount, amenities, images, featured
       FROM Room WHERE active = 1 AND (id = ? OR slug = ?) LIMIT 1`,
      [req.params.id, req.params.id]
    )
    if (!rows.length) return res.status(404).json({ message: 'Room not found' })
    res.json({ room: parseRoom(rows[0]) })
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

    const [conflict] = await pool.execute(
      `SELECT id FROM Booking
       WHERE roomId = ? AND status IN ('CONFIRMED','PENDING','CHECKED_IN')
         AND checkIn < ? AND checkOut > ? LIMIT 1`,
      [req.params.id, end, start]
    )

    const [blocked] = await pool.execute(
      'SELECT id FROM BlockedDate WHERE roomId = ? AND date >= ? AND date < ? LIMIT 1',
      [req.params.id, start, end]
    )

    res.json({ available: !conflict.length && !blocked.length })
  } catch (err) {
    next(err)
  }
})

export default router
