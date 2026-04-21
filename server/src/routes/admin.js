// d:/kaaya eco resort/server/src/routes/admin.js
import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { protect, adminOnly } from '../middleware/authMiddleware.js'

const router = Router()
const prisma = new PrismaClient()

// All admin routes require auth + ADMIN role
router.use(protect, adminOnly)

// ── Stats ────────────────────────────────────────────────────────────────────

// GET /api/admin/stats
router.get('/stats', async (_req, res, next) => {
  try {
    const [
      totalBookings,
      confirmedBookings,
      pendingBookings,
      totalRevenue,
      totalRooms,
      unapprovedReviews,
      unreadInquiries,
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'CONFIRMED' } }),
      prisma.booking.count({ where: { status: 'PENDING' } }),
      prisma.booking.aggregate({
        where: { status: 'CONFIRMED' },
        _sum:  { totalPrice: true },
      }),
      prisma.room.count({ where: { active: true } }),
      prisma.review.count({ where: { approved: false } }),
      prisma.inquiry.count({ where: { read: false } }),
    ])

    res.json({
      totalBookings,
      confirmedBookings,
      pendingBookings,
      totalRevenue: totalRevenue._sum.totalPrice || 0,
      totalRooms,
      unapprovedReviews,
      unreadInquiries,
    })
  } catch (err) {
    next(err)
  }
})

// ── Bookings ──────────────────────────────────────────────────────────────────

// GET /api/admin/bookings
router.get('/bookings', async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query
    const skip = (Number(page) - 1) * Number(limit)

    const where = status ? { status } : {}

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        skip,
        take: Number(limit),
        select: {
          id: true, checkIn: true, checkOut: true, adults: true, children: true,
          totalPrice: true, status: true, specialRequests: true,
          guestName: true, guestEmail: true, guestPhone: true, createdAt: true,
          room: { select: { id: true, name: true, type: true } },
          user: { select: { id: true, email: true, firstName: true, lastName: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.booking.count({ where }),
    ])

    res.json({ bookings, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) })
  } catch (err) {
    next(err)
  }
})

// PATCH /api/admin/bookings/:id
router.patch('/bookings/:id', async (req, res, next) => {
  try {
    const { status } = req.body
    const validStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'CHECKED_IN', 'CHECKED_OUT']

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' })
    }

    const booking = await prisma.booking.update({
      where: { id: req.params.id },
      data:  { status },
      select: { id: true, status: true },
    })

    res.json({ booking })
  } catch (err) {
    next(err)
  }
})

// ── Rooms ──────────────────────────────────────────────────────────────────────

// POST /api/admin/rooms
router.post('/rooms', async (req, res, next) => {
  try {
    const {
      name, slug, type, description, longDescription,
      pricePerNight, maxAdults, maxChildren, bedCount,
      amenities, images, featured,
    } = req.body

    if (!name || !type || !pricePerNight || !maxAdults) {
      return res.status(400).json({ message: 'name, type, pricePerNight, maxAdults are required' })
    }

    const room = await prisma.room.create({
      data: {
        name, slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        type, description: description || '',
        longDescription: longDescription || '',
        pricePerNight: Number(pricePerNight),
        maxAdults: Number(maxAdults),
        maxChildren: Number(maxChildren) || 0,
        bedCount: Number(bedCount) || 1,
        amenities: amenities || [],
        images: images || [],
        featured: Boolean(featured),
      },
    })

    res.status(201).json({ room })
  } catch (err) {
    next(err)
  }
})

// PUT /api/admin/rooms/:id
router.put('/rooms/:id', async (req, res, next) => {
  try {
    const {
      name, slug, type, description, longDescription,
      pricePerNight, maxAdults, maxChildren, bedCount,
      amenities, images, featured, active,
    } = req.body

    const room = await prisma.room.update({
      where: { id: req.params.id },
      data: {
        ...(name            !== undefined && { name }),
        ...(slug            !== undefined && { slug }),
        ...(type            !== undefined && { type }),
        ...(description     !== undefined && { description }),
        ...(longDescription !== undefined && { longDescription }),
        ...(pricePerNight   !== undefined && { pricePerNight: Number(pricePerNight) }),
        ...(maxAdults       !== undefined && { maxAdults: Number(maxAdults) }),
        ...(maxChildren     !== undefined && { maxChildren: Number(maxChildren) }),
        ...(bedCount        !== undefined && { bedCount: Number(bedCount) }),
        ...(amenities       !== undefined && { amenities }),
        ...(images          !== undefined && { images }),
        ...(featured        !== undefined && { featured: Boolean(featured) }),
        ...(active          !== undefined && { active: Boolean(active) }),
      },
    })

    res.json({ room })
  } catch (err) {
    next(err)
  }
})

// DELETE /api/admin/rooms/:id
router.delete('/rooms/:id', async (req, res, next) => {
  try {
    await prisma.room.update({
      where: { id: req.params.id },
      data:  { active: false },
    })
    res.json({ message: 'Room deactivated' })
  } catch (err) {
    next(err)
  }
})

// ── Gallery ────────────────────────────────────────────────────────────────────

// POST /api/admin/gallery
router.post('/gallery', async (req, res, next) => {
  try {
    const { url, publicId, category, caption, sortOrder } = req.body

    if (!url || !publicId) {
      return res.status(400).json({ message: 'url and publicId are required' })
    }

    const image = await prisma.galleryImage.create({
      data: {
        url, publicId,
        category:  category  || 'general',
        caption:   caption   || null,
        sortOrder: sortOrder || 0,
      },
    })

    res.status(201).json({ image })
  } catch (err) {
    next(err)
  }
})

// DELETE /api/admin/gallery/:id
router.delete('/gallery/:id', async (req, res, next) => {
  try {
    await prisma.galleryImage.update({
      where: { id: req.params.id },
      data:  { active: false },
    })
    res.json({ message: 'Image removed from gallery' })
  } catch (err) {
    next(err)
  }
})

// ── Reviews ────────────────────────────────────────────────────────────────────

// PATCH /api/admin/reviews/:id/approve
router.patch('/reviews/:id/approve', async (req, res, next) => {
  try {
    const { approved } = req.body
    const review = await prisma.review.update({
      where: { id: req.params.id },
      data:  { approved: Boolean(approved) },
      select: { id: true, approved: true },
    })
    res.json({ review })
  } catch (err) {
    next(err)
  }
})

// GET /api/admin/reviews (includes unapproved)
router.get('/reviews', async (_req, res, next) => {
  try {
    const reviews = await prisma.review.findMany({
      select: {
        id: true, rating: true, title: true, comment: true,
        approved: true, createdAt: true,
        user: { select: { firstName: true, lastName: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    res.json({ reviews })
  } catch (err) {
    next(err)
  }
})

// ── Inquiries ──────────────────────────────────────────────────────────────────

// GET /api/admin/inquiries
router.get('/inquiries', async (_req, res, next) => {
  try {
    const inquiries = await prisma.inquiry.findMany({
      select: {
        id: true, name: true, email: true, phone: true,
        subject: true, message: true, read: true, createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })
    res.json({ inquiries })
  } catch (err) {
    next(err)
  }
})

// PATCH /api/admin/inquiries/:id/read
router.patch('/inquiries/:id/read', async (req, res, next) => {
  try {
    await prisma.inquiry.update({
      where: { id: req.params.id },
      data:  { read: true },
    })
    res.json({ message: 'Marked as read' })
  } catch (err) {
    next(err)
  }
})

export default router
