// d:/kaaya eco resort/server/src/routes/payments.js
import { Router } from 'express'
import Stripe from 'stripe'
import { PrismaClient } from '@prisma/client'
import { protect } from '../middleware/authMiddleware.js'

const router = Router()
const prisma = new PrismaClient()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// POST /api/payments/create-intent
router.post('/create-intent', protect, async (req, res, next) => {
  try {
    const { bookingId } = req.body

    if (!bookingId) {
      return res.status(400).json({ message: 'bookingId is required' })
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: { id: true, totalPrice: true, userId: true, status: true, guestEmail: true },
    })

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    if (booking.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' })
    }

    if (booking.status !== 'PENDING') {
      return res.status(400).json({ message: 'Booking is not in a payable state' })
    }

    // Amount in LKR minor units (paise) — Stripe uses the smallest currency unit
    // LKR doesn't have sub-units in practice, so multiply by 100 for Stripe
    const amountCents = Math.round(booking.totalPrice * 100)

    const paymentIntent = await stripe.paymentIntents.create({
      amount:   amountCents,
      currency: 'lkr',
      metadata: { bookingId, userId: req.user.id },
      receipt_email: booking.guestEmail,
    })

    res.json({
      clientSecret:    paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (err) {
    next(err)
  }
})

// POST /api/payments/webhook  (raw body, set up in index.js)
router.post('/webhook', async (req, res, next) => {
  const sig = req.headers['stripe-signature']

  let event
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    return res.status(400).json({ message: `Webhook Error: ${err.message}` })
  }

  try {
    if (event.type === 'payment_intent.succeeded') {
      const pi        = event.data.object
      const bookingId = pi.metadata.bookingId

      await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status:           'CONFIRMED',
          stripePaymentId:  pi.id,
        },
      })
    }

    if (event.type === 'payment_intent.payment_failed') {
      const pi        = event.data.object
      const bookingId = pi.metadata.bookingId

      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'CANCELLED' },
      })
    }

    res.json({ received: true })
  } catch (err) {
    next(err)
  }
})

export default router
