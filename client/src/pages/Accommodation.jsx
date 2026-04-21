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

export default function Accommodation() {
  const dispatch = useDispatch()
  const { rooms, loading, error } = useSelector((s) => s.rooms)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    dispatch(fetchRooms())
  }, [dispatch])

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

          {/* Error */}
          {!loading && error && (
            <div className="text-center py-16">
              <p className="font-sans text-terra text-base">Unable to load rooms. Please try again.</p>
              <button onClick={() => dispatch(fetchRooms())} className="btn-outline mt-4">
                Retry
              </button>
            </div>
          )}

          {/* Rooms grid */}
          {!loading && !error && (
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
                  'Restaurant & Bar',
                  'BBQ Area',
                  'Tropical Garden',
                  'Outdoor Dining',
                  'Kids Play Area',
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
