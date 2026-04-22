// d:/kaaya eco resort/client/src/App.jsx
import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import Layout from './components/layout/Layout.jsx'
import ScrollToTop from './components/common/ScrollToTop.jsx'
import ProtectedRoute from './components/common/ProtectedRoute.jsx'
import AdminRoute from './components/common/AdminRoute.jsx'
import { fetchCurrentUser } from './store/slices/authSlice.js'

// Pages — lazy loaded for performance
import { lazy, Suspense } from 'react'
import Spinner from './components/common/Spinner.jsx'

const Home           = lazy(() => import('./pages/Home.jsx'))
const About          = lazy(() => import('./pages/About.jsx'))
const Accommodation  = lazy(() => import('./pages/Accommodation.jsx'))
const RoomDetail     = lazy(() => import('./pages/RoomDetail.jsx'))
const Experiences    = lazy(() => import('./pages/Experiences.jsx'))
const Dining         = lazy(() => import('./pages/Dining.jsx'))
const Gallery        = lazy(() => import('./pages/Gallery.jsx'))
const Groups         = lazy(() => import('./pages/Groups.jsx'))
const Contact        = lazy(() => import('./pages/Contact.jsx'))
const Login          = lazy(() => import('./pages/Login.jsx'))
const Register       = lazy(() => import('./pages/Register.jsx'))
const Booking        = lazy(() => import('./pages/Booking.jsx'))
const BookingSuccess = lazy(() => import('./pages/BookingSuccess.jsx'))
const MyBookings     = lazy(() => import('./pages/MyBookings.jsx'))
const Admin          = lazy(() => import('./pages/Admin.jsx'))
const ClaimAdmin     = lazy(() => import('./pages/ClaimAdmin.jsx'))

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone">
      <Spinner size="lg" />
    </div>
  )
}

export default function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    // Restore auth state from stored token on app load
    dispatch(fetchCurrentUser())
  }, [dispatch])

  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/"               element={<Home />} />
            <Route path="/about"          element={<About />} />
            <Route path="/accommodation"  element={<Accommodation />} />
            <Route path="/accommodation/:id" element={<RoomDetail />} />
            <Route path="/experiences"    element={<Experiences />} />
            <Route path="/dining"         element={<Dining />} />
            <Route path="/gallery"        element={<Gallery />} />
            <Route path="/groups-events"  element={<Groups />} />
            <Route path="/contact"        element={<Contact />} />
            <Route path="/login"          element={<Login />} />
            <Route path="/register"       element={<Register />} />

            {/* Booking success — public so Stripe redirects work after page reload */}
            <Route path="/booking/success" element={<BookingSuccess />} />

            {/* Protected guest routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/book"        element={<Booking />} />
              <Route path="/my-bookings" element={<MyBookings />} />
            </Route>

            {/* First-time admin setup — public, self-locks after first admin exists */}
            <Route path="/claim-admin" element={<ClaimAdmin />} />

          </Route>

          {/* Admin — own full-page layout, no site nav/footer */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  )
}
