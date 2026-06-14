import { Router } from 'express'
import { randomUUID } from 'crypto'
import pool from '../lib/db.js'
import { protect, adminOnly } from '../middleware/authMiddleware.js'

const router = Router()
router.use(protect, adminOnly)

// ── Stats ─────────────────────────────────────────────────────────────────────

router.get('/stats', async (_req, res, next) => {
  try {
    const [[total]]       = await pool.execute('SELECT COUNT(*) AS v FROM Booking')
    const [[confirmed]]   = await pool.execute("SELECT COUNT(*) AS v FROM Booking WHERE status = 'CONFIRMED'")
    const [[pending]]     = await pool.execute("SELECT COUNT(*) AS v FROM Booking WHERE status = 'PENDING'")
    const [[revenue]]     = await pool.execute("SELECT COALESCE(SUM(totalPrice),0) AS v FROM Booking WHERE status = 'CONFIRMED'")
    const [[rooms]]       = await pool.execute('SELECT COUNT(*) AS v FROM Room WHERE active = 1')
    const [[unrevReviews]]= await pool.execute('SELECT COUNT(*) AS v FROM Review WHERE approved = 0')
    const [[unreadInq]]   = await pool.execute('SELECT COUNT(*) AS v FROM Inquiry WHERE `read` = 0')

    res.json({
      totalBookings:     Number(total.v),
      confirmedBookings: Number(confirmed.v),
      pendingBookings:   Number(pending.v),
      totalRevenue:      Number(revenue.v),
      totalRooms:        Number(rooms.v),
      unapprovedReviews: Number(unrevReviews.v),
      unreadInquiries:   Number(unreadInq.v),
    })
  } catch (err) {
    next(err)
  }
})

// ── Bookings ──────────────────────────────────────────────────────────────────

router.get('/bookings', async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query
    const offset = (Number(page) - 1) * Number(limit)

    let where = ''
    const params = []
    if (status) { where = 'WHERE b.status = ?'; params.push(status) }

    const [rows] = await pool.execute(
      `SELECT b.id, b.checkIn, b.checkOut, b.adults, b.children, b.totalPrice, b.status,
              b.specialRequests, b.guestName, b.guestEmail, b.guestPhone, b.createdAt,
              r.id AS room_id, r.name AS room_name, r.type AS room_type,
              u.id AS user_id, u.email AS user_email, u.firstName AS user_firstName, u.lastName AS user_lastName
       FROM Booking b
       JOIN Room r ON b.roomId = r.id
       JOIN User u ON b.userId = u.id
       ${where}
       ORDER BY b.createdAt DESC
       LIMIT ${Number(limit)} OFFSET ${offset}`,
      params
    )

    const [[{ total }]] = await pool.execute(
      `SELECT COUNT(*) AS total FROM Booking b ${where}`,
      params
    )

    const bookings = rows.map((b) => ({
      id: b.id, checkIn: b.checkIn, checkOut: b.checkOut, adults: b.adults, children: b.children,
      totalPrice: b.totalPrice, status: b.status, specialRequests: b.specialRequests,
      guestName: b.guestName, guestEmail: b.guestEmail, guestPhone: b.guestPhone, createdAt: b.createdAt,
      room: { id: b.room_id, name: b.room_name, type: b.room_type },
      user: { id: b.user_id, email: b.user_email, firstName: b.user_firstName, lastName: b.user_lastName },
    }))

    res.json({ bookings, total: Number(total), page: Number(page), totalPages: Math.ceil(Number(total) / Number(limit)) })
  } catch (err) {
    next(err)
  }
})

router.patch('/bookings/:id', async (req, res, next) => {
  try {
    const { status } = req.body
    const valid = ['PENDING', 'CONFIRMED', 'CANCELLED', 'CHECKED_IN', 'CHECKED_OUT']
    if (!valid.includes(status)) return res.status(400).json({ message: 'Invalid status' })

    await pool.execute('UPDATE Booking SET status = ?, updatedAt = NOW() WHERE id = ?', [status, req.params.id])
    res.json({ booking: { id: req.params.id, status } })
  } catch (err) {
    next(err)
  }
})

// ── Rooms ─────────────────────────────────────────────────────────────────────

router.post('/rooms', async (req, res, next) => {
  try {
    const { name, slug, type, description, longDescription, pricePerNight, maxAdults, maxChildren, bedCount, amenities, images, featured } = req.body
    if (!name || !type || !pricePerNight || !maxAdults) {
      return res.status(400).json({ message: 'name, type, pricePerNight, maxAdults are required' })
    }
    const id = randomUUID()
    await pool.execute(
      `INSERT INTO Room (id, name, slug, type, description, longDescription, pricePerNight,
         maxAdults, maxChildren, bedCount, amenities, images, featured, active, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())`,
      [
        id, name, slug || name.toLowerCase().replace(/\s+/g, '-'), type,
        description || '', longDescription || '',
        Number(pricePerNight), Number(maxAdults), Number(maxChildren) || 0, Number(bedCount) || 1,
        JSON.stringify(amenities || []), JSON.stringify(images || []),
        featured ? 1 : 0,
      ]
    )
    res.status(201).json({ room: { id, name, slug, type } })
  } catch (err) {
    next(err)
  }
})

router.put('/rooms/:id', async (req, res, next) => {
  try {
    const fields = []
    const params = []
    const allowed = { name: 's', slug: 's', type: 's', description: 's', longDescription: 's', pricePerNight: 'n', maxAdults: 'n', maxChildren: 'n', bedCount: 'n', featured: 'b', active: 'b' }
    const jsonFields = { amenities: true, images: true }

    for (const [key, cast] of Object.entries(allowed)) {
      if (req.body[key] !== undefined) {
        fields.push(`\`${key}\` = ?`)
        params.push(cast === 'n' ? Number(req.body[key]) : cast === 'b' ? (req.body[key] ? 1 : 0) : req.body[key])
      }
    }
    for (const key of Object.keys(jsonFields)) {
      if (req.body[key] !== undefined) {
        fields.push(`\`${key}\` = ?`)
        params.push(JSON.stringify(req.body[key]))
      }
    }

    if (!fields.length) return res.status(400).json({ message: 'No fields to update' })
    params.push(req.params.id)
    await pool.execute(`UPDATE Room SET ${fields.join(', ')}, updatedAt = NOW() WHERE id = ?`, params)
    res.json({ room: { id: req.params.id } })
  } catch (err) {
    next(err)
  }
})

router.delete('/rooms/:id', async (req, res, next) => {
  try {
    await pool.execute('UPDATE Room SET active = 0, updatedAt = NOW() WHERE id = ?', [req.params.id])
    res.json({ message: 'Room deactivated' })
  } catch (err) {
    next(err)
  }
})

// ── Gallery ───────────────────────────────────────────────────────────────────

router.post('/gallery', async (req, res, next) => {
  try {
    const { url, publicId, category, caption, sortOrder } = req.body
    if (!url || !publicId) return res.status(400).json({ message: 'url and publicId are required' })

    const id = randomUUID()
    await pool.execute(
      'INSERT INTO GalleryImage (id, url, publicId, category, caption, sortOrder, active, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, 1, NOW(), NOW())',
      [id, url, publicId, category || 'general', caption || null, sortOrder || 0]
    )
    res.status(201).json({ image: { id, url, publicId } })
  } catch (err) {
    next(err)
  }
})

router.delete('/gallery/:id', async (req, res, next) => {
  try {
    await pool.execute('UPDATE GalleryImage SET active = 0, updatedAt = NOW() WHERE id = ?', [req.params.id])
    res.json({ message: 'Image removed from gallery' })
  } catch (err) {
    next(err)
  }
})

// ── Reviews ───────────────────────────────────────────────────────────────────

router.patch('/reviews/:id/approve', async (req, res, next) => {
  try {
    const approved = req.body.approved ? 1 : 0
    await pool.execute('UPDATE Review SET approved = ?, updatedAt = NOW() WHERE id = ?', [approved, req.params.id])
    res.json({ review: { id: req.params.id, approved: !!approved } })
  } catch (err) {
    next(err)
  }
})

router.get('/reviews', async (_req, res, next) => {
  try {
    const [rows] = await pool.execute(
      `SELECT r.id, r.rating, r.title, r.comment, r.approved, r.createdAt,
              u.firstName, u.lastName, u.email
       FROM Review r
       JOIN User u ON r.userId = u.id
       ORDER BY r.createdAt DESC`
    )
    const reviews = rows.map((r) => ({
      id: r.id, rating: r.rating, title: r.title, comment: r.comment,
      approved: !!r.approved, createdAt: r.createdAt,
      user: { firstName: r.firstName, lastName: r.lastName, email: r.email },
    }))
    res.json({ reviews })
  } catch (err) {
    next(err)
  }
})

// ── Inquiries ─────────────────────────────────────────────────────────────────

router.get('/inquiries', async (_req, res, next) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, name, email, phone, subject, message, `read`, createdAt FROM Inquiry ORDER BY createdAt DESC'
    )
    res.json({ inquiries: rows.map((r) => ({ ...r, read: !!r.read })) })
  } catch (err) {
    next(err)
  }
})

router.patch('/inquiries/:id/read', async (req, res, next) => {
  try {
    await pool.execute('UPDATE Inquiry SET `read` = 1, updatedAt = NOW() WHERE id = ?', [req.params.id])
    res.json({ message: 'Marked as read' })
  } catch (err) {
    next(err)
  }
})

// ── Analytics ─────────────────────────────────────────────────────────────────

router.get('/analytics', async (_req, res, next) => {
  try {
    const now    = new Date()
    const months = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      months.push({
        label: d.toLocaleString('en', { month: 'short' }) + ' ' + String(d.getFullYear()).slice(2),
        start: new Date(d.getFullYear(), d.getMonth(), 1),
        end:   new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59),
      })
    }

    const monthlyData = await Promise.all(months.map(async (m) => {
      const [[row]] = await pool.execute(
        `SELECT COUNT(*) AS bookings,
                COALESCE(SUM(CASE WHEN status = 'CONFIRMED' THEN totalPrice ELSE 0 END), 0) AS revenue
         FROM Booking WHERE createdAt >= ? AND createdAt <= ?`,
        [m.start, m.end]
      )
      return { label: m.label, bookings: Number(row.bookings), revenue: Number(row.revenue) }
    }))

    const [topRoomRows] = await pool.execute(
      `SELECT b.roomId, COUNT(*) AS bookingCount, SUM(b.totalPrice) AS revenue, r.name
       FROM Booking b
       JOIN Room r ON b.roomId = r.id
       WHERE b.status = 'CONFIRMED'
       GROUP BY b.roomId, r.name
       ORDER BY bookingCount DESC
       LIMIT 5`
    )
    const topRooms = topRoomRows.map((r) => ({
      name: r.name, bookings: Number(r.bookingCount), revenue: Number(r.revenue),
    }))

    const [recentRows] = await pool.execute(
      `SELECT b.id, b.guestName, b.totalPrice, b.status, b.createdAt, r.name AS room_name
       FROM Booking b
       JOIN Room r ON b.roomId = r.id
       ORDER BY b.createdAt DESC LIMIT 5`
    )
    const recentBookings = recentRows.map((b) => ({
      id: b.id, guestName: b.guestName, totalPrice: b.totalPrice,
      status: b.status, createdAt: b.createdAt,
      room: { name: b.room_name },
    }))

    res.json({ monthlyData, topRooms, recentBookings })
  } catch (err) {
    next(err)
  }
})

// ── Users ─────────────────────────────────────────────────────────────────────

router.get('/users', async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query
    const offset = (Number(page) - 1) * Number(limit)

    const [rows] = await pool.execute(
      `SELECT u.id, u.email, u.firstName, u.lastName, u.phone, u.role, u.createdAt,
              (SELECT COUNT(*) FROM Booking WHERE userId = u.id) AS bookingCount,
              (SELECT COUNT(*) FROM Review  WHERE userId = u.id) AS reviewCount
       FROM User u
       ORDER BY u.createdAt DESC
       LIMIT ${Number(limit)} OFFSET ${offset}`
    )

    const [[{ total }]] = await pool.execute('SELECT COUNT(*) AS total FROM User')

    const users = rows.map((u) => ({
      ...u,
      _count: { bookings: Number(u.bookingCount), reviews: Number(u.reviewCount) },
    }))

    res.json({ users, total: Number(total), totalPages: Math.ceil(Number(total) / Number(limit)) })
  } catch (err) {
    next(err)
  }
})

router.patch('/users/:id/role', async (req, res, next) => {
  try {
    const { role } = req.body
    if (!['GUEST', 'ADMIN'].includes(role)) return res.status(400).json({ message: 'Invalid role' })
    await pool.execute('UPDATE User SET role = ?, updatedAt = NOW() WHERE id = ?', [role, req.params.id])
    res.json({ user: { id: req.params.id, role } })
  } catch (err) {
    next(err)
  }
})

export default router
