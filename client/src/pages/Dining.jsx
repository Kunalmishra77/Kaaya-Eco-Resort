// d:/kaaya eco resort/client/src/pages/Dining.jsx
import { Link } from 'react-router-dom'
import { ArrowRight, Clock, Utensils, Flame, Coffee } from 'lucide-react'
import PageHero from '../components/common/PageHero.jsx'
import SectionReveal from '../components/common/SectionReveal.jsx'
import MobileBookingBar from '../components/booking/MobileBookingBar.jsx'

const MENUS = [
  {
    meal:  'Breakfast',
    icon:  Coffee,
    time:  '7:00 AM – 9:30 AM',
    desc:  'Start your safari morning with a Sri Lankan breakfast spread — hoppers, roti, sambal, fresh tropical fruit, and strong Ceylon tea or coffee. Fuel for the day ahead.',
    items: ['Sri Lankan hoppers (appa)', 'Pol roti with coconut sambal', 'String hoppers with curry', 'Fresh tropical fruit platter', 'Ceylon tea & coffee', 'Egg dishes on request'],
  },
  {
    meal:  'Lunch',
    icon:  Utensils,
    time:  '12:00 PM – 2:30 PM',
    desc:  "A lighter midday meal with fresh rice and curry, sandwiches, and cold drinks. Perfect for between safari drives when you don't want to stray far from the pool.",
    items: ['Rice & curry (3–4 accompaniments)', 'Dhal curry & vegetable dishes', 'Fresh pol sambol', 'Grilled fish or chicken', 'Cold fresh juices', 'Light sandwiches & snacks'],
  },
  {
    meal:  'Dinner',
    icon:  Flame,
    time:  '7:00 PM – 10:00 PM',
    desc:  "The centrepiece of the Kaaya day. A full Sri Lankan table — seafood curries, slow-cooked meats, and desserts made from local ingredients. BBQ dinners are available on request.",
    items: ['Seafood curry (catch of the day)', 'Chicken or mutton curry', 'Vegetable & lentil dishes', 'Rice, roti & bread basket', 'Wambatu moju (aubergine pickle)', 'Coconut milk desserts'],
  },
  {
    meal:  'BBQ Night',
    icon:  Flame,
    time:  'By Arrangement',
    desc:  'Our signature outdoor BBQ experience under the stars. Fresh seafood, marinated meats, live fire, cold Lion beer, and the sounds of the night jungle. Arranged for groups on request.',
    items: ['Grilled whole fish', 'Prawn & seafood skewers', 'Marinated chicken', 'Grilled vegetables', 'Coconut bread', 'Sri Lankan arrack cocktails'],
  },
]

const BARS = [
  {
    title: 'The Wewa Bar — BYOB',
    desc:  'Bring Your Own Bottles and enjoy! Our lakeside bar is yours — the best seat in the house for a sunset over Yoda Wewa. Get your bottles and enjoy with friends and family under the open sky.',
    items: ['Fresh king coconut', 'Tropical fruit juices', 'Ginger tea & herbal drinks', 'Cold beverages', 'Light bar snacks'],
  },
]

export default function Dining() {
  return (
    <div className="pb-20 lg:pb-0">
      <PageHero
        label="Food & Drink"
        title="Dining at Kaaya"
        subtitle="Sri Lankan flavours crafted from local ingredients, served where the jungle meets the lake."
        image="/images/lakeside-dining.jpg"
        objectPosition="center 40%"
        height="h-[50vh] sm:h-[72vh] min-h-[320px] sm:min-h-[460px]"
      />

      {/* Intro */}
      <section className="page-section bg-stone">
        <div className="container-lg">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-10 sm:mb-16 lg:mb-24">
            <SectionReveal direction="left">
              <p className="section-label mb-4">Our Philosophy</p>
              <h2 className="section-heading mb-6">
                Tastes of the<br />Southern Province
              </h2>
              <p className="prose-resort mb-4">
                Sri Lanka's southern coast is known for some of the island's most flavourful, aromatic cuisine. At Kaaya, we cook the way our neighbours cook — with fresh coconut, garden-grown curry leaves, locally caught seafood, and spice blends ground daily.
              </p>
              <p className="prose-resort mb-4">
                Most of our vegetables, herbs, and fruit come from nearby farms or our own garden. The fish is sourced from the coastal fishing communities at Kirinda Beach, just 8 kilometres away. Dining here is as much a part of the Yala experience as the safari itself.
              </p>
              <p className="prose-resort">
                We cater to all dietary requirements — vegetarian, vegan, and gluten-free menus are available. Please let us know at the time of booking.
              </p>
            </SectionReveal>

            <SectionReveal direction="right" delay={0.1}>
              <div className="space-y-4">
                <div className="h-56 rounded-sm overflow-hidden">
                  <img
                    src="/images/restaurant-pavilion.jpg"
                    alt="Restaurant pavilion at Kaaya"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-36 rounded-sm overflow-hidden">
                    <img
                      src="/images/outdoor-seating.jpg"
                      alt="Outdoor dining area"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="h-36 rounded-sm overflow-hidden">
                    <img
                      src="/images/lakeside-dining.jpg"
                      alt="Lakeside dining at sunset"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>
              </div>
            </SectionReveal>
          </div>

          {/* Menus */}
          <SectionReveal className="text-center mb-14">
            <p className="section-label mb-4">Daily Menus</p>
            <h2 className="section-heading">What We Serve</h2>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
            {MENUS.map((menu, i) => (
              <SectionReveal key={menu.meal} delay={i * 0.08} direction="up">
                <div className="bg-white border border-sage/20 rounded-sm p-7 card-hover h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 rounded-full bg-forest/10 flex items-center justify-center">
                      <menu.icon size={20} className="text-forest" />
                    </div>
                    <span className="flex items-center gap-1.5 font-sans text-xs text-timber/50">
                      <Clock size={12} /> {menu.time}
                    </span>
                  </div>

                  <h3 className="font-display text-timber text-xl font-semibold mb-3">{menu.meal}</h3>
                  <p className="font-sans text-timber/60 text-sm leading-relaxed mb-5">{menu.desc}</p>

                  <div className="grid grid-cols-2 gap-2">
                    {menu.items.map((item) => (
                      <div key={item} className="flex items-center gap-2 font-sans text-xs text-timber/70">
                        <span className="w-1 h-1 rounded-full bg-sand flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>

          {/* Bar */}
          {BARS.map((bar) => (
            <SectionReveal key={bar.title}>
              <div className="bg-forest rounded-sm p-8 md:p-12">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <p className="section-label text-sand/70 mb-3">Drinks & Cocktails</p>
                    <h3 className="font-display text-stone text-3xl font-semibold mb-4">{bar.title}</h3>
                    <p className="font-sans text-stone/65 text-sm leading-relaxed">{bar.desc}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {bar.items.map((item) => (
                      <div key={item} className="flex items-center gap-2 font-sans text-sm text-stone/70">
                        <span className="w-1.5 h-1.5 rounded-full bg-sand flex-shrink-0" />
                        {item}
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
      <section className="page-section bg-stone border-t border-sage/20">
        <div className="container-lg text-center">
          <SectionReveal>
            <p className="section-label mb-4">Dietary Requirements</p>
            <h2 className="section-heading mb-6">We Cook for Everyone</h2>
            <p className="font-sans text-timber/60 text-lg mb-8 max-w-md mx-auto">
              Vegetarian, vegan, gluten-free, and allergy-specific menus are available. Please mention your requirements at the time of booking.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/book" className="btn-primary">
                Book Your Stay <ArrowRight size={16} />
              </Link>
              <Link to="/contact" className="btn-outline">
                Contact About Dining
              </Link>
            </div>
          </SectionReveal>
        </div>
      </section>

      <MobileBookingBar />
    </div>
  )
}
