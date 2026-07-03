import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { FiArrowRight, FiChevronLeft, FiChevronRight, FiTruck, FiHeadphones, FiRotateCcw, FiShield } from 'react-icons/fi'

/* ─────────────────────────────────────────
   HERO CAROUSEL
───────────────────────────────────────── */
const SLIDES = [
  {
    image: '/images/imgi_2_Artboard_1.jpg_1.jpg',
    cta1:  { label: 'SHOP THE LOOK',     href: '/shop?occasion=bridal' },
    cta2:  { label: 'EXPLORE HERITAGE',  href: '/about' },
    split: false,
  },
  {
    image: '/images/imgi_3_Artboard_1_copy_4_jpg.jpg',
    cta1:  { label: 'SHOP FORMING SETS', href: '/shop?category=forming' },
    cta2:  { label: 'VIEW ALL DESIGNS',  href: '/shop' },
    split: false,
  },
  {
    image:   '/images/imgi_5_111_jpg.jpg',
    tag:     'Bridal Collection',
    heading: 'Adorn Your\nLove Story',
    sub:     'Complete bridal sets in 22K gold — from Kolhapuri saaj to layered necklace sets.',
    cta1:    { label: 'SHOP BRIDAL',      href: '/shop?occasion=bridal' },
    cta2:    { label: 'BOOK APPOINTMENT', href: '/contact' },
    split:   true,
  },
]

/* Navbar height: 28px announcement + 56px header (mobile) = 84px */
const NAV_H = 84

function HeroCarousel() {
  const [idx, setIdx] = useState(0)
  const prev = () => setIdx(i => (i - 1 + SLIDES.length) % SLIDES.length)
  const next = () => setIdx(i => (i + 1) % SLIDES.length)
  useEffect(() => { const t = setInterval(next, 5000); return () => clearInterval(t) }, [])
  const slide = SLIDES[idx]

  return (
    <section className="bg-[#1a0a0f]" style={{ paddingTop: NAV_H }}>
      {/*
        Mobile: images are landscape 1500×525 (ratio ~2.86:1).
        Use padding-top trick to keep natural ratio on mobile.
        Desktop (md+): switch to full viewport height.
      */}
      <div className="relative w-full overflow-hidden"
        style={{ paddingTop: 'min(52%, calc(100vh - 84px))' }}>
        <div className="absolute inset-0">
          {SLIDES.map((s, i) => (
            <div key={i}
              className={`transition-opacity duration-1000 absolute inset-0 ${i === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              {s.split ? (
                /* Slide 3 — text panel full width on mobile, split on desktop */
                <div className="flex flex-col md:flex-row h-full">
                  <div className="flex flex-col justify-center bg-[#1a0a0f] px-6 sm:px-10 md:px-14 py-8 md:py-0 w-full md:w-[50%] shrink-0">
                    <span className="inline-block text-[#C8963C] text-[9px] sm:text-[10px] font-sans font-bold tracking-[0.28em] uppercase mb-3 border border-[#C8963C]/40 px-2.5 py-1 self-start">
                      {s.tag}
                    </span>
                    <h2 className="font-serif text-xl sm:text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-3 whitespace-pre-line">
                      {s.heading}
                    </h2>
                    <p className="font-sans text-white/55 text-xs sm:text-sm leading-relaxed mb-5 max-w-xs hidden sm:block">{s.sub}</p>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      <Link to={s.cta1.href} className="btn-crimson" style={{ fontSize: 10, padding: '8px 14px' }}>{s.cta1.label}</Link>
                      <Link to={s.cta2.href} className="btn-outline-white" style={{ fontSize: 10, padding: '8px 14px' }}>{s.cta2.label}</Link>
                    </div>
                  </div>
                  <div className="hidden md:block flex-1 overflow-hidden">
                    <img src={s.image} alt="Chipade Saraf Bridal" className="w-full h-full object-cover object-center" />
                  </div>
                </div>
              ) : (
                <>
                  {/* Landscape banner — cover on desktop, contain-width on mobile */}
                  <div className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${s.image})`,
                      backgroundSize: '100% 100%',
                      backgroundPosition: 'center top',
                      backgroundRepeat: 'no-repeat',
                    }} />
                  <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-32"
                    style={{ background: 'linear-gradient(to top, rgba(26,10,15,0.85) 0%, transparent 100%)' }} />
                </>
              )}
            </div>
          ))}

          {/* Arrows */}
          <button onClick={prev} className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center bg-black/40 hover:bg-[#8B1A4A] text-white transition-colors rounded-sm">
            <FiChevronLeft size={14} />
          </button>
          <button onClick={next} className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center bg-black/40 hover:bg-[#8B1A4A] text-white transition-colors rounded-sm">
            <FiChevronRight size={14} />
          </button>

          {/* CTA overlay — landscape slides */}
          {!slide.split && (
            <div className="absolute bottom-0 left-0 right-0 z-10 pb-3 sm:pb-6">
              <AnimatePresence mode="wait">
                <motion.div key={idx} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} transition={{ duration:0.3 }}
                  className="flex justify-center gap-2 sm:gap-4 px-4">
                  <Link to={slide.cta1.href} className="btn-crimson shadow-lg" style={{ fontSize:9, padding:'7px 12px' }}>{slide.cta1.label}</Link>
                  <Link to={slide.cta2.href} className="btn-outline-white" style={{ fontSize:9, padding:'7px 12px' }}>{slide.cta2.label}</Link>
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Dots row */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-2 max-w-7xl mx-auto">
        <div className="flex gap-1.5">
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)}
              className={`rounded-full transition-all duration-300 ${i === idx ? 'w-5 sm:w-8 h-1.5 bg-[#C8963C]' : 'w-1.5 h-1.5 bg-white/20'}`} />
          ))}
        </div>
        <span className="text-white/25 text-[9px] font-sans tracking-widest uppercase hidden sm:block">Since 1904 ✦ Kolhapur</span>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────
   SHOP BY CATEGORY
───────────────────────────────────────── */
const CATEGORIES = [
  { name:'Gold',      image:'/images/imgi_8_Gold.jfif.jpg',               href:'/shop?category=gold' },
  { name:'Forming',   image:'/images/imgi_9_Forming.jfif.jpg',            href:'/shop?category=forming' },
  { name:'Silver',    image:'/images/imgi_10_Silver_jewellery.jfif.jpg',  href:'/shop?category=silver' },
  { name:'Daily Wear',image:'/images/imgi_11_Daily_Wear.jfif.jpg',        href:'/shop?category=daily-wear' },
  { name:'Diamond',   image:'/images/imgi_12_Diamond.jfif.jpg',           href:'/shop?category=diamond' },
]

function ShopByCategory() {
  return (
    <section className="py-10 sm:py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-7 sm:mb-10">
          <p className="label-gold mb-1.5">Browse</p>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-gray-900">Shop By Category</h2>
          <div className="w-12 h-0.5 bg-[#C8963C] mx-auto mt-3" />
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-5">
          {CATEGORIES.map((cat, i) => (
            <motion.div key={cat.name} initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ delay: i*0.07 }}>
              <Link to={cat.href} className="group block text-center">
                <div className="relative overflow-hidden aspect-square bg-gray-50 mb-2">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-[#8B1A4A]/0 group-hover:bg-[#8B1A4A]/20 transition-colors" />
                </div>
                <h3 className="font-sans font-semibold text-[10px] sm:text-xs text-gray-800 group-hover:text-[#8B1A4A] transition-colors tracking-wide uppercase">{cat.name}</h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────
   HERITAGE SECTION
───────────────────────────────────────── */
function HeritageSection() {
  return (
    <section className="flex flex-col md:grid md:grid-cols-2">
      {/* Image is portrait 450×900 — show full image using natural aspect ratio */}
      <div className="overflow-hidden">
        <img src="/images/imgi_13_Bride_jpg.jpg" alt="Heritage" className="w-full h-auto block" />
      </div>
      <motion.div initial={{ opacity:0, x:30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
        className="bg-[#8B1A4A] flex flex-col justify-center px-6 sm:px-10 md:px-14 lg:px-20 py-12 sm:py-16">
        <span className="label-gold mb-3 block">Heritage Collection</span>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white leading-tight mb-4">The Essence of<br />Heritage</h2>
        <p className="font-sans text-white/65 text-sm leading-relaxed mb-6 max-w-sm">
          Celebrate your roots with our signature Kolhapuri Saaj and Thushi sets. Handcrafted by master artisans since 1904.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/shop?occasion=bridal" className="btn-gold" style={{ fontSize:11 }}>SHOP THE LOOK</Link>
          <Link to="/about" className="btn-outline-white" style={{ fontSize:11 }}>EXPLORE HERITAGE</Link>
        </div>
      </motion.div>
    </section>
  )
}

/* ─────────────────────────────────────────
   FORMING SECTION
───────────────────────────────────────── */
function FormingSection() {
  return (
    <section className="flex flex-col md:grid md:grid-cols-2">
      <motion.div initial={{ opacity:0, x:-30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
        className="bg-[#1a0a0f] flex flex-col justify-center px-6 sm:px-10 md:px-14 lg:px-20 py-12 sm:py-16 order-2 md:order-1">
        <span className="label-gold mb-3 block">Forming Jewellery</span>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white leading-tight mb-4">Luxury<br />Within Reach</h2>
        <p className="font-sans text-white/60 text-sm leading-relaxed mb-6 max-w-sm">
          Premium forming jewellery with a mirror-bright gold finish — the look of pure gold at a fraction of the price.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/shop?category=forming" className="btn-gold" style={{ fontSize:11 }}>SHOP FORMING</Link>
          <Link to="/shop?category=forming" className="btn-outline-white" style={{ fontSize:11 }}>VIEW ALL</Link>
        </div>
      </motion.div>
      {/* Forming image is square 736×736 — show full */}
      <div className="overflow-hidden order-1 md:order-2">
        <img src="/images/imgi_9_Forming.jfif.jpg" alt="Forming Jewellery" className="w-full h-auto block" />
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────
   WEDDING / COLLECTIONS FEATURE
───────────────────────────────────────── */
function WeddingFeature() {
  return (
    <section className="py-10 sm:py-14 bg-[#FDF8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-7 sm:mb-10">
          <p className="label-gold mb-1.5">For Every Occasion</p>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-gray-900">Featured Collections</h2>
          <div className="w-12 h-0.5 bg-[#C8963C] mx-auto mt-3" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {[
            { img:'/images/imgi_18_allcollectionsphoto.png', label:'Bridal Season 2025', title:'Wedding Collections', href:'/shop?occasion=bridal', btnLabel:'WEDDINGS COLLECTIONS', btnBg:'#8B1A4A', btnColor:'#ead08a' },
            { img:'/images/imgi_30_footerbigimage_1.png',    label:'Gifting & Occasions', title:'Make It Memorable',  href:'/shop',                  btnLabel:'EXPLORE GIFTING',       btnBg:'#C8963C', btnColor:'#fff' },
          ].map((c, i) => (
            <motion.div key={c.title} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ delay: i*0.1 }}
              className="relative overflow-hidden group cursor-pointer" style={{ minHeight: 280 }}>
              <img src={c.img} alt={c.title} className="w-full h-full object-cover object-top absolute inset-0 transition-transform duration-700 group-hover:scale-105" style={{ minHeight: 280 }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
                <p className="text-white/65 text-[10px] font-sans tracking-widest uppercase mb-1.5">{c.label}</p>
                <h3 className="font-serif text-xl sm:text-2xl md:text-3xl text-white mb-3">{c.title}</h3>
                <Link to={c.href}
                  style={{ background: c.btnBg, color: c.btnColor }}
                  className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 text-[10px] font-sans font-bold tracking-widest uppercase">
                  {c.btnLabel} <FiArrowRight size={11} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────
   TABBED COLLECTIONS
───────────────────────────────────────── */
const TABS = [
  { label:'Earrings',  products:[
    { name:'Paisley Ruby Earrings', price:'₹22,500', image:'/images/imgi_25_Earrings_jpg.jpg' },
    { name:'Gold Jhumka Set',       price:'₹18,000', image:'/images/imgi_24_Earrings2_jpg.jpg' },
    { name:'Diamond Drop Earrings', price:'₹85,000', image:'/images/imgi_73_Earrings2_jpg.jpg' },
    { name:'Gold Chandbali',        price:'₹32,000', image:'/images/imgi_74_Earrings_jpg.jpg' },
  ]},
  { label:'Necklaces', products:[
    { name:'Kolhapuri Saaj Set',    price:'₹1,45,000', image:'/images/imgi_29_Necklace1_jpg.jpg' },
    { name:'Pearl & Ruby Choker',   price:'₹98,500',   image:'/images/imgi_28_Necklace2_jpg.jpg' },
    { name:'Temple Necklace',       price:'₹1,12,000', image:'/images/imgi_124_Necklace_jpg.jpg' },
    { name:'Diamond Necklace Set',  price:'₹3,25,000', image:'/images/imgi_12_Diamond.jfif.jpg' },
  ]},
  { label:'Bracelets', products:[
    { name:'Gold Chain Bracelet',    price:'₹65,000',  image:'/images/imgi_27_bracelet.jpg' },
    { name:'Diamond Tennis Bracelet',price:'₹2,80,000',image:'/images/imgi_76_bracelet.jpg' },
    { name:'Gold Bangle Set',        price:'₹42,000',  image:'/images/imgi_20_2bangles_news.png' },
    { name:'Traditional Bangles',    price:'₹38,500',  image:'/images/imgi_71_2bangles_news.png' },
  ]},
  { label:'Rings',     products:[
    { name:'Gold Solitaire Ring',   price:'₹55,000',  image:'/images/imgi_8_Gold.jfif.jpg' },
    { name:'Diamond Floral Ring',   price:'₹1,85,000',image:'/images/imgi_11_Daily_Wear.jfif.jpg' },
    { name:'Forming Ring Set',      price:'₹8,500',   image:'/images/imgi_9_Forming.jfif.jpg' },
    { name:'Ruby Studded Ring',     price:'₹28,000',  image:'/images/imgi_10_Silver_jewellery.jfif.jpg' },
  ]},
]

function TabbedCollections() {
  const [active, setActive] = useState(0)
  return (
    <section className="py-10 sm:py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8">
          <p className="label-gold mb-1.5">Handcrafted With Love</p>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-gray-900">Our Finest Pieces</h2>
          <div className="w-12 h-0.5 bg-[#C8963C] mx-auto mt-3" />
        </div>
        {/* Tabs — scrollable on mobile */}
        <div className="flex gap-0 border-b border-gray-200 mb-6 sm:mb-8 overflow-x-auto scrollbar-hide">
          {TABS.map((tab, i) => (
            <button key={tab.label} onClick={() => setActive(i)}
              className={`px-4 sm:px-6 py-3 font-sans text-xs sm:text-sm font-semibold tracking-wide uppercase whitespace-nowrap border-b-2 -mb-px transition-all flex-shrink-0 ${
                active === i ? 'border-[#8B1A4A] text-[#8B1A4A]' : 'border-transparent text-gray-500'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:-10 }} transition={{ duration:0.25 }}
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
            {TABS[active].products.map((p, i) => (
              <Link key={i} to="/shop" className="group block card-product">
                <div className="aspect-square overflow-hidden bg-gray-50">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-2.5 sm:p-4">
                  <h3 className="font-sans text-[11px] sm:text-sm text-gray-800 truncate font-medium">{p.name}</h3>
                  <p className="text-[#C8963C] font-sans font-semibold text-xs sm:text-sm mt-1">{p.price}</p>
                </div>
              </Link>
            ))}
          </motion.div>
        </AnimatePresence>
        <div className="text-center mt-6 sm:mt-8">
          <Link to="/shop" className="btn-crimson inline-flex" style={{ fontSize:11 }}>EXPLORE ALL <FiArrowRight className="ml-1.5" /></Link>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────
   NECKLACE SECTION
───────────────────────────────────────── */
const NECKLACES = [
  { name:'Kolhapuri Saaj Set',   price:'₹1,45,000', image:'/images/imgi_29_Necklace1_jpg.jpg', tag:'Bestseller' },
  { name:'Pearl & Ruby Choker',  price:'₹98,500',   image:'/images/imgi_28_Necklace2_jpg.jpg', tag:'New' },
  { name:'Temple Necklace',      price:'₹1,12,000', image:'/images/imgi_124_Necklace_jpg.jpg', tag:'' },
  { name:'Diamond Layered Set',  price:'₹3,25,000', image:'/images/imgi_12_Diamond.jfif.jpg',  tag:'Luxury' },
  { name:'Gold Thushi Set',      price:'₹85,000',   image:'/images/imgi_29_Necklace1_jpg.jpg', tag:'' },
  { name:'Antique Necklace Set', price:'₹1,65,000', image:'/images/imgi_28_Necklace2_jpg.jpg', tag:'' },
]

function NecklaceSection() {
  return (
    <section className="py-10 sm:py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-7 sm:mb-10 gap-3">
          <div>
            <p className="label-gold mb-1.5">Statement Pieces</p>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-gray-900">Necklace Collections</h2>
            <div className="w-12 h-0.5 bg-[#C8963C] mt-3" />
          </div>
          <Link to="/shop?category=necklaces" className="btn-crimson self-start sm:self-auto" style={{ fontSize:10, padding:'8px 14px' }}>
            VIEW ALL <FiArrowRight className="ml-1 inline" />
          </Link>
        </div>

        {/* Mobile: simple 2-col grid | Desktop: 1 large + list */}
        <div className="block md:hidden">
          <div className="grid grid-cols-2 gap-3">
            {NECKLACES.slice(0, 4).map((item, i) => (
              <Link key={i} to="/shop?category=necklaces" className="group block card-product">
                <div className="aspect-square overflow-hidden bg-gray-50 relative">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  {item.tag && <span className="absolute top-2 left-2 badge-crimson text-[9px]">{item.tag}</span>}
                </div>
                <div className="p-2.5">
                  <h3 className="font-sans text-[11px] font-medium text-gray-800 truncate">{item.name}</h3>
                  <p className="text-[#C8963C] font-bold text-xs mt-0.5">{item.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden md:grid md:grid-cols-3 gap-5">
          {/* Large featured */}
          <motion.div initial={{ opacity:0, x:-20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
            className="md:row-span-2 relative overflow-hidden group" style={{ minHeight:400 }}>
            <Link to="/shop?category=necklaces" className="block h-full">
              <img src={NECKLACES[0].image} alt={NECKLACES[0].name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 absolute inset-0" style={{ minHeight:400 }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="badge-gold mb-2 inline-block">{NECKLACES[0].tag}</span>
                <h3 className="font-serif text-xl text-white mb-1">{NECKLACES[0].name}</h3>
                <p className="text-[#C8963C] font-bold">{NECKLACES[0].price}</p>
              </div>
            </Link>
          </motion.div>
          {/* 5 horizontal cards */}
          {NECKLACES.slice(1).map((item, i) => (
            <motion.div key={i} initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ delay: i*0.06 }}>
              <Link to="/shop?category=necklaces" className="group flex gap-3 card-product p-3">
                <div className="w-20 h-20 shrink-0 overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  {item.tag && <span className="badge-crimson mb-1 self-start text-[9px]">{item.tag}</span>}
                  <h3 className="font-sans text-sm font-semibold text-gray-800 group-hover:text-[#8B1A4A] truncate">{item.name}</h3>
                  <p className="text-[#C8963C] font-bold text-sm mt-0.5">{item.price}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────
   RINGS SECTION
───────────────────────────────────────── */
const RINGS = [
  { name:'Diamond Solitaire Ring',  price:'₹1,85,000', image:'/images/imgi_12_Diamond.jfif.jpg',         tag:'Luxury' },
  { name:'Gold Floral Band Ring',   price:'₹55,000',   image:'/images/imgi_8_Gold.jfif.jpg',             tag:'' },
  { name:'Ruby Studded Ring',       price:'₹28,000',   image:'/images/imgi_11_Daily_Wear.jfif.jpg',      tag:'New' },
  { name:'Forming Ring Set',        price:'₹8,500',    image:'/images/imgi_9_Forming.jfif.jpg',          tag:'' },
  { name:'Silver Oxidised Ring',    price:'₹3,200',    image:'/images/imgi_10_Silver_jewellery.jfif.jpg',tag:'' },
  { name:'Engagement Ring Set',     price:'₹2,40,000', image:'/images/imgi_12_Diamond.jfif.jpg',         tag:'Bridal' },
]

function RingsSection() {
  return (
    <section className="py-10 sm:py-14 bg-[#1a0a0f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-7 sm:mb-10 gap-3">
          <div>
            <p className="label-gold mb-1.5">Symbols of Love</p>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white">Rings Collection</h2>
            <div className="w-12 h-0.5 bg-[#C8963C] mt-3" />
          </div>
          <Link to="/shop?category=rings" className="btn-gold self-start sm:self-auto" style={{ fontSize:10, padding:'8px 14px' }}>
            SHOP ALL RINGS <FiArrowRight className="ml-1 inline" />
          </Link>
        </div>
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {RINGS.map((ring, i) => (
            <motion.div key={i} initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ delay: i*0.06 }}>
              <Link to="/shop?category=rings" className="group block text-center">
                <div className="relative overflow-hidden aspect-square bg-[#2a1520] mb-2">
                  <img src={ring.image} alt={ring.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  {ring.tag && <span className="absolute top-1 left-1 badge-gold text-[8px] sm:text-[9px]">{ring.tag}</span>}
                </div>
                <h3 className="font-sans text-[10px] sm:text-xs text-white/75 group-hover:text-[#ead08a] leading-tight mb-0.5 line-clamp-2">{ring.name}</h3>
                <p className="text-[#C8963C] font-bold text-[10px] sm:text-xs">{ring.price}</p>
              </Link>
            </motion.div>
          ))}
        </div>
        {/* Custom order strip */}
        <div className="mt-8 sm:mt-12 border border-[#C8963C]/30 p-6 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="label-gold mb-1.5">Custom Orders</p>
            <h3 className="font-serif text-xl sm:text-2xl md:text-3xl text-white">Design Your Dream Ring</h3>
            <p className="font-sans text-white/50 text-xs sm:text-sm mt-1.5 max-w-md">
              Work with our master craftsmen to create a bespoke engagement or wedding ring.
            </p>
          </div>
          <Link to="/contact" className="btn-gold shrink-0" style={{ fontSize:11 }}>ENQUIRE NOW <FiArrowRight className="ml-1 inline" /></Link>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────
   BRIDAL LOOKBOOK
───────────────────────────────────────── */
const BRIDE_IMGS = [
  '/images/imgi_13_Bride_jpg.jpg',
  '/images/imgi_14_Bride_back_1_jpg.jpg',
  '/images/imgi_15_Bride_back_2_jpg.jpg',
  '/images/imgi_16_Bride_back_3_jpg.jpg',
  '/images/imgi_17_Bride_back_4_jpg.jpg',
]

function BridalLookbook() {
  return (
    <section className="py-10 sm:py-14 bg-[#FDF8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6 sm:mb-8">
          <div>
            <p className="label-gold mb-1.5">Bridal Lookbook</p>
            <h2 className="font-serif text-2xl sm:text-3xl text-gray-900">The Bridal Edit</h2>
          </div>
          <Link to="/shop?occasion=bridal" className="text-[#8B1A4A] text-xs sm:text-sm font-sans font-semibold flex items-center gap-1">
            View All <FiArrowRight size={13} />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3">
          {BRIDE_IMGS.map((img, i) => (
            <motion.div key={i} initial={{ opacity:0, y:14 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ delay: i*0.06 }}
              className={i >= 2 ? 'hidden lg:block' : ''}>
              <Link to="/shop?occasion=bridal" className="group block relative overflow-hidden aspect-[3/4]">
                <img src={img} alt="Bridal jewellery" className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-[#8B1A4A]/0 group-hover:bg-[#8B1A4A]/15 transition-colors" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────
   TRUST BADGES
───────────────────────────────────────── */
const TRUST = [
  { icon:FiTruck,      title:'Free Shipping', sub:'On orders above ₹999' },
  { icon:FiHeadphones, title:'Support 24/7',  sub:'Dedicated customer care' },
  { icon:FiRotateCcw,  title:'30 Days Return',sub:'Hassle-free returns' },
  { icon:FiShield,     title:'Secure Payment',sub:'SSL encrypted checkout' },
]

function TrustBadges() {
  return (
    <section className="bg-[#8B1A4A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-white/10">
          {TRUST.map(({ icon:Icon, title, sub }) => (
            <div key={title} className="flex flex-col items-center text-center py-6 sm:py-8 px-3 sm:px-6 gap-2 sm:gap-3">
              <Icon size={22} className="text-[#ead08a]" />
              <div>
                <p className="font-sans font-bold text-white text-[11px] sm:text-sm tracking-wide uppercase">{title}</p>
                <p className="font-sans text-white/55 text-[10px] sm:text-xs mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────
   PROMO BANNER
───────────────────────────────────────── */
function PromoBanner() {
  return (
    <section className="relative overflow-hidden py-14 sm:py-20">
      <img src="/images/imgi_26_selection.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/65" />
      <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
        className="relative z-10 text-center max-w-xl mx-auto px-5">
        <p className="label-gold mb-3">Limited Time</p>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white mb-3 leading-tight">
          Your favourite jewellery,<br />for less.
        </h2>
        <p className="font-sans text-white/65 mb-6 text-sm sm:text-base">
          Save up to <span className="text-[#ead08a] font-bold">20%</span> on selected jewellery
        </p>
        <Link to="/shop" className="btn-gold inline-flex" style={{ fontSize:11 }}>
          EXPLORE OFFERS <FiArrowRight className="ml-1.5" />
        </Link>
      </motion.div>
    </section>
  )
}

/* ─────────────────────────────────────────
   NEWSLETTER
───────────────────────────────────────── */
function Newsletter() {
  const [email, setEmail] = useState('')
  const [done, setDone]   = useState(false)
  return (
    <section className="bg-[#1a0a0f] py-12 sm:py-14">
      <div className="max-w-lg mx-auto px-5 text-center">
        <p className="label-gold mb-2">Stay Updated</p>
        <h2 className="font-serif text-2xl sm:text-3xl text-white mb-2">Stay in the Glow</h2>
        <p className="font-sans text-white/50 text-xs sm:text-sm mb-6">
          Exclusive offers, new arrivals and festival specials — straight to your inbox.
        </p>
        {done ? (
          <p className="font-sans text-[#ead08a] text-sm font-semibold">✦ Thank you! You're on the list.</p>
        ) : (
          <form onSubmit={e => { e.preventDefault(); setDone(true) }} className="flex gap-0">
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 min-w-0 px-3 sm:px-4 py-3 bg-white/5 border border-white/20 text-white text-xs sm:text-sm font-sans placeholder:text-white/35 focus:outline-none focus:border-[#C8963C]" />
            <button type="submit"
              className="bg-[#C8963C] hover:bg-[#b07830] text-white px-4 sm:px-6 py-3 font-sans font-bold text-[10px] tracking-widest uppercase transition-colors shrink-0">
              SUBSCRIBE
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */
export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>Chipade Saraf — The Golden Legacy of Kolhapur Since 1904</title>
        <meta name="description" content="Kolhapur's most trusted jewellers since 1904. Gold, Silver, Diamond & Forming jewellery — BIS Hallmarked, Free Delivery, Lifetime Guarantee." />
      </Helmet>
      <HeroCarousel />
      <ShopByCategory />
      <HeritageSection />
      <FormingSection />
      <WeddingFeature />
      <TabbedCollections />
      <NecklaceSection />
      <RingsSection />
      <BridalLookbook />
      <TrustBadges />
      <PromoBanner />
      <Newsletter />
    </>
  )
}
