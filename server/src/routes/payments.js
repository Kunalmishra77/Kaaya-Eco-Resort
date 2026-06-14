import { Router } from 'express'
import Stripe from 'stripe'
import pool from '../lib/db.js'
import { protect } from '../middleware/authMiddleware.js'

const router = Router()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder')

// POST /api/payments/create-intent
router.post('/create-intent', protect, async (req, res, next) => {
  try {
    const { bookingId } = req.body

    if (!bookingId) {
      return res.status(400).json({ message: 'bookingId is required' })
    }

    const [[booking]] = await pool.execute(
      'SELECT id, totalPrice, userId, status, guestEmail FROM Booking WHERE id = ? LIMIT 1',
      [bookingId]
    )

    if (!booking)           return res.status(404).json({ message: 'Booking not found' })
    if (booking.userId !== req.user.id) return res.status(403).json({ message: 'Access denied' })
    if (booking.status !== 'PENDING')   return res.status(400).json({ message: 'Booking is not in a payable state' })

    const amountCents = Math.round(booking.totalPrice * 100)
    const paymentIntent = await stripe.paymentIntents.create({
      amount:        amountCents,
      currency:      'lkr',
      metadata:      { bookingId, userId: req.user.id },
      receipt_email: booking.guestEmail,
    })

    res.json({ clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id })
  } catch (err) {
    next(err)
  }
})

// POST /api/payments/webhook
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
      const pi = event.data.object
      await pool.execute(
        "UPDATE Booking SET status = 'CONFIRMED', stripePaymentId = ?, updatedAt = NOW() WHERE id = ?",
        [pi.id, pi.metadata.bookingId]
      )
    }

    if (event.type === 'payment_intent.payment_failed') {
      const pi = event.data.object
      await pool.execute(
        "UPDATE Booking SET status = 'CANCELLED', updatedAt = NOW() WHERE id = ?",
        [pi.metadata.bookingId]
      )
    }

    res.json({ received: true })
  } catch (err) {
    next(err)
  }
})

export default router
