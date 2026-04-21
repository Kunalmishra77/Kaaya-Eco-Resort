// d:/kaaya eco resort/client/src/components/common/StarRating.jsx
import { Star } from 'lucide-react'

/**
 * Read-only star rating display.
 * interactive mode allows clicking to set a value.
 */
export default function StarRating({
  value = 0,
  max = 5,
  size = 16,
  interactive = false,
  onChange,
  className = '',
}) {
  const stars = Array.from({ length: max }, (_, i) => i + 1)

  return (
    <div className={`flex items-center gap-0.5 ${className}`} role={interactive ? 'radiogroup' : 'img'} aria-label={`Rating: ${value} out of ${max}`}>
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onChange?.(star)}
          className={[
            'transition-transform duration-100',
            interactive ? 'hover:scale-110 cursor-pointer' : 'cursor-default',
          ].join(' ')}
          aria-label={interactive ? `Rate ${star} star${star > 1 ? 's' : ''}` : undefined}
        >
          <Star
            size={size}
            className={star <= value ? 'text-sand fill-sand' : 'text-sage/40 fill-transparent'}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  )
}
