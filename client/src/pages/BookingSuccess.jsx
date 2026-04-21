// d:/kaaya eco resort/client/src/pages/BookingSuccess.jsx
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle, CalendarDays, Users, Mail, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import api from '../utils/api.js'
import { formatPrice, formatDate, nightsBetween } from '../utils/helpers.js'
import Spinner from '../components/common/Spinner.jsx'

export default function BookingSuccess() {
  const [searchParams] = useSearchParams()
  const bookingId = searchParams.get('bookingId')

  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!bookingId) { setLoading(false); return }
    api.get(`/bookings/${bookingId}`)
      .then(({ data }) => setBooking(data.booking))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [bookingId])

  if (loading) {
    return (
      <div className="min-h-screen bg-stone flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  const nights = booking ? nightsBetween(booking.checkIn, booking.checkOut) : 0

  return (
    <div className="min-h-screen bg-stone flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="flex justify-center mb-8"
        >
          <div className="w-20 h-20 rounded-full bg-forest/10 flex items-center justify-center">
            <CheckCircle size={44} className="text-forest" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="text-center mb-10">
            <p className="section-label text-sand mb-3">Booking Confirmed</p>
            <h1 className="font-display text-timber text-4xl font-semibold mb-4">
              You're Heading to Yala!
            </h1>
            <p className="font-sans text-timber/60 text-base leading-relaxed max-w-sm mx-auto">
              Your booking is confirmed. A confirmation email has been sent to{' '}
              <span className="font-medium text-timber">{booking?.guestEmail || 'your email'}</span>.
            </p>
          </div>

          {booking && (
            <div className="bg-white border border-sage/20 rounded-sm p-6 mb-8">
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-sage/20">
                <div>
                  <p className="font-sans text-xs text-timber/40 uppercase tracking-wider">Booking Reference</p>
                  <p className="font-sans font-semibold text-timber text-sm mt-0.5">{booking.id.slice(-8).toUpperCase()}</p>
                </div>
                <span className="badge bg-green-100 text-green-700">Confirmed</span>
              </div>

              <div className="space-y-4 text-sm font-sans">
                <div>
                  <p className="text-timber/40 uppercase tracking-wider text-xs mb-1">Room</p>
                  <p className="font-semibold text-timber">{booking.room?.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-timber/40 uppercase tracking-wider text-xs mb-1 flex items-center gap-1">
                      <CalendarDays size={11} /> Check-in
                    </p>
                    <p className="font-semibold text-timber">{formatDate(booking.checkIn)}</p>
                  </div>
                  <div>
                    <p className="text-timber/40 uppercase tracking-wider text-xs mb-1 flex items-center gap-1">
                      <CalendarDays size={11} /> Check-out
                    </p>
                    <p className="font-semibold text-timber">{formatDate(booking.checkOut)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-timber/40 uppercase tracking-wider text-xs mb-1 flex items-center gap-1">
                      <Users size={11} /> Guests
                    </p>
                    <p className="font-semibold text-timber">
                      {booking.adults} adults{booking.children > 0 ? `, ${booking.children} children` : ''}
                    </p>
                  </div>
                  <div>
                    <p className="text-timber/40 uppercase tracking-wider text-xs mb-1">Duration</p>
                    <p className="font-semibold text-timber">{nights} night{nights !== 1 ? 's' : ''}</p>
                  </div>
                </div>

                <div className="divider" />
                <div className="flex justify-between font-semibold text-base">
                  <span className="text-timber">Total Paid</span>
                  <span className="text-forest">{formatPrice(booking.totalPrice)}</span>
                </div>
              </div>
            </div>
          )}

          {/* What's next */}
          <div className="bg-forest rounded-sm p-6 mb-8">
            <p className="font-sans text-xs uppercase tracking-wider text-sand/70 font-semibold mb-4">What Happens Next</p>
            <div className="space-y-3 font-sans text-sm text-stone/70">
              <div className="flex items-start gap-3">
                <Mail size={15} className="text-sand flex-shrink-0 mt-0.5" />
                <p>A confirmation email with full details has been sent to you.</p>
              </div>
              <div className="flex items-start gap-3">
                <CalendarDays size={15} className="text-sand flex-shrink-0 mt-0.5" />
                <p>Our team will contact you 48 hours before arrival to confirm arrangements and safari schedules.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-sand flex-shrink-0 mt-0.5">📞</span>
                <p>For any queries, call us on +94 77 123 4567 or email bookings@kaayaecoresort.com.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/my-bookings" className="btn-primary flex-1 justify-center gap-2">
              View My Bookings <ArrowRight size={16} />
            </Link>
            <Link to="/" className="btn-outline flex-1 justify-center">
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
