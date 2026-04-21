// d:/kaaya eco resort/client/src/components/admin/BookingsTable.jsx
import { useState, useEffect, useCallback } from 'react'
import { ChevronDown, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../utils/api.js'
import { formatPrice, formatDate, BOOKING_STATUS_CONFIG } from '../../utils/helpers.js'
import Spinner from '../common/Spinner.jsx'

const STATUSES = ['PENDING', 'CONFIRMED', 'CANCELLED', 'CHECKED_IN', 'CHECKED_OUT']

export default function BookingsTable() {
  const [bookings,    setBookings]    = useState([])
  const [loading,     setLoading]     = useState(true)
  const [filter,      setFilter]      = useState('')
  const [updating,    setUpdating]    = useState(null)
  const [page,        setPage]        = useState(1)
  const [totalPages,  setTotalPages]  = useState(1)

  const fetchBookings = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit: 20 })
      if (filter) params.set('status', filter)
      const { data } = await api.get(`/admin/bookings?${params}`)
      setBookings(data.bookings)
      setTotalPages(data.totalPages)
    } catch {
      toast.error('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }, [filter, page])

  useEffect(() => { fetchBookings() }, [fetchBookings])

  const updateStatus = async (bookingId, status) => {
    setUpdating(bookingId)
    try {
      await api.patch(`/admin/bookings/${bookingId}`, { status })
      setBookings((prev) => prev.map((b) => b.id === bookingId ? { ...b, status } : b))
      toast.success(`Booking updated to ${status}`)
    } catch {
      toast.error('Failed to update booking')
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div>
      {/* Filter + refresh */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFilter('')}
            className={`font-sans text-xs px-4 py-2 rounded-sm border transition-colors ${!filter ? 'bg-forest border-forest text-stone' : 'border-sage/40 text-timber hover:border-forest'}`}
          >
            All
          </button>
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => { setFilter(s); setPage(1) }}
              className={`font-sans text-xs px-4 py-2 rounded-sm border transition-colors ${filter === s ? 'bg-forest border-forest text-stone' : 'border-sage/40 text-timber hover:border-forest'}`}
            >
              {BOOKING_STATUS_CONFIG[s]?.label || s}
            </button>
          ))}
        </div>
        <button onClick={fetchBookings} className="p-2 text-timber/50 hover:text-timber transition-colors" aria-label="Refresh">
          <RefreshCw size={16} />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-12">
          <p className="font-sans text-timber/40">No bookings found.</p>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto rounded-sm border border-sage/20">
            <table className="w-full text-sm font-sans">
              <thead className="bg-stone border-b border-sage/20">
                <tr>
                  {['Ref', 'Guest', 'Room', 'Check-in', 'Check-out', 'Guests', 'Total', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-timber/60 text-xs uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-sage/10">
                {bookings.map((b) => {
                  const status = BOOKING_STATUS_CONFIG[b.status] || { label: b.status, color: 'bg-gray-100 text-gray-600' }
                  return (
                    <tr key={b.id} className="hover:bg-stone/50 transition-colors">
                      <td className="px-4 py-3 text-timber/50 font-mono text-xs">{b.id.slice(-8).toUpperCase()}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-timber">{b.guestName}</p>
                        <p className="text-timber/40 text-xs">{b.guestEmail}</p>
                      </td>
                      <td className="px-4 py-3 text-timber whitespace-nowrap">{b.room?.name}</td>
                      <td className="px-4 py-3 text-timber/70 whitespace-nowrap">{formatDate(b.checkIn)}</td>
                      <td className="px-4 py-3 text-timber/70 whitespace-nowrap">{formatDate(b.checkOut)}</td>
                      <td className="px-4 py-3 text-timber/70">{b.adults}+{b.children}</td>
                      <td className="px-4 py-3 text-forest font-semibold whitespace-nowrap">{formatPrice(b.totalPrice)}</td>
                      <td className="px-4 py-3">
                        <span className={`badge ${status.color} text-[10px]`}>{status.label}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="relative group">
                          <button
                            disabled={!!updating}
                            className="flex items-center gap-1 border border-sage/40 rounded-sm px-3 py-1.5 text-xs text-timber hover:border-sand transition-colors"
                          >
                            {updating === b.id ? <Spinner size="sm" /> : <>Update <ChevronDown size={11} /></>}
                          </button>
                          <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-sage/20 rounded-sm shadow-lg z-10 hidden group-hover:block group-focus-within:block">
                            {STATUSES.filter((s) => s !== b.status).map((s) => (
                              <button
                                key={s}
                                onClick={() => updateStatus(b.id, s)}
                                className="w-full text-left px-4 py-2 text-xs text-timber hover:bg-stone transition-colors"
                              >
                                → {BOOKING_STATUS_CONFIG[s]?.label || s}
                              </button>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="px-4 py-2 text-xs font-sans border border-sage/40 rounded-sm disabled:opacity-40 hover:border-forest transition-colors">
                ← Prev
              </button>
              <span className="font-sans text-sm text-timber/60">Page {page} of {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-4 py-2 text-xs font-sans border border-sage/40 rounded-sm disabled:opacity-40 hover:border-forest transition-colors">
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
