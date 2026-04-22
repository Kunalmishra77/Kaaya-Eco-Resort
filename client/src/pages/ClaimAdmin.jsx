// d:/kaaya eco resort/client/src/pages/ClaimAdmin.jsx
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { Shield, CheckCircle, XCircle, LogIn } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../utils/api.js'
import { fetchCurrentUser } from '../store/slices/authSlice.js'
import Spinner from '../components/common/Spinner.jsx'

export default function ClaimAdmin() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, isAuthenticated, loading: authLoading } = useSelector((s) => s.auth)

  const [checking,  setChecking]  = useState(true)
  const [adminExists, setAdminExists] = useState(null)
  const [claiming,  setClaiming]  = useState(false)
  const [success,   setSuccess]   = useState(false)

  useEffect(() => {
    api.get('/auth/admin-exists')
      .then(({ data }) => setAdminExists(data.exists))
      .catch(() => setAdminExists(null))
      .finally(() => setChecking(false))
  }, [])

  // Already admin — redirect straight to dashboard
  useEffect(() => {
    if (user?.role === 'ADMIN') navigate('/admin', { replace: true })
  }, [user, navigate])

  const handleClaim = async () => {
    setClaiming(true)
    try {
      await api.post('/auth/claim-admin')
      await dispatch(fetchCurrentUser())
      setSuccess(true)
      toast.success('Admin access granted!')
      setTimeout(() => navigate('/admin'), 1500)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to claim admin')
    } finally {
      setClaiming(false)
    }
  }

  if (checking || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">

        {/* Brand */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-block">
            <p className="font-display text-forest text-3xl font-semibold">Kaaya Eco Resort</p>
            <p className="font-sans text-sand text-xs tracking-[0.25em] uppercase mt-1">Admin Setup</p>
          </Link>
        </div>

        <div className="bg-white border border-sage/20 rounded-sm shadow-sm p-8">

          {/* Success state */}
          {success ? (
            <div className="text-center py-4">
              <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
              <h1 className="font-display text-timber text-2xl font-semibold mb-2">You're an Admin!</h1>
              <p className="font-sans text-timber/60 text-sm">Redirecting to admin dashboard…</p>
            </div>

          /* Admin already exists */
          ) : adminExists ? (
            <div className="text-center py-4">
              <XCircle size={48} className="text-terra mx-auto mb-4" />
              <h1 className="font-display text-timber text-2xl font-semibold mb-3">Admin Already Exists</h1>
              <p className="font-sans text-timber/60 text-sm mb-6">
                This resort already has an admin account. Ask them to promote you from the Admin → Users tab.
              </p>
              <Link to="/" className="btn-primary w-full justify-center">Back to Site</Link>
            </div>

          /* Not logged in */
          ) : !isAuthenticated ? (
            <div className="text-center py-4">
              <Shield size={48} className="text-sage mx-auto mb-4" />
              <h1 className="font-display text-timber text-2xl font-semibold mb-3">Admin Setup</h1>
              <p className="font-sans text-timber/60 text-sm mb-6">
                Sign in or create an account first. Then come back here to claim admin access.
              </p>
              <Link to="/login" state={{ from: { pathname: '/claim-admin' } }} className="btn-primary w-full justify-center gap-2">
                <LogIn size={16} /> Sign In
              </Link>
              <p className="font-sans text-sm text-timber/50 mt-4 text-center">
                No account?{' '}
                <Link to="/register" state={{ from: { pathname: '/claim-admin' } }} className="text-sand font-semibold hover:text-timber transition-colors">
                  Create one
                </Link>
              </p>
            </div>

          /* Ready to claim */
          ) : (
            <div className="text-center py-2">
              <div className="w-16 h-16 rounded-full bg-forest/10 flex items-center justify-center mx-auto mb-5">
                <Shield size={32} className="text-forest" />
              </div>
              <h1 className="font-display text-timber text-2xl font-semibold mb-2">Claim Admin Access</h1>
              <p className="font-sans text-timber/60 text-sm mb-2">
                No admin exists yet. Click below to make your account the resort administrator.
              </p>
              <div className="bg-stone rounded-sm px-4 py-3 mb-6 text-left">
                <p className="font-sans text-xs text-timber/50 uppercase tracking-wider mb-1">Signed in as</p>
                <p className="font-sans font-semibold text-timber text-sm">{user?.firstName} {user?.lastName}</p>
                <p className="font-sans text-timber/50 text-xs">{user?.email}</p>
              </div>
              <button
                onClick={handleClaim}
                disabled={claiming}
                className="btn-primary w-full justify-center gap-2 disabled:opacity-60"
              >
                {claiming ? <Spinner size="sm" color="white" /> : <Shield size={16} />}
                {claiming ? 'Setting up…' : 'Claim Admin Access'}
              </button>
              <p className="font-sans text-xs text-timber/40 mt-4 text-center">
                This page becomes unavailable once an admin is set.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
