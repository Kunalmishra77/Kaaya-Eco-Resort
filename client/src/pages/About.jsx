// d:/kaaya eco resort/client/src/pages/About.jsx
import { Link } from 'react-router-dom'
import { ArrowRight, Leaf, Heart, Shield } from 'lucide-react'
import PageHero from '../components/common/PageHero.jsx'
import SectionReveal from '../components/common/SectionReveal.jsx'
import MobileBookingBar from '../components/booking/MobileBookingBar.jsx'

const VALUES = [
  {
    icon:  Leaf,
    title: 'Ecological Responsibility',
    desc:  'Solar-powered common areas, composting, zero single-use plastic policy, and partnerships with local conservation projects. We exist within this ecosystem — and we take that seriously.',
  },
  {
    icon:  Heart,
    title: 'Community First',
    desc:  'Our staff are from the surrounding villages. Our food is sourced from local farmers and Kirinda fishermen. The prosperity of Kaaya flows back into the community that makes it possible.',
  },
  {
    icon:  Shield,
    title: 'Wildlife Respect',
    desc:  "We follow strict safari protocols that prioritise animal welfare. No off-road driving, minimum vehicle distances, no baiting. Yala's wildlife exists on its own terms here.",
  },
]

const TEAM_HIGHLIGHTS = [
  { name: 'Panchami',        role: 'Booking Manager',  note: '5 years at Kaaya. Fluent in English & Sinhala — your first point of contact for anything you need.' },
  { name: 'Upali',           role: 'Inhouse Cook',     note: '20+ years crafting authentic local cuisine. Every meal is a taste of the Southern Province.' },
  { name: 'Sachinta & Odith', role: 'Your Caretakers', note: 'Always on hand to ensure your stay is comfortable, relaxed, and exactly as you imagined.' },
]

export default function About() {
  return (
    <div className="pb-20 lg:pb-0">
      <PageHero
        label="Our Story"
        title="About Kaaya"
        subtitle="A family-built retreat at the edge of one of Sri Lanka's greatest national parks."
        image="/images/chalet-sunset.jpg"
        objectPosition="center 45%"
        height="h-[50vh] sm:h-[72vh] min-h-[320px] sm:min-h-[460px]"
      />

      {/* Origin story */}
      <section className="page-section bg-stone">
        <div className="container-lg">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-12 sm:mb-20 lg:mb-28">
            <SectionReveal direction="left">
              <p className="section-label mb-4">How It Began</p>
              <h2 className="section-heading mb-6">
                Born from a Love<br />of the Wild
              </h2>
              <div className="space-y-4 prose-resort">
                <p>
                  Kaaya Eco Resort began as a family dream — a piece of land on the shores of Yoda Wewa, a view of the ancient reservoir that had sustained southern Sri Lanka for a thousand years, and a vision for what a different kind of hospitality could look like.
                </p>
                <p>
                  The word <em>kaaya</em> in Sanskrit means the body — the vessel. We chose it deliberately. This resort is a vessel for the experience of Yala: the sightings, the silences, the meals, the mornings. Everything here is in service of the encounter with nature.
                </p>
                <p>
                  We opened our first rooms in 2019, in a single family chalet tucked into the tree line. Since then, we've grown to seven rooms and chalets, built entirely from local materials, designed by a Colombo architect with roots in this very district.
                </p>
                <p>
                  We are not a hotel chain. We are a family-run retreat, and every guest who comes here is welcomed the way you'd welcome someone into your home.
                </p>
              </div>
            </SectionReveal>

            <SectionReveal direction="right" delay={0.1}>
              <div className="space-y-4">
                <div className="h-48 sm:h-64 rounded-sm overflow-hidden">
                  <img
                    src="/images/lake-sunset-tree.jpg"
                    alt="Yoda Wewa from the resort grounds"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-32 sm:h-40 rounded-sm overflow-hidden">
                    <img
                      src="/images/garden-buddha.jpg"
                      alt="Resort gardens"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="h-32 sm:h-40 rounded-sm overflow-hidden">
                    <img
                      src="/images/chalet-jungle-exterior.jpg"
                      alt="Original chalet"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>
              </div>
            </SectionReveal>
          </div>

          {/* Location */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-12 sm:mb-20 lg:mb-28">
            <SectionReveal direction="left" className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-3 h-64 sm:h-80 lg:h-96">
                <div className="row-span-2 rounded-sm overflow-hidden">
                  <img
                    src="/images/tropical-garden.jpg"
                    alt="Tropical gardens at Kaaya"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="rounded-sm overflow-hidden">
                  <img
                    src="/images/resort-entrance.jpg"
                    alt="Resort entrance"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="rounded-sm overflow-hidden">
                  <img
                    src="/images/outdoor-seating.jpg"
                    alt="Outdoor seating area"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </SectionReveal>

            <SectionReveal direction="right" delay={0.1} className="order-1 lg:order-2">
              <p className="section-label mb-4">Location</p>
              <h2 className="section-heading mb-6">
                Where We Are
              </h2>
              <div className="space-y-4 prose-resort mb-8">
                <p>
                  We're located in Yala, in Sri Lanka's Southern Province — a three-and-a-half-hour drive from Colombo, or a scenic journey from Colombo along the southern coastal highway.
                </p>
                <p>
                  The nearest town is Tissamaharama, 8 kilometres away. The Yala National Park main entrance (Palatupana) is a 30-minute drive. Kirinda Beach 8 km, Tissamaharama Lake 6 km, Ella 80 km.
                </p>
                <p>
                  We front directly onto Yoda Wewa — the ancient reservoir that serves as a natural boundary and a constant source of wildlife. Elephants drink at the water's edge most evenings. Painted storks nest in the trees above us.
                </p>
              </div>
              <div className="space-y-2 font-sans text-sm text-timber/70 mb-6">
                <p>📍 Weweya Yodhakandiya, Yala, Southern Province, Sri Lanka</p>
                <p>✈️ Nearest airport: Mattala Rajapaksa International (HRI) — 45 mins</p>
                <p>🚗 Colombo to Kaaya: approx. 3.5 hours</p>
                <p>🏙️ Galle to Kaaya: approx. 2 hours</p>
                <p>🏖️ Mirissa Beach to Kaaya: approx. 1 hour 45 minutes</p>
                <p>🌊 Hiriketiya Beach to Kaaya: approx. 1 hour</p>
              </div>
            </SectionReveal>
          </div>

          {/* Values */}
          <SectionReveal className="text-center mb-14">
            <p className="section-label mb-4">What We Stand For</p>
            <h2 className="section-heading">Our Values</h2>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 sm:mb-20 lg:mb-28">
            {VALUES.map((v, i) => (
              <SectionReveal key={v.title} delay={i * 0.1} direction="up">
                <div className="bg-white border border-sage/20 rounded-sm p-7 card-hover h-full">
                  <div className="w-12 h-12 rounded-full bg-forest/10 flex items-center justify-center mb-5">
                    <v.icon size={22} className="text-forest" />
                  </div>
                  <h3 className="font-display text-timber text-xl font-semibold mb-3">{v.title}</h3>
                  <p className="font-sans text-timber/60 text-sm leading-relaxed">{v.desc}</p>
                </div>
              </SectionReveal>
            ))}
          </div>

          {/* Team */}
          <SectionReveal className="text-center mb-12">
            <p className="section-label mb-4">The Team</p>
            <h2 className="section-heading">The Faces Behind Kaaya</h2>
            <p className="font-sans text-timber/60 text-base mt-4 max-w-lg mx-auto">
              Every member of our small team is from the local community. They bring knowledge, warmth, and a genuine love of this land.
            </p>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TEAM_HIGHLIGHTS.map((member, i) => (
              <SectionReveal key={member.name} delay={i * 0.1}>
                <div className="bg-white border border-sage/20 rounded-sm p-6 text-center card-hover">
                  <div className="w-16 h-16 rounded-full bg-forest text-stone flex items-center justify-center font-display font-semibold text-2xl mx-auto mb-4">
                    {member.name[0]}
                  </div>
                  <h3 className="font-display text-timber text-lg font-semibold mb-1">{member.name}</h3>
                  <p className="section-label text-sage mb-3 text-[10px]">{member.role}</p>
                  <p className="font-sans text-timber/55 text-sm italic leading-relaxed">"{member.note}"</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-forest page-section">
        <div className="container-lg text-center">
          <SectionReveal>
            <h2 className="font-display text-stone text-4xl sm:text-5xl font-semibold mb-6">
              Come See It for Yourself
            </h2>
            <p className="font-sans text-stone/60 text-lg mb-10 max-w-md mx-auto">
              No description does it justice. Come and experience Yala's wild heart from the shores of Yoda Wewa.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/book" className="btn-primary">
                Book Your Stay <ArrowRight size={16} />
              </Link>
              <Link to="/contact" className="btn-outline-white">
                Get in Touch
              </Link>
            </div>
          </SectionReveal>
        </div>
      </section>

      <MobileBookingBar />
    </div>
  )
}
