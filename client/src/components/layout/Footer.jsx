// d:/kaaya eco resort/client/src/components/layout/Footer.jsx
import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Facebook, Instagram } from 'lucide-react'

const EXPLORE = [
  { label: 'About Us',        to: '/about'         },
  { label: 'Accommodation',   to: '/accommodation' },
  { label: 'Experiences',     to: '/experiences'   },
  { label: 'Dining',          to: '/dining'        },
  { label: 'Gallery',         to: '/gallery'       },
  { label: 'Groups & Events', to: '/groups-events' },
]

const ROOMS = [
  { label: 'Family Bungalow Room 1',    to: '/accommodation' },
  { label: 'Family Bungalow Room 2',    to: '/accommodation' },
  { label: 'Family Chalet with Jacuzzi',to: '/accommodation' },
  { label: 'Standard Chalets',          to: '/accommodation' },
  { label: 'Check Availability',        to: '/book'          },
]

export default function Footer() {
  return (
    <footer className="bg-forest text-stone" aria-label="Site footer">
      {/* Main footer grid */}
      <div className="container-lg page-section pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-sand/40">
                <img src="/logo.jpg" alt="Kaaya Eco Resort" className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none' }} />
              </div>
              <div>
                <p className="font-display text-stone text-base font-semibold leading-tight">Kaaya Eco Resort</p>
                <p className="font-sans text-sand text-[10px] tracking-[0.2em] uppercase">Yala · Sri Lanka</p>
              </div>
            </div>
            <p className="font-sans text-stone/60 text-sm leading-relaxed mb-6">
              Your Gateway to Yala's Wild Heart. A luxury eco-resort on the shores of Yoda Wewa, at the
              edge of one of Sri Lanka's greatest national parks.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.facebook.com/kaayaecoresort"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full border border-stone/20 flex items-center justify-center text-stone/60 hover:border-sand hover:text-sand transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
              <a
                href="https://www.instagram.com/kaayaecoresort"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full border border-stone/20 flex items-center justify-center text-stone/60 hover:border-sand hover:text-sand transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-sans text-xs uppercase tracking-[0.2em] text-sand mb-5">Explore</h3>
            <ul className="space-y-3">
              {EXPLORE.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="font-sans text-sm text-stone/60 hover:text-sand transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Accommodation */}
          <div>
            <h3 className="font-sans text-xs uppercase tracking-[0.2em] text-sand mb-5">Accommodation</h3>
            <ul className="space-y-3">
              {ROOMS.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="font-sans text-sm text-stone/60 hover:text-sand transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-sans text-xs uppercase tracking-[0.2em] text-sand mb-5">Get in Touch</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={15} className="text-sand flex-shrink-0 mt-0.5" />
                <span className="font-sans text-sm text-stone/60 leading-relaxed">
                  Weweya Yodhakandiya, Yala<br />Southern Province, Sri Lanka
                </span>
              </li>
              <li>
                <a
                  href="tel:+94725677777"
                  className="flex items-center gap-3 font-sans text-sm text-stone/60 hover:text-sand transition-colors"
                >
                  <Phone size={15} className="text-sand flex-shrink-0" />
                  +94 72 567 7777
                </a>
              </li>
              <li>
                <a
                  href="mailto:kaayaecoresort@gmail.com"
                  className="flex items-center gap-3 font-sans text-sm text-stone/60 hover:text-sand transition-colors"
                >
                  <Mail size={15} className="text-sand flex-shrink-0" />
                  kaayaecoresort@gmail.com
                </a>
              </li>
            </ul>

            <div className="mt-6">
              <Link to="/book" className="btn-primary py-2.5 px-5 text-xs w-full justify-center">
                Book a Stay
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-stone/10">
        <div className="container-lg px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-sans text-xs text-stone/40">
            © {new Date().getFullYear()} Kaaya Eco Resort. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link to="/contact" className="font-sans text-xs text-stone/40 hover:text-stone/70 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/contact" className="font-sans text-xs text-stone/40 hover:text-stone/70 transition-colors">
              Terms of Service
            </Link>
            <a
              href="https://www.kaayaecoresort.com"
              className="font-sans text-xs text-stone/40 hover:text-stone/70 transition-colors"
            >
              www.kaayaecoresort.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
