// d:/kaaya eco resort/client/src/components/layout/Navbar.jsx
import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, User, ChevronDown, LogOut, CalendarDays, LayoutDashboard } from 'lucide-react'
import { logout } from '../../store/slices/authSlice.js'

const NAV_LINKS = [
  { label: 'Home',          to: '/'              },
  { label: 'About',         to: '/about'         },
  { label: 'Accommodation', to: '/accommodation' },
  { label: 'Experiences',   to: '/experiences'   },
  { label: 'Dining',        to: '/dining'        },
  { label: 'Gallery',       to: '/gallery'       },
  { label: 'Groups',        to: '/groups-events' },
  { label: 'Contact',       to: '/contact'       },
]

export default function Navbar() {
  const [scrolled,     setScrolled]     = useState(false)
  const [mobileOpen,   setMobileOpen]   = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef(null)
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const { user, isAuthenticated } = useSelector((s) => s.auth)

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close mobile on resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setMobileOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    setUserMenuOpen(false)
    navigate('/')
  }

  const navbarClasses = [
    'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
    scrolled
      ? 'bg-forest shadow-lg shadow-forest/20 py-2'
      : 'bg-transparent py-4',
  ].join(' ')

  const linkClasses = ({ isActive }) =>
    [
      'font-sans text-xs font-semibold uppercase tracking-widest transition-colors duration-200',
      isActive
        ? 'text-sand'
        : 'text-stone/90 hover:text-sand',
    ].join(' ')

  return (
    <>
      <nav className={navbarClasses} aria-label="Main navigation">
        <div className="container-lg flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0" aria-label="Kaaya Eco Resort home">
            <img
              src="/logo.svg"
              alt="Kaaya Eco Resort"
              className="h-12 sm:h-16 lg:h-20 w-auto"
              style={{ filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.5))' }}
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'block'
              }}
            />
            <span style={{ display: 'none' }} className="font-display text-stone text-base font-semibold tracking-wide">
              Kaaya Eco Resort
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClasses} end={link.to === '/'}>
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Book Now — always visible on desktop */}
            <Link to="/book" className="hidden lg:inline-flex btn-primary py-2.5 px-6 text-xs">
              Book Now
            </Link>

            {/* User menu */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="hidden lg:flex items-center gap-1.5 text-stone/80 hover:text-sand transition-colors duration-200"
                  aria-label="Account menu"
                  aria-expanded={userMenuOpen}
                >
                  <User size={18} />
                  <span className="font-sans text-sm font-medium">{user?.firstName}</span>
                  <ChevronDown size={14} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 bg-white border border-sage/20 rounded-sm shadow-xl z-50"
                    >
                      <div className="px-4 py-3 border-b border-sage/20">
                        <p className="font-sans text-xs text-timber/50 uppercase tracking-wider">Signed in as</p>
                        <p className="font-sans text-sm font-semibold text-timber truncate">{user?.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          to="/my-bookings"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-timber hover:bg-stone hover:text-forest transition-colors"
                        >
                          <CalendarDays size={15} /> My Bookings
                        </Link>
                        {user?.role === 'ADMIN' && (
                          <Link
                            to="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-timber hover:bg-stone hover:text-forest transition-colors"
                          >
                            <LayoutDashboard size={15} /> Admin Dashboard
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-terra hover:bg-stone transition-colors"
                        >
                          <LogOut size={15} /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden lg:inline-flex items-center gap-1.5 font-sans text-sm text-stone/80 hover:text-sand transition-colors duration-200"
              >
                <User size={16} /> Sign In
              </Link>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-3 text-stone hover:text-sand transition-colors"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-forest/95 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-80 bg-forest z-50 lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-stone/10">
                <div>
                  <img src="/logo.svg" alt="Kaaya Eco Resort" className="h-16 w-auto" style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.4))' }} />
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 text-stone/60 hover:text-stone transition-colors"
                  aria-label="Close menu"
                >
                  <X size={22} />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto py-6 px-6">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <NavLink
                      to={link.to}
                      end={link.to === '/'}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `block py-3.5 font-sans text-base font-medium border-b border-stone/10 transition-colors ${
                          isActive ? 'text-sand' : 'text-stone/80 hover:text-sand'
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  </motion.div>
                ))}
              </nav>

              <div className="p-6 border-t border-stone/10 space-y-3">
                <Link
                  to="/book"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary w-full justify-center"
                >
                  Book Now
                </Link>
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <Link
                      to="/my-bookings"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 text-stone/70 hover:text-stone text-sm font-sans py-2"
                    >
                      <CalendarDays size={15} /> My Bookings
                    </Link>
                    {user?.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 text-stone/70 hover:text-stone text-sm font-sans py-2"
                      >
                        <LayoutDashboard size={15} /> Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => { handleLogout(); setMobileOpen(false) }}
                      className="flex items-center gap-2 text-terra text-sm font-sans py-2"
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="btn-outline w-full justify-center"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
