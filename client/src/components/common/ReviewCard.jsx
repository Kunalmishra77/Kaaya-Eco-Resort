// d:/kaaya eco resort/client/src/components/common/ReviewCard.jsx
import { formatDate } from '../../utils/helpers.js'
import StarRating from './StarRating.jsx'

export default function ReviewCard({ review, className = '' }) {
  const initials = review.user
    ? `${review.user.firstName?.[0] ?? ''}${review.user.lastName?.[0] ?? ''}`.toUpperCase()
    : '?'

  return (
    <div className={`bg-white border border-sage/20 rounded-sm p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-forest text-stone flex items-center justify-center font-sans font-semibold text-sm flex-shrink-0">
            {initials}
          </div>
          <div>
            <p className="font-sans font-semibold text-timber text-sm">
              {review.user ? `${review.user.firstName} ${review.user.lastName}` : 'Guest'}
            </p>
            <p className="font-sans text-xs text-timber/40">{formatDate(review.createdAt)}</p>
          </div>
        </div>
        <StarRating value={review.rating} size={14} />
      </div>

      {/* Title */}
      {review.title && (
        <p className="font-display text-timber font-semibold text-base mb-2 leading-snug">
          "{review.title}"
        </p>
      )}

      {/* Comment */}
      <p className="font-sans text-timber/70 text-sm leading-relaxed">{review.comment}</p>
    </div>
  )
}
