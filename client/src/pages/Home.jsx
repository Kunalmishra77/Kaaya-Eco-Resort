// d:/kaaya eco resort/client/src/pages/Home.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Telescope, Waves, Bird, Star, Users, TreePine } from 'lucide-react'

import { fetchRooms } from '../store/slices/roomSlice.js'
import HeroBookingBar from '../components/booking/HeroBookingBar.jsx'
import MobileBookingBar from '../components/booking/MobileBookingBar.jsx'
import RoomCard from '../components/common/RoomCard.jsx'
import SectionReveal from '../components/common/SectionReveal.jsx'
import Spinner from '../components/common/Spinner.jsx'

const EXPERIENCES = [
  {
    icon:  Telescope,
    title: 'Yala Safari',
    image: '/images/lake-sunset-tree.jpg',
    desc:  "Track leopards, elephants, and crocodiles through one of Asia's most bio-diverse national parks. Morning and afternoon game drives.",
  },
  {
    icon:  Waves,
    title: 'Yoda Wewa Lake',
    image: '/images/garden-swing.jpg',
    desc:  'Sunrise boat rides, fishing, and bird watching on the ancient reservoir that borders our property.',
  },
  {
    icon:  Bird,
    title: 'Bird Watching',
    image: '/images/lakeside-dining.jpg',
    desc:  'Over 200 species recorded in the area including endemic Sri Lankan species. Hambantota Bird Park is nearby.',
  },
  {
    icon:  Star,
    title: 'Cultural Tours',
    image: '/images/garden-buddha.jpg',
    desc:  'Kataragama Devalaya, Kirinda Temple, Tissamaharama, and the ancient Sithulpawwa Monastery inside Yala.',
  },
  {
    icon:  Users,
    title: 'Family Activities',
    image: '/images/pool-garden.jpg',
    desc:  'Badminton court, kids play area, BBQ nights, and swimming pool. Memories the whole family will treasure.',
  },
  {
    icon:  TreePine,
    title: 'Private Resort Hire',
    image: '/images/resort-courtyard.jpg',
    desc:  'Book the entire resort exclusively for your family reunion, wedding, or corporate retreat.',
  },
]

const HERO_SLIDES = [
  { src: '/images/chalet-sunset.jpg',    pos: 'center 45%' },
  { src: '/images/lake-dusk.jpg',        pos: 'center 55%' },
  { src: '/images/pool-trees.jpg',       pos: 'center 50%' },
  { src: '/images/lake-sunset-tree.jpg', pos: 'center 68%' },
]

const STATS = [
  { value: '7',    label: 'Unique Rooms' },
  { value: '24+',  label: 'Guests Capacity' },
  { value: '200+', label: 'Bird Species Nearby' },
  { value: '5★',   label: 'Guest Rating' },
]

export default function Home() {
  const dispatch = useDispatch()
  const { rooms, loading } = useSelector((s) => s.rooms)
  const [heroIdx, setHeroIdx] = useState(0)

  useEffect(() => {
    dispatch(fetchRooms())
  }, [dispatch])

  useEffect(() => {
    const t = setInterval(() => setHeroIdx((i) => (i + 1) % HERO_SLIDES.length), 7000)
    return () => clearInterval(t)
  }, [])

  const featuredRooms = rooms.filter((r) => r.featured).slice(0, 3)

  return (
    <div className="pb-20 lg:pb-0">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative h-screen min-h-[600px] max-h-[900px] flex flex-col">
        {/* Cinematic Ken Burns image background */}
        <div className="absolute inset-0 overflow-hidden">
          <AnimatePresence>
            <motion.div
              key={heroIdx}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8, ease: 'easeInOut' }}
            >
              <div
                className={`w-full h-full bg-cover bg-no-repeat kenburns-${heroIdx}`}
                style={{
                  backgroundImage:    `url(${HERO_SLIDES[heroIdx].src})`,
                  backgroundPosition: HERO_SLIDES[heroIdx].pos,
                }}
              />
            </motion.div>
          </AnimatePresence>
          {/* Overlay */}
          <div className="absolute inset-0"
               style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.08) 45%, rgba(15,40,25,0.65) 100%)' }} />
        </div>

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8">
          <div className="container-lg">
            <motion.div
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-3xl"
            >
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="section-label text-sand mb-5"
              >
                Yala · Sri Lanka
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="font-display text-white text-4xl sm:text-5xl lg:text-7xl font-semibold leading-none"
              style={{ textShadow: '0 2px 24px rgba(0,0,0,0.75), 0 1px 5px rgba(0,0,0,0.95)' }}
              >
                Your Gateway to<br />
                <span className="text-sand italic">Yala's Wild Heart</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.6 }}
                className="font-sans text-white/90 text-lg sm:text-xl mt-6 max-w-xl leading-relaxed"
                style={{ textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}
              >
                Nature's embrace by Yoda Wewa — where luxury eco-living meets the untamed beauty of Yala National Park.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex flex-wrap gap-3 sm:gap-4 mt-8 sm:mt-10"
              >
                <Link to="/book" className="btn-primary">
                  Book a Stay <ArrowRight size={16} />
                </Link>
                <Link to="/accommodation" className="btn-outline-white">
                  Explore Rooms
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-28 md:bottom-36 right-8 z-20 flex flex-col gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroIdx(i)}
              className={`w-1 rounded-full transition-all duration-500 ${i === heroIdx ? 'h-8 bg-sand' : 'h-2 bg-white/40 hover:bg-white/70'}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Booking bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.0 }}
          className="relative z-10 px-4 sm:px-6 lg:px-8 pb-12 hidden md:block"
        >
          <div className="container-lg">
            <HeroBookingBar />
          </div>
        </motion.div>
      </section>

      {/* ── Stats strip ──────────────────────────────────────────────────── */}
      <section className="bg-forest">
        <div className="container-lg px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {STATS.map((stat, i) => (
              <SectionReveal key={stat.label} delay={i * 0.08} direction="up">
                <div className="text-center">
                  <p className="font-display text-sand text-4xl font-semibold">{stat.value}</p>
                  <p className="font-sans text-stone/60 text-sm mt-1 uppercase tracking-wider">{stat.label}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── About intro ───────────────────────────────────────────────────── */}
      <section className="page-section bg-stone">
        <div className="container-lg">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <SectionReveal direction="left">
              <p className="section-label mb-4">About Kaaya</p>
              <h2 className="section-heading mb-6">
                Nature's Embrace by<br />Yoda Wewa
              </h2>
              <p className="prose-resort mb-5">
                Nestled on the shores of Yoda Wewa — an ancient irrigation reservoir that has sustained Sri Lanka's southern wildlife for centuries — Kaaya Eco Resort is your perfect launchpad for Yala National Park adventures.
              </p>
              <p className="prose-resort mb-8">
                Our seven unique accommodations, from lake-view family rooms to a private chalet with Jacuzzi, are designed with a single philosophy: luxury that honours the land. Timber, stone, and handcrafted local materials bring warmth without artifice.
              </p>
              <Link to="/about" className="btn-primary">
                Our Story <ArrowRight size={16} />
              </Link>
            </SectionReveal>

            <SectionReveal direction="right" delay={0.15}>
              <div className="grid grid-cols-2 gap-3 h-[280px] sm:h-[380px] lg:h-[480px]">
                {/* Tall left image — lake sunset tree */}
                <div className="row-span-2 rounded-sm overflow-hidden">
                  <img
                    src="/images/lake-sunset-tree.jpg"
                    alt="Yoda Wewa at sunrise"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                {/* Top right — garden Buddha */}
                <div className="rounded-sm overflow-hidden">
                  <img
                    src="/images/garden-buddha.jpg"
                    alt="Peaceful resort gardens"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                {/* Bottom right — lakeside dining */}
                <div className="rounded-sm overflow-hidden">
                  <img
                    src="/images/lakeside-dining.jpg"
                    alt="Lakeside dining at sunset"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* ── Featured rooms ────────────────────────────────────────────────── */}
      <section className="page-section bg-white">
        <div className="container-lg">
          <SectionReveal className="text-center mb-8 sm:mb-14">
            <p className="section-label mb-4">Accommodation</p>
            <h2 className="section-heading">Stay With Us</h2>
            <p className="font-sans text-timber/60 text-lg mt-4 max-w-xl mx-auto">
              Seven distinct rooms and chalets — each a unique expression of rustic luxury at the edge of the wild.
            </p>
          </SectionReveal>

          {loading ? (
            <div className="flex justify-center py-16">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {(featuredRooms.length > 0 ? featuredRooms : PLACEHOLDER_ROOMS).map((room, i) => (
                  <RoomCard key={room.id} room={room} delay={i * 0.1} />
                ))}
              </div>
              <div className="text-center">
                <Link to="/accommodation" className="btn-outline">
                  View All Rooms <ArrowRight size={16} />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── Experiences ───────────────────────────────────────────────────── */}
      <section className="page-section bg-stone">
        <div className="container-lg">
          <SectionReveal className="text-center mb-8 sm:mb-14">
            <p className="section-label mb-4">Experiences</p>
            <h2 className="section-heading">Adventures Await</h2>
            <p className="font-sans text-timber/60 text-lg mt-4 max-w-xl mx-auto">
              From leopard safaris at dawn to moonlit Jacuzzi evenings — every day at Kaaya writes a story worth telling.
            </p>
          </SectionReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {EXPERIENCES.map((exp, i) => (
              <SectionReveal key={exp.title} delay={i * 0.07} direction="up">
                <div className="bg-white rounded-sm overflow-hidden border border-sage/20 card-hover group h-full flex flex-col">
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={exp.image}
                      alt={exp.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-forest/30 group-hover:bg-forest/10 transition-colors duration-500" />
                  </div>
                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="w-10 h-10 rounded-full bg-forest/10 flex items-center justify-center mb-4 group-hover:bg-forest transition-colors duration-300">
                      <exp.icon size={20} className="text-forest group-hover:text-stone transition-colors duration-300" />
                    </div>
                    <h3 className="font-display text-timber text-xl font-semibold mb-2">{exp.title}</h3>
                    <p className="font-sans text-timber/60 text-sm leading-relaxed flex-1">{exp.desc}</p>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/experiences" className="btn-primary">
              Discover All Experiences <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Pool / Amenities highlight ─────────────────────────────────────── */}
      <section className="relative h-[50vh] sm:h-[60vh] min-h-[280px] sm:min-h-[400px] overflow-hidden">
        <img
          src="/images/pool-trees.jpg"
          alt="Resort swimming pool"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-forest/60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <SectionReveal className="text-center px-4">
            <p className="section-label text-sand/80 mb-4">On-site Facilities</p>
            <h2 className="font-display text-stone text-3xl sm:text-4xl md:text-5xl font-semibold mb-5 sm:mb-6 max-w-2xl mx-auto leading-tight">
              A Pool Beneath the Palms
            </h2>
            <p className="font-sans text-stone/70 text-lg mb-8 max-w-md mx-auto">
              Surrounded by flowering tropical gardens, our pool is the perfect retreat after a morning safari.
            </p>
            <Link to="/experiences" className="btn-primary">
              Explore Amenities <ArrowRight size={16} />
            </Link>
          </SectionReveal>
        </div>
      </section>

      {/* ── Reviews ───────────────────────────────────────────────────────── */}
      <GuestReviews />

      {/* ── CTA banner ────────────────────────────────────────────────────── */}
      <section className="relative py-16 sm:py-24 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/lake-dusk.jpg"
            alt="Yoda Wewa at dusk"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-forest/75" />
        </div>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #C8A96E 0%, transparent 70%)' }} />

        <div className="relative z-10 container-lg px-4 sm:px-6 lg:px-8 text-center">
          <SectionReveal>
            <p className="section-label text-sand/80 mb-4">Your Wild Heart Awaits</p>
            <h2 className="font-display text-stone text-3xl sm:text-4xl md:text-5xl font-semibold mb-5 sm:mb-6 max-w-2xl mx-auto leading-tight">
              Ready for Your Yala Adventure?
            </h2>
            <p className="font-sans text-stone/65 text-lg mb-10 max-w-md mx-auto leading-relaxed">
              Limited rooms available. Book directly for the best rates and a personalised safari experience.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/book" className="btn-primary">
                Reserve Your Room <ArrowRight size={16} />
              </Link>
              <Link to="/contact" className="btn-outline-white">
                Ask a Question
              </Link>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Mobile sticky booking bar */}
      <MobileBookingBar />
    </div>
  )
}

function GuestReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    import('../utils/api.js').then(({ default: api }) => {
      api.get('/reviews')
        .then(({ data }) => setReviews(data.reviews || []))
        .catch(() => setReviews(FALLBACK_REVIEWS))
        .finally(() => setLoading(false))
    })
  }, [])

  if (loading || reviews.length === 0) return null

  // Duplicate for seamless infinite loop
  const items = [...reviews, ...reviews]

  return (
    <section className="page-section bg-white overflow-hidden">
      <div className="container-lg mb-12">
        <SectionReveal className="text-center mb-8 sm:mb-14">
          <p className="section-label mb-4">Guest Reviews</p>
          <h2 className="section-heading">What Our Guests Say</h2>
        </SectionReveal>
      </div>

      {/* Edge fades */}
      <div className="relative">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-white to-transparent" />

        <div className="testimonial-track">
          {items.map((review, i) => {
            const initials = review.user
              ? `${review.user.firstName?.[0] ?? ''}${review.user.lastName?.[0] ?? ''}`.toUpperCase()
              : '?'
            return (
              <div key={i} className="flex-shrink-0 w-80 mx-3">
                <div className="bg-stone border border-sage/20 rounded-sm p-6 h-full">
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(review.rating || 5)].map((_, s) => (
                      <Star key={s} size={13} className="fill-sand text-sand" />
                    ))}
                  </div>
                  {review.title && (
                    <p className="font-display text-timber font-semibold text-base mb-2 leading-snug">
                      "{review.title}"
                    </p>
                  )}
                  <p className="font-sans text-timber/65 text-sm leading-relaxed mb-5">
                    {review.comment}
                  </p>
                  <div className="flex items-center gap-2.5 mt-auto">
                    <div className="w-9 h-9 rounded-full bg-forest text-stone flex items-center justify-center font-sans font-semibold text-xs flex-shrink-0">
                      {initials}
                    </div>
                    <div>
                      <p className="font-sans font-semibold text-timber text-sm">
                        {review.user ? `${review.user.firstName} ${review.user.lastName}` : 'Guest'}
                      </p>
                      <p className="font-sans text-timber/40 text-xs">Verified Stay</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

const PLACEHOLDER_ROOMS = [
  { id: '1', name: 'Family Room – Lake View',    slug: 'family-room-lake-view',   type: 'FAMILY_ROOM',   pricePerNight: 34500, maxAdults: 6, bedCount: 3, description: 'Breathtaking sunrise views over Yoda Wewa lake.', images: ['/images/family-room-interior-b.jpg'] },
  { id: '2', name: 'Family Chalet with Jacuzzi', slug: 'family-chalet-jacuzzi',   type: 'FAMILY_CHALET', pricePerNight: 52000, maxAdults: 4, bedCount: 2, description: 'Private chalet with outdoor Jacuzzi for ultimate luxury.', images: ['/images/jacuzzi-chalet.jpg'] },
  { id: '3', name: 'Family Room – Garden View',  slug: 'family-room-garden-view', type: 'FAMILY_ROOM',   pricePerNight: 28500, maxAdults: 6, bedCount: 3, description: 'Spacious family room overlooking tropical gardens.', images: ['/images/family-room-interior-a.jpg'] },
]

const FALLBACK_REVIEWS = [
  { id: '1', rating: 5, title: 'Best safari base camp in Yala', comment: 'We stayed in the Lake View Family Room and it was absolutely stunning. Woke up to elephants by the lake every morning.', createdAt: new Date().toISOString(), user: { firstName: 'Sarah', lastName: 'M.' } },
  { id: '2', rating: 5, title: 'The Jacuzzi chalet is a dream', comment: 'Celebrated our anniversary in the Family Chalet. The outdoor Jacuzzi under the stars was unforgettable.', createdAt: new Date().toISOString(), user: { firstName: 'James', lastName: 'T.' } },
  { id: '3', rating: 5, title: 'Perfect family holiday', comment: 'Brought our three kids for a week. The kids loved the safari, the pool, and the badminton court.', createdAt: new Date().toISOString(), user: { firstName: 'Priya', lastName: 'R.' } },
]
