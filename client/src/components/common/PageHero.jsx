// d:/kaaya eco resort/client/src/components/common/PageHero.jsx
import { motion } from 'framer-motion'

export default function PageHero({
  title,
  subtitle,
  label,
  image,
  objectPosition = 'center',
  height = 'h-[55vh] min-h-[380px]',
  align = 'center',
  overlay = 'overlay-page-hero',
  children,
}) {
  const alignClasses = {
    center: 'items-center text-center',
    left:   'items-start text-left',
    right:  'items-end text-right',
  }

  return (
    <section className={`relative ${height} flex flex-col`}>
      {/* Background */}
      {image ? (
        <div className="absolute inset-0">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            style={{ objectPosition }}
          />
          <div className={`absolute inset-0 ${overlay}`} />
        </div>
      ) : (
        <div className="absolute inset-0 bg-forest" />
      )}

      {/* Content — centred both axes on all inner pages */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 py-16">
        <div className="container-lg w-full flex flex-col items-center">
          <motion.div
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {label && (
              <p className="section-label text-sand mb-4 drop-shadow-md">{label}</p>
            )}
            <h1 className="font-display text-white text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight max-w-3xl"
                style={{ textShadow: '0 2px 20px rgba(0,0,0,0.7), 0 1px 4px rgba(0,0,0,0.9)' }}>
              {title}
            </h1>
            {subtitle && (
              <p className="font-sans text-white/90 text-lg sm:text-xl mt-5 max-w-2xl leading-relaxed"
                 style={{ textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}>
                {subtitle}
              </p>
            )}
            {children && (
              <div className="mt-6">{children}</div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Decorative bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-stone to-transparent z-10" />
    </section>
  )
}
