// d:/kaaya eco resort/client/src/components/admin/InquiryInbox.jsx
import { useState, useEffect } from 'react'
import { Mail, MailOpen, RefreshCw, Phone } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../utils/api.js'
import { formatDate } from '../../utils/helpers.js'
import Spinner from '../common/Spinner.jsx'

export default function InquiryInbox() {
  const [inquiries, setInquiries] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [expanded,  setExpanded]  = useState(null)
  const [filter,    setFilter]    = useState('unread')

  const fetchInquiries = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/admin/inquiries')
      setInquiries(data.inquiries)
    } catch {
      toast.error('Failed to load inquiries')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchInquiries() }, [])

  const markRead = async (id) => {
    try {
      await api.patch(`/admin/inquiries/${id}/read`)
      setInquiries((prev) => prev.map((i) => i.id === id ? { ...i, read: true } : i))
    } catch {
      // Silently fail — non-critical
    }
  }

  const handleExpand = (id) => {
    setExpanded(expanded === id ? null : id)
    const inq = inquiries.find((i) => i.id === id)
    if (inq && !inq.read) markRead(id)
  }

  const filtered = inquiries.filter((i) =>
    filter === 'unread' ? !i.read :
    filter === 'read'   ?  i.read :
    true
  )

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        {[
          { key: 'unread', label: `Unread (${inquiries.filter((i) => !i.read).length})` },
          { key: 'read',   label: `Read (${inquiries.filter((i) => i.read).length})` },
          { key: 'all',    label: 'All' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`font-sans text-xs px-4 py-2 rounded-sm border transition-colors ${filter === t.key ? 'bg-forest border-forest text-stone' : 'border-sage/40 text-timber hover:border-forest'}`}
          >
            {t.label}
          </button>
        ))}
        <button onClick={fetchInquiries} className="ml-auto p-2 text-timber/50 hover:text-timber" aria-label="Refresh">
          <RefreshCw size={15} />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <p className="font-sans text-timber/40 text-center py-10">No inquiries found.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((inq) => (
            <div
              key={inq.id}
              className={`border rounded-sm transition-colors ${!inq.read ? 'border-sand/40 bg-sand/5' : 'border-sage/20 bg-white'}`}
            >
              <button
                onClick={() => handleExpand(inq.id)}
                className="w-full flex items-start gap-4 p-4 text-left"
              >
                <div className={`mt-0.5 flex-shrink-0 ${!inq.read ? 'text-sand' : 'text-sage'}`}>
                  {!inq.read ? <Mail size={16} /> : <MailOpen size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <p className={`font-sans text-sm ${!inq.read ? 'font-semibold text-timber' : 'text-timber/70'}`}>
                      {inq.name}
                    </p>
                    <span className="font-sans text-xs text-timber/40 flex-shrink-0">{formatDate(inq.createdAt)}</span>
                  </div>
                  <p className="font-sans text-xs text-timber/50 mt-0.5">{inq.email}</p>
                  <p className={`font-sans text-sm mt-1 ${!inq.read ? 'text-timber font-medium' : 'text-timber/60'} truncate`}>
                    {inq.subject}
                  </p>
                </div>
              </button>

              {expanded === inq.id && (
                <div className="px-14 pb-5 border-t border-sage/20">
                  <div className="pt-4 space-y-3">
                    <div className="flex flex-wrap gap-4 text-xs font-sans text-timber/50">
                      <span className="flex items-center gap-1.5"><Mail size={11} /> {inq.email}</span>
                      {inq.phone && <span className="flex items-center gap-1.5"><Phone size={11} /> {inq.phone}</span>}
                    </div>
                    <p className="font-sans text-sm text-timber/70 leading-relaxed bg-stone rounded-sm p-4">
                      {inq.message}
                    </p>
                    <div className="flex gap-3">
                      <a
                        href={`mailto:${inq.email}?subject=Re: ${inq.subject}`}
                        className="btn-primary py-2 px-4 text-xs"
                      >
                        Reply via Email
                      </a>
                      {inq.phone && (
                        <a href={`tel:${inq.phone}`} className="btn-outline py-2 px-4 text-xs">
                          Call
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
