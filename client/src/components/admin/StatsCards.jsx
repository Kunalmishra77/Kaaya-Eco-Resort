// d:/kaaya eco resort/client/src/components/admin/StatsCards.jsx
import { motion } from 'framer-motion'
import { CalendarDays, CheckCircle, Clock, DollarSign, BedDouble, Star, MessageSquare } from 'lucide-react'
import { formatPrice } from '../../utils/helpers.js'

const STAT_CONFIGS = [
  { key: 'totalBookings',     label: 'Total Bookings',    icon: CalendarDays,  bg: 'bg-forest/10',    icon_color: 'text-forest'     },
  { key: 'confirmedBookings', label: 'Confirmed',         icon: CheckCircle,   bg: 'bg-emerald-50',   icon_color: 'text-emerald-600' },
  { key: 'pendingBookings',   label: 'Pending Payment',   icon: Clock,         bg: 'bg-amber-50',     icon_color: 'text-amber-600'   },
  { key: 'totalRevenue',      label: 'Revenue',           icon: DollarSign,    bg: 'bg-sand/20',      icon_color: 'text-timber',  isPrice: true },
  { key: 'totalRooms',        label: 'Active Rooms',      icon: BedDouble,     bg: 'bg-lake/20',      icon_color: 'text-forest'     },
  { key: 'unapprovedReviews', label: 'Pending Reviews',   icon: Star,          bg: 'bg-orange-50',    icon_color: 'text-orange-600'  },
  { key: 'unreadInquiries',   label: 'Unread Inquiries',  icon: MessageSquare, bg: 'bg-terra/10',     icon_color: 'text-terra'       },
]

export default function StatsCards({ stats, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {STAT_CONFIGS.map((s) => (
          <div key={s.key} className="bg-white border border-sage/20 rounded-lg p-4 animate-pulse">
            <div className="w-8 h-8 bg-sage/15 rounded-full mb-3" />
            <div className="h-3 bg-sage/15 rounded w-3/4 mb-2" />
            <div className="h-6 bg-sage/15 rounded w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
      {STAT_CONFIGS.map((config, i) => {
        const raw   = stats?.[config.key]
        const value = config.isPrice ? formatPrice(raw || 0) : (raw ?? '–')

        return (
          <motion.div
            key={config.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
            className="bg-white border border-sage/20 rounded-lg p-4"
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-3 ${config.bg}`}>
              <config.icon size={15} className={config.icon_color} />
            </div>
            <p className="font-sans text-[10px] text-timber/45 uppercase tracking-wider mb-1 leading-tight">
              {config.label}
            </p>
            <p className={[
              'font-display font-semibold text-timber leading-tight',
              config.isPrice ? 'text-base sm:text-lg' : 'text-2xl',
            ].join(' ')}>
              {value}
            </p>
          </motion.div>
        )
      })}
    </div>
  )
}
