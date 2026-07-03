import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { FiFilter, FiX, FiChevronDown, FiChevronUp, FiGrid, FiList, FiArrowRight } from 'react-icons/fi'

/* ── Product data using real images ── */
const ALL_PRODUCTS = [
  // Gold
  { id:1,  name:'Rajwadi Choker Set',       cat:'gold',    sub:'necklaces',  price:145000, mrp:165000, image:'/images/imgi_8_Gold.jfif.jpg',             tag:'Bestseller', isNew:false },
  { id:2,  name:'Kolhapuri Saaj Set',        cat:'gold',    sub:'necklaces',  price:285000, mrp:null,   image:'/images/imgi_29_Necklace1_jpg.jpg',         tag:'Heritage',   isNew:false },
  { id:3,  name:'Traditional Necklace',      cat:'gold',    sub:'necklaces',  price:112000, mrp:135000, image:'/images/imgi_28_Necklace2_jpg.jpg',         tag:'',           isNew:true  },
  { id:4,  name:'Gold Jhumka Earrings',      cat:'gold',    sub:'earrings',   price:28000,  mrp:null,   image:'/images/imgi_25_Earrings_jpg.jpg',          tag:'New',        isNew:true  },
  { id:5,  name:'Chandbali Earrings',        cat:'gold',    sub:'earrings',   price:22500,  mrp:28000,  image:'/images/imgi_24_Earrings2_jpg.jpg',         tag:'',           isNew:false },
  { id:6,  name:'Gold Bangles Set (4pc)',    cat:'gold',    sub:'bangles',    price:42000,  mrp:50000,  image:'/images/imgi_20_2bangles_news.png',         tag:'Bestseller', isNew:false },
  { id:7,  name:'Antique Bangle Pair',       cat:'gold',    sub:'bangles',    price:38500,  mrp:null,   image:'/images/imgi_71_2bangles_news.png',         tag:'',           isNew:false },
  { id:8,  name:'Gold Chain Bracelet',       cat:'gold',    sub:'bracelets',  price:65000,  mrp:72000,  image:'/images/imgi_27_bracelet.jpg',              tag:'',           isNew:false },
  { id:9,  name:'Diamond Necklace Set',      cat:'diamond', sub:'necklaces',  price:325000, mrp:380000, image:'/images/imgi_124_Necklace_jpg.jpg',         tag:'Luxury',     isNew:false },
  { id:10, name:'Diamond Drop Earrings',     cat:'diamond', sub:'earrings',   price:85000,  mrp:null,   image:'/images/imgi_73_Earrings2_jpg.jpg',         tag:'New',        isNew:true  },
  { id:11, name:'Diamond Tennis Bracelet',   cat:'diamond', sub:'bracelets',  price:280000, mrp:320000, image:'/images/imgi_76_bracelet.jpg',              tag:'Luxury',     isNew:false },
  { id:12, name:'Silver Antique Necklace',   cat:'silver',  sub:'necklaces',  price:8500,   mrp:10000,  image:'/images/imgi_10_Silver_jewellery.jfif.jpg', tag:'',           isNew:false },
  { id:13, name:'Forming Necklace Set',      cat:'forming', sub:'necklaces',  price:3200,   mrp:4500,   image:'/images/imgi_9_Forming.jfif.jpg',           tag:'Bestseller', isNew:false },
  { id:14, name:'Forming Earrings',          cat:'forming', sub:'earrings',   price:1800,   mrp:2500,   image:'/images/imgi_21_earrings2.png',             tag:'',           isNew:true  },
  { id:15, name:'Bridal Complete Set',       cat:'bridal',  sub:'sets',       price:480000, mrp:520000, image:'/images/imgi_13_Bride_jpg.jpg',             tag:'Bridal',     isNew:false },
  { id:16, name:'Bridal Gold Choker',        cat:'bridal',  sub:'necklaces',  price:210000, mrp:null,   image:'/images/imgi_18_allcollectionsphoto.png',   tag:'Bridal',     isNew:false },
  { id:17, name:'Daily Wear Gold Ring',      cat:'daily',   sub:'rings',      price:18000,  mrp:22000,  image:'/images/imgi_11_Daily_Wear.jfif.jpg',       tag:'Daily Wear', isNew:false },
  { id:18, name:'Gold Earring Studs',        cat:'gold',    sub:'earrings',   price:14500,  mrp:null,   image:'/images/imgi_74_Earrings_jpg.jpg',          tag:'',           isNew:false },
  { id:19, name:'Gold Pendant Set',          cat:'gold',    sub:'pendants',   price:32000,  mrp:38000,  image:'/images/imgi_26_selection.jpg',             tag:'',           isNew:false },
  { id:20, name:'Luxury Necklace Set',       cat:'gold',    sub:'necklaces',  price:195000, mrp:null,   image:'/images/imgi_77_Necklace2_jpg.jpg',         tag:'Premium',    isNew:true  },
  { id:21, name:'Kolhapuri Thushi',          cat:'gold',    sub:'necklaces',  price:88000,  mrp:95000,  image:'/images/imgi_78_Necklace1_jpg.jpg',         tag:'Heritage',   isNew:false },
  { id:22, name:'Ornate Earring Set',        cat:'gold',    sub:'earrings',   price:19500,  mrp:24000,  image:'/images/imgi_48_earrings2.png',             tag:'',           isNew:false },
  { id:23, name:'Silver Bangles Set',        cat:'silver',  sub:'bangles',    price:4200,   mrp:5500,   image:'/images/imgi_10_Silver_jewellery.jfif.jpg', tag:'',           isNew:false },
  { id:24, name:'Bridal Bracelet Set',       cat:'bridal',  sub:'bracelets',  price:95000,  mrp:110000, image:'/images/imgi_75_selection.jpg',             tag:'Bridal',     isNew:false },
]

const CATS = [
  { key:'',        label:'All'       },
  { key:'gold',    label:'Gold'      },
  { key:'diamond', label:'Diamond'   },
  { key:'silver',  label:'Silver'    },
  { key:'forming', label:'Forming'   },
  { key:'bridal',  label:'Bridal'    },
  { key:'daily',   label:'Daily Wear'},
]

const SORT_OPTIONS = [
  { key:'newest',    label:'Newest First'     },
  { key:'price-asc', label:'Price: Low to High'},
  { key:'price-desc',label:'Price: High to Low'},
  { key:'popular',   label:'Most Popular'     },
]

const fmt = (n) => '₹' + n.toLocaleString('en-IN')

function ProductCard({ p }) {
  const disc = p.mrp ? Math.round((1 - p.price / p.mrp) * 100) : 0
  return (
    <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35 }}
      className="group bg-white overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300">
      <Link to={`/product/product-${p.id}`} className="block">
        <div className="relative overflow-hidden aspect-square bg-gray-50">
          <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          {p.tag && (
            <span className="absolute top-2 left-2 text-[10px] font-sans font-bold tracking-wide uppercase px-2 py-0.5"
              style={{ background: p.tag === 'Bridal' ? '#8B1A4A' : '#C8963C', color: p.tag === 'Bridal' ? '#ead08a' : '#fff' }}>
              {p.tag}
            </span>
          )}
          {p.isNew && <span className="absolute top-2 right-2 text-[10px] font-sans font-bold tracking-wide uppercase px-2 py-0.5 bg-green-600 text-white">New</span>}
          {disc > 0 && <span className="absolute bottom-2 left-2 text-[10px] font-sans font-bold px-2 py-0.5 bg-red-500 text-white">-{disc}%</span>}
        </div>
        <div className="p-4">
          <h3 className="font-sans text-sm font-medium text-gray-800 group-hover:text-[#8B1A4A] transition-colors truncate">{p.name}</h3>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="font-sans font-bold text-[#C8963C] text-sm">{fmt(p.price)}</span>
            {p.mrp && <span className="text-gray-400 text-xs line-through">{fmt(p.mrp)}</span>}
          </div>
        </div>
      </Link>
      <div className="px-4 pb-4">
        <button className="w-full py-2 text-xs font-sans font-bold tracking-widest uppercase text-[#8B1A4A] border border-[#8B1A4A] hover:bg-[#8B1A4A] hover:text-[#ead08a] transition-colors">
          ADD TO CART
        </button>
      </div>
    </motion.div>
  )
}

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [sort, setSort]       = useState('newest')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [priceRange, setPriceRange]   = useState([0, 500000])

  const catParam = searchParams.get('category') || searchParams.get('occasion') || ''

  let products = ALL_PRODUCTS.filter(p => !catParam || p.cat === catParam || (catParam === 'bridal' && p.cat === 'bridal'))
  if (sort === 'price-asc')  products = [...products].sort((a,b) => a.price - b.price)
  if (sort === 'price-desc') products = [...products].sort((a,b) => b.price - a.price)
  products = products.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])

  const activeCat = CATS.find(c => c.key === catParam) || CATS[0]

  return (
    <>
      <Helmet><title>{activeCat.label} Jewellery — Chipade Saraf</title></Helmet>

      {/* Page header */}
      <div className="bg-[#1a0a0f] py-12 text-center">
        <p className="label-gold mb-2">Chipade Saraf Collection</p>
        <h1 className="font-serif text-4xl md:text-5xl text-white">{activeCat.label} Jewellery</h1>
        <p className="font-sans text-white/50 text-sm mt-3">Handcrafted in Kolhapur since 1904</p>
      </div>

      {/* Category tab strip */}
      <div className="bg-white border-b border-gray-100 sticky top-[108px] z-30">
        <div className="max-w-7xl mx-auto px-4 flex gap-0 overflow-x-auto scrollbar-hide">
          {CATS.map(c => (
            <button key={c.key}
              onClick={() => { const p = new URLSearchParams(); if(c.key) p.set('category', c.key); setSearchParams(p) }}
              className={`px-5 py-3.5 font-sans text-sm font-semibold whitespace-nowrap border-b-2 transition-all ${
                catParam === c.key ? 'border-[#8B1A4A] text-[#8B1A4A]' : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <p className="font-sans text-sm text-gray-500">{products.length} products</p>
          <div className="flex items-center gap-3">
            <button onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-2 border border-gray-200 px-4 py-2 font-sans text-sm text-gray-700 hover:border-[#8B1A4A] hover:text-[#8B1A4A] transition-colors">
              <FiFilter size={14} /> Filters
            </button>
            <select value={sort} onChange={e => setSort(e.target.value)}
              className="border border-gray-200 px-3 py-2 font-sans text-sm text-gray-700 focus:outline-none focus:border-[#C8963C]">
              {SORT_OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar filters */}
          <AnimatePresence>
            {filtersOpen && (
              <motion.aside initial={{ width:0, opacity:0 }} animate={{ width:240, opacity:1 }}
                exit={{ width:0, opacity:0 }} transition={{ duration:0.25 }}
                className="shrink-0 overflow-hidden">
                <div className="w-60">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-sans font-bold text-sm uppercase tracking-wide text-gray-800">Filters</h3>
                    <button onClick={() => setFiltersOpen(false)} className="text-gray-400 hover:text-gray-700"><FiX /></button>
                  </div>
                  {/* Price filter */}
                  <div className="mb-6">
                    <h4 className="font-sans text-xs font-bold tracking-widest uppercase text-gray-500 mb-3">Price Range</h4>
                    <div className="flex flex-col gap-2">
                      {[[0,20000,'Under ₹20,000'],[20000,100000,'₹20k – ₹1 Lakh'],[100000,300000,'₹1L – ₹3 Lakh'],[300000,500000,'Above ₹3 Lakh']].map(([min,max,label]) => (
                        <button key={label}
                          onClick={() => setPriceRange([min,max])}
                          className={`text-left font-sans text-sm px-3 py-2 transition-colors ${priceRange[0]===min && priceRange[1]===max ? 'bg-[#8B1A4A] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => setPriceRange([0,500000])}
                    className="text-xs font-sans text-[#C8963C] underline">Clear filters</button>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Grid */}
          <div className="flex-1">
            {products.length === 0 ? (
              <div className="text-center py-24">
                <p className="font-serif text-2xl text-gray-400 mb-4">No products found</p>
                <button onClick={() => { setSearchParams({}); setPriceRange([0,500000]) }} className="btn-crimson">View All</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                {products.map(p => <ProductCard key={p.id} p={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
