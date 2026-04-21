// d:/kaaya eco resort/client/src/components/common/RoomCard.jsx
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, Bed, ArrowRight } from 'lucide-react'
import { formatPrice, ROOM_TYPE_LABELS } from '../../utils/helpers.js'

export default function RoomCard({ room, delay = 0 }) {
  const heroImage = room.images?.[0] || null

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className="group bg-white rounded-sm overflow-hidden border border-sage/20 card-hover flex flex-col"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-room">
        {heroImage ? (
          <img
            src={heroImage}
            alt={room.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-sage/10 flex items-center justify-center">
            <span className="font-sans text-sage/40 text-sm">No image</span>
          </div>
        )}

        {/* Type badge */}
        <div className="absolute top-4 left-4">
          <span className="badge bg-forest/80 text-stone backdrop-blur-sm text-[10px] tracking-wider">
            {ROOM_TYPE_LABELS[room.type] || room.type}
          </span>
        </div>

        {/* Price overlay on hover */}
        <div className="absolute inset-0 bg-forest/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-5">
          <Link
            to={`/accommodation/${room.slug || room.id}`}
            className="btn-primary py-2.5 px-5 text-xs w-full justify-center"
          >
            View Room <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-display text-timber text-xl font-semibold leading-snug mb-3 group-hover:text-forest transition-colors">
          {room.name}
        </h3>

        {/* Meta */}
        <div className="flex items-center gap-4 mb-3">
          <span className="flex items-center gap-1.5 font-sans text-xs text-timber/50">
            <Users size={13} /> {room.maxAdults} adults
          </span>
          <span className="flex items-center gap-1.5 font-sans text-xs text-timber/50">
            <Bed size={13} /> {room.bedCount} {room.bedCount === 1 ? 'bed' : 'beds'}
          </span>
        </div>

        {/* Description */}
        <p className="font-sans text-sm text-timber/60 leading-relaxed flex-1 mb-5 line-clamp-2">
          {room.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-sage/20">
          <div>
            <p className="font-sans text-xs text-timber/40 uppercase tracking-wider">From</p>
            <p className="font-display text-forest text-xl font-semibold">
              {formatPrice(room.pricePerNight)}
              <span className="font-sans text-xs text-timber/40 font-normal ml-1">/night</span>
            </p>
          </div>
          <Link
            to={`/accommodation/${room.slug || room.id}`}
            className="inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-sand hover:text-timber transition-colors"
            aria-label={`View details for ${room.name}`}
          >
            Details <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </motion.article>
  )
}
