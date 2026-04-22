// d:/kaaya eco resort/client/src/pages/Admin.jsx
import { useState, useEffect, useRef } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, CalendarDays, BedDouble, Image,
  Star, MessageSquare, Users, RefreshCw, Menu, X,
  ExternalLink, LogOut, ChevronRight,
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
  const { adminUser, adminLogout } = useOutletContext()
  const [tab,          setTab]          = useState('overview')
  const [stats,        setStats]        = useState(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [sidebarOpen,  setSidebarOpen]  = useState(false)
  const sidebarRef = useRef(null)

  const fetchStats = async () => {
    setStatsLoading(true)
    try {
      const { data } = await api.get('/admin/stats')
      setStats(data)
    } catch { /* non-fatal */ } finally {
      setStatsLoading(false)
    }
  }

  useEffect(() => { fetchStats() }, [])

  // Close sidebar on outside tap (mobile)
  useEffect(() => {
    if (!sidebarOpen) return
    const handler = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setSidebarOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [sidebarOpen])

  // Close on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setSidebarOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const activeTab = TABS.find((t) => t.key === tab)

  const handleTabClick = (key) => {
    setTab(key)
    setSidebarOpen(false)
  }

  const SidebarContent = () => (
    <>
      {/* Brand */}
      <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between flex-shrink-0">
        <div>
          <p className="font-display text-white text-lg font-semibold leading-tight">Kaaya</p>
          <p className="font-sans text-white/40 text-[11px] uppercase tracking-widest">Admin Panel</p>
        </div>
        <button
          onMouseDown={() => setSidebarOpen(false)}
          className="lg:hidden p-2 -mr-1 text-white/40 hover:text-white transition-colors rounded-md"
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {TABS.map((t) => {
          const isActive  = tab === t.key
          const hasBadge  =
            (t.key === 'reviews'   && stats?.unapprovedReviews > 0) ||
            (t.key === 'inquiries' && stats?.unreadInquiries   > 0)
          const badgeCount =
            t.key === 'reviews'   ? stats?.unapprovedReviews :
            t.key === 'inquiries' ? stats?.unreadInquiries   : 0

          return (
            <button
              key={t.key}
              type="button"
              onMouseDown={() => handleTabClick(t.key)}
              onTouchEnd={(e) => { e.preventDefault(); handleTabClick(t.key) }}
              className={[
                'w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-sans font-medium',
                'transition-colors duration-150 select-none',
                isActive
                  ? 'bg-white/15 text-white'
                  : 'text-white/60 hover:bg-white/10 hover:text-white active:bg-white/20',
              ].join(' ')}
            >
              <t.icon size={16} className="flex-shrink-0" />
              <span className="flex-1 text-left">{t.label}</span>
              {hasBadge && (
                <span className="w-5 h-5 rounded-full bg-terra text-white text-[10px] flex items-center justify-center font-bold flex-shrink-0">
                  {badgeCount}
                </span>
              )}
              {isActive && <ChevronRight size={12} className="flex-shrink-0 text-white/40" />}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/10 space-y-2 flex-shrink-0">
        <div className="flex items-center gap-3 px-1 mb-3">
          <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
            <Users size={14} className="text-white/70" />
          </div>
          <div className="min-w-0">
            <p className="font-sans text-white text-xs font-semibold truncate">{adminUser?.firstName} {adminUser?.lastName}</p>
            <p className="font-sans text-white/40 text-[10px] truncate">{adminUser?.email}</p>
          </div>
        </div>
        <Link
          to="/"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors text-xs font-sans w-full"
        >
          <ExternalLink size={13} />
          View Site
        </Link>
        <button
          type="button"
          onClick={adminLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/40 hover:text-terra hover:bg-white/5 transition-colors text-xs font-sans w-full"
        >
          <LogOut size={13} />
          Sign Out of Admin
        </button>
      </div>
    </>
  )

  return (
    <div className="h-screen bg-[#f5f4f0] flex overflow-hidden">

      {/* ── Mobile sidebar backdrop ───────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onMouseDown={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Desktop sidebar (static in flex) ─────────────────── */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:flex-shrink-0 bg-forest h-full overflow-hidden">
        <SidebarContent />
      </aside>

      {/* ── Mobile sidebar (fixed drawer) ────────────────────── */}
      <div
        ref={sidebarRef}
        className={[
          'fixed inset-y-0 left-0 z-50 w-64 bg-forest flex flex-col lg:hidden',
          'transition-transform duration-300 ease-in-out',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        <SidebarContent />
      </div>

      {/* ── Main content ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="bg-white border-b border-sage/20 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-4">
            {/* Hamburger — mobile only */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-1 text-timber/50 hover:text-timber transition-colors rounded-md hover:bg-stone"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="font-display text-timber text-base sm:text-lg font-semibold leading-tight">
                {activeTab?.label}
              </h1>
              <p className="font-sans text-timber/40 text-xs hidden sm:block">
                Kaaya Eco Resort · Admin Dashboard
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchStats}
              className="p-2 text-timber/40 hover:text-timber transition-colors rounded-md hover:bg-stone"
              title="Refresh stats"
            >
              <RefreshCw size={15} />
            </button>
            <Link
              to="/"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans text-timber/60 border border-sage/30 rounded-md hover:border-forest hover:text-forest transition-colors"
            >
              <ExternalLink size={12} /> View Site
            </Link>
          </div>
        </header>

        {/* Scrollable body */}
        <main className="flex-1 overflow-y-auto">
          {/* Stats */}
          <div className="px-4 sm:px-6 pt-5 pb-4">
            <StatsCards stats={stats} loading={statsLoading} />
          </div>

          {/* Tab content */}
          <div className="px-4 sm:px-6 pb-8">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              {tab === 'overview'   && <OverviewTab   stats={stats} />}
              {tab === 'bookings'   && <BookingsTable />}
              {tab === 'rooms'      && <RoomManager />}
              {tab === 'gallery'    && <GalleryUploader />}
              {tab === 'reviews'    && <ReviewModeration />}
              {tab === 'inquiries'  && <InquiryInbox />}
              {tab === 'users'      && <UserManager />}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}
