// d:/kaaya eco resort/client/src/pages/Login.jsx
import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import toast from 'react-hot-toast'
import { loginUser, clearError } from '../store/slices/authSlice.js'
import Spinner from '../components/common/Spinner.jsx'

export default function Login() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const location  = useLocation()
  const { loading, error, isAuthenticated } = useSelector((s) => s.auth)

  const [form, setForm]       = useState({ email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [fieldErr, setFieldErr] = useState({})

  const from = location.state?.from?.pathname || '/'

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true })
  }, [isAuthenticated, navigate, from])

  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearError()) }
  }, [error, dispatch])

  const validate = () => {
    const errs = {}
    if (!form.email.trim())    errs.email    = 'Email is required'
    if (!form.password.trim()) errs.password = 'Password is required'
    return errs
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (fieldErr[name]) setFieldErr((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setFieldErr(errs); return }
    dispatch(loginUser(form))
  }

  return (
    <div className="min-h-screen bg-stone flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-block">
            <p className="font-display text-forest text-3xl font-semibold">Kaaya Eco Resort</p>
            <p className="font-sans text-sand text-xs tracking-[0.25em] uppercase mt-1">Yala · Sri Lanka</p>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white border border-sage/20 rounded-sm shadow-sm p-8">
          <h1 className="font-display text-timber text-2xl font-semibold mb-2">Welcome back</h1>
          <p className="font-sans text-timber/50 text-sm mb-8">
            Sign in to manage your bookings and reservations.
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label htmlFor="email" className="block font-sans text-xs uppercase tracking-wider text-timber/50 mb-1.5 font-semibold">
                Email Address
              </label>
              <input
                id="email" name="email" type="email"
                value={form.email} onChange={handleChange}
                placeholder="your@email.com"
                className={`input-base ${fieldErr.email ? 'border-terra' : ''}`}
                autoComplete="email"
                autoFocus
              />
              {fieldErr.email && <p className="font-sans text-xs text-terra mt-1">{fieldErr.email}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block font-sans text-xs uppercase tracking-wider text-timber/50 font-semibold">
                  Password
                </label>
                <Link to="/contact" className="font-sans text-xs text-sand hover:text-timber transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password" name="password"
                  type={showPwd ? 'text' : 'password'}
                  value={form.password} onChange={handleChange}
                  placeholder="Your password"
                  className={`input-base pr-10 ${fieldErr.password ? 'border-terra' : ''}`}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-timber/40 hover:text-timber transition-colors"
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {fieldErr.password && <p className="font-sans text-xs text-terra mt-1">{fieldErr.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center gap-2 mt-2 disabled:opacity-60"
            >
              {loading ? <Spinner size="sm" color="white" /> : <LogIn size={16} />}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="divider mt-6 mb-6" />

          <p className="font-sans text-sm text-timber/50 text-center">
            Don't have an account?{' '}
            <Link to="/register" state={location.state} className="text-sand font-semibold hover:text-timber transition-colors">
              Create one
            </Link>
          </p>
        </div>

        <p className="font-sans text-xs text-timber/30 text-center mt-6">
          By signing in, you agree to our terms and privacy policy.
        </p>
      </div>
    </div>
  )
}
