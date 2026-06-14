// d:/kaaya eco resort/client/src/pages/Accommodation.jsx
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRooms } from '../store/slices/roomSlice.js'
import PageHero from '../components/common/PageHero.jsx'
import RoomCard from '../components/common/RoomCard.jsx'
import SectionReveal from '../components/common/SectionReveal.jsx'
import Spinner from '../components/common/Spinner.jsx'
import MobileBookingBar from '../components/booking/MobileBookingBar.jsx'
import { ROOM_TYPE_LABELS } from '../utils/helpers.js'

const FILTERS = [
  { key: 'all',             label: 'All Rooms'       },
  { key: 'FAMILY_ROOM',     label: 'Family Rooms'    },
  { key: 'FAMILY_CHALET',   label: 'Family Chalet'   },
  { key: 'STANDARD_CHALET', label: 'Standard Chalets'},
]

const STATIC_ROOMS = [
  {
    id: 'family-bungalow-1',
    slug: 'family-bungalow-room-1',
    name: 'Family Bungalow Room 1 – Lake View',
    type: 'FAMILY_ROOM',
    maxAdults: 6,
    bedCount: 3,
    pricePerNight: 17500,
    featured: true,
    description: 'Spacious family room with 3 beds and stunning Lake View. Air conditioned with attached bathroom. Accommodates up to 6 adults.',
    images: ['/images/family-bungalow-exterior.jpg'],
  },
  {
    id: 'family-bungalow-2',
    slug: 'family-bungalow-room-2',
    name: 'Family Bungalow Room 2 – Lake View',
    type: 'FAMILY_ROOM',
    maxAdults: 6,
    bedCount: 3,
    pricePerNight: 17500,
    featured: true,
    description: 'Spacious family room with 3 beds and stunning Lake View. Air conditioned with attached bathroom. Accommodates up to 6 adults.',
    images: ['/images/family-bungalow-interior.jpg'],
  },
  {
    id: 'family-chalet-jacuzzi',
    slug: 'family-chalet-jacuzzi',
    name: 'Family Chalet with Jacuzzi – Lake View',
    type: 'FAMILY_CHALET',
    maxAdults: 4,
    bedCount: 2,
    pricePerNight: 17500,
    featured: true,
    description: 'Private chalet with Jacuzzi and beautiful Lake View. Two beds, air conditioned with attached bathroom. Perfect for couples or small families.',
    images: ['/images/jacuzzi-chalet.jpg'],
  },
  {
    id: 'standard-chalet-1',
    slug: 'standard-chalet-1',
    name: 'Standard Chalet 1',
    type: 'STANDARD_CHALET',
    maxAdults: 2,
    bedCount: 1,
    pricePerNight: 9500,
    featured: false,
    description: 'Cosy standard chalet for 2 adults. Air conditioned with attached bathroom. Simple, comfortable, and surrounded by nature.',
    images: ['/images/chalet-jungle-exterior.jpg'],
  },
  {
    id: 'standard-chalet-2',
    slug: 'standard-chalet-2',
    name: 'Standard Chalet 2',
    type: 'STANDARD_CHALET',
    maxAdults: 2,
    bedCount: 1,
    pricePerNight: 9500,
    featured: false,
    description: 'Cosy standard chalet for 2 adults. Air conditioned with attached bathroom. Simple, comfortable, and surrounded by nature.',
    images: ['/images/chalet-sunset.jpg'],
  },
  {
    id: 'standard-chalet-3',
    slug: 'standard-chalet-3',
    name: 'Standard Chalet 3',
    type: 'STANDARD_CHALET',
    maxAdults: 2,
    bedCount: 1,
    pricePerNight: 9500,
    featured: false,
    description: 'Cosy standard chalet for 2 adults. Air conditioned with attached bathroom. Simple, comfortable, and surrounded by nature.',
    images: ['/images/chalet-jungle-exterior.jpg'],
  },
  {
    id: 'standard-chalet-4',
    slug: 'standard-chalet-4',
    name: 'Standard Chalet 4',
    type: 'STANDARD_CHALET',
    maxAdults: 2,
    bedCount: 1,
    pricePerNight: 9500,
    featured: false,
    description: 'Cosy standard chalet for 2 adults. Air conditioned with attached bathroom. Simple, comfortable, and surrounded by nature.',
    images: ['/images/chalet-sunset.jpg'],
  },
]

export default function Accommodation() {
  const dispatch = useDispatch()
  const { rooms: apiRooms, loading, error } = useSelector((s) => s.rooms)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    dispatch(fetchRooms())
  }, [dispatch])

  const rooms = (apiRooms && apiRooms.length > 0) ? apiRooms : STATIC_ROOMS
  const filtered = filter === 'all' ? rooms : rooms.filter((r) => r.type === filter)

  return (
    <div className="pb-20 lg:pb-0">
      <PageHero
        label="Where You'll Stay"
        title="Accommodation"
        subtitle="Seven distinctive rooms and chalets — each a different expression of wilderness luxury."
        image="/images/jacuzzi-chalet.jpg"
        objectPosition="center 50%"
        height="h-[50vh] sm:h-[72vh] min-h-[320px] sm:min-h-[460px]"
      />

      <section className="page-section bg-stone">
        <div className="container-lg">

          {/* Filter tabs */}
          <SectionReveal className="flex flex-wrap gap-2 mb-12 justify-center">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={[
                  'font-sans text-sm font-medium px-5 py-2.5 rounded-sm border transition-all duration-200',
                  filter === f.key
                    ? 'bg-forest border-forest text-stone'
                    : 'border-sage/40 text-timber hover:border-forest hover:text-forest bg-white',
                ].join(' ')}
              >
                {f.label}
              </button>
            ))}
          </SectionReveal>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-20">
              <Spinner size="lg" />
            </div>
          )}

          {/* Rooms grid */}
          {!loading && (
            <>
              {filtered.length === 0 ? (
                <div className="text-center py-16">
                  <p className="font-sans text-timber/50 text-base">
                    No {filter !== 'all' ? ROOM_TYPE_LABELS[filter] : 'rooms'} found.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map((room, i) => (
                    <RoomCard key={room.id} room={room} delay={i * 0.07} />
                  ))}
                </div>
              )}
            </>
          )}

          {/* Shared amenities callout */}
          {!loading && (
            <SectionReveal delay={0.3} className="mt-20 bg-forest rounded-sm p-8 md:p-12 text-center">
              <p className="section-label text-sand/80 mb-4">All Accommodation Includes</p>
              <h3 className="font-display text-stone text-2xl sm:text-3xl font-semibold mb-6">
                Shared Resort Facilities
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-stone/70">
                {[
                  'Outdoor Pool',
                  'Jacuzzi',
                  'BBQ Area',
                  'Tropical Garden',
                  'Boat Ride',
                  'Lake Front',
                ].map((amenity) => (
                  <div key={amenity} className="font-sans text-sm text-center">
                    <div className="w-10 h-10 rounded-full bg-stone/10 flex items-center justify-center mx-auto mb-2">
                      <span className="text-sand text-lg">✓</span>
                    </div>
                    {amenity}
                  </div>
                ))}
              </div>
            </SectionReveal>
          )}
        </div>
      </section>

      <MobileBookingBar />
    </div>
  )
}
