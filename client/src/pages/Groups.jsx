// d:/kaaya eco resort/client/src/pages/Groups.jsx
import { Link } from 'react-router-dom'
import { ArrowRight, Users, Star, Calendar, ChevronRight } from 'lucide-react'
import PageHero from '../components/common/PageHero.jsx'
import SectionReveal from '../components/common/SectionReveal.jsx'
import MobileBookingBar from '../components/booking/MobileBookingBar.jsx'

const USE_CASES = [
  {
    title: 'Family Reunions',
    desc:  'Reconnect across generations with an exclusive Yala safari experience. With capacity for ~24 adults across 7 rooms, Kaaya is perfectly sized for large family gatherings.',
    icon:  '🏡',
  },
  {
    title: 'Weddings & Honeymoons',
    desc:  "Celebrate the most important moments of your life surrounded by Sri Lanka's most dramatic wilderness. We help plan every detail from arrival to farewell dinner.",
    icon:  '💍',
  },
  {
    title: 'Corporate Retreats',
    desc:  'Step out of the boardroom and into the wild. Team-building safari days, strategy sessions in our outdoor spaces, and evenings under a canopy of stars.',
    icon:  '💼',
  },
  {
    title: 'Birthday Celebrations',
    desc:  'A milestone birthday deserves a truly wild celebration. Take over the resort, arrange a private BBQ, and head out on a dawn leopard safari.',
    icon:  '🎉',
  },
  {
    title: 'Wellness Retreats',
    desc:  'Yoga on the lake shore at sunrise, nature walks, mindful silence among the trees. The natural environment of Yoda Wewa lends itself beautifully to restorative group experiences.',
    icon:  '🌿',
  },
  {
    title: 'Photography Tours',
    desc:  "Yala's wildlife and Yoda Wewa's birdlife are extraordinary photographic subjects. We work with photography groups to maximise golden-hour safari access.",
    icon:  '📸',
  },
]

const INCLUSIONS = [
  'Entire resort exclusively yours',
  'All 7 rooms & chalets',
  'Swimming pool & outdoor spaces',
  'Dedicated event coordinator',
  'Bespoke safari scheduling',
  'Private BBQ & dining packages',
  'Airport/hotel transfers',
  'Catering for all dietary needs',
  'Group activity planning',
  'Decoration on request',
]

const FAQS = [
  {
    q: 'How many guests can you accommodate?',
    a: 'The resort accommodates approximately 24 adults across our 7 rooms and chalets, with additional capacity for children. For larger groups, we can recommend nearby partner accommodation.',
  },
  {
    q: 'What is the minimum booking period for exclusive hire?',
    a: 'We typically require a minimum of 3 nights for an exclusive resort booking, though longer stays are preferred and receive better rates.',
  },
  {
    q: 'Can we arrange the wedding or event décor ourselves?',
    a: 'Absolutely. You are welcome to bring in your own décor and event suppliers. We can also recommend trusted local vendors for flowers, photography, and entertainment.',
  },
  {
    q: 'Is catering included in the exclusive hire price?',
    a: "Catering is quoted separately and can be fully customised — from simple buffets to elaborate themed dinners. We'll work with you on a menu that reflects your group's tastes.",
  },
  {
    q: 'How far in advance should we book?',
    a: 'Exclusive hire during peak season (November–April) should be booked at least 3–4 months in advance. For off-peak periods, 4–6 weeks is usually sufficient.',
  },
]

export default function Groups() {
  return (
    <div className="pb-20 lg:pb-0">
      <PageHero
        label="Exclusive Experiences"
        title="Groups & Events"
        subtitle="Take over Kaaya entirely. Your family, your celebration, your wild adventure — exclusively yours."
        image="/images/pool-trees.jpg"
        objectPosition="center 50%"
        height="h-[50vh] sm:h-[72vh] min-h-[320px] sm:min-h-[460px]"
      />

      {/* Intro */}
      <section className="page-section bg-stone">
        <div className="container-lg">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-10 sm:mb-16 lg:mb-24">
            <SectionReveal direction="left">
              <p className="section-label mb-4">Private Resort Hire</p>
              <h2 className="section-heading mb-6">
                The Whole Resort,<br />Exclusively Yours
              </h2>
              <p className="prose-resort mb-5">
                Kaaya Eco Resort is available for exclusive hire — meaning your group, and only your group, occupies every room, every space, and every experience for the duration of your stay.
              </p>
              <p className="prose-resort mb-5">
                Our total capacity of approximately 24 adults across 7 rooms and chalets makes us perfect for large families, celebration groups, and corporate teams who want true privacy and an uncompromised experience.
              </p>
              <p className="prose-resort mb-8">
                Our dedicated events coordinator will work with you from the first inquiry to create a personalised programme — safari schedules, dining menus, cultural day trips, decorations, and more.
              </p>
              <Link to="/contact" className="btn-primary">
                Enquire Now <ArrowRight size={16} />
              </Link>
            </SectionReveal>

            <SectionReveal direction="right" delay={0.1}>
              {/* Capacity info */}
              <div className="bg-forest rounded-sm p-8">
                <p className="section-label text-sand/70 mb-6">Resort Capacity</p>
                <div className="space-y-4 mb-8">
                  {[
                    { room: 'Family Bungalow Room 1',      cap: '6 adults' },
                    { room: 'Family Bungalow Room 2',      cap: '6 adults' },
                    { room: 'Family Chalet with Jacuzzi',  cap: '4 adults' },
                    { room: 'Standard Chalets (×4)',       cap: '8 adults total' },
                  ].map((item) => (
                    <div key={item.room} className="flex items-center justify-between border-b border-stone/10 pb-3">
                      <span className="font-sans text-stone/70 text-sm">{item.room}</span>
                      <span className="flex items-center gap-1.5 font-sans text-sand text-sm font-medium">
                        <Users size={13} /> {item.cap}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="bg-stone/10 rounded-sm px-5 py-4 flex items-center justify-between">
                  <span className="font-sans text-stone font-semibold">Total Capacity</span>
                  <span className="font-display text-sand text-2xl font-semibold">~24 Adults</span>
                </div>
              </div>
            </SectionReveal>
          </div>

          {/* Use cases */}
          <SectionReveal className="text-center mb-14">
            <p className="section-label mb-4">Perfect For</p>
            <h2 className="section-heading">Every Kind of Gathering</h2>
          </SectionReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
            {USE_CASES.map((uc, i) => (
              <SectionReveal key={uc.title} delay={i * 0.07} direction="up">
                <div className="bg-white border border-sage/20 rounded-sm p-7 card-hover h-full">
                  <div className="text-3xl mb-4">{uc.icon}</div>
                  <h3 className="font-display text-timber text-xl font-semibold mb-3">{uc.title}</h3>
                  <p className="font-sans text-timber/60 text-sm leading-relaxed">{uc.desc}</p>
                </div>
              </SectionReveal>
            ))}
          </div>

          {/* Inclusions */}
          <SectionReveal>
            <div className="bg-stone border border-sage/20 rounded-sm p-8 md:p-12 mb-24">
              <div className="grid md:grid-cols-2 gap-10 items-start">
                <div>
                  <p className="section-label mb-4">What's Included</p>
                  <h3 className="font-display text-timber text-3xl font-semibold mb-4">Exclusive Hire Inclusions</h3>
                  <p className="font-sans text-timber/60 text-sm leading-relaxed">
                    Our exclusive hire package is fully customisable. The following are included as standard across all exclusive bookings.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {INCLUSIONS.map((item) => (
                    <div key={item} className="flex items-center gap-3 bg-white rounded-sm px-4 py-3 border border-sage/20">
                      <Star size={13} className="text-sand flex-shrink-0 fill-sand" />
                      <span className="font-sans text-sm text-timber">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionReveal>

          {/* FAQs */}
          <SectionReveal className="text-center mb-10">
            <p className="section-label mb-4">FAQ</p>
            <h2 className="section-heading">Common Questions</h2>
          </SectionReveal>

          <div className="space-y-4 mb-20">
            {FAQS.map((faq, i) => (
              <SectionReveal key={i} delay={i * 0.06}>
                <details className="group bg-white border border-sage/20 rounded-sm">
                  <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none font-sans font-semibold text-timber text-sm hover:text-forest transition-colors">
                    {faq.q}
                    <ChevronRight size={16} className="text-sage group-open:rotate-90 transition-transform" />
                  </summary>
                  <div className="px-6 pb-5">
                    <p className="font-sans text-sm text-timber/60 leading-relaxed">{faq.a}</p>
                  </div>
                </details>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-forest page-section">
        <div className="container-lg">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <SectionReveal direction="left">
              <p className="section-label text-sand/70 mb-4">Get in Touch</p>
              <h2 className="font-display text-stone text-4xl font-semibold mb-4 leading-tight">
                Start Planning Your Group Experience
              </h2>
              <p className="font-sans text-stone/60 text-base leading-relaxed">
                Contact our events team with your group size, preferred dates, and occasion. We'll get back to you within 24 hours with a personalised proposal.
              </p>
            </SectionReveal>
            <SectionReveal direction="right" delay={0.1} className="flex flex-col sm:flex-row gap-4 md:justify-end">
              <Link to="/contact" className="btn-primary">
                Send an Enquiry <ArrowRight size={16} />
              </Link>
              <a href="tel:+94725677777" className="btn-outline-white">
                Call Us Directly
              </a>
            </SectionReveal>
          </div>
        </div>
      </section>

      <MobileBookingBar />
    </div>
  )
}
