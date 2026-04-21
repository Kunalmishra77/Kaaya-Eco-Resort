// d:/kaaya eco resort/client/src/components/admin/StatsCards.jsx
import { motion } from 'framer-motion'
import { CalendarDays, CheckCircle, Clock, DollarSign, BedDouble, Star, MessageSquare } from 'lucide-react'
import { formatPrice } from '../../utils/helpers.js'

const STAT_CONFIGS = [
  { key: 'totalBookings',    label: 'Total Bookings',     icon: CalendarDays,   color: 'bg-forest/10 text-forest'    },
  { key: 'confirmedBookings',label: 'Confirmed',          icon: CheckCircle,    color: 'bg-green-50 text-green-700'  },
  { key: 'pendingBookings',  label: 'Pending Payment',    icon: Clock,          color: 'bg-yellow-50 text-yellow-700'},
  { key: 'totalRevenue',     label: 'Confirmed Revenue',  icon: DollarSign,     color: 'bg-sand/20 text-timber',  isPrice: true },
  { key: 'totalRooms',       label: 'Active Rooms',       icon: BedDouble,      color: 'bg-lake/20 text-forest'      },
  { key: 'unapprovedReviews',label: 'Pending Reviews',    icon: Star,           color: 'bg-orange-50 text-orange-700'},
  { key: 'unreadInquiries',  label: 'Unread Inquiries',   icon: MessageSquare,  color: 'bg-terra/10 text-terra'      },
]

export default function StatsCards({ stats, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {STAT_CONFIGS.map((s) => (
          <div key={s.key} className="bg-white border border-sage/20 rounded-sm p-5 animate-pulse">
            <div className="h-4 bg-sage/20 rounded w-3/4 mb-3" />
            <div className="h-8 bg-sage/20 rounded w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
      {STAT_CONFIGS.map((config, i) => (
        <motion.div
          key={config.key}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
          className="bg-white border border-sage/20 rounded-sm p-5"
        >
          <div className={`w-9 h-9 rounded-full flex items-center justify-center mb-3 ${config.color.split(' ').slice(0, 2).join(' ')}`}>
            <config.icon size={17} className={config.color.split(' ').slice(2).join(' ')} />
          </div>
          <p className="font-sans text-[11px] text-timber/50 uppercase tracking-wider mb-1">{config.label}</p>
          <p className="font-display text-timber text-2xl font-semibold">
            {config.isPrice
              ? formatPrice(stats?.[config.key] || 0)
              : (stats?.[config.key] ?? '–')}
          </p>
        </motion.div>
      ))}
    </div>
  )
}
