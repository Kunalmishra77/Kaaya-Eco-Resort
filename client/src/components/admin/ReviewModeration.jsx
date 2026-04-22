// d:/kaaya eco resort/client/src/components/admin/ReviewModeration.jsx
import { useState, useEffect } from 'react'
import { Check, X, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../utils/api.js'
import { formatDate } from '../../utils/helpers.js'
import StarRating from '../common/StarRating.jsx'
import Spinner from '../common/Spinner.jsx'

export default function ReviewModeration() {
  const [reviews,  setReviews]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [filter,   setFilter]   = useState('pending')
  const [updating, setUpdating] = useState(null)

  const fetchReviews = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/admin/reviews')
      setReviews(data.reviews)
    } catch {
      toast.error('Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchReviews() }, [])

  const handleApprove = async (id, approved) => {
    setUpdating(id)
    try {
      await api.patch(`/admin/reviews/${id}/approve`, { approved })
      setReviews((prev) => prev.map((r) => r.id === id ? { ...r, approved } : r))
      toast.success(approved ? 'Review approved' : 'Review unpublished')
    } catch {
      toast.error('Failed to update review')
    } finally {
      setUpdating(null)
    }
  }

  const pending  = reviews.filter((r) => !r.approved)
  const approved = reviews.filter((r) =>  r.approved)
  const filtered = filter === 'pending' ? pending : filter === 'approved' ? approved : reviews

  const FILTERS = [
    { key: 'pending',  label: `Pending (${pending.length})`   },
    { key: 'approved', label: `Approved (${approved.length})` },
    { key: 'all',      label: `All (${reviews.length})`       },
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
        <button onClick={fetchReviews} className="ml-auto p-2 text-timber/40 hover:text-timber rounded-md hover:bg-white transition-colors" title="Refresh">
          <RefreshCw size={14} />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-sage/20">
          <p className="font-sans text-timber/40">No reviews in this category.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((review) => (
            <div key={review.id} className="bg-white border border-sage/20 rounded-lg p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <StarRating value={review.rating} size={13} />
                    <span className={[
                      'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium',
                      review.approved ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700',
                    ].join(' ')}>
                      {review.approved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                  {review.title && (
                    <p className="font-display text-timber font-semibold mb-1">"{review.title}"</p>
                  )}
                  <p className="font-sans text-sm text-timber/65 mb-3 leading-relaxed">{review.comment}</p>
                  <div className="flex items-center gap-2 text-xs text-timber/35 flex-wrap">
                    <span className="font-medium text-timber/50">{review.user?.firstName} {review.user?.lastName}</span>
                    <span>·</span>
                    <span>{review.user?.email}</span>
                    <span>·</span>
                    <span>{formatDate(review.createdAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {!review.approved && (
                    <button
                      onClick={() => handleApprove(review.id, true)}
                      disabled={updating === review.id}
                      className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors px-3 py-1.5 rounded-md text-xs font-sans font-semibold disabled:opacity-50"
                    >
                      {updating === review.id ? <Spinner size="sm" /> : <Check size={13} />}
                      Approve
                    </button>
                  )}
                  {review.approved && (
                    <button
                      onClick={() => handleApprove(review.id, false)}
                      disabled={updating === review.id}
                      className="flex items-center gap-1.5 bg-red-50 text-terra border border-red-200 hover:bg-red-100 transition-colors px-3 py-1.5 rounded-md text-xs font-sans font-semibold disabled:opacity-50"
                    >
                      <X size={13} /> Unpublish
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
