// d:/kaaya eco resort/client/src/pages/Gallery.jsx
import { useState, useEffect } from 'react'
import Masonry from 'react-masonry-css'
import Lightbox from 'yet-another-react-lightbox'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../utils/api.js'
import PageHero from '../components/common/PageHero.jsx'
import SectionReveal from '../components/common/SectionReveal.jsx'
import Spinner from '../components/common/Spinner.jsx'
import 'yet-another-react-lightbox/styles.css'

const CATEGORIES = [
  { key: 'all',           label: 'All Photos'    },
  { key: 'accommodation', label: 'Accommodation' },
  { key: 'wildlife',      label: 'Wildlife'      },
  { key: 'lake',          label: 'Lake & Nature' },
  { key: 'dining',        label: 'Dining'        },
  { key: 'activities',    label: 'Activities'    },
]

const MASONRY_BREAKPOINTS = {
  default: 3,
  1024:    3,
  768:     2,
  480:     1,
}

const PLACEHOLDER_ITEMS = []

export default function Gallery() {
  const [images,       setImages]       = useState([])
  const [filtered,     setFiltered]     = useState([])
  const [category,     setCategory]     = useState('all')
  const [loading,      setLoading]      = useState(true)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIdx,  setLightboxIdx]  = useState(0)

  useEffect(() => {
    api.get('/gallery')
      .then(({ data }) => {
        const imgs = data.images?.length ? data.images : PLACEHOLDER_ITEMS
        setImages(imgs)
        setFiltered(imgs)
      })
      .catch(() => {
        setImages(PLACEHOLDER_ITEMS)
        setFiltered(PLACEHOLDER_ITEMS)
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    setFiltered(
      category === 'all' ? images : images.filter((img) => img.category === category)
    )
  }, [category, images])

  const openLightbox = (index) => {
    const realImages = filtered.filter((img) => img.url)
    if (realImages.length === 0) return
    setLightboxIdx(index)
    setLightboxOpen(true)
  }

  const slides = filtered.filter((img) => img.url).map((img) => ({
    src: img.url,
    alt: img.caption || 'Kaaya Eco Resort',
  }))

  return (
    <div className="pb-20 lg:pb-0">
      <PageHero
        label="Photo Gallery"
        title="A Glimpse of Kaaya"
        subtitle="The wild, the water, the warmth — captured in a moment."
        image="/images/tropical-garden.jpg"
        objectPosition="center 60%"
        height="h-[45vh] sm:h-[62vh] min-h-[280px] sm:min-h-[400px]"
      />

      <section className="page-section bg-stone">
        <div className="container-lg">
          {/* Category filter */}
          <SectionReveal className="flex flex-wrap gap-2 mb-12 justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                className={[
                  'font-sans text-sm font-medium px-5 py-2.5 rounded-sm border transition-all duration-200',
                  category === cat.key
                    ? 'bg-forest border-forest text-stone'
                    : 'border-sage/40 text-timber hover:border-forest hover:text-forest bg-white',
                ].join(' ')}
              >
                {cat.label}
              </button>
            ))}
          </SectionReveal>

          {loading ? (
            <div className="flex justify-center py-20">
              <Spinner size="lg" />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={category}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {filtered.length === 0 ? (
                  <div className="text-center py-24">
                    <div className="w-20 h-20 rounded-full bg-forest/10 flex items-center justify-center mx-auto mb-6">
                      <span className="text-4xl">📷</span>
                    </div>
                    <h3 className="font-display text-timber text-2xl font-semibold mb-3">Gallery Coming Soon</h3>
                    <p className="font-sans text-timber/50 text-base max-w-sm mx-auto leading-relaxed">
                      We're putting together our photo collection. New pictures of the resort, wildlife, and lake views are on their way. Check back soon!
                    </p>
                  </div>
                ) : (
                  <Masonry
                    breakpointCols={MASONRY_BREAKPOINTS}
                    className="flex gap-4 -ml-4"
                    columnClassName="pl-4 bg-clip-padding"
                  >
                    {filtered.map((img, i) => (
                      <motion.div
                        key={img.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.4) }}
                        className="mb-4 group cursor-pointer"
                        onClick={() => openLightbox(i)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && openLightbox(i)}
                        aria-label={img.caption || 'Gallery image'}
                      >
                        {img.url ? (
                          <div className="relative overflow-hidden rounded-sm">
                            <img
                              src={img.url}
                              alt={img.caption || 'Kaaya Eco Resort'}
                              className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                              loading="lazy"
                            />
                            {img.caption && (
                              <div className="absolute inset-0 bg-forest/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                <p className="font-sans text-stone text-sm">{img.caption}</p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div
                            className="relative overflow-hidden rounded-sm bg-sage/20 flex items-end p-5"
                            style={{ minHeight: `${180 + (i % 3) * 60}px` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-forest/20 to-olive/10" />
                            {img.caption && (
                              <p className="relative font-display text-timber/40 text-sm italic">{img.caption}</p>
                            )}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </Masonry>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {slides.length > 0 && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={slides}
          index={lightboxIdx}
        />
      )}
    </div>
  )
}
