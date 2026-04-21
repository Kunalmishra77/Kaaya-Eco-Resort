// d:/kaaya eco resort/client/src/pages/MyBookings.jsx
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { CalendarDays, Users, ArrowRight, Bed } from 'lucide-react'
import { fetchMyBookings } from '../store/slices/bookingSlice.js'
import { formatPrice, formatDate, nightsBetween, BOOKING_STATUS_CONFIG } from '../utils/helpers.js'
import Spinner from '../components/common/Spinner.jsx'
import SectionReveal from '../components/common/SectionReveal.jsx'

export default function MyBookings() {
  const dispatch = useDispatch()
  const { myBookings, loading } = useSelector((s) => s.booking)
  const { user } = useSelector((s) => s.auth)

  useEffect(() => {
    dispatch(fetchMyBookings())
  }, [dispatch])

  return (
    <div className="min-h-screen bg-stone">
      {/* Header */}
      <div className="bg-forest px-4 sm:px-6 lg:px-8 py-14">
        <div className="container-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="section-label text-sand/70 mb-3">My Account</p>
            <h1 className="font-display text-stone text-4xl font-semibold">
              Welcome back, {user?.firstName}
            </h1>
            <p className="font-sans text-stone/55 mt-2">Manage your Kaaya reservations</p>
          </motion.div>
        </div>
      </div>

      {/* Bookings list */}
      <section className="page-section">
        <div className="container-lg">
          {loading ? (
            <div className="flex justify-center py-16">
              <Spinner size="lg" />
            </div>
          ) : myBookings.length === 0 ? (
            <SectionReveal>
              <div className="text-center py-20">
                <div className="w-16 h-16 rounded-full bg-sage/20 flex items-center justify-center mx-auto mb-6">
                  <CalendarDays size={28} className="text-sage" />
                </div>
                <h2 className="font-display text-timber text-2xl font-semibold mb-3">No bookings yet</h2>
                <p className="font-sans text-timber/55 text-base mb-8 max-w-sm mx-auto">
                  Your Yala adventure is waiting. Browse our rooms and make your first booking.
                </p>
                <Link to="/accommodation" className="btn-primary">
                  Explore Rooms <ArrowRight size={16} />
                </Link>
              </div>
            </SectionReveal>
          ) : (
            <div className="space-y-6">
              <p className="font-sans text-sm text-timber/50">{myBookings.length} booking{myBookings.length !== 1 ? 's' : ''} found</p>
              {myBookings.map((booking, i) => (
                <BookingCard key={booking.id} booking={booking} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function BookingCard({ booking, index }) {
  const nights   = nightsBetween(booking.checkIn, booking.checkOut)
  const status   = BOOKING_STATUS_CONFIG[booking.status] || { label: booking.status, color: 'bg-gray-100 text-gray-600' }
  const isPast   = new Date(booking.checkOut) < new Date()
  const heroImg  = booking.room?.images?.[0] || null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="bg-white border border-sage/20 rounded-sm overflow-hidden card-hover"
    >
      <div className="grid sm:grid-cols-4 gap-0">
        {/* Image */}
        <div className="sm:col-span-1 h-40 sm:h-auto bg-sage/10 relative overflow-hidden">
          {heroImg ? (
            <img src={heroImg} alt={booking.room?.name} className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-forest/30 to-olive/20 flex items-center justify-center">
              <Bed size={28} className="text-forest/30" />
            </div>
          )}
          {isPast && (
            <div className="absolute inset-0 bg-timber/30" />
          )}
        </div>

        {/* Details */}
        <div className="sm:col-span-3 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="font-display text-timber text-xl font-semibold leading-snug mb-1">
                  {booking.room?.name}
                </h3>
                <p className="font-sans text-xs text-timber/40 uppercase tracking-wider">
                  Ref: {booking.id.slice(-8).toUpperCase()}
                </p>
              </div>
              <span className={`badge ${status.color} flex-shrink-0`}>{status.label}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm font-sans text-timber/70 mb-5">
              <div>
                <p className="text-xs text-timber/40 uppercase tracking-wider mb-0.5 flex items-center gap-1">
                  <CalendarDays size={10} /> Check-in
                </p>
                <p className="font-medium text-timber">{formatDate(booking.checkIn)}</p>
              </div>
              <div>
                <p className="text-xs text-timber/40 uppercase tracking-wider mb-0.5 flex items-center gap-1">
                  <CalendarDays size={10} /> Check-out
                </p>
                <p className="font-medium text-timber">{formatDate(booking.checkOut)}</p>
              </div>
              <div>
                <p className="text-xs text-timber/40 uppercase tracking-wider mb-0.5">Nights</p>
                <p className="font-medium text-timber">{nights}</p>
              </div>
              <div>
                <p className="text-xs text-timber/40 uppercase tracking-wider mb-0.5 flex items-center gap-1">
                  <Users size={10} /> Guests
                </p>
                <p className="font-medium text-timber">
                  {booking.adults}{booking.children > 0 ? `+${booking.children}` : ''}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-sage/20 pt-4">
            <div>
              <p className="font-sans text-xs text-timber/40 uppercase tracking-wider">Total</p>
              <p className="font-display text-forest text-xl font-semibold">{formatPrice(booking.totalPrice)}</p>
            </div>
            <div className="flex items-center gap-3">
              {booking.status === 'PENDING' && (
                <Link to={`/book?bookingId=${booking.id}`} className="btn-primary py-2 px-4 text-xs">
                  Complete Payment
                </Link>
              )}
              <Link to={`/accommodation`} className="btn-outline py-2 px-4 text-xs">
                View Rooms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
