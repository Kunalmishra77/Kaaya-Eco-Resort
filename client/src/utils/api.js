// d:/kaaya eco resort/client/src/utils/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 — clear token and let Redux/React Router handle the redirect.
// We import the store lazily to avoid circular-dependency issues at module init.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      if (!window.location.pathname.startsWith('/login')) {
        // Dispatch logout so ProtectedRoute redirects to /login with `from` state
        // intact — the user will be sent back to their original page after signing in.
        const { store }  = await import('../store/index.js')
        const { logout } = await import('../store/slices/authSlice.js')
        store.dispatch(logout())
      }
    }
    return Promise.reject(error)
  }
)

export default api
