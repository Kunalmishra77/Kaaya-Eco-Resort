// d:/kaaya eco resort/client/src/pages/Contact.jsx
import { useState } from 'react'
import { MapPin, Phone, Mail, Facebook, Clock, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../utils/api.js'
import PageHero from '../components/common/PageHero.jsx'
import SectionReveal from '../components/common/SectionReveal.jsx'
import Spinner from '../components/common/Spinner.jsx'
import MobileBookingBar from '../components/booking/MobileBookingBar.jsx'

const SUBJECTS = [
  'Booking Enquiry',
  'Group / Exclusive Hire',
  'Safari Arrangements',
  'Dietary Requirements',
  'General Information',
  'Other',
]

export default function Contact() {
  const [form,    setForm]    = useState({ name: '', email: '', phone: '', subject: 'Booking Enquiry', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent,    setSent]    = useState(false)
  const [errors,  setErrors]  = useState({})

  const validate = () => {
    const errs = {}
    if (!form.name.trim())    errs.name    = 'Name is required'
    if (!form.email.trim())   errs.email   = 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email'
    if (!form.message.trim()) errs.message = 'Message is required'
    return errs
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    try {
      await api.post('/inquiries', form)
      setSent(true)
      toast.success("Message sent! We'll be in touch within 24 hours.")
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pb-20 lg:pb-0">
      <PageHero
        label="Get in Touch"
        title="Contact Us"
        subtitle="We're a small team. We read every message personally and reply within 24 hours."
        image="/images/lake-dusk.jpg"
        objectPosition="center 55%"
        height="h-[45vh] sm:h-[62vh] min-h-[280px] sm:min-h-[400px]"
      />

      <section className="page-section bg-stone">
        <div className="container-lg">
          <div className="grid lg:grid-cols-3 gap-8 sm:gap-12 lg:gap-16">

            {/* Contact info */}
            <div className="lg:col-span-1">
              <SectionReveal direction="left">
                <h2 className="font-display text-timber text-2xl font-semibold mb-8">
                  Find Us
                </h2>

                <div className="space-y-6 mb-10">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-forest/10 flex items-center justify-center flex-shrink-0">
                      <MapPin size={18} className="text-forest" />
                    </div>
                    <div>
                      <p className="font-sans font-semibold text-timber text-sm mb-1">Address</p>
                      <p className="font-sans text-timber/60 text-sm leading-relaxed">
                        Weweya Yodhakandiya, Yala<br />Southern Province, Sri Lanka
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-forest/10 flex items-center justify-center flex-shrink-0">
                      <Phone size={18} className="text-forest" />
                    </div>
                    <div>
                      <p className="font-sans font-semibold text-timber text-sm mb-1">Phone / WhatsApp</p>
                      <a href="tel:+94725677777" className="font-sans text-timber/60 text-sm hover:text-sand transition-colors">
                        +94 72 567 7777
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-forest/10 flex items-center justify-center flex-shrink-0">
                      <Mail size={18} className="text-forest" />
                    </div>
                    <div>
                      <p className="font-sans font-semibold text-timber text-sm mb-1">Email</p>
                      <a href="mailto:kaayaecoresort@gmail.com" className="font-sans text-timber/60 text-sm hover:text-sand transition-colors">
                        kaayaecoresort@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-forest/10 flex items-center justify-center flex-shrink-0">
                      <Clock size={18} className="text-forest" />
                    </div>
                    <div>
                      <p className="font-sans font-semibold text-timber text-sm mb-1">Response Time</p>
                      <p className="font-sans text-timber/60 text-sm">Within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-forest/10 flex items-center justify-center flex-shrink-0">
                      <Facebook size={18} className="text-forest" />
                    </div>
                    <div>
                      <p className="font-sans font-semibold text-timber text-sm mb-1">Facebook</p>
                      <a
                        href="https://www.facebook.com/kaayaecoresort"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-sans text-timber/60 text-sm hover:text-sand transition-colors"
                      >
                        facebook.com/kaayaecoresort
                      </a>
                    </div>
                  </div>
                </div>

                {/* Google Maps embed */}
                <div className="rounded-sm overflow-hidden border border-sage/20">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.959523416551!2d81.32110727554947!3d6.269053826066728!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae69d3a850ce993%3A0xeb0035b9bf384dec!2sKaaya%20Eco%20Resort%20-%20Yala!5e0!3m2!1sen!2slk!4v1778688945614!5m2!1sen!2slk"
                    width="100%"
                    height="240"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Kaaya Eco Resort Location"
                  />
                </div>
              </SectionReveal>
            </div>

            {/* Contact form */}
            <div className="lg:col-span-2">
              <SectionReveal direction="right" delay={0.1}>
                {sent ? (
                  <div className="bg-forest rounded-sm p-10 text-center">
                    <div className="w-16 h-16 rounded-full bg-sand/20 flex items-center justify-center mx-auto mb-6">
                      <Send size={28} className="text-sand" />
                    </div>
                    <h3 className="font-display text-stone text-2xl font-semibold mb-3">Message Sent!</h3>
                    <p className="font-sans text-stone/65 text-base mb-6 max-w-sm mx-auto">
                      Thank you for reaching out. We'll reply to {form.email} within 24 hours.
                    </p>
                    <button
                      onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', subject: 'Booking Enquiry', message: '' }) }}
                      className="btn-outline-white"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate>
                    <h2 className="font-display text-timber text-2xl font-semibold mb-8">
                      Send Us a Message
                    </h2>

                    <div className="grid sm:grid-cols-2 gap-5 mb-5">
                      <div>
                        <label htmlFor="name" className="block font-sans text-xs uppercase tracking-wider text-timber/50 mb-1.5 font-semibold">
                          Full Name *
                        </label>
                        <input
                          id="name" name="name" type="text"
                          value={form.name} onChange={handleChange}
                          placeholder="Your name"
                          className={`input-base ${errors.name ? 'border-terra' : ''}`}
                          autoComplete="name"
                        />
                        {errors.name && <p className="font-sans text-xs text-terra mt-1">{errors.name}</p>}
                      </div>

                      <div>
                        <label htmlFor="email" className="block font-sans text-xs uppercase tracking-wider text-timber/50 mb-1.5 font-semibold">
                          Email Address *
                        </label>
                        <input
                          id="email" name="email" type="email"
                          value={form.email} onChange={handleChange}
                          placeholder="your@email.com"
                          className={`input-base ${errors.email ? 'border-terra' : ''}`}
                          autoComplete="email"
                        />
                        {errors.email && <p className="font-sans text-xs text-terra mt-1">{errors.email}</p>}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5 mb-5">
                      <div>
                        <label htmlFor="phone" className="block font-sans text-xs uppercase tracking-wider text-timber/50 mb-1.5 font-semibold">
                          Phone / WhatsApp
                        </label>
                        <input
                          id="phone" name="phone" type="tel"
                          value={form.phone} onChange={handleChange}
                          placeholder="+1 234 567 8900"
                          className="input-base"
                          autoComplete="tel"
                        />
                      </div>

                      <div>
                        <label htmlFor="subject" className="block font-sans text-xs uppercase tracking-wider text-timber/50 mb-1.5 font-semibold">
                          Subject
                        </label>
                        <select
                          id="subject" name="subject"
                          value={form.subject} onChange={handleChange}
                          className="input-base"
                        >
                          {SUBJECTS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mb-8">
                      <label htmlFor="message" className="block font-sans text-xs uppercase tracking-wider text-timber/50 mb-1.5 font-semibold">
                        Message *
                      </label>
                      <textarea
                        id="message" name="message"
                        value={form.message} onChange={handleChange}
                        rows={6}
                        placeholder="Tell us how we can help — dates, group size, special requests..."
                        className={`input-base resize-none ${errors.message ? 'border-terra' : ''}`}
                      />
                      {errors.message && <p className="font-sans text-xs text-terra mt-1">{errors.message}</p>}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary gap-3 disabled:opacity-60"
                    >
                      {loading ? <Spinner size="sm" color="white" /> : <Send size={16} />}
                      {loading ? 'Sending…' : 'Send Message'}
                    </button>
                  </form>
                )}
              </SectionReveal>
            </div>
          </div>
        </div>
      </section>

      <MobileBookingBar />
    </div>
  )
}
