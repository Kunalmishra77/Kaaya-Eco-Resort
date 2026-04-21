// d:/kaaya eco resort/client/src/components/common/Spinner.jsx
export default function Spinner({ size = 'md', color = 'sand', className = '' }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  }
  const colors = {
    sand:   'border-sand/20 border-t-sand',
    forest: 'border-forest/20 border-t-forest',
    white:  'border-white/20 border-t-white',
  }

  return (
    <div
      className={`rounded-full animate-spin ${sizes[size] || sizes.md} ${colors[color] || colors.sand} ${className}`}
      role="status"
      aria-label="Loading"
      style={{ borderWidth: size === 'lg' ? '3px' : '2px' }}
    />
  )
}
