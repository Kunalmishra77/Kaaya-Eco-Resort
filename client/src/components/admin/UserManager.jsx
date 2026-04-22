// d:/kaaya eco resort/client/src/components/admin/UserManager.jsx
import { useState, useEffect, useCallback } from 'react'
import { Shield, User, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../utils/api.js'
import { formatDate } from '../../utils/helpers.js'
import Spinner from '../common/Spinner.jsx'

export default function UserManager() {
  const [users,      setUsers]      = useState([])
  const [loading,    setLoading]    = useState(true)
  const [updating,   setUpdating]   = useState(null)
  const [page,       setPage]       = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search,     setSearch]     = useState('')

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get(`/admin/users?page=${page}&limit=20`)
      setUsers(data.users)
      setTotalPages(data.totalPages)
    } catch {
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const toggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'ADMIN' ? 'GUEST' : 'ADMIN'
    if (!window.confirm(`Change this user's role to ${newRole}?`)) return
    setUpdating(userId)
    try {
      await api.patch(`/admin/users/${userId}/role`, { role: newRole })
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: newRole } : u))
      toast.success(`Role updated to ${newRole}`)
    } catch {
      toast.error('Failed to update role')
    } finally {
      setUpdating(null)
    }
  }

  const filtered = users.filter((u) => {
    if (!search) return true
    const q = search.toLowerCase()
    return u.email.toLowerCase().includes(q) || u.firstName.toLowerCase().includes(q) || u.lastName.toLowerCase().includes(q)
  })

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          className="input-base max-w-xs"
        />
        <button onClick={fetchUsers} className="p-2 text-timber/40 hover:text-timber transition-colors rounded-md hover:bg-white" title="Refresh">
          <RefreshCw size={15} />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-sage/20">
          <p className="font-sans text-timber/40">No users found.</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg border border-sage/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-sans">
                <thead className="bg-stone/60 border-b border-sage/20">
                  <tr>
                    {['User', 'Email', 'Phone', 'Role', 'Bookings', 'Joined', 'Actions'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left font-semibold text-timber/50 text-[11px] uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-sage/10">
                  {filtered.map((u) => (
                    <tr key={u.id} className="hover:bg-stone/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-forest/10 flex items-center justify-center flex-shrink-0">
                            {u.role === 'ADMIN'
                              ? <Shield size={13} className="text-forest" />
                              : <User   size={13} className="text-sage"   />}
                          </div>
                          <p className="font-medium text-timber whitespace-nowrap">{u.firstName} {u.lastName}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-timber/55 text-xs">{u.email}</td>
                      <td className="px-4 py-3 text-timber/40 text-xs">{u.phone || '–'}</td>
                      <td className="px-4 py-3">
                        <span className={[
                          'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold',
                          u.role === 'ADMIN' ? 'bg-forest text-white' : 'bg-stone text-timber/50',
                        ].join(' ')}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-timber/50 text-center">{u._count?.bookings ?? 0}</td>
                      <td className="px-4 py-3 text-timber/40 text-xs whitespace-nowrap">{formatDate(u.createdAt)}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleRole(u.id, u.role)}
                          disabled={!!updating}
                          className={[
                            'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-sans font-medium border transition-colors disabled:opacity-50 whitespace-nowrap',
                            u.role === 'ADMIN'
                              ? 'border-terra/30 text-terra hover:bg-terra/5'
                              : 'border-forest/30 text-forest hover:bg-forest/5',
                          ].join(' ')}
                        >
                          {updating === u.id
                            ? <Spinner size="sm" />
                            : u.role === 'ADMIN' ? 'Revoke Admin' : 'Make Admin'
                          }
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-5">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="px-4 py-2 text-xs font-sans border border-sage/40 rounded-md bg-white disabled:opacity-40 hover:border-forest transition-colors">
                ← Prev
              </button>
              <span className="font-sans text-sm text-timber/50">Page {page} of {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-4 py-2 text-xs font-sans border border-sage/40 rounded-md bg-white disabled:opacity-40 hover:border-forest transition-colors">
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
