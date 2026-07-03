import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight, FiCalendar, FiUser } from 'react-icons/fi'

const POSTS = [
  { slug:'kolhapuri-saaj-guide',      title:'The Complete Guide to Kolhapuri Saaj',        date:'15 Jan 2025', author:'Chipade Saraf',  cat:'Heritage',  image:'/images/imgi_29_Necklace1_jpg.jpg',         excerpt:'The Kolhapuri Saaj is more than jewellery — it is a cultural identity. Learn about its history, significance, and how to choose the perfect one.' },
  { slug:'gold-purity-guide',          title:'22K vs 18K Gold: Which is Right for You?',    date:'08 Feb 2025', author:'Chipade Saraf',  cat:'Gold Guide', image:'/images/imgi_8_Gold.jfif.jpg',              excerpt:'Understanding gold purity is key to buying the right jewellery. We break down the difference between 22K and 18K gold for Indian jewellery.' },
  { slug:'bridal-jewellery-2025',      title:'Bridal Jewellery Trends in 2025',             date:'20 Mar 2025', author:'Chipade Saraf',  cat:'Bridal',    image:'/images/imgi_13_Bride_jpg.jpg',             excerpt:'From minimalist layered necklaces to bold Kundan chokers — here are the bridal jewellery trends dominating 2025 weddings.' },
  { slug:'forming-jewellery-explained','title':'What is Forming Jewellery? A Complete Guide', date:'05 Apr 2025', author:'Chipade Saraf', cat:'Forming',   image:'/images/imgi_9_Forming.jfif.jpg',           excerpt:'Forming jewellery offers the look of pure gold at a fraction of the price. Here\'s everything you need to know about this popular style.' },
  { slug:'diamond-buying-guide',       title:'How to Buy Diamonds: The 4C\'s Explained',   date:'18 May 2025', author:'Chipade Saraf',  cat:'Diamond',   image:'/images/imgi_12_Diamond.jfif.jpg',          excerpt:'Cut, Clarity, Colour, and Carat — understanding the 4Cs helps you choose the right diamond. Our experts explain what to look for.' },
  { slug:'care-for-gold-jewellery',    title:'How to Care for Your Gold Jewellery',         date:'10 Jun 2025', author:'Chipade Saraf',  cat:'Care Tips', image:'/images/imgi_28_Necklace2_jpg.jpg',         excerpt:'With the right care, your gold jewellery will last a lifetime. Here are expert tips on cleaning, storing, and maintaining your precious pieces.' },
]

const CAT_COLORS = { Heritage:'bg-[#8B1A4A] text-[#ead08a]', 'Gold Guide':'bg-[#C8963C] text-white', Bridal:'bg-pink-700 text-white', Forming:'bg-amber-700 text-white', Diamond:'bg-slate-700 text-white', 'Care Tips':'bg-green-700 text-white' }

export default function Blog() {
  const [featured, ...rest] = POSTS

  return (
    <>
      <Helmet><title>Jewellery Guide & Blog — Chipade Saraf</title></Helmet>

      {/* Header */}
      <div className="bg-[#1a0a0f] py-14 text-center relative overflow-hidden">
        <img src="/images/imgi_3_Artboard_1_copy_4_jpg.jpg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-15" />
        <div className="relative z-10">
          <p className="label-gold mb-3">Jewellery Expertise</p>
          <h1 className="font-serif text-5xl text-white mb-2">Our Blog</h1>
          <p className="font-sans text-white/50 text-sm">Guides, trends and stories from the world of jewellery</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Featured post */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          className="grid md:grid-cols-2 gap-0 mb-14 bg-white shadow-lg overflow-hidden">
          <div className="overflow-hidden">
            <img src={featured.image} alt={featured.title} className="w-full h-full object-cover min-h-[300px]" />
          </div>
          <div className="p-8 md:p-10 flex flex-col justify-center">
            <span className={`self-start text-[10px] font-bold uppercase tracking-wide px-2 py-1 mb-4 ${CAT_COLORS[featured.cat] || 'bg-gray-200 text-gray-700'}`}>{featured.cat}</span>
            <h2 className="font-serif text-3xl text-gray-900 mb-4 leading-tight">{featured.title}</h2>
            <p className="font-sans text-gray-500 text-sm leading-relaxed mb-6">{featured.excerpt}</p>
            <div className="flex items-center gap-4 text-xs font-sans text-gray-400 mb-6">
              <span className="flex items-center gap-1"><FiCalendar size={12} /> {featured.date}</span>
              <span className="flex items-center gap-1"><FiUser size={12} /> {featured.author}</span>
            </div>
            <Link to={`/blog/${featured.slug}`} className="btn-crimson self-start text-xs gap-2">
              READ MORE <FiArrowRight size={13} />
            </Link>
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((post, i) => (
            <motion.div key={post.slug} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ delay: i*0.07 }}
              className="group bg-white shadow-sm hover:shadow-lg transition-shadow">
              <div className="overflow-hidden aspect-[16/10]">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 mb-3 inline-block ${CAT_COLORS[post.cat] || 'bg-gray-200 text-gray-700'}`}>{post.cat}</span>
                <h3 className="font-serif text-xl text-gray-900 mb-3 leading-snug group-hover:text-[#8B1A4A] transition-colors">{post.title}</h3>
                <p className="font-sans text-gray-500 text-xs leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs font-sans text-gray-400">
                  <span className="flex items-center gap-1"><FiCalendar size={11}/> {post.date}</span>
                  <Link to={`/blog/${post.slug}`} className="text-[#8B1A4A] font-semibold flex items-center gap-1 hover:underline">
                    Read <FiArrowRight size={11}/>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  )
}
