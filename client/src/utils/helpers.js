// d:/kaaya eco resort/client/src/utils/helpers.js

/**
 * Format a price in LKR with thousands separator
 * e.g. 28500 → "LKR 28,500"
 */
export function formatPrice(amount) {
  return `LKR ${Number(amount).toLocaleString('en-LK')}`
}

/**
 * Number of nights between two dates
 * Accepts Date objects or ISO strings
 */
export function nightsBetween(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0
  const msPerDay = 1000 * 60 * 60 * 24
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime()
  return Math.max(0, Math.round(diff / msPerDay))
}

/**
 * Format a date as "15 Aug 2025"
 */
export function formatDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Format a date as "Mon, 15 Aug"
 */
export function formatDateShort(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-GB', {
    weekday: 'short',
    day:     '2-digit',
    month:   'short',
  })
}

/**
 * Calculate total booking price
 */
export function calcTotalPrice(pricePerNight, checkIn, checkOut) {
  const nights = nightsBetween(checkIn, checkOut)
  return nights * pricePerNight
}

/**
 * Truncate text to a max character count
 */
export function truncate(text, max = 120) {
  if (!text || text.length <= max) return text
  return text.slice(0, max).trimEnd() + '…'
}

/**
 * Booking status display config
 */
export const BOOKING_STATUS_CONFIG = {
  PENDING:      { label: 'Pending',      color: 'bg-yellow-100 text-yellow-800' },
  CONFIRMED:    { label: 'Confirmed',    color: 'bg-green-100 text-green-800'  },
  CANCELLED:    { label: 'Cancelled',    color: 'bg-red-100 text-red-800'      },
  CHECKED_IN:   { label: 'Checked In',   color: 'bg-blue-100 text-blue-800'   },
  CHECKED_OUT:  { label: 'Checked Out',  color: 'bg-gray-100 text-gray-600'   },
}

/**
 * Room type display labels
 */
export const ROOM_TYPE_LABELS = {
  FAMILY_ROOM:      'Family Room',
  FAMILY_CHALET:    'Family Chalet',
  STANDARD_CHALET:  'Standard Chalet',
}

/**
 * Generate an array of dates between two dates (exclusive of end)
 */
export function dateRange(start, end) {
  const dates = []
  const current = new Date(start)
  const endDate = new Date(end)
  while (current < endDate) {
    dates.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }
  return dates
}
