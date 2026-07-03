import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { RiArrowRightLine, RiPlayCircleLine } from 'react-icons/ri'
import { APP_NAME, APP_TAGLINE } from '@/constants'

const HERO_SLIDES = [
  {
    bg:       '#0F0F0F',
    label:    'New Bridal Collection 2025',
    headline: ['Adorned in', 'Gold & Grace'],
    sub:      'Discover heirloom-quality jewellery crafted for life\'s most precious moments.',
    cta:      { label: 'Explore Bridal', href: '/shop?category=bridal' },
    cta2:     { label: 'View Lookbook', href: '/about' },
    accent:   '#C8A165',
  },
  {
    bg:       '#1a1410',
    label:    'Diamond Solitaire Collection',
    headline: ['Where Light', 'Becomes Art'],
    sub:      'Each diamond selected for brilliance, fire, and scintillation. Certified. Flawless. Yours.',
    cta:      { label: 'Shop Diamonds', href: '/shop?category=diamond' },
    cta2:     { label: 'Watch Film',   href: '/about' },
    accent:   '#C8A165',
  },
  {
    bg:       '#0a0a0a',
    label:    'Temple Jewellery Heritage',
    headline: ['Ancient Craft,', 'Eternal Beauty'],
    sub:      'Temple jewellery inspired by centuries of South Indian artistry. Hand-crafted, hallmarked.',
    cta:      { label: 'Explore Temple', href: '/shop?category=temple' },
    cta2:     { label: 'Our Story',    href: '/about' },
    accent:   '#C8A165',
  },
]

export default function HeroSection() {
  const containerRef = useRef(null)
  const headlineRef  = useRef(null)
  const subRef       = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline()
    tl.fromTo(
      headlineRef.current?.children,
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.12, duration: 1, ease: 'power3.out' },
    )
    tl.fromTo(
      subRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
      '-=0.4',
    )
  }, [])

  const slide = HERO_SLIDES[0]

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: slide.bg }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gold gradient orbs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.07, 0.12, 0.07] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(200,161,101,0.15) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(200,161,101,0.12) 0%, transparent 70%)' }}
        />

        {/* Diagonal lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" preserveAspectRatio="none">
          {[...Array(12)].map((_, i) => (
            <line
              key={i}
              x1={`${(i * 100) / 12}%`} y1="0"
              x2={`${(i * 100) / 12 - 20}%`} y2="100%"
              stroke="#C8A165" strokeWidth="1"
            />
          ))}
        </svg>

        {/* Floating geometric shape */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="absolute right-8 top-1/2 -translate-y-1/2 opacity-10 hidden lg:block"
        >
          <svg width="300" height="300" viewBox="0 0 300 300">
            <polygon points="150,10 290,75 290,225 150,290 10,225 10,75"
              fill="none" stroke="#C8A165" strokeWidth="0.8" />
            <polygon points="150,40 260,98 260,202 150,260 40,202 40,98"
              fill="none" stroke="#C8A165" strokeWidth="0.4" />
            <polygon points="150,70 230,120 230,180 150,230 70,180 70,120"
              fill="none" stroke="#C8A165" strokeWidth="0.2" />
          </svg>
        </motion.div>
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 section-padding max-w-7xl mx-auto w-full
                      grid lg:grid-cols-2 gap-16 items-center py-24">

        {/* Left: Text */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-8 h-px bg-gold-500" />
            <span className="font-poppins text-[11px] font-semibold tracking-[0.3em] uppercase text-gold-400">
              {slide.label}
            </span>
          </motion.div>

          <div ref={headlineRef} className="overflow-hidden mb-6">
            {slide.headline.map((line, i) => (
              <div key={i} className="overflow-hidden">
                <h1
                  className={`font-playfair font-bold leading-[0.95] tracking-tight
                    text-6xl md:text-7xl lg:text-8xl xl:text-9xl
                    ${i === 0 ? 'text-cream' : 'text-gradient-gold'}`}
                >
                  {line}
                </h1>
              </div>
            ))}
          </div>

          <p ref={subRef}
            className="font-cormorant text-xl text-cream/50 leading-relaxed max-w-md mb-10">
            {slide.sub}
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Link to={slide.cta.href} className="btn-gold">
              {slide.cta.label}
              <RiArrowRightLine />
            </Link>
            <Link
              to={slide.cta2.href}
              className="flex items-center gap-2 font-poppins text-xs font-medium
                         tracking-widest uppercase text-cream/60 hover:text-cream transition-colors"
            >
              <RiPlayCircleLine size={20} />
              {slide.cta2.label}
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex items-center gap-10 mt-14 pt-10 border-t border-white/8"
          >
            {[
              { value: '50K+',  label: 'Happy Clients'   },
              { value: '12K+',  label: 'Designs'          },
              { value: '25+',   label: 'Years of Craft'   },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="font-playfair text-3xl font-bold text-gold-400">{value}</p>
                <p className="font-inter text-xs text-cream/30 tracking-wider mt-0.5">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: Product showcase */}
        <div className="relative hidden lg:flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative w-[420px] h-[560px]"
          >
            {/* Main product image */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dark/40 z-10 rounded-none" />
            <img
              src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=840&auto=format&fit=crop&q=80"
              alt="Featured jewellery"
              className="w-full h-full object-cover"
            />

            {/* Floating card */}
            <motion.div
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-8 -left-10 z-20 glass-dark px-5 py-4 w-52"
            >
              <p className="font-poppins text-[10px] tracking-widest uppercase text-gold-400 mb-1">
                New Arrival
              </p>
              <p className="font-playfair text-sm text-cream leading-tight">
                Celestial Diamond Necklace
              </p>
              <p className="font-cormorant text-lg font-semibold text-gold-400 mt-1">
                ₹2,45,000
              </p>
            </motion.div>

            {/* Small accent card */}
            <motion.div
              animate={{ y: [4, -4, 4] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute -top-6 -right-8 z-20 glass-dark p-3 w-36 text-center"
            >
              <div className="text-gold-400 text-2xl mb-1">22K</div>
              <p className="font-poppins text-[9px] tracking-wider text-cream/50 uppercase">
                BIS Hallmarked
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-poppins text-[10px] tracking-[0.3em] uppercase text-cream/25">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-10 bg-gradient-to-b from-gold-500 to-transparent"
        />
      </motion.div>
    </section>
  )
}
