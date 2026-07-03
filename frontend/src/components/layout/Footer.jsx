import { Link } from 'react-router-dom'
import { FiInstagram, FiFacebook, FiYoutube, FiMapPin, FiPhone, FiMail } from 'react-icons/fi'
import { FOOTER_LINKS, APP_NAME, APP_FULL_NAME, APP_ADDRESS, APP_ADDRESS2, APP_PHONE, APP_EMAIL } from '@constants'

export default function Footer() {
  return (
    <footer className="bg-dark-texture text-white">
      {/* Main footer */}
      <div className="container-wide py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand column */}
        <div className="lg:col-span-1">
          <img
            src="/images/imgi_1_CHIPADE_LOGO_PNG.png"
            alt="Chipade Saraf"
            className="h-24 w-auto object-contain mb-5"
          />
          <p className="font-sans text-white/60 text-sm leading-relaxed mb-6">
            {APP_FULL_NAME} — Kolhapur's most trusted jewellers since 1904. Crafting pure gold, silver, diamond and pearl jewellery with love and legacy.
          </p>
          <div className="flex gap-3">
            <a href="https://instagram.com" target="_blank" rel="noreferrer"
              className="w-9 h-9 border border-gold-500/40 text-gold-400 flex items-center justify-center hover:bg-gold-500 hover:text-white hover:border-gold-500 transition-all">
              <FiInstagram size={16} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer"
              className="w-9 h-9 border border-gold-500/40 text-gold-400 flex items-center justify-center hover:bg-gold-500 hover:text-white hover:border-gold-500 transition-all">
              <FiFacebook size={16} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer"
              className="w-9 h-9 border border-gold-500/40 text-gold-400 flex items-center justify-center hover:bg-gold-500 hover:text-white hover:border-gold-500 transition-all">
              <FiYoutube size={16} />
            </a>
          </div>
        </div>

        {/* Collections */}
        <div>
          <h4 className="font-serif text-gold-400 text-base mb-5 pb-2 border-b border-gold-500/20">Collections</h4>
          <ul className="space-y-2.5">
            {FOOTER_LINKS.collections.map(l => (
              <li key={l.label}>
                <Link to={l.href} className="font-sans text-white/60 text-sm hover:text-gold-400 transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-serif text-gold-400 text-base mb-5 pb-2 border-b border-gold-500/20">Customer Care</h4>
          <ul className="space-y-2.5">
            {FOOTER_LINKS.support.map(l => (
              <li key={l.label}>
                <Link to={l.href} className="font-sans text-white/60 text-sm hover:text-gold-400 transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-serif text-gold-400 text-base mb-5 pb-2 border-b border-gold-500/20">Visit Us</h4>
          <ul className="space-y-4">
            <li className="flex gap-3 text-sm">
              <FiMapPin className="text-gold-500 shrink-0 mt-0.5" size={15} />
              <div className="text-white/60 leading-relaxed">
                <p>{APP_ADDRESS}</p>
                <p className="mt-1">{APP_ADDRESS2}</p>
              </div>
            </li>
            <li className="flex gap-3 text-sm">
              <FiPhone className="text-gold-500 shrink-0 mt-0.5" size={15} />
              <div className="text-white/60">
                <a href="tel:02312544441" className="hover:text-gold-400 transition-colors block">0231-2544441</a>
                <a href="tel:+918237129913" className="hover:text-gold-400 transition-colors block">+91 82371 29913</a>
              </div>
            </li>
            <li className="flex gap-3 text-sm">
              <FiMail className="text-gold-500 shrink-0 mt-0.5" size={15} />
              <a href={`mailto:${APP_EMAIL}`} className="text-white/60 hover:text-gold-400 transition-colors">{APP_EMAIL}</a>
            </li>
          </ul>

          <div className="mt-6 p-4 border border-gold-500/20 bg-gold-500/5">
            <p className="text-gold-400 text-xs font-sans font-semibold tracking-wider uppercase mb-1">Store Hours</p>
            <p className="text-white/60 text-xs">Mon – Sat: 10:00 AM – 8:00 PM</p>
            <p className="text-white/60 text-xs">Sunday: 11:00 AM – 6:00 PM</p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gold-500/20">
        <div className="container-wide py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-sans text-white/40">
          <span>© {new Date().getFullYear()} {APP_FULL_NAME}. All rights reserved.</span>
          <span className="text-gold-600/60">Kolhapur's Trusted Jewellers Since 1904 ✦</span>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-gold-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms"   className="hover:text-gold-400 transition-colors">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
