// d:/kaaya eco resort/client/src/components/admin/BookingsTable.jsx
import { useState, useEffect, useCallback, useRef } from 'react'
import { ChevronDown, ChevronUp, RefreshCw, Mail, Phone, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../utils/api.js'
import { formatPrice, formatDate, BOOKING_STATUS_CONFIG } from '../../utils/helpers.js'
import Spinner from '../common/Spinner.jsx'

const STATUSES = ['PENDING', 'CONFIRMED', 'CANCELLED', 'CHECKED_IN', 'CHECKED_OUT']

function StatusDropdown({ booking, onUpdate, updating }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const options = STATUSES.filter((s) => s !== booking.status)

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o) }}
        disabled={!!updating}
        className="flex items-center gap-1.5 border border-sage/40 rounded-md px-3 py-1.5 text-xs font-sans text-timber hover:border-sand hover:text-sand transition-colors bg-white whitespace-nowrap"
      >
        {updating === booking.id
          ? <><Spinner size="sm" /> Updating</>
          : <>Update <ChevronDown size={11} /></>
        }
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-sage/20 rounded-lg shadow-xl z-30">
          <div className="py-1">
            {options.map((s) => {
              const cfg = BOOKING_STATUS_CONFIG[s] || { label: s }
              return (
                <button
                  key={s}
                  onClick={(e) => { e.stopPropagation(); onUpdate(booking.id, s); setOpen(false) }}
                  className="w-full text-left px-4 py-2 text-xs font-sans text-timber hover:bg-stone transition-colors flex items-center gap-2"
                >
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.color?.split(' ')[0] || 'bg-sage'}`} />
                  {cfg.label}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default function BookingsTable() {
  const [bookings,   setBookings]   = useState([])
  const [loading,    setLoading]    = useState(true)
  const [filter,     setFilter]     = useState('')
  const [updating,   setUpdating]   = useState(null)
  const [page,       setPage]       = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [expanded,   setExpanded]   = useState(null)

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
      toast.success(`Status → ${BOOKING_STATUS_CONFIG[status]?.label || status}`)
    } catch {
      toast.error('Failed to update booking')
    } finally {
      setUpdating(null)
    }
  }

  const nights = (b) => {
    if (!b.checkIn || !b.checkOut) return '–'
    return Math.round((new Date(b.checkOut) - new Date(b.checkIn)) / (1000 * 60 * 60 * 24))
  }

  const FILTER_BTNS = [
    { label: 'All',          value: ''             },
    { label: 'Pending',      value: 'PENDING'      },
    { label: 'Confirmed',    value: 'CONFIRMED'    },
    { label: 'Cancelled',    value: 'CANCELLED'    },
    { label: 'Checked In',   value: 'CHECKED_IN'   },
    { label: 'Checked Out',  value: 'CHECKED_OUT'  },
  ]

  return (
    <div>
      {/* Filters */}
      <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {FILTER_BTNS.map((btn) => (
            <button
              key={btn.value}
              onClick={() => { setFilter(btn.value); setPage(1) }}
              className={[
                'font-sans text-xs px-3 py-1.5 rounded-md border transition-colors',
                filter === btn.value
                  ? 'bg-forest border-forest text-white'
                  : 'border-sage/40 text-timber/70 hover:border-forest hover:text-forest bg-white',
              ].join(' ')}
            >
              {btn.label}
            </button>
          ))}
        </div>
        <button onClick={fetchBookings} className="p-2 text-timber/40 hover:text-timber transition-colors rounded-md hover:bg-white" title="Refresh">
          <RefreshCw size={15} />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-sage/20">
          <p className="font-sans text-timber/40">No bookings found.</p>
        </div>
      ) : (
        <>
          <div className="rounded-lg border border-sage/20 overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-sans">
                <thead className="bg-stone/60 border-b border-sage/20">
                  <tr>
                    {['', 'Ref', 'Guest', 'Room', 'Check-in', 'Check-out', 'Nights', 'Total', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left font-semibold text-timber/50 text-[11px] uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-sage/10">
                  {bookings.map((b) => {
                    const status = BOOKING_STATUS_CONFIG[b.status] || { label: b.status, color: 'bg-gray-100 text-gray-600' }
                    const isOpen = expanded === b.id
                    const n      = nights(b)
                    return (
                      <>
                        <tr
                          key={b.id}
                          className={`transition-colors cursor-pointer ${isOpen ? 'bg-forest/5' : 'hover:bg-stone/40'}`}
                          onClick={() => setExpanded(isOpen ? null : b.id)}
                        >
                          <td className="px-4 py-3 w-8">
                            {isOpen
                              ? <ChevronUp   size={13} className="text-sage" />
                              : <ChevronDown size={13} className="text-sage" />
                            }
                          </td>
                          <td className="px-4 py-3 text-timber/40 font-mono text-[11px] whitespace-nowrap">
                            {b.id.slice(-8).toUpperCase()}
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-medium text-timber leading-tight">{b.guestName}</p>
                            <p className="text-timber/40 text-[11px] truncate max-w-[140px]">{b.guestEmail}</p>
                          </td>
                          <td className="px-4 py-3 text-timber/80 whitespace-nowrap text-xs">{b.room?.name}</td>
                          <td className="px-4 py-3 text-timber/60 whitespace-nowrap text-xs">{formatDate(b.checkIn)}</td>
                          <td className="px-4 py-3 text-timber/60 whitespace-nowrap text-xs">{formatDate(b.checkOut)}</td>
                          <td className="px-4 py-3 text-timber/50 text-center">{n}</td>
                          <td className="px-4 py-3 text-forest font-semibold whitespace-nowrap text-xs">{formatPrice(b.totalPrice)}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${status.color}`}>
                              {status.label}
                            </span>
                          </td>
                          <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                            <StatusDropdown
                              booking={b}
                              onUpdate={updateStatus}
                              updating={updating}
                            />
                          </td>
                        </tr>

                        {/* Expanded detail */}
                        {isOpen && (
                          <tr key={`${b.id}-detail`}>
                            <td colSpan={10} className="bg-forest/5 border-b border-forest/10">
                              <div className="px-6 py-5">
                                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 text-sm font-sans">
                                  <div>
                                    <p className="text-[10px] uppercase tracking-wider text-timber/40 mb-2 font-semibold">Guest</p>
                                    <p className="font-medium text-timber mb-1.5">{b.guestName}</p>
                                    <a href={`mailto:${b.guestEmail}`} className="flex items-center gap-1.5 text-timber/50 hover:text-sand transition-colors text-xs mb-1">
                                      <Mail size={11} /> {b.guestEmail}
                                    </a>
                                    {b.guestPhone && (
                                      <a href={`tel:${b.guestPhone}`} className="flex items-center gap-1.5 text-timber/50 hover:text-sand transition-colors text-xs">
                                        <Phone size={11} /> {b.guestPhone}
                                      </a>
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-[10px] uppercase tracking-wider text-timber/40 mb-2 font-semibold">Stay</p>
                                    <p className="text-timber/70 text-xs mb-1">{b.room?.name}</p>
                                    <p className="text-timber/70 text-xs mb-1">{formatDate(b.checkIn)} → {formatDate(b.checkOut)}</p>
                                    <p className="text-timber/60 text-xs">{n} night{n !== 1 ? 's' : ''} · {b.adults} adult{b.adults !== 1 ? 's' : ''}{b.children > 0 ? ` · ${b.children} child${b.children !== 1 ? 'ren' : ''}` : ''}</p>
                                  </div>
                                  <div>
                                    <p className="text-[10px] uppercase tracking-wider text-timber/40 mb-2 font-semibold">Payment</p>
                                    <p className="font-display text-forest text-xl font-semibold">{formatPrice(b.totalPrice)}</p>
                                    <p className="text-timber/40 text-[11px] mt-1">Booked {formatDate(b.createdAt)}</p>
                                    {b.stripePaymentId && (
                                      <p className="text-timber/30 text-[10px] mt-1 font-mono truncate">{b.stripePaymentId}</p>
                                    )}
                                  </div>
                                  {b.specialRequests && (
                                    <div>
                                      <p className="text-[10px] uppercase tracking-wider text-timber/40 mb-2 font-semibold flex items-center gap-1">
                                        <MessageSquare size={10} /> Requests
                                      </p>
                                      <p className="text-timber/70 text-xs leading-relaxed bg-white rounded-md p-3 border border-sage/20">
                                        {b.specialRequests}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-5">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="px-4 py-2 text-xs font-sans border border-sage/40 rounded-md bg-white disabled:opacity-40 hover:border-forest transition-colors">
                ← Prev
              </button>
              <span className="font-sans text-sm text-timber/50">Page {page} of {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-4 py-2 text-xs font-sans border border-sage/40 rounded-md bg-white disabled:opacity-40 hover:border-forest transition-colors">
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
