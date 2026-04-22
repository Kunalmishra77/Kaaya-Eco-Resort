// d:/kaaya eco resort/client/src/components/admin/OverviewTab.jsx
import { useState, useEffect } from 'react'
import { TrendingUp } from 'lucide-react'
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
  const maxRevenue = Math.max(...monthlyData.map((m) => m.revenue), 1)

  return (
    <div className="space-y-5">

      {/* Revenue chart */}
      <div className="bg-white border border-sage/20 rounded-lg p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="font-sans text-[10px] uppercase tracking-wider text-timber/40 mb-0.5">Confirmed Revenue</p>
            <p className="font-display text-timber text-lg font-semibold">Last 6 Months</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-forest/10 flex items-center justify-center">
            <TrendingUp size={16} className="text-forest" />
          </div>
        </div>

        {monthlyData.length === 0 ? (
          <p className="text-center font-sans text-timber/40 text-sm py-8">No revenue data yet.</p>
        ) : (
          <div className="flex items-end gap-2 sm:gap-3" style={{ height: '140px' }}>
            {monthlyData.map((m, i) => {
              const pct = Math.max(4, (m.revenue / maxRevenue) * 100)
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group h-full justify-end">
                  <div className="relative w-full" style={{ height: `${pct}%` }}>
                    <div className="w-full h-full bg-forest/20 group-hover:bg-forest/40 rounded-t-md transition-colors duration-200" />
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-forest text-white text-[9px] font-sans px-2 py-1 rounded-md whitespace-nowrap pointer-events-none z-10 shadow-lg">
                      {formatPrice(m.revenue)}
                    </div>
                  </div>
                  <p className="font-sans text-[10px] text-timber/40 whitespace-nowrap">{m.label}</p>
                  <p className="font-sans text-[10px] font-semibold text-forest">{m.bookings}</p>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-5">

        {/* Top rooms */}
        <div className="bg-white border border-sage/20 rounded-lg p-5">
          <p className="font-sans text-[10px] uppercase tracking-wider text-timber/40 mb-4 font-semibold">Top Rooms by Revenue</p>
          {topRooms.length === 0 ? (
            <p className="font-sans text-sm text-timber/40 text-center py-8">No confirmed bookings yet.</p>
          ) : (
            <div className="space-y-4">
              {topRooms.map((room, i) => {
                const pct = topRooms[0].revenue > 0 ? (room.revenue / topRooms[0].revenue) * 100 : 0
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="font-sans text-sm font-medium text-timber truncate max-w-[55%]">{room.name}</p>
                      <p className="font-sans text-sm text-forest font-semibold">{formatPrice(room.revenue)}</p>
                    </div>
                    <div className="h-1.5 bg-stone rounded-full overflow-hidden">
                      <div className="h-full bg-forest/50 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="font-sans text-[10px] text-timber/35 mt-1">{room.bookings} booking{room.bookings !== 1 ? 's' : ''}</p>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Recent bookings */}
        <div className="bg-white border border-sage/20 rounded-lg p-5">
          <p className="font-sans text-[10px] uppercase tracking-wider text-timber/40 mb-4 font-semibold">Recent Bookings</p>
          {recentBookings.length === 0 ? (
            <p className="font-sans text-sm text-timber/40 text-center py-8">No bookings yet.</p>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((b) => {
                const st = BOOKING_STATUS_CONFIG[b.status] || { label: b.status, color: 'bg-gray-100 text-gray-600' }
                return (
                  <div key={b.id} className="flex items-center gap-3 py-2 border-b border-sage/10 last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-sm font-medium text-timber truncate leading-tight">{b.guestName}</p>
                      <p className="font-sans text-xs text-timber/40 truncate">{b.room?.name}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-sans text-sm font-semibold text-forest">{formatPrice(b.totalPrice)}</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-medium ${st.color}`}>{st.label}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>

      {/* Quick stats grid */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Bookings', value: stats.totalBookings,     color: 'text-forest'       },
            { label: 'Confirmed',      value: stats.confirmedBookings, color: 'text-emerald-600'  },
            { label: 'Pending',        value: stats.pendingBookings,   color: 'text-amber-600'    },
            { label: 'Active Rooms',   value: stats.totalRooms,        color: 'text-forest'       },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-sage/20 rounded-lg p-5 text-center">
              <p className={`font-display text-3xl font-semibold ${s.color}`}>{s.value ?? '–'}</p>
              <p className="font-sans text-[10px] text-timber/40 uppercase tracking-wider mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
