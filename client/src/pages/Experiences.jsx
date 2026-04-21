// d:/kaaya eco resort/client/src/pages/Experiences.jsx
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, MapPin } from 'lucide-react'
import PageHero from '../components/common/PageHero.jsx'
import SectionReveal from '../components/common/SectionReveal.jsx'
import MobileBookingBar from '../components/booking/MobileBookingBar.jsx'

const EXPERIENCES = [
  {
    category: 'Wildlife',
    title:    'Yala National Park Safari',
    subtitle: 'Leopards, Elephants & Wild Wonders',
    body:     [
      "Yala National Park is home to the highest density of leopards in the world — and Kaaya's location means you're at the gates before most other guests have finished breakfast.",
      "Morning safaris depart at first light, when predators are most active and the air carries the cool scent of the jungle. Afternoon drives are equally rewarding — herds of elephants gathering at watering holes, crocodiles basking by the banks, and painted storks wheeling overhead.",
      'Our team can arrange fully guided safaris with experienced, licensed Yala naturalists. Vehicles, permits, and entrance fees are all coordinated for you.',
    ],
    highlights: ['Morning & afternoon departures', 'Leopard tracking routes', 'Elephant corridors', 'Crocodile pools', 'Rare bird spotting', 'Guided or self-drive options'],
    image: '/images/lake-sunset-tree.jpg',
  },
  {
    category: 'Nature',
    title:    'Yoda Wewa Lake Experience',
    subtitle: "Sunrise on Sri Lanka's Ancient Reservoir",
    body:     [
      'Yoda Wewa is not just a beautiful backdrop — it is one of Sri Lanka\'s ancient irrigation reservoirs, built over a thousand years ago and still teeming with life. Egrets, kingfishers, painted storks, and the occasional elephant share its shores.',
      'We offer sunrise boat rides across the still water, when mist rises off the surface and the sky turns every shade of gold. Fishing, bird watching from the bank, and gentle evening walks along the water\'s edge are among our most cherished activities.',
    ],
    highlights: ['Sunrise boat rides', 'Freshwater fishing', 'Bank-side bird watching', 'Evening walks', 'Photography sessions', 'Elephant sightings'],
    image: '/images/lakeside-dining.jpg',
  },
  {
    category: 'Culture',
    title:    'Sri Lankan Cultural Immersion',
    subtitle: 'Temples, Pilgrimage Sites & Ancient History',
    body:     [
      "The southern corner of Sri Lanka is rich with cultural sites that complement the wildlife experience beautifully. Just beyond our gates lies a landscape shaped by thousands of years of civilisation.",
      'Kataragama Devalaya, one of the most sacred pilgrimage sites for Buddhists, Hindus, and Muslims alike, is a short drive away. Kirinda Beach and the cliffside Kirinda Temple offer dramatic ocean views. Tissamaharama\'s ancient stupa and the lotus-filled Tissa Wewa lake are unmissable. And within Yala itself, the remarkable Sithulpawwa cave monastery — with its 2,000-year-old rock paintings — rewards those who venture beyond the safari circuit.',
    ],
    highlights: ['Kataragama Devalaya', 'Kirinda Temple & beach', 'Tissamaharama Stupa', 'Tissa Wewa lake', 'Sithulpawwa Monastery', 'Local village tours'],
    image: '/images/garden-buddha.jpg',
  },
  {
    category: 'Nature',
    title:    'Bird Watching',
    subtitle: "Sri Lanka's Feathered Wonders",
    body:     [
      "With over 200 species recorded in and around Yala, this is one of Sri Lanka's premier birding destinations. Yoda Wewa itself is a heron and egret colony, alive with the clatter of nesting storks from November through March.",
      "The nearby Hambantota Bird Park, established on the shores of Bundala lagoon, is a World Heritage Site and one of the best flamingo-watching spots on the island. Our team can arrange guided dawn birding walks that will delight beginners and seasoned twitchers alike.",
    ],
    highlights: ['Yoda Wewa heronry', 'Hambantota Bird Park', 'Endemic Sri Lankan species', 'Painted storks', 'Flamingos at Bundala', 'Dawn birding walks'],
    image: '/images/garden-swing.jpg',
  },
  {
    category: 'On-site',
    title:    'Resort Activities',
    subtitle: 'Family Fun Within Our Gates',
    body:     [
      'Life at Kaaya is never dull, even when you choose to stay close. The swimming pool is a favourite gathering place in the afternoons — cool, serene, surrounded by flowering tropical plants.',
      "The badminton court sees friendly family competitions most evenings. The kids play area keeps younger guests entertained during downtime. And our BBQ nights, held under a canopy of stars with Sri Lankan flavours and live music on request, are an experience in themselves.",
    ],
    highlights: ['Swimming pool', 'Badminton court', 'Kids play area', 'BBQ nights', 'Outdoor dining', 'Picnic area'],
    image: '/images/pool-garden.jpg',
  },
  {
    category: 'Groups',
    title:    'Private Resort Hire',
    subtitle: 'Exclusively Yours',
    body:     [
      'Kaaya Eco Resort can be booked exclusively for families, reunion groups, weddings, and corporate retreats. When you take the whole resort, you get the whole experience — every chalet, every space, every experience, reserved entirely for your group.',
      'Our team will work with you to create a bespoke programme: safari schedules, private BBQ evenings, cultural day trips, and catering menus tailored to your preferences. With a total capacity of around 24 adults, we\'re perfectly sized for large family gatherings or intimate corporate breaks.',
    ],
    highlights: ['Entire resort exclusive', 'Bespoke programme design', 'Private safari schedules', 'Catering & dining packages', 'Group activities', 'Celebrations & events'],
    image: '/images/resort-courtyard.jpg',
  },
]

export default function Experiences() {
  return (
    <div className="pb-20 lg:pb-0">
      <PageHero
        label="Adventures Await"
        title="Experiences"
        subtitle="From leopard safaris at dawn to lake sunsets in the evening — life at Kaaya moves at nature's pace."
        image="/images/lake-sunset-tree.jpg"
        objectPosition="center 68%"
        height="h-[72vh] min-h-[460px]"
      />

      <section className="page-section bg-stone">
        <div className="container-lg space-y-28">
          {EXPERIENCES.map((exp, i) => (
            <SectionReveal key={exp.title} direction={i % 2 === 0 ? 'left' : 'right'} delay={0.05}>
              <div className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                {/* Image block */}
                <div className={`order-1 ${i % 2 !== 0 ? 'lg:order-2' : ''}`}>
                  <div className="relative h-80 rounded-sm overflow-hidden group">
                    <img
                      src={exp.image}
                      alt={exp.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-forest/40" />
                    <div className="absolute bottom-0 left-0 p-6">
                      <span className="badge bg-white/20 text-white/90 text-[10px] tracking-wider mb-3 backdrop-blur-sm">
                        {exp.category}
                      </span>
                      <p className="font-display text-white text-2xl font-semibold text-shadow-sm">{exp.title}</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className={`order-2 ${i % 2 !== 0 ? 'lg:order-1' : ''}`}>
                  <p className="section-label text-sand mb-3">{exp.category}</p>
                  <h2 className="font-display text-timber text-3xl sm:text-4xl font-semibold leading-tight mb-3">
                    {exp.title}
                  </h2>
                  <p className="font-sans text-sand/80 text-base italic mb-6">{exp.subtitle}</p>

                  <div className="space-y-3 mb-8">
                    {exp.body.map((para, pi) => (
                      <p key={pi} className="prose-resort">{para}</p>
                    ))}
                  </div>

                  {/* Highlights */}
                  <div className="grid grid-cols-2 gap-2 mb-8">
                    {exp.highlights.map((h) => (
                      <div key={h} className="flex items-center gap-2 font-sans text-sm text-timber/70">
                        <span className="w-1.5 h-1.5 rounded-full bg-sand flex-shrink-0" />
                        {h}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-forest page-section">
        <div className="container-lg text-center">
          <SectionReveal>
            <p className="section-label text-sand/70 mb-4">Start Planning</p>
            <h2 className="font-display text-stone text-4xl sm:text-5xl font-semibold mb-6">
              Ready for Your Adventure?
            </h2>
            <p className="font-sans text-stone/60 text-lg mb-10 max-w-md mx-auto">
              Book a room and we'll help you build the perfect Yala itinerary.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/book" className="btn-primary">
                Book a Stay <ArrowRight size={16} />
              </Link>
              <Link to="/contact" className="btn-outline-white">
                Contact Us
              </Link>
            </div>
          </SectionReveal>
        </div>
      </section>

      <MobileBookingBar />
    </div>
  )
}
