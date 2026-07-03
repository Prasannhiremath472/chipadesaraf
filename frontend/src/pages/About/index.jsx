import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'

const TIMELINE = [
  { year:'1904', title:'The Foundation', desc:'मे. गोपीनाथ अनंत चिपडे यांनी कोल्हापूरात सराफी व्यवसायाची सुरुवात केली. एका छोट्या दुकानातून सुरू झालेला हा प्रवास आजही सुरू आहे.' },
  { year:'1940', title:'Growing Legacy', desc:'Second generation took over, expanding the craft — adding diamond and pearl work alongside traditional 22K gold jewellery.' },
  { year:'1975', title:'Master Craftsmen', desc:'Kolhapur\'s most sought-after jewellers. Known for the authentic Kolhapuri Saaj and Thushi — worn by brides across Maharashtra.' },
  { year:'2000', title:'Modern Era', desc:'Third generation modernized the studio with BIS hallmarking, certified diamonds, and a full bridal collection service.' },
  { year:'2024', title:'Chipade Saraf Today', desc:'120 years of trust. 50,000+ satisfied families. Gold, Silver, Diamond & Forming jewellery — all under one roof in Kolhapur.' },
]

const VALUES = [
  { icon:'🔱', title:'BIS Hallmarked',   desc:'Every gold piece carries the BIS hallmark — certified purity you can trust.' },
  { icon:'💎', title:'Certified Diamond', desc:'Diamonds sourced from certified cutters with full transparency on cut, clarity and carat.' },
  { icon:'🛡️', title:'Lifetime Guarantee',desc:'We stand behind every piece — free re-polishing and servicing for life.' },
  { icon:'🤝', title:'Since 1904',        desc:'Five generations of craftsmanship and a 120-year legacy of Kolhapuri jewellery.' },
]

export default function About() {
  return (
    <>
      <Helmet>
        <title>Our Story — Chipade Saraf | Since 1904</title>
        <meta name="description" content="मे. गोपीनाथ अनंत चिपडे सराफ — Kolhapur's trusted jewellers since 1904. Discover our 120-year legacy." />
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ minHeight: 480 }}>
        <img src="/images/imgi_18_allcollectionsphoto.png" alt="Chipade Saraf Heritage"
          className="w-full h-full object-cover absolute inset-0" style={{ minHeight: 480 }} />
        <div className="absolute inset-0" style={{ background:'linear-gradient(to right, rgba(26,10,15,0.90) 45%, rgba(26,10,15,0.30) 100%)' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-24 flex flex-col justify-center" style={{ minHeight: 480 }}>
          <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7 }}>
            <p className="label-gold mb-4">Our Heritage</p>
            <h1 className="font-serif text-5xl md:text-6xl text-white leading-tight mb-5">
              मे. गोपीनाथ अनंत<br />चिपडे सराफ
            </h1>
            <p className="font-sans text-white/65 text-lg mb-2">Kolhapur's Trusted Jewellers</p>
            <p className="font-serif text-[#ead08a] text-2xl italic">Since 1904</p>
          </motion.div>
        </div>
      </section>

      {/* Story split */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity:0, x:-30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}>
            <p className="label-gold mb-3">Our Story</p>
            <h2 className="font-serif text-4xl text-gray-900 mb-6">120 Years of Craftsmanship</h2>
            <p className="font-sans text-gray-600 leading-relaxed mb-4">
              Founded in 1904 by Gopinath Anant Chipade in the heart of Kolhapur, our journey began with a single purpose — to craft jewellery that carries the soul of Maharashtra. From the iconic <strong>Kolhapuri Saaj</strong> to the delicate <strong>Thushi</strong>, every piece tells a story of heritage.
            </p>
            <p className="font-sans text-gray-600 leading-relaxed mb-6">
              Today, five generations later, we continue that tradition — blending ancient Kolhapuri craftsmanship with contemporary elegance. Our artisans hand-craft each piece with the same devotion that Gopinathrao brought to his workshop over a century ago.
            </p>
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-gray-100">
              {[['120+','Years of Trust'],['50,000+','Happy Families'],['12,000+','Unique Designs']].map(([n,l]) => (
                <div key={l} className="text-center">
                  <p className="font-serif text-3xl text-[#C8963C] font-bold">{n}</p>
                  <p className="font-sans text-xs text-gray-500 mt-1">{l}</p>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity:0, x:30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}>
            <div className="grid grid-cols-2 gap-3">
              <img src="/images/imgi_13_Bride_jpg.jpg" alt="Bridal jewellery" className="w-full aspect-[3/4] object-cover object-top" />
              <div className="flex flex-col gap-3">
                <img src="/images/imgi_8_Gold.jfif.jpg" alt="Gold jewellery" className="w-full aspect-square object-cover" />
                <img src="/images/imgi_9_Forming.jfif.jpg" alt="Forming jewellery" className="w-full aspect-square object-cover" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-[#FDF8F0]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="label-gold mb-2">Our Journey</p>
            <h2 className="font-serif text-4xl text-gray-900">120 Years of Legacy</h2>
            <div className="w-14 h-0.5 bg-[#C8963C] mx-auto mt-4" />
          </div>
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-px bg-[#C8963C]/20 hidden md:block" />
            {TIMELINE.map((t, i) => (
              <motion.div key={t.year}
                initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }} transition={{ delay: i * 0.1 }}
                className={`relative flex gap-8 mb-10 md:mb-14 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                <div className="md:w-1/2 flex flex-col justify-center">
                  <span className="text-[#C8963C] font-serif text-3xl font-bold mb-2">{t.year}</span>
                  <h3 className="font-sans font-bold text-gray-800 text-lg mb-2">{t.title}</h3>
                  <p className="font-sans text-gray-600 text-sm leading-relaxed">{t.desc}</p>
                </div>
                <div className="hidden md:flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-[#C8963C] border-4 border-[#FDF8F0] relative z-10" />
                </div>
                <div className="md:w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-[#8B1A4A]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="label-gold mb-2">Our Promise</p>
            <h2 className="font-serif text-4xl text-white">Why Choose Chipade Saraf</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }} transition={{ delay: i*0.1 }}
                className="text-center p-6 border border-white/10 hover:border-[#C8963C]/50 transition-colors">
                <span className="text-4xl block mb-4">{v.icon}</span>
                <h3 className="font-sans font-bold text-white text-sm uppercase tracking-wide mb-2">{v.title}</h3>
                <p className="font-sans text-white/55 text-xs leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bridal lookbook strip */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="label-gold mb-2">Bridal Collections</p>
              <h2 className="font-serif text-3xl text-gray-900">The Chipade Bridal Legacy</h2>
            </div>
            <Link to="/shop?occasion=bridal" className="btn-crimson text-xs">SHOP BRIDAL <FiArrowRight className="ml-1 inline" /></Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {['/images/imgi_13_Bride_jpg.jpg','/images/imgi_14_Bride_back_1_jpg.jpg','/images/imgi_15_Bride_back_2_jpg.jpg','/images/imgi_16_Bride_back_3_jpg.jpg','/images/imgi_17_Bride_back_4_jpg.jpg'].map((img, i) => (
              <Link key={i} to="/shop?occasion=bridal" className="group block overflow-hidden aspect-[3/4] bg-gray-50">
                <img src={img} alt="Bridal" className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stores */}
      <section className="py-16 bg-[#1a0a0f]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="label-gold mb-2">Visit Us</p>
            <h2 className="font-serif text-4xl text-white">Our Stores in Kolhapur</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { name:'Main Store', addr:'Bhausinghji Road, Kolhapur — 416001', phone:'0231-2544441', hours:'Mon–Sat 10am–8pm, Sun 11am–6pm' },
              { name:'Venus Corner', addr:'Venus Corner, Dasara Chowk Road, Kolhapur', phone:'+91 82371 29913', hours:'Mon–Sat 10am–8pm, Sun 11am–6pm' },
            ].map(s => (
              <div key={s.name} className="border border-[#C8963C]/20 p-8">
                <h3 className="font-serif text-xl text-[#ead08a] mb-4">{s.name}</h3>
                <p className="font-sans text-white/60 text-sm mb-2">📍 {s.addr}</p>
                <p className="font-sans text-white/60 text-sm mb-2">📞 {s.phone}</p>
                <p className="font-sans text-white/60 text-sm">🕐 {s.hours}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/contact" className="btn-gold">CONTACT US <FiArrowRight className="ml-1 inline" /></Link>
          </div>
        </div>
      </section>
    </>
  )
}
