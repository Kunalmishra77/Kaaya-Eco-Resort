// Admin session stored in sessionStorage (clears when browser tab closes)
// Completely separate from the regular site login in localStorage
const KEY = 'kaaya_admin_session'

export function getAdminSession() {
  try {
    const raw = sessionStorage.getItem(KEY)
    if (!raw) return null
    const session = JSON.parse(raw)
    if (!session?.token || !session?.user) return null
    return session
  } catch {
    return null
  }
}

export function setAdminSession(token, user) {
  sessionStorage.setItem(KEY, JSON.stringify({ token, user }))
}

export function clearAdminSession() {
  sessionStorage.removeItem(KEY)
}
