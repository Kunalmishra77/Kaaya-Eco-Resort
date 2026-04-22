// d:/kaaya eco resort/client/src/pages/Admin.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, CalendarDays, BedDouble, Image,
  Star, MessageSquare, Users, RefreshCw,
} from 'lucide-react'
import api from '../utils/api.js'
import StatsCards       from '../components/admin/StatsCards.jsx'
import OverviewTab      from '../components/admin/OverviewTab.jsx'
import BookingsTable    from '../components/admin/BookingsTable.jsx'
import RoomManager      from '../components/admin/RoomManager.jsx'
import GalleryUploader  from '../components/admin/GalleryUploader.jsx'
import ReviewModeration from '../components/admin/ReviewModeration.jsx'
import InquiryInbox     from '../components/admin/InquiryInbox.jsx'
import UserManager      from '../components/admin/UserManager.jsx'

const TABS = [
  { key: 'overview',   label: 'Overview',   icon: LayoutDashboard },
  { key: 'bookings',   label: 'Bookings',   icon: CalendarDays    },
  { key: 'rooms',      label: 'Rooms',      icon: BedDouble       },
  { key: 'gallery',    label: 'Gallery',    icon: Image           },
  { key: 'reviews',    label: 'Reviews',    icon: Star            },
  { key: 'inquiries',  label: 'Inquiries',  icon: MessageSquare   },
  { key: 'users',      label: 'Users',      icon: Users           },
]

export default function Admin() {
  const { user }  = useSelector((s) => s.auth)
  const [tab,     setTab]     = useState('overview')
  const [stats,   setStats]   = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/admin/stats')
      setStats(data)
    } catch {
      // Non-fatal
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchStats() }, [])

  return (
    <div className="min-h-screen bg-stone">
      {/* Header */}
      <div className="bg-forest px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="container-lg">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between gap-4 flex-wrap"
          >
            <div>
              <p className="section-label text-sand/60 mb-2">Admin Dashboard</p>
              <h1 className="font-display text-stone text-2xl sm:text-3xl font-semibold">Kaaya Eco Resort</h1>
              <p className="font-sans text-stone/50 text-sm mt-1">
                Signed in as {user?.firstName} {user?.lastName}
                <span className="ml-2 badge bg-sand/20 text-sand text-[10px]">ADMIN</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchStats}
                className="p-2 text-stone/50 hover:text-stone transition-colors"
                aria-label="Refresh stats"
              >
                <RefreshCw size={16} />
              </button>
              <Link to="/" className="btn-outline-white py-2 px-4 text-xs">
                View Site
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="container-lg">
          <StatsCards stats={stats} loading={loading} />
        </div>
      </div>

      {/* Tab navigation */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="container-lg">
          <div className="border-b border-sage/20 flex overflow-x-auto gap-0.5 pb-0 scrollbar-hide">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={[
                  'flex items-center gap-2 px-4 sm:px-5 py-3.5 font-sans text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                  tab === t.key
                    ? 'border-sand text-sand'
                    : 'border-transparent text-timber/50 hover:text-timber',
                ].join(' ')}
              >
                <t.icon size={14} />
                {t.label}
                {t.key === 'reviews'   && stats?.unapprovedReviews > 0 && (
                  <span className="w-5 h-5 rounded-full bg-terra text-stone text-[10px] flex items-center justify-center font-bold">
                    {stats.unapprovedReviews}
                  </span>
                )}
                {t.key === 'inquiries' && stats?.unreadInquiries > 0 && (
                  <span className="w-5 h-5 rounded-full bg-terra text-stone text-[10px] flex items-center justify-center font-bold">
                    {stats.unreadInquiries}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="container-lg">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {tab === 'overview'   && <OverviewTab stats={stats} />}
            {tab === 'bookings'   && <BookingsTable />}
            {tab === 'rooms'      && <RoomManager />}
            {tab === 'gallery'    && <GalleryUploader />}
            {tab === 'reviews'    && <ReviewModeration />}
            {tab === 'inquiries'  && <InquiryInbox />}
            {tab === 'users'      && <UserManager />}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
