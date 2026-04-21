// d:/kaaya eco resort/client/src/components/booking/BookingForm.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import DatePicker from 'react-datepicker'
import { Users, CalendarDays, MessageSquare, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'
import { setSearchParams } from '../../store/slices/bookingSlice.js'
import { formatPrice, nightsBetween, calcTotalPrice } from '../../utils/helpers.js'
import Spinner from '../common/Spinner.jsx'
import api from '../../utils/api.js'
import 'react-datepicker/dist/react-datepicker.css'

export default function BookingForm({ room, onBookingCreated }) {
  const dispatch = useDispatch()
  const { checkIn: storeCheckIn, checkOut: storeCheckOut, adults: storeAdults, children: storeChildren } = useSelector((s) => s.booking)

  const [checkIn,         setCheckIn]         = useState(storeCheckIn  ? new Date(storeCheckIn)  : null)
  const [checkOut,        setCheckOut]        = useState(storeCheckOut ? new Date(storeCheckOut) : null)
  const [adults,          setAdults]          = useState(storeAdults   ?? 2)
  const [children,        setChildren]        = useState(storeChildren ?? 0)
  const [specialRequests, setSpecialRequests] = useState('')
  const [guestName,       setGuestName]       = useState('')
  const [guestEmail,      setGuestEmail]      = useState('')
  const [guestPhone,      setGuestPhone]      = useState('')
  const [guestOpen,       setGuestOpen]       = useState(false)
  const [availability,    setAvailability]    = useState(null)
  const [checkingAvail,   setCheckingAvail]   = useState(false)
  const [loading,         setLoading]         = useState(false)

  const { user } = useSelector((s) => s.auth)

  useEffect(() => {
    if (user) {
      setGuestName(`${user.firstName} ${user.lastName}`)
      setGuestEmail(user.email)
      setGuestPhone(user.phone || '')
    }
  }, [user])

  // Check availability when dates change
  useEffect(() => {
    if (!checkIn || !checkOut || !room?.id) { setAvailability(null); return }

    const timer = setTimeout(async () => {
      setCheckingAvail(true)
      try {
        const { data } = await api.get(`/rooms/${room.id}/availability`, {
          params: { checkIn: checkIn.toISOString(), checkOut: checkOut.toISOString() },
        })
        setAvailability(data.available)
      } catch {
        setAvailability(null)
      } finally {
        setCheckingAvail(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [checkIn, checkOut, room?.id])

  const nights     = nightsBetween(checkIn, checkOut)
  const totalPrice = room ? calcTotalPrice(room.pricePerNight, checkIn, checkOut) : 0
  const today      = new Date()

  const validate = () => {
    if (!checkIn || !checkOut) return 'Please select check-in and check-out dates'
    if (nights < 1)            return 'Minimum stay is 1 night'
    if (!guestName.trim())     return 'Guest name is required'
    if (!guestEmail.trim())    return 'Guest email is required'
    if (availability === false) return 'Room is not available for the selected dates'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const err = validate()
    if (err) { toast.error(err); return }

    setLoading(true)
    try {
      dispatch(setSearchParams({
        checkIn:  checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        adults,
        children,
      }))

      const { data } = await api.post('/bookings', {
        roomId: room.id,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        adults,
        children,
        specialRequests,
        guestName,
        guestEmail,
        guestPhone,
      })

      onBookingCreated(data.booking)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create booking')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Dates */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-sans text-xs uppercase tracking-wider text-timber/50 mb-1.5 font-semibold">
            Check-in
          </label>
          <div className="relative">
            <CalendarDays size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-sage pointer-events-none z-10" />
            <DatePicker
              selected={checkIn}
              onChange={(d) => { setCheckIn(d); if (checkOut && d >= checkOut) setCheckOut(null) }}
              minDate={today}
              placeholderText="Select date"
              dateFormat="dd MMM yyyy"
              className="input-base pl-9"
              popperPlacement="bottom-start"
            />
          </div>
        </div>
        <div>
          <label className="block font-sans text-xs uppercase tracking-wider text-timber/50 mb-1.5 font-semibold">
            Check-out
          </label>
          <div className="relative">
            <CalendarDays size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-sage pointer-events-none z-10" />
            <DatePicker
              selected={checkOut}
              onChange={setCheckOut}
              minDate={checkIn ? new Date(checkIn.getTime() + 86400000) : tomorrow(today)}
              placeholderText="Select date"
              dateFormat="dd MMM yyyy"
              className="input-base pl-9"
              popperPlacement="bottom-start"
            />
          </div>
        </div>
      </div>

      {/* Availability indicator */}
      {checkIn && checkOut && (
        <div className={`px-4 py-3 rounded-sm text-sm font-sans flex items-center gap-2 ${
          checkingAvail
            ? 'bg-stone text-timber/50'
            : availability === true
              ? 'bg-green-50 text-green-700 border border-green-200'
              : availability === false
                ? 'bg-red-50 text-terra border border-red-200'
                : 'bg-stone text-timber/50'
        }`}>
          {checkingAvail ? (
            <><Spinner size="sm" color="forest" /> Checking availability…</>
          ) : availability === true ? (
            <>✓ Available for {nights} night{nights !== 1 ? 's' : ''}</>
          ) : availability === false ? (
            <>✗ Not available for these dates</>
          ) : null}
        </div>
      )}

      {/* Guests */}
      <div className="relative">
        <label className="block font-sans text-xs uppercase tracking-wider text-timber/50 mb-1.5 font-semibold">
          Guests
        </label>
        <button
          type="button"
          onClick={() => setGuestOpen(!guestOpen)}
          className="input-base flex items-center justify-between"
        >
          <span className="flex items-center gap-2 text-timber">
            <Users size={15} className="text-sage" />
            {adults} adult{adults !== 1 ? 's' : ''}{children > 0 ? `, ${children} child${children !== 1 ? 'ren' : ''}` : ''}
          </span>
          <ChevronDown size={14} className={`text-sage transition-transform ${guestOpen ? 'rotate-180' : ''}`} />
        </button>

        {guestOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-sage/30 rounded-sm shadow-lg z-20 p-4 space-y-4">
            {[
              { label: 'Adults', sub: 'Age 13+', val: adults, min: 1, max: room?.maxAdults ?? 8, set: setAdults },
              { label: 'Children', sub: 'Age 2–12', val: children, min: 0, max: room?.maxChildren ?? 4, set: setChildren },
            ].map((g) => (
              <div key={g.label} className="flex items-center justify-between">
                <div>
                  <p className="font-sans text-sm font-medium text-timber">{g.label}</p>
                  <p className="font-sans text-xs text-timber/40">{g.sub}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => g.set(Math.max(g.min, g.val - 1))}
                    className="w-9 h-9 rounded-full border border-sage/40 text-timber hover:border-sand hover:text-sand transition-colors flex items-center justify-center" aria-label={`Decrease ${g.label}`}>–</button>
                  <span className="font-sans font-semibold text-timber w-4 text-center">{g.val}</span>
                  <button type="button" onClick={() => g.set(Math.min(g.max, g.val + 1))}
                    className="w-9 h-9 rounded-full border border-sage/40 text-timber hover:border-sand hover:text-sand transition-colors flex items-center justify-center" aria-label={`Increase ${g.label}`}>+</button>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => setGuestOpen(false)} className="w-full btn-primary py-2 text-xs">Done</button>
          </div>
        )}
      </div>

      {/* Guest details */}
      <div className="border-t border-sage/20 pt-6 space-y-4">
        <p className="font-sans text-xs uppercase tracking-wider text-timber/50 font-semibold">Guest Details</p>

        <div>
          <label htmlFor="guestName" className="block font-sans text-xs uppercase tracking-wider text-timber/50 mb-1.5 font-semibold">
            Full Name *
          </label>
          <input id="guestName" type="text" value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            className="input-base" placeholder="Guest name" autoComplete="name" />
        </div>

        <div>
          <label htmlFor="guestEmail" className="block font-sans text-xs uppercase tracking-wider text-timber/50 mb-1.5 font-semibold">
            Email *
          </label>
          <input id="guestEmail" type="email" value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
            className="input-base" placeholder="your@email.com" autoComplete="email" />
        </div>

        <div>
          <label htmlFor="guestPhone" className="block font-sans text-xs uppercase tracking-wider text-timber/50 mb-1.5 font-semibold">
            Phone / WhatsApp
          </label>
          <input id="guestPhone" type="tel" value={guestPhone}
            onChange={(e) => setGuestPhone(e.target.value)}
            className="input-base" placeholder="+1 234 567 8900" autoComplete="tel" />
        </div>

        <div>
          <label htmlFor="specialRequests" className="block font-sans text-xs uppercase tracking-wider text-timber/50 mb-1.5 font-semibold">
            <span className="flex items-center gap-1.5"><MessageSquare size={12} /> Special Requests</span>
          </label>
          <textarea id="specialRequests" value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            rows={3} className="input-base resize-none"
            placeholder="Early check-in, dietary needs, celebration setups…" />
        </div>
      </div>

      {/* Price summary */}
      {nights > 0 && room && (
        <div className="bg-stone rounded-sm p-5 border border-sage/20">
          <div className="space-y-2 text-sm font-sans">
            <div className="flex justify-between text-timber/70">
              <span>{formatPrice(room.pricePerNight)} × {nights} night{nights !== 1 ? 's' : ''}</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="divider" />
            <div className="flex justify-between font-semibold text-timber text-base">
              <span>Total</span>
              <span className="text-forest">{formatPrice(totalPrice)}</span>
            </div>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || availability === false || checkingAvail}
        className="btn-primary w-full justify-center gap-2 disabled:opacity-60"
      >
        {loading ? <><Spinner size="sm" color="white" /> Processing…</> : 'Continue to Payment'}
      </button>
    </form>
  )
}

function tomorrow(date) {
  const d = new Date(date)
  d.setDate(d.getDate() + 1)
  return d
}
