import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiHeart, FiShoppingBag, FiUser, FiMenu, FiX, FiChevronDown } from 'react-icons/fi'
import { useCart } from '@contexts/CartContext'
import { useWishlist } from '@contexts/WishlistContext'
import { useAuth } from '@contexts/AuthContext'

const NAV = [
  { label: 'Home', href: '/' },
  {
    label: 'Jewellery', href: '/shop',
    children: [
      { label: 'Gold Jewellery',  href: '/shop?category=gold' },
      { label: 'Diamond',        href: '/shop?category=diamond' },
      { label: 'Silver',         href: '/shop?category=silver' },
      { label: 'Necklaces',      href: '/shop?category=necklaces' },
      { label: 'Earrings',       href: '/shop?category=earrings' },
      { label: 'Bangles',        href: '/shop?category=bangles' },
      { label: 'Bracelets',      href: '/shop?category=bracelets' },
      { label: 'Rings',          href: '/shop?category=rings' },
      { label: 'Pendants',       href: '/shop?category=pendants' },
    ],
  },
  {
    label: 'Forming', href: '/shop?category=forming',
    children: [
      { label: 'Forming Necklace',  href: '/shop?category=forming' },
      { label: 'Forming Bangles',   href: '/shop?category=forming' },
      { label: 'Forming Earrings',  href: '/shop?category=forming' },
      { label: 'Forming Bracelets', href: '/shop?category=forming' },
      { label: 'Forming Rings',     href: '/shop?category=forming' },
    ],
  },
  { label: 'Bridal',       href: '/shop?occasion=bridal' },
  { label: 'Bullions',     href: '/shop?category=bullions' },
  { label: 'All Products', href: '/shop' },
  { label: 'About Us',     href: '/about' },
  { label: 'Contact',      href: '/contact' },
]

const MARQUEE = [
  '✦ FREE DELIVERY FROM ₹999',
  '✦ 10% OFF ALL JEWELLERY',
  '✦ LIFETIME GUARANTEE',
  '✦ BIS HALLMARKED GOLD',
  '✦ सोने | चांदी | हिरे | मोती',
  '✦ SINCE 1904 — KOLHAPUR',
]

export default function Navbar() {
  const [scrolled, setScrolled]         = useState(false)
  const [mobileOpen, setMobileOpen]     = useState(false)
  const [activeMenu, setActiveMenu]     = useState(null)
  const [mobileExpanded, setMobileExpanded] = useState(null)
  const { itemCount }      = useCart()
  const { items: wishlist } = useWishlist()
  const { user }           = useAuth()
  const location           = useLocation()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setActiveMenu(null)
    setMobileExpanded(null)
  }, [location.pathname, location.search])

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const isHome    = location.pathname === '/'
  const transparent = isHome && !scrolled

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">

        {/* ── Announcement bar ── */}
        <div className="bg-[#8B1A4A] overflow-hidden" style={{ height: 28 }}>
          <div className="marquee-wrap h-full flex items-center">
            <div className="marquee-track">
              {[...MARQUEE, ...MARQUEE].map((t, i) => (
                <span key={i} className="text-[#ead08a] text-[10px] font-sans tracking-[0.15em] whitespace-nowrap px-6">{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main header ── */}
        <header className={`transition-all duration-300 ${transparent ? 'bg-transparent' : 'bg-white border-b border-gray-100 shadow-sm'}`}>
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between h-14 sm:h-16 lg:h-18">

            {/* Logo */}
            <Link to="/" className="shrink-0">
              <img src="/images/imgi_1_CHIPADE_LOGO_PNG.png" alt="Chipade Saraf"
                className="h-9 sm:h-11 lg:h-13 w-auto object-contain" />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center">
              {NAV.map(link => (
                <div key={link.label} className="relative"
                  onMouseEnter={() => setActiveMenu(link.label)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <NavLink to={link.href} end={link.href === '/'}
                    className={({ isActive }) =>
                      `flex items-center gap-0.5 px-2.5 xl:px-3 py-2 text-[12px] xl:text-[13px] font-sans font-medium tracking-wide whitespace-nowrap transition-colors ${
                        transparent
                          ? isActive ? 'text-[#ead08a]' : 'text-white hover:text-[#ead08a]'
                          : isActive ? 'text-[#8B1A4A]' : 'text-gray-700 hover:text-[#8B1A4A]'
                      }`
                    }
                  >
                    {link.label}
                    {link.children && <FiChevronDown size={11} className="opacity-50 mt-px" />}
                  </NavLink>
                  <AnimatePresence>
                    {link.children && activeMenu === link.label && (
                      <motion.div initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }}
                        exit={{ opacity:0, y:4 }} transition={{ duration:0.12 }}
                        className="absolute top-full left-0 min-w-[190px] bg-white border border-gray-100 shadow-xl py-2 z-50"
                      >
                        {link.children.map(child => (
                          <Link key={child.label} to={child.href}
                            className="block px-5 py-2.5 text-[12px] font-sans text-gray-700 hover:bg-[#8B1A4A]/5 hover:text-[#8B1A4A] transition-colors">
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* Action icons */}
            <div className="flex items-center gap-0">
              <button onClick={() => window.dispatchEvent(new CustomEvent('open-search'))}
                className={`p-2 sm:p-2.5 transition-colors ${transparent ? 'text-white' : 'text-gray-700 hover:text-[#8B1A4A]'}`}>
                <FiSearch size={18} />
              </button>
              <Link to={user ? '/account' : '/auth/login'}
                className={`p-2 sm:p-2.5 hidden sm:flex transition-colors ${transparent ? 'text-white' : 'text-gray-700 hover:text-[#8B1A4A]'}`}>
                <FiUser size={18} />
              </Link>
              <Link to="/wishlist"
                className={`relative p-2 sm:p-2.5 transition-colors ${transparent ? 'text-white' : 'text-gray-700 hover:text-[#8B1A4A]'}`}>
                <FiHeart size={18} />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#8B1A4A] text-white text-[8px] flex items-center justify-center rounded-full font-bold leading-none">{wishlist.length}</span>
                )}
              </Link>
              <button onClick={() => window.dispatchEvent(new CustomEvent('open-cart'))}
                className={`relative p-2 sm:p-2.5 transition-colors ${transparent ? 'text-white' : 'text-gray-700 hover:text-[#8B1A4A]'}`}>
                <FiShoppingBag size={18} />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#C8963C] text-white text-[8px] flex items-center justify-center rounded-full font-bold leading-none">{itemCount}</span>
                )}
              </button>
              {/* Hamburger */}
              <button onClick={() => setMobileOpen(o => !o)}
                className={`lg:hidden p-2 sm:p-2.5 ml-0.5 transition-colors ${transparent ? 'text-white' : 'text-gray-700'}`}
                aria-label="Menu">
                {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
              </button>
            </div>
          </div>
        </header>

        {/* ── Mobile drawer ── */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              {/* Backdrop */}
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                className="lg:hidden fixed inset-0 bg-black/50 z-40" style={{ top: 56 }}
                onClick={() => setMobileOpen(false)} />

              {/* Slide-in panel */}
              <motion.div
                initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                transition={{ type:'tween', duration: 0.25 }}
                className="lg:hidden fixed right-0 top-0 bottom-0 w-[85vw] max-w-[340px] bg-white z-50 flex flex-col overflow-y-auto"
                style={{ top: 56 }}
              >
                {/* User row */}
                <div className="flex items-center gap-3 p-4 bg-[#8B1A4A]">
                  <div className="w-9 h-9 rounded-full bg-[#C8963C]/30 flex items-center justify-center">
                    <FiUser size={16} className="text-[#ead08a]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-sans text-white text-xs font-semibold">{user ? user.name || 'My Account' : 'Welcome!'}</p>
                    <Link to={user ? '/account' : '/auth/login'} className="font-sans text-[#ead08a] text-[11px]">
                      {user ? 'View account →' : 'Login / Register →'}
                    </Link>
                  </div>
                </div>

                {/* Nav links */}
                <div className="flex-1">
                  {NAV.map(link => (
                    <div key={link.label} className="border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <Link to={link.href}
                          onClick={() => !link.children && setMobileOpen(false)}
                          className="flex-1 px-5 py-3.5 font-sans font-semibold text-sm text-gray-800 hover:text-[#8B1A4A] active:bg-gray-50">
                          {link.label}
                        </Link>
                        {link.children && (
                          <button
                            onClick={() => setMobileExpanded(mobileExpanded === link.label ? null : link.label)}
                            className="px-4 py-3.5 text-gray-400">
                            <FiChevronDown size={15}
                              className={`transition-transform duration-200 ${mobileExpanded === link.label ? 'rotate-180 text-[#8B1A4A]' : ''}`} />
                          </button>
                        )}
                      </div>
                      <AnimatePresence>
                        {link.children && mobileExpanded === link.label && (
                          <motion.div initial={{ height:0 }} animate={{ height:'auto' }}
                            exit={{ height:0 }} transition={{ duration:0.2 }}
                            className="overflow-hidden bg-[#FDF8F0]"
                          >
                            {link.children.map(c => (
                              <Link key={c.label} to={c.href}
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center gap-2 px-7 py-2.5 font-sans text-sm text-gray-600 hover:text-[#8B1A4A] border-b border-white/60 last:border-0">
                                <span className="w-1 h-1 rounded-full bg-[#C8963C] shrink-0" />
                                {c.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>

                {/* Bottom CTAs */}
                <div className="p-4 flex flex-col gap-3 border-t border-gray-100 bg-gray-50">
                  <Link to="/shop?occasion=bridal" onClick={() => setMobileOpen(false)}
                    className="btn-crimson justify-center text-xs">SHOP BRIDAL COLLECTION</Link>
                  <Link to="/contact" onClick={() => setMobileOpen(false)}
                    className="btn-gold justify-center text-xs">BOOK APPOINTMENT</Link>
                  <div className="text-center mt-1">
                    <a href="tel:02312544441" className="font-sans text-xs text-gray-500">📞 0231-2544441</a>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

      </div>
    </>
  )
}
