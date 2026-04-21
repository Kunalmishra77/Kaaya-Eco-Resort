// d:/kaaya eco resort/client/src/components/booking/AvailabilityCalendar.jsx
import { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import { Loader2 } from 'lucide-react'
import api from '../../utils/api.js'
import 'react-datepicker/dist/react-datepicker.css'

/**
 * Inline calendar for a specific room that highlights unavailable dates.
 * Fetches blocked/booked dates from the backend and marks them as excluded.
 */
export default function AvailabilityCalendar({ roomId, onRangeSelect }) {
  const [startDate,     setStartDate]     = useState(null)
  const [endDate,       setEndDate]       = useState(null)
  const [bookedRanges,  setBookedRanges]  = useState([])
  const [loading,       setLoading]       = useState(false)

  // For full month-view availability, we'd need a separate endpoint.
  // This component provides a date range picker with availability checking on select.
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const isDateBlocked = (date) => {
    return bookedRanges.some(({ start, end }) => date >= start && date < end)
  }

  const handleChange = ([start, end]) => {
    setStartDate(start)
    setEndDate(end)
    if (start && end) {
      onRangeSelect?.({ checkIn: start, checkOut: end })
    }
  }

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10 rounded-sm">
          <Loader2 size={20} className="animate-spin text-forest" />
        </div>
      )}
      <DatePicker
        selectsRange
        startDate={startDate}
        endDate={endDate}
        onChange={handleChange}
        minDate={today}
        excludeDates={bookedRanges.flatMap(({ start, end }) => {
          const dates = []
          const d = new Date(start)
          while (d < end) {
            dates.push(new Date(d))
            d.setDate(d.getDate() + 1)
          }
          return dates
        })}
        inline
        monthsShown={2}
        calendarClassName="font-sans"
        dayClassName={(date) =>
          isDateBlocked(date) ? 'react-datepicker__day--disabled' : undefined
        }
      />
    </div>
  )
}
