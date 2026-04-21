// d:/kaaya eco resort/server/src/routes/inquiries.js
import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { sendInquiryAck, notifyAdminNewInquiry } from '../services/emailService.js'

const router = Router()
const prisma = new PrismaClient()

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

    const inquiry = await prisma.inquiry.create({
      data: {
        name:    name.trim(),
        email:   email.toLowerCase().trim(),
        phone:   phone?.trim() || null,
        subject: subject?.trim() || 'General Inquiry',
        message: message.trim(),
      },
      select: { id: true, createdAt: true },
    })

    // Send emails non-blocking
    sendInquiryAck({ name, email, message }).catch(() => {})
    notifyAdminNewInquiry({ name, email, phone, subject, message }).catch(() => {})

    res.status(201).json({
      inquiry,
      message: "Thank you for your message. We'll be in touch within 24 hours.",
    })
  } catch (err) {
    next(err)
  }
})

export default router
