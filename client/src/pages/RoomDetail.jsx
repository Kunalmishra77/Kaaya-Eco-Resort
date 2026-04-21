// d:/kaaya eco resort/client/src/pages/RoomDetail.jsx
import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import { Users, Bed, Check, ArrowLeft, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import Lightbox from 'yet-another-react-lightbox'

import { fetchRoomById, clearSelectedRoom } from '../store/slices/roomSlice.js'
import { setSelectedRoom } from '../store/slices/bookingSlice.js'
import { formatPrice, ROOM_TYPE_LABELS } from '../utils/helpers.js'
import Spinner from '../components/common/Spinner.jsx'
import SectionReveal from '../components/common/SectionReveal.jsx'
import MobileBookingBar from '../components/booking/MobileBookingBar.jsx'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'yet-another-react-lightbox/styles.css'

export default function RoomDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { selectedRoom: room, loading, error } = useSelector((s) => s.rooms)
  const [lightboxOpen, setLightboxOpen]   = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  useEffect(() => {
    dispatch(fetchRoomById(id))
    return () => { dispatch(clearSelectedRoom()) }
  }, [id, dispatch])

  const handleBookNow = () => {
    dispatch(setSelectedRoom(room.id))
    navigate('/book')
  }

  const slides = (room?.images || []).map((url) => ({ src: url }))

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !room) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone gap-4">
        <p className="font-sans text-terra text-base">Room not found.</p>
        <Link to="/accommodation" className="btn-primary">Back to Accommodation</Link>
      </div>
    )
  }

  return (
    <div className="pb-20 lg:pb-0">
      {/* Image gallery / hero */}
      <div className="relative h-[45vh] sm:h-[60vh] min-h-[280px] sm:min-h-[400px] bg-forest">
        {room.images?.length > 0 ? (
          <>
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              navigation={{ prevEl: '.swiper-btn-prev', nextEl: '.swiper-btn-next' }}
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000, disableOnInteraction: true }}
              className="h-full w-full"
            >
              {room.images.map((img, i) => (
                <SwiperSlide key={i}>
                  <button
                    onClick={() => { setLightboxIndex(i); setLightboxOpen(true) }}
                    className="w-full h-full cursor-zoom-in"
                    aria-label={`View image ${i + 1} fullscreen`}
                  >
                    <img src={img} alt={`${room.name} view ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>
            {/* Custom nav buttons */}
            <button className="swiper-btn-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors" aria-label="Previous image">
              <ChevronLeft size={20} className="text-timber" />
            </button>
            <button className="swiper-btn-next absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors" aria-label="Next image">
              <ChevronRight size={20} className="text-timber" />
            </button>
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-forest to-olive flex items-end p-8">
            <div>
              <span className="badge bg-sand/90 text-timber mb-3">{ROOM_TYPE_LABELS[room.type]}</span>
              <h1 className="font-display text-stone text-4xl sm:text-5xl font-semibold text-shadow-md">{room.name}</h1>
            </div>
          </div>
        )}

        {/* Back link */}
        <Link
          to="/accommodation"
          className="absolute top-6 left-4 sm:left-6 z-10 flex items-center gap-2 bg-black/30 backdrop-blur-sm text-stone hover:bg-black/50 transition-colors px-4 py-2 rounded-sm font-sans text-sm"
        >
          <ArrowLeft size={15} /> All Rooms
        </Link>

        {/* Overlay on no-image */}
        {room.images?.length === 0 && <div className="absolute inset-0 overlay-dark" />}
      </div>

      {/* Lightbox */}
      {slides.length > 0 && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={slides}
          index={lightboxIndex}
        />
      )}

      {/* Main content */}
      <section className="page-section bg-stone">
        <div className="container-lg">
          <div className="grid lg:grid-cols-3 gap-8 sm:gap-12 lg:gap-16">
            {/* Left — details */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="badge bg-forest/10 text-forest mb-4">
                  {ROOM_TYPE_LABELS[room.type]}
                </span>
                <h1 className="font-display text-timber text-4xl sm:text-5xl font-semibold leading-tight mb-6">
                  {room.name}
                </h1>

                {/* Quick stats */}
                <div className="flex flex-wrap gap-5 mb-8">
                  <span className="flex items-center gap-2 font-sans text-sm text-timber/70">
                    <Users size={16} className="text-sage" /> Up to {room.maxAdults} adults
                  </span>
                  <span className="flex items-center gap-2 font-sans text-sm text-timber/70">
                    <Bed size={16} className="text-sage" /> {room.bedCount} {room.bedCount === 1 ? 'bed' : 'beds'}
                  </span>
                  {room.maxChildren > 0 && (
                    <span className="flex items-center gap-2 font-sans text-sm text-timber/70">
                      + {room.maxChildren} children
                    </span>
                  )}
                </div>

                {/* Long description */}
                {room.longDescription ? (
                  <div className="prose-resort mb-10 space-y-4">
                    {room.longDescription.split('\n\n').map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                ) : (
                  <p className="prose-resort mb-10">{room.description}</p>
                )}

                {/* Amenities */}
                {room.amenities?.length > 0 && (
                  <SectionReveal>
                    <h2 className="font-display text-timber text-2xl font-semibold mb-6">
                      Room Amenities
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {room.amenities.map((amenity) => (
                        <div key={amenity} className="flex items-center gap-3 bg-white rounded-sm px-4 py-3 border border-sage/20">
                          <Check size={15} className="text-olive flex-shrink-0" />
                          <span className="font-sans text-sm text-timber">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </SectionReveal>
                )}
              </motion.div>
            </div>

            {/* Right — booking panel */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <SectionReveal direction="right" delay={0.1}>
                  <div className="bg-white border border-sage/20 rounded-sm p-6 shadow-sm">
                    <div className="mb-6">
                      <p className="font-sans text-xs text-timber/40 uppercase tracking-wider mb-1">Nightly rate from</p>
                      <p className="font-display text-forest text-3xl font-semibold">
                        {formatPrice(room.pricePerNight)}
                        <span className="font-sans text-sm text-timber/40 font-normal ml-1">/night</span>
                      </p>
                    </div>

                    <div className="space-y-3 mb-6 text-sm font-sans text-timber/70">
                      <div className="flex justify-between">
                        <span>Max guests</span>
                        <span className="font-medium text-timber">{room.maxAdults} adults{room.maxChildren > 0 ? ` + ${room.maxChildren} children` : ''}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Beds</span>
                        <span className="font-medium text-timber">{room.bedCount} {room.bedCount === 1 ? 'bed' : 'beds'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Room type</span>
                        <span className="font-medium text-timber">{ROOM_TYPE_LABELS[room.type]}</span>
                      </div>
                    </div>

                    <button onClick={handleBookNow} className="btn-primary w-full justify-center gap-2 mb-3">
                      <CalendarDays size={16} /> Book This Room
                    </button>
                    <Link to="/contact" className="btn-outline w-full justify-center text-center block">
                      Ask a Question
                    </Link>

                    <p className="font-sans text-xs text-timber/40 text-center mt-4">
                      Best rate guaranteed when booking direct
                    </p>
                  </div>
                </SectionReveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MobileBookingBar />
    </div>
  )
}
