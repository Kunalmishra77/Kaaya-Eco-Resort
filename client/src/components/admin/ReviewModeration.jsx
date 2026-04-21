// d:/kaaya eco resort/client/src/components/admin/ReviewModeration.jsx
import { useState, useEffect } from 'react'
import { Check, X, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../utils/api.js'
import { formatDate } from '../../utils/helpers.js'
import StarRating from '../common/StarRating.jsx'
import Spinner from '../common/Spinner.jsx'

export default function ReviewModeration() {
  const [reviews, setReviews]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [filter,  setFilter]    = useState('pending')
  const [updating,setUpdating]  = useState(null)

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
      toast.success(approved ? 'Review approved' : 'Review rejected')
    } catch {
      toast.error('Failed to update review')
    } finally {
      setUpdating(null)
    }
  }

  const filtered = reviews.filter((r) =>
    filter === 'pending'  ? !r.approved :
    filter === 'approved' ?  r.approved :
    true
  )

  return (
    <div>
      {/* Tabs */}
      <div className="flex items-center gap-3 mb-6">
        {[
          { key: 'pending',  label: `Pending (${reviews.filter((r) => !r.approved).length})` },
          { key: 'approved', label: `Approved (${reviews.filter((r) => r.approved).length})` },
          { key: 'all',      label: 'All' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`font-sans text-xs px-4 py-2 rounded-sm border transition-colors ${filter === t.key ? 'bg-forest border-forest text-stone' : 'border-sage/40 text-timber hover:border-forest'}`}
          >
            {t.label}
          </button>
        ))}
        <button onClick={fetchReviews} className="ml-auto p-2 text-timber/50 hover:text-timber" aria-label="Refresh">
          <RefreshCw size={15} />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <p className="font-sans text-timber/40 text-center py-10">No reviews in this category.</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((review) => (
            <div key={review.id} className="bg-white border border-sage/20 rounded-sm p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <StarRating value={review.rating} size={13} />
                    <span className={`badge text-[10px] ${review.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {review.approved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                  {review.title && (
                    <p className="font-display text-timber font-semibold mb-1">"{review.title}"</p>
                  )}
                  <p className="font-sans text-sm text-timber/70 mb-3 leading-relaxed">{review.comment}</p>
                  <div className="flex items-center gap-3 text-xs text-timber/40">
                    <span>{review.user?.firstName} {review.user?.lastName}</span>
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
                      className="flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors px-3 py-1.5 rounded-sm text-xs font-sans font-semibold disabled:opacity-50"
                    >
                      {updating === review.id ? <Spinner size="sm" color="forest" /> : <Check size={13} />}
                      Approve
                    </button>
                  )}
                  {review.approved && (
                    <button
                      onClick={() => handleApprove(review.id, false)}
                      disabled={updating === review.id}
                      className="flex items-center gap-1.5 bg-red-50 text-terra border border-red-200 hover:bg-red-100 transition-colors px-3 py-1.5 rounded-sm text-xs font-sans font-semibold disabled:opacity-50"
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
