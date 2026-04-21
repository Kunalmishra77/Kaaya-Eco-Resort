// d:/kaaya eco resort/client/src/components/booking/HeroBookingBar.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import DatePicker from 'react-datepicker'
import { CalendarDays, Users, ChevronDown, Search } from 'lucide-react'
import { setSearchParams } from '../../store/slices/bookingSlice.js'
import 'react-datepicker/dist/react-datepicker.css'

export default function HeroBookingBar() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const booking   = useSelector((s) => s.booking)

  const [checkIn,   setCheckIn]   = useState(booking.checkIn   ? new Date(booking.checkIn)  : null)
  const [checkOut,  setCheckOut]  = useState(booking.checkOut  ? new Date(booking.checkOut) : null)
  const [adults,    setAdults]    = useState(booking.adults    ?? 2)
  const [children,  setChildren]  = useState(booking.children  ?? 0)
  const [guestOpen, setGuestOpen] = useState(false)

  const today    = new Date()
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1)

  const handleSearch = (e) => {
    e.preventDefault()
    if (!checkIn || !checkOut) return

    dispatch(setSearchParams({
      checkIn:  checkIn.toISOString(),
      checkOut: checkOut.toISOString(),
      adults,
      children,
    }))
    navigate('/accommodation')
  }

  return (
    <form
      onSubmit={handleSearch}
      className="bg-white/95 backdrop-blur-sm rounded-sm shadow-2xl p-4 sm:p-6"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Check-in */}
        <div className="relative">
          <label className="block font-sans text-[10px] uppercase tracking-wider text-timber/50 mb-1.5 font-semibold">
            Check-in
          </label>
          <div className="relative">
            <CalendarDays size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-sage pointer-events-none z-10" />
            <DatePicker
              selected={checkIn}
              onChange={(date) => {
                setCheckIn(date)
                if (checkOut && date >= checkOut) setCheckOut(null)
              }}
              selectsStart
              startDate={checkIn}
              endDate={checkOut}
              minDate={today}
              placeholderText="Select date"
              dateFormat="dd MMM yyyy"
              className="input-base pl-9 cursor-pointer"
              popperPlacement="bottom-start"
            />
          </div>
        </div>

        {/* Check-out */}
        <div className="relative">
          <label className="block font-sans text-[10px] uppercase tracking-wider text-timber/50 mb-1.5 font-semibold">
            Check-out
          </label>
          <div className="relative">
            <CalendarDays size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-sage pointer-events-none z-10" />
            <DatePicker
              selected={checkOut}
              onChange={setCheckOut}
              selectsEnd
              startDate={checkIn}
              endDate={checkOut}
              minDate={checkIn ? new Date(checkIn.getTime() + 86400000) : tomorrow}
              placeholderText="Select date"
              dateFormat="dd MMM yyyy"
              className="input-base pl-9 cursor-pointer"
              popperPlacement="bottom-start"
            />
          </div>
        </div>

        {/* Guests */}
        <div className="relative">
          <label className="block font-sans text-[10px] uppercase tracking-wider text-timber/50 mb-1.5 font-semibold">
            Guests
          </label>
          <button
            type="button"
            onClick={() => setGuestOpen(!guestOpen)}
            className="input-base flex items-center justify-between cursor-pointer"
          >
            <span className="flex items-center gap-2 text-timber">
              <Users size={15} className="text-sage" />
              {adults} adult{adults !== 1 ? 's' : ''}{children > 0 ? `, ${children} child${children !== 1 ? 'ren' : ''}` : ''}
            </span>
            <ChevronDown size={14} className={`text-sage transition-transform ${guestOpen ? 'rotate-180' : ''}`} />
          </button>

          {guestOpen && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-sage/30 rounded-sm shadow-lg z-30 p-4 space-y-4">
              {/* Adults */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-sans text-sm font-medium text-timber">Adults</p>
                  <p className="font-sans text-xs text-timber/40">Age 13+</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                    className="w-7 h-7 rounded-full border border-sage/40 flex items-center justify-center text-timber hover:border-sand hover:text-sand transition-colors"
                    aria-label="Decrease adults"
                  >–</button>
                  <span className="font-sans font-semibold text-timber w-4 text-center">{adults}</span>
                  <button
                    type="button"
                    onClick={() => setAdults(Math.min(12, adults + 1))}
                    className="w-7 h-7 rounded-full border border-sage/40 flex items-center justify-center text-timber hover:border-sand hover:text-sand transition-colors"
                    aria-label="Increase adults"
                  >+</button>
                </div>
              </div>

              {/* Children */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-sans text-sm font-medium text-timber">Children</p>
                  <p className="font-sans text-xs text-timber/40">Age 2–12</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setChildren(Math.max(0, children - 1))}
                    className="w-7 h-7 rounded-full border border-sage/40 flex items-center justify-center text-timber hover:border-sand hover:text-sand transition-colors"
                    aria-label="Decrease children"
                  >–</button>
                  <span className="font-sans font-semibold text-timber w-4 text-center">{children}</span>
                  <button
                    type="button"
                    onClick={() => setChildren(Math.min(6, children + 1))}
                    className="w-7 h-7 rounded-full border border-sage/40 flex items-center justify-center text-timber hover:border-sand hover:text-sand transition-colors"
                    aria-label="Increase children"
                  >+</button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setGuestOpen(false)}
                className="w-full btn-primary py-2 text-xs"
              >
                Done
              </button>
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex flex-col justify-end">
          <label className="hidden lg:block font-sans text-[10px] uppercase tracking-wider text-transparent mb-1.5">
            &nbsp;
          </label>
          <button
            type="submit"
            disabled={!checkIn || !checkOut}
            className="btn-primary w-full justify-center gap-2 disabled:opacity-50"
          >
            <Search size={16} /> Check Availability
          </button>
        </div>
      </div>
    </form>
  )
}
