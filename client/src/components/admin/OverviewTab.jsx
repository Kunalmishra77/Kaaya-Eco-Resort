// d:/kaaya eco resort/client/src/components/admin/OverviewTab.jsx
import { useState, useEffect } from 'react'
import { TrendingUp, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../../utils/api.js'
import { formatPrice, formatDate, BOOKING_STATUS_CONFIG } from '../../utils/helpers.js'
import Spinner from '../common/Spinner.jsx'

export default function OverviewTab({ stats }) {
  const [analytics, setAnalytics] = useState(null)
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    api.get('/admin/analytics')
      .then(({ data }) => setAnalytics(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>

  const { monthlyData = [], topRooms = [], recentBookings = [] } = analytics || {}

  const maxRevenue  = Math.max(...monthlyData.map((m) => m.revenue),  1)
  const maxBookings = Math.max(...monthlyData.map((m) => m.bookings), 1)

  return (
    <div className="space-y-8">

      {/* ── Revenue bar chart ──────────────────────────────────────── */}
      <div className="bg-white border border-sage/20 rounded-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="font-sans text-xs uppercase tracking-wider text-timber/40 mb-1">Confirmed Revenue</p>
            <p className="font-display text-timber text-xl font-semibold">Last 6 Months</p>
          </div>
          <TrendingUp size={20} className="text-sage" />
        </div>

        <div className="flex items-end gap-3 h-44">
          {monthlyData.map((m, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
              <div className="relative w-full flex items-end" style={{ height: '128px' }}>
                {/* Revenue bar */}
                <div
                  className="w-full bg-forest/20 group-hover:bg-forest/30 rounded-t-sm transition-all duration-300 relative"
                  style={{ height: `${Math.max(4, (m.revenue / maxRevenue) * 100)}%` }}
                  title={formatPrice(m.revenue)}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-forest text-stone text-[10px] font-sans px-1.5 py-0.5 rounded whitespace-nowrap pointer-events-none z-10">
                    {formatPrice(m.revenue)}
                  </div>
                </div>
              </div>
              <p className="font-sans text-[10px] text-timber/40 whitespace-nowrap">{m.label}</p>
              <p className="font-sans text-[10px] font-semibold text-forest">{m.bookings} bkg</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        {/* ── Top rooms ─────────────────────────────────────────────── */}
        <div className="bg-white border border-sage/20 rounded-sm p-6">
          <p className="font-sans text-xs uppercase tracking-wider text-timber/40 mb-4">Top Rooms by Revenue</p>
          <div className="space-y-3">
            {topRooms.length === 0 ? (
              <p className="font-sans text-sm text-timber/40 text-center py-6">No confirmed bookings yet.</p>
            ) : topRooms.map((room, i) => {
              const pct = maxRevenue > 0 ? (room.revenue / topRooms[0].revenue) * 100 : 0
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-sans text-sm font-medium text-timber truncate max-w-[60%]">{room.name}</p>
                    <p className="font-sans text-sm text-forest font-semibold">{formatPrice(room.revenue)}</p>
                  </div>
                  <div className="h-1.5 bg-stone rounded-full overflow-hidden">
                    <div className="h-full bg-forest/60 rounded-full transition-all duration-500"
                         style={{ width: `${pct}%` }} />
                  </div>
                  <p className="font-sans text-[10px] text-timber/40 mt-0.5">{room.bookings} confirmed booking{room.bookings !== 1 ? 's' : ''}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Recent bookings ───────────────────────────────────────── */}
        <div className="bg-white border border-sage/20 rounded-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="font-sans text-xs uppercase tracking-wider text-timber/40">Recent Bookings</p>
          </div>
          <div className="space-y-3">
            {recentBookings.length === 0 ? (
              <p className="font-sans text-sm text-timber/40 text-center py-6">No bookings yet.</p>
            ) : recentBookings.map((b) => {
              const st = BOOKING_STATUS_CONFIG[b.status] || { label: b.status, color: 'bg-gray-100 text-gray-600' }
              return (
                <div key={b.id} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-sm font-medium text-timber truncate">{b.guestName}</p>
                    <p className="font-sans text-xs text-timber/40 truncate">{b.room?.name}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-sans text-sm font-semibold text-forest">{formatPrice(b.totalPrice)}</p>
                    <span className={`badge text-[9px] ${st.color}`}>{st.label}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>

      {/* ── Quick stats summary ───────────────────────────────────── */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Bookings', value: stats.totalBookings,     color: 'text-forest' },
            { label: 'Confirmed',      value: stats.confirmedBookings, color: 'text-green-600' },
            { label: 'Pending',        value: stats.pendingBookings,   color: 'text-yellow-600' },
            { label: 'Active Rooms',   value: stats.totalRooms,        color: 'text-forest' },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-sage/20 rounded-sm p-5 text-center">
              <p className={`font-display text-3xl font-semibold ${s.color}`}>{s.value ?? '–'}</p>
              <p className="font-sans text-xs text-timber/40 uppercase tracking-wider mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
