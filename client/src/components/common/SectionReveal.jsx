// d:/kaaya eco resort/client/src/components/common/SectionReveal.jsx
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

/**
 * Wraps children in a scroll-triggered reveal animation.
 * direction: 'up' | 'down' | 'left' | 'right' | 'none'
 */
export default function SectionReveal({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  duration = 0.6,
  once = true,
  threshold = 0.15,
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, amount: threshold })

  const offsets = {
    up:    { y: 32,  x: 0   },
    down:  { y: -32, x: 0   },
    left:  { y: 0,   x: -32 },
    right: { y: 0,   x: 32  },
    none:  { y: 0,   x: 0   },
  }

  const initial = { opacity: 0, ...offsets[direction] }
  const animate = isInView
    ? { opacity: 1, x: 0, y: 0 }
    : initial

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={initial}
      animate={animate}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
