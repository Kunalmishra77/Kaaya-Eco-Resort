// d:/kaaya eco resort/client/src/pages/Booking.jsx
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import api from '../utils/api.js'
import BookingForm from '../components/booking/BookingForm.jsx'
import StripeCheckout from '../components/booking/StripeCheckout.jsx'
import RoomCard from '../components/common/RoomCard.jsx'
import Spinner from '../components/common/Spinner.jsx'
import SectionReveal from '../components/common/SectionReveal.jsx'

const STEPS = ['Choose Room', 'Your Details', 'Payment']

export default function Booking() {
  const navigate = useNavigate()
  const { selectedRoomId } = useSelector((s) => s.booking)

  const [step,        setStep]        = useState(selectedRoomId ? 1 : 0)
  const [rooms,       setRooms]       = useState([])
  const [loadingRooms,setLoadingRooms]= useState(true)
  const [selectedRoom,setSelectedRoom]= useState(null)
  const [booking,     setBooking]     = useState(null)

  useEffect(() => {
    api.get('/rooms')
      .then(({ data }) => {
        setRooms(data.rooms)
        if (selectedRoomId) {
          const found = data.rooms.find((r) => r.id === selectedRoomId)
          if (found) { setSelectedRoom(found); setStep(1) }
        }
      })
      .catch(() => {})
      .finally(() => setLoadingRooms(false))
  }, [selectedRoomId])

  // Also fetch individual room if navigated from room detail
  useEffect(() => {
    if (selectedRoomId && rooms.length === 0) {
      api.get(`/rooms/${selectedRoomId}`)
        .then(({ data }) => setSelectedRoom(data.room))
        .catch(() => {})
    }
  }, [selectedRoomId, rooms])

  const handleBookingCreated = (newBooking) => {
    setBooking(newBooking)
    setStep(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePaymentSuccess = () => {
    navigate(`/booking/success?bookingId=${booking.id}`)
  }

  return (
    <div className="min-h-screen bg-stone">
      {/* Header bar */}
      <div className="bg-forest py-6 px-4 sm:px-6 lg:px-8">
        <div className="container-lg">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="font-display text-stone text-xl font-semibold">
              Kaaya Eco Resort
            </Link>
            <Link to="/accommodation" className="font-sans text-stone/60 hover:text-stone text-sm transition-colors">
              ← Back to Rooms
            </Link>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`flex items-center gap-2 font-sans text-sm ${i === step ? 'text-sand font-semibold' : i < step ? 'text-stone/60' : 'text-stone/30'}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === step ? 'bg-sand text-timber' : i < step ? 'bg-stone/20 text-stone/60' : 'bg-stone/10 text-stone/30'}`}>
                    {i + 1}
                  </span>
                  <span className="hidden sm:inline">{s}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <ChevronRight size={14} className="text-stone/20" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-lg px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">

          {/* Step 0: Choose room */}
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
              <h1 className="font-display text-timber text-3xl sm:text-4xl font-semibold mb-3">Choose Your Room</h1>
              <p className="font-sans text-timber/60 mb-10">Select a room to continue with your booking.</p>

              {loadingRooms ? (
                <div className="flex justify-center py-16"><Spinner size="lg" /></div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rooms.map((room, i) => (
                    <div key={room.id} onClick={() => { setSelectedRoom(room); setStep(1) }} className="cursor-pointer">
                      <RoomCard room={room} delay={i * 0.07} />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Step 1: Booking details */}
          {step === 1 && selectedRoom && (
            <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
              <div className="grid lg:grid-cols-3 gap-8 sm:gap-12">
                {/* Form */}
                <div className="lg:col-span-2">
                  <h1 className="font-display text-timber text-3xl font-semibold mb-2">Your Details</h1>
                  <p className="font-sans text-timber/60 mb-8">
                    Booking <span className="text-forest font-medium">{selectedRoom.name}</span>
                  </p>
                  <div className="bg-white border border-sage/20 rounded-sm p-6 sm:p-8">
                    <BookingForm room={selectedRoom} onBookingCreated={handleBookingCreated} />
                  </div>
                </div>

                {/* Room summary */}
                <div className="lg:col-span-1 order-first lg:order-last">
                  <SectionReveal direction="right">
                    <div className="sticky top-24">
                      <p className="font-sans text-xs uppercase tracking-wider text-timber/50 font-semibold mb-4">Selected Room</p>
                      <RoomCard room={selectedRoom} />
                      <button
                        onClick={() => setStep(0)}
                        className="mt-3 font-sans text-sm text-timber/50 hover:text-sand transition-colors"
                      >
                        ← Change room
                      </button>
                    </div>
                  </SectionReveal>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && booking && (
            <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
              <div className="max-w-lg mx-auto">
                <h1 className="font-display text-timber text-3xl font-semibold mb-2">Secure Payment</h1>
                <p className="font-sans text-timber/60 mb-8">Complete your booking with a secure card payment.</p>

                <div className="bg-white border border-sage/20 rounded-sm p-6 sm:p-8">
                  <StripeCheckout
                    booking={booking}
                    onSuccess={handlePaymentSuccess}
                    onCancel={() => setStep(1)}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
