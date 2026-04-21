// d:/kaaya eco resort/client/src/components/common/AdminRoute.jsx
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Spinner from './Spinner.jsx'

export default function AdminRoute() {
  const { user, isAuthenticated, loading } = useSelector((s) => s.auth)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
