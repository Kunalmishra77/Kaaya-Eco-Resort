// d:/kaaya eco resort/client/src/components/common/AdminRoute.jsx
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { getAdminSession, setAdminSession, clearAdminSession } from '../../utils/adminAuth.js'
import AdminLogin from '../../pages/AdminLogin.jsx'

export default function AdminRoute() {
  const [session, setSession] = useState(() => getAdminSession())

  const handleLogin = (token, user) => {
    setAdminSession(token, user)
    setSession({ token, user })
  }

  const handleLogout = () => {
    clearAdminSession()
    setSession(null)
  }

  if (!session) {
    return <AdminLogin onSuccess={handleLogin} />
  }

  return <Outlet context={{ adminUser: session.user, adminLogout: handleLogout }} />
}
