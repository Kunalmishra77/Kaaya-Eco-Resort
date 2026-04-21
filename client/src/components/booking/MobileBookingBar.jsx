// d:/kaaya eco resort/client/src/components/booking/MobileBookingBar.jsx
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CalendarDays } from 'lucide-react'
import { formatDateShort } from '../../utils/helpers.js'

/**
 * Sticky bottom bar on mobile — always shows a "Book Now" CTA.
 * Shows selected dates when they exist in the booking store.
 */
export default function MobileBookingBar() {
  const { checkIn, checkOut } = useSelector((s) => s.booking)

  const hasDates = checkIn && checkOut

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-forest/95 backdrop-blur-sm border-t border-stone/10 px-4 py-3 flex items-center justify-between gap-4 shadow-2xl">
      {hasDates ? (
        <div className="flex items-center gap-2 text-stone/80 min-w-0">
          <CalendarDays size={15} className="text-sand flex-shrink-0" />
          <p className="font-sans text-sm truncate">
            <span className="font-medium">{formatDateShort(checkIn)}</span>
            <span className="text-stone/40 mx-1">→</span>
            <span className="font-medium">{formatDateShort(checkOut)}</span>
          </p>
        </div>
      ) : (
        <p className="font-sans text-sm text-stone/70">
          Yala's Wild Heart awaits
        </p>
      )}

      <Link
        to="/book"
        className="btn-primary py-2.5 px-6 text-xs flex-shrink-0 whitespace-nowrap"
      >
        Book Now
      </Link>
    </div>
  )
}
