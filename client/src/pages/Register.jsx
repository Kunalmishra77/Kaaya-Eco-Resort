// d:/kaaya eco resort/client/src/pages/Register.jsx
import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Eye, EyeOff, UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'
import { registerUser, clearError } from '../store/slices/authSlice.js'
import Spinner from '../components/common/Spinner.jsx'

export default function Register() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const location  = useLocation()
  const { loading, error, isAuthenticated } = useSelector((s) => s.auth)

  const [form, setForm]         = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [showPwd, setShowPwd]   = useState(false)
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
    if (!form.firstName.trim())  errs.firstName = 'First name is required'
    if (!form.lastName.trim())   errs.lastName  = 'Last name is required'
    if (!form.email.trim())      errs.email     = 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email'
    if (!form.password)          errs.password  = 'Password is required'
    if (form.password.length < 8) errs.password = 'Password must be at least 8 characters'
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match'
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
    const { confirmPassword, ...data } = form
    dispatch(registerUser(data))
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
          <h1 className="font-display text-timber text-2xl font-semibold mb-2">Create an account</h1>
          <p className="font-sans text-timber/50 text-sm mb-8">
            Register to book your stay at Kaaya Eco Resort.
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block font-sans text-xs uppercase tracking-wider text-timber/50 mb-1.5 font-semibold">
                  First Name
                </label>
                <input
                  id="firstName" name="firstName" type="text"
                  value={form.firstName} onChange={handleChange}
                  placeholder="First"
                  className={`input-base ${fieldErr.firstName ? 'border-terra' : ''}`}
                  autoComplete="given-name"
                  autoFocus
                />
                {fieldErr.firstName && <p className="font-sans text-xs text-terra mt-1">{fieldErr.firstName}</p>}
              </div>
              <div>
                <label htmlFor="lastName" className="block font-sans text-xs uppercase tracking-wider text-timber/50 mb-1.5 font-semibold">
                  Last Name
                </label>
                <input
                  id="lastName" name="lastName" type="text"
                  value={form.lastName} onChange={handleChange}
                  placeholder="Last"
                  className={`input-base ${fieldErr.lastName ? 'border-terra' : ''}`}
                  autoComplete="family-name"
                />
                {fieldErr.lastName && <p className="font-sans text-xs text-terra mt-1">{fieldErr.lastName}</p>}
              </div>
            </div>

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
              />
              {fieldErr.email && <p className="font-sans text-xs text-terra mt-1">{fieldErr.email}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block font-sans text-xs uppercase tracking-wider text-timber/50 mb-1.5 font-semibold">
                Phone / WhatsApp <span className="text-timber/30 normal-case tracking-normal">(optional)</span>
              </label>
              <input
                id="phone" name="phone" type="tel"
                value={form.phone} onChange={handleChange}
                placeholder="+1 234 567 8900"
                className="input-base"
                autoComplete="tel"
              />
            </div>

            <div>
              <label htmlFor="password" className="block font-sans text-xs uppercase tracking-wider text-timber/50 mb-1.5 font-semibold">
                Password
              </label>
              <div className="relative">
                <input
                  id="password" name="password"
                  type={showPwd ? 'text' : 'password'}
                  value={form.password} onChange={handleChange}
                  placeholder="Min. 8 characters"
                  className={`input-base pr-10 ${fieldErr.password ? 'border-terra' : ''}`}
                  autoComplete="new-password"
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

            <div>
              <label htmlFor="confirmPassword" className="block font-sans text-xs uppercase tracking-wider text-timber/50 mb-1.5 font-semibold">
                Confirm Password
              </label>
              <input
                id="confirmPassword" name="confirmPassword"
                type={showPwd ? 'text' : 'password'}
                value={form.confirmPassword} onChange={handleChange}
                placeholder="Repeat password"
                className={`input-base ${fieldErr.confirmPassword ? 'border-terra' : ''}`}
                autoComplete="new-password"
              />
              {fieldErr.confirmPassword && <p className="font-sans text-xs text-terra mt-1">{fieldErr.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center gap-2 mt-2 disabled:opacity-60"
            >
              {loading ? <Spinner size="sm" color="white" /> : <UserPlus size={16} />}
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <div className="divider mt-6 mb-6" />

          <p className="font-sans text-sm text-timber/50 text-center">
            Already have an account?{' '}
            <Link to="/login" state={location.state} className="text-sand font-semibold hover:text-timber transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
