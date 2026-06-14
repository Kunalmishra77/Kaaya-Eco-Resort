import { Router } from 'express'
import { randomUUID } from 'crypto'
import pool from '../lib/db.js'
import { sendInquiryAck, notifyAdminNewInquiry } from '../services/emailService.js'

const router = Router()

// POST /api/inquiries
router.post('/', async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email address' })
    }

    const id = randomUUID()
    await pool.execute(
      `INSERT INTO Inquiry (id, name, email, phone, subject, message, \`read\`, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, 0, NOW(), NOW())`,
      [
        id,
        name.trim(),
        email.toLowerCase().trim(),
        phone?.trim() || null,
        subject?.trim() || 'General Inquiry',
        message.trim(),
      ]
    )

    sendInquiryAck({ name, email, message }).catch(() => {})
    notifyAdminNewInquiry({ name, email, phone, subject, message }).catch(() => {})

    res.status(201).json({
      inquiry: { id, createdAt: new Date() },
      message: "Thank you for your message. We'll be in touch within 24 hours.",
    })
  } catch (err) {
    next(err)
  }
})

export default router
