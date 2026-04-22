// d:/kaaya eco resort/client/src/components/admin/InquiryInbox.jsx
import { useState, useEffect } from 'react'
import { Mail, MailOpen, RefreshCw, Phone, ChevronDown, ChevronUp } from 'lucide-react'
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
    } catch { /* non-critical */ }
  }

  const handleExpand = (id) => {
    setExpanded(expanded === id ? null : id)
    const inq = inquiries.find((i) => i.id === id)
    if (inq && !inq.read) markRead(id)
  }

  const unread   = inquiries.filter((i) => !i.read)
  const read     = inquiries.filter((i) =>  i.read)
  const filtered = filter === 'unread' ? unread : filter === 'read' ? read : inquiries

  const FILTERS = [
    { key: 'unread', label: `Unread (${unread.length})` },
    { key: 'read',   label: `Read (${read.length})`     },
    { key: 'all',    label: `All (${inquiries.length})`  },
  ]

  return (
    <div>
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {FILTERS.map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={[
              'font-sans text-xs px-3 py-1.5 rounded-md border transition-colors',
              filter === t.key
                ? 'bg-forest border-forest text-white'
                : 'border-sage/40 text-timber/70 hover:border-forest hover:text-forest bg-white',
            ].join(' ')}
          >
            {t.label}
          </button>
        ))}
        <button onClick={fetchInquiries} className="ml-auto p-2 text-timber/40 hover:text-timber rounded-md hover:bg-white transition-colors" title="Refresh">
          <RefreshCw size={14} />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-sage/20">
          <p className="font-sans text-timber/40">No inquiries found.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((inq) => (
            <div
              key={inq.id}
              className={[
                'rounded-lg border transition-colors overflow-hidden',
                !inq.read ? 'border-sand/40 bg-sand/5' : 'border-sage/20 bg-white',
              ].join(' ')}
            >
              <button
                onClick={() => handleExpand(inq.id)}
                className="w-full flex items-start gap-4 p-4 text-left"
              >
                <div className={`mt-0.5 flex-shrink-0 ${!inq.read ? 'text-sand' : 'text-sage/60'}`}>
                  {!inq.read ? <Mail size={16} /> : <MailOpen size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <p className={`font-sans text-sm ${!inq.read ? 'font-semibold text-timber' : 'text-timber/70'}`}>
                      {inq.name}
                    </p>
                    <span className="font-sans text-[11px] text-timber/35 flex-shrink-0">{formatDate(inq.createdAt)}</span>
                  </div>
                  <p className="font-sans text-xs text-timber/45 mt-0.5">{inq.email}</p>
                  <p className={`font-sans text-xs mt-1 truncate ${!inq.read ? 'text-timber font-medium' : 'text-timber/50'}`}>
                    {inq.subject}
                  </p>
                </div>
                <div className="flex-shrink-0 text-timber/30 mt-0.5">
                  {expanded === inq.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>
              </button>

              {expanded === inq.id && (
                <div className="px-5 pb-5 pt-1 border-t border-sage/20">
                  <div className="flex flex-wrap gap-4 text-xs font-sans text-timber/45 mb-3">
                    <span className="flex items-center gap-1.5"><Mail size={11} /> {inq.email}</span>
                    {inq.phone && <span className="flex items-center gap-1.5"><Phone size={11} /> {inq.phone}</span>}
                  </div>
                  <p className="font-sans text-sm text-timber/65 leading-relaxed bg-stone/60 rounded-md p-4 mb-4">
                    {inq.message}
                  </p>
                  <div className="flex gap-3">
                    <a href={`mailto:${inq.email}?subject=Re: ${inq.subject}`} className="btn-primary py-2 px-4 text-xs">
                      Reply via Email
                    </a>
                    {inq.phone && (
                      <a href={`tel:${inq.phone}`} className="btn-outline py-2 px-4 text-xs">Call</a>
                    )}
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
