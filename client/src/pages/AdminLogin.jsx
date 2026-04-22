// d:/kaaya eco resort/client/src/pages/AdminLogin.jsx
import { useState } from 'react'
import { Shield, Eye, EyeOff, Lock } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../utils/api.js'
import Spinner from '../components/common/Spinner.jsx'

export default function AdminLogin({ onSuccess }) {
  const [form,    setForm]    = useState({ email: '', password: '' })
  const [showPw,  setShowPw]  = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      toast.error('Enter your admin email and password')
      return
    }
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', form)
      if (data.user?.role !== 'ADMIN') {
        toast.error('Access denied — admin credentials required')
        return
      }
      toast.success(`Welcome back, ${data.user.firstName}`)
      onSuccess(data.token, data.user)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-forest flex flex-col items-center justify-center px-4 py-12">

      {/* Brand mark */}
      <div className="mb-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
          <Shield size={30} className="text-white" />
        </div>
        <h1 className="font-display text-white text-2xl font-semibold">Admin Panel</h1>
        <p className="font-sans text-white/40 text-sm mt-1">Kaaya Eco Resort</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-white/8 border border-white/10 rounded-2xl p-7">
        <div className="mb-6">
          <p className="font-sans text-white text-base font-semibold">Sign in to continue</p>
          <p className="font-sans text-white/40 text-xs mt-0.5">Admin access only — your regular account is unaffected</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block font-sans text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">
              Admin Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={set('email')}
              placeholder="admin@kaayaecoresort.com"
              className="w-full bg-white/10 border border-white/15 rounded-lg px-4 py-2.5 text-sm font-sans text-white placeholder-white/25 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all"
              autoComplete="email"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block font-sans text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={set('password')}
                placeholder="••••••••"
                className="w-full bg-white/10 border border-white/15 rounded-lg px-4 py-2.5 pr-11 text-sm font-sans text-white placeholder-white/25 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                tabIndex={-1}
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sand hover:bg-sand/90 disabled:opacity-60 text-forest font-sans font-semibold text-sm py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors mt-2"
          >
            {loading ? <Spinner size="sm" color="forest" /> : <Lock size={14} />}
            {loading ? 'Verifying…' : 'Access Admin Panel'}
          </button>
        </form>
      </div>

      <p className="font-sans text-white/20 text-xs mt-6 text-center">
        This is a restricted area. Unauthorized access attempts are logged.
      </p>
    </div>
  )
}
