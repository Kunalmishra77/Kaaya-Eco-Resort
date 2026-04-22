// d:/kaaya eco resort/client/src/components/layout/Navbar.jsx
import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
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
  const dispatch    = useDispatch()
  const navigate    = useNavigate()
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

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setMobileOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleLogout = () => {
    dispatch(logout())
    setUserMenuOpen(false)
    navigate('/')
  }

  const closeMobile = () => setMobileOpen(false)

  return (
    <>
      {/* ── Top nav bar ─────────────────────────────────── */}
      <nav
        className={[
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled ? 'bg-forest shadow-lg shadow-forest/20 py-2' : 'bg-transparent py-4',
        ].join(' ')}
        aria-label="Main navigation"
      >
        <div className="container-lg flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0" onClick={closeMobile} aria-label="Kaaya Eco Resort home">
            <img
              src="/logo.svg"
              alt="Kaaya Eco Resort"
              className="h-12 sm:h-16 lg:h-20 w-auto"
              style={{ filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.5))' }}
              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block' }}
            />
            <span style={{ display: 'none' }} className="font-display text-stone text-base font-semibold tracking-wide">
              Kaaya Eco Resort
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  'font-sans text-xs font-semibold uppercase tracking-widest transition-colors duration-200 ' +
                  (isActive ? 'text-sand' : 'text-stone/90 hover:text-sand')
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Book Now — desktop only */}
            <Link to="/book" className="hidden lg:inline-flex btn-primary py-2.5 px-6 text-xs">
              Book Now
            </Link>

            {/* User menu — desktop only */}
            {isAuthenticated ? (
              <div className="relative hidden lg:block" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 text-stone/80 hover:text-sand transition-colors duration-200"
                  aria-expanded={userMenuOpen}
                >
                  <User size={18} />
                  <span className="font-sans text-sm font-medium">{user?.firstName}</span>
                  <ChevronDown size={14} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-sage/20 rounded-lg shadow-xl z-50">
                    <div className="px-4 py-3 border-b border-sage/20">
                      <p className="font-sans text-xs text-timber/50 uppercase tracking-wider">Signed in as</p>
                      <p className="font-sans text-sm font-semibold text-timber truncate">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <Link to="/my-bookings" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-timber hover:bg-stone hover:text-forest transition-colors">
                        <CalendarDays size={15} /> My Bookings
                      </Link>
                      {user?.role === 'ADMIN' && (
                        <Link to="/admin" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-timber hover:bg-stone hover:text-forest transition-colors">
                          <LayoutDashboard size={15} /> Admin Panel
                        </Link>
                      )}
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-terra hover:bg-stone transition-colors">
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login"
                className="hidden lg:inline-flex items-center gap-1.5 font-sans text-sm text-stone/80 hover:text-sand transition-colors duration-200">
                <User size={16} /> Sign In
              </Link>
            )}

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden p-3 text-stone hover:text-sand transition-colors"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile menu ───────────────────────────────────── */}
      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-forest/60 z-[60] lg:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Drawer — CSS transition only, NO framer-motion, NO opacity animation */}
      <div
        className={[
          'fixed top-0 right-0 bottom-0 w-full sm:w-80 bg-forest z-[70] lg:hidden',
          'flex flex-col transition-transform duration-300 ease-in-out',
          mobileOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
        aria-hidden={!mobileOpen}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 flex-shrink-0">
          <img
            src="/logo.svg"
            alt="Kaaya Eco Resort"
            className="h-14 w-auto"
            style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.4))' }}
          />
          <button
            onClick={closeMobile}
            className="p-2 text-white/50 hover:text-white transition-colors rounded-md"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        {/* Nav links — plain links, no animations that block pointer-events */}
        <nav className="flex-1 overflow-y-auto py-4 px-4">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={closeMobile}
              className={({ isActive }) =>
                'flex items-center py-3.5 px-3 rounded-lg font-sans text-base font-medium border-b border-white/8 transition-colors ' +
                (isActive ? 'text-sand' : 'text-white/80 hover:text-white active:text-sand')
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer actions */}
        <div className="px-4 py-5 border-t border-white/10 space-y-3 flex-shrink-0">
          <Link
            to="/book"
            onClick={closeMobile}
            className="btn-primary w-full justify-center"
          >
            Book Now
          </Link>

          {isAuthenticated ? (
            <div className="space-y-1 pt-1">
              <p className="font-sans text-white/30 text-[10px] uppercase tracking-widest px-3 pb-1">
                {user?.firstName} {user?.lastName}
              </p>
              <Link to="/my-bookings" onClick={closeMobile}
                className="flex items-center gap-2.5 text-white/70 hover:text-white text-sm font-sans py-2.5 px-3 rounded-lg hover:bg-white/8 transition-colors">
                <CalendarDays size={15} /> My Bookings
              </Link>
              {user?.role === 'ADMIN' && (
                <Link to="/admin" onClick={closeMobile}
                  className="flex items-center gap-2.5 text-white/70 hover:text-white text-sm font-sans py-2.5 px-3 rounded-lg hover:bg-white/8 transition-colors">
                  <LayoutDashboard size={15} /> Admin Panel
                </Link>
              )}
              <button
                onClick={() => { handleLogout(); closeMobile() }}
                className="flex items-center gap-2.5 text-terra text-sm font-sans py-2.5 px-3 rounded-lg hover:bg-white/5 transition-colors w-full"
              >
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          ) : (
            <Link to="/login" onClick={closeMobile}
              className="btn-outline-white w-full justify-center">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </>
  )
}
