import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { FiShoppingBag, FiHeart, FiShield, FiTruck, FiRotateCcw, FiStar, FiArrowRight } from 'react-icons/fi'

const PRODUCTS = {
  'product-1':  { name:'Rajwadi Choker Set',     cat:'Gold Necklaces', price:145000, mrp:165000, images:['/images/imgi_8_Gold.jfif.jpg','/images/imgi_29_Necklace1_jpg.jpg','/images/imgi_28_Necklace2_jpg.jpg'], purity:'22K Gold', weight:'48g', sku:'CS-GN-001', desc:'A grand Kolhapuri choker set crafted in 22K gold with fine hand-engraved floral motifs. Perfect for bridal and festive occasions.' },
  'product-2':  { name:'Kolhapuri Saaj Set',      cat:'Gold Necklaces', price:285000, mrp:null,   images:['/images/imgi_29_Necklace1_jpg.jpg','/images/imgi_8_Gold.jfif.jpg'], purity:'22K Gold', weight:'85g', sku:'CS-GN-002', desc:'The iconic Kolhapuri Saaj — a heritage necklace set that has adorned Maharashtrian brides for generations.' },
  'product-3':  { name:'Traditional Necklace',    cat:'Gold Necklaces', price:112000, mrp:135000, images:['/images/imgi_28_Necklace2_jpg.jpg','/images/imgi_124_Necklace_jpg.jpg'], purity:'22K Gold', weight:'36g', sku:'CS-GN-003', desc:'A timeless gold necklace with antique finish and gemstone accents.' },
  'product-9':  { name:'Diamond Necklace Set',    cat:'Diamond',        price:325000, mrp:380000, images:['/images/imgi_124_Necklace_jpg.jpg','/images/imgi_12_Diamond.jfif.jpg'], purity:'18K Gold + Diamond', weight:'22g', sku:'CS-DN-001', desc:'Certified SI clarity diamonds set in 18K white gold. A statement necklace for the modern woman.' },
  'product-15': { name:'Bridal Complete Set',      cat:'Bridal',         price:480000, mrp:520000, images:['/images/imgi_13_Bride_jpg.jpg','/images/imgi_18_allcollectionsphoto.png'], purity:'22K Gold', weight:'180g', sku:'CS-BR-001', desc:'A complete bridal set including necklace, earrings, bangles, maang tikka and nose ring.' },
}

const RELATED = [
  { id:'r1', name:'Pearl Choker Set',   price:98000, image:'/images/imgi_28_Necklace2_jpg.jpg' },
  { id:'r2', name:'Antique Thushi',      price:72000, image:'/images/imgi_9_Forming.jfif.jpg' },
  { id:'r3', name:'Gold Jhumka Set',     price:28000, image:'/images/imgi_25_Earrings_jpg.jpg' },
  { id:'r4', name:'Diamond Earrings',    price:85000, image:'/images/imgi_73_Earrings2_jpg.jpg' },
]

const fmt = n => '₹' + n.toLocaleString('en-IN')

export default function ProductDetail() {
  const { slug } = useParams()
  const p = PRODUCTS[slug] || PRODUCTS['product-1']
  const [mainImg, setMainImg] = useState(0)
  const [qty, setQty]         = useState(1)
  const [wishlisted, setWishlisted] = useState(false)
  const [tab, setTab]         = useState('description')
  const disc = p.mrp ? Math.round((1 - p.price / p.mrp) * 100) : 0

  return (
    <>
      <Helmet><title>{p.name} — Chipade Saraf</title></Helmet>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 py-3">
        <div className="max-w-7xl mx-auto px-6 text-xs font-sans text-gray-400 flex gap-2">
          <Link to="/" className="hover:text-[#8B1A4A]">Home</Link> /
          <Link to="/shop" className="hover:text-[#8B1A4A]">Shop</Link> /
          <span className="text-gray-700">{p.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-2 gap-12">

          {/* Images */}
          <div className="flex flex-col gap-3">
            <div className="relative overflow-hidden aspect-square bg-gray-50">
              <motion.img key={mainImg} src={p.images[mainImg]} alt={p.name}
                initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.3 }}
                className="w-full h-full object-cover" />
              {disc > 0 && <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1">-{disc}% OFF</span>}
            </div>
            {p.images.length > 1 && (
              <div className="flex gap-3">
                {p.images.map((img, i) => (
                  <button key={i} onClick={() => setMainImg(i)}
                    className={`w-20 h-20 overflow-hidden border-2 transition-colors ${i === mainImg ? 'border-[#8B1A4A]' : 'border-transparent hover:border-gray-300'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <p className="label-gold mb-2">{p.cat}</p>
            <h1 className="font-serif text-3xl md:text-4xl text-gray-900 mb-3">{p.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              {[...Array(5)].map((_,i) => <FiStar key={i} size={14} className={i < 4 ? 'text-[#C8963C] fill-[#C8963C]' : 'text-gray-300'} />)}
              <span className="font-sans text-sm text-gray-500">(4.8) · 127 reviews</span>
            </div>
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-serif text-3xl text-[#C8963C] font-bold">{fmt(p.price)}</span>
              {p.mrp && <span className="text-gray-400 text-lg line-through">{fmt(p.mrp)}</span>}
              {disc > 0 && <span className="text-green-600 text-sm font-sans font-semibold">Save {fmt(p.mrp - p.price)}</span>}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6 p-4 bg-[#FDF8F0] border border-[#C8963C]/20">
              {[['Purity',p.purity],['Weight',p.weight],['SKU',p.sku],['Hallmark','BIS Certified']].map(([k,v]) => (
                <div key={k}>
                  <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-gray-400">{k}</p>
                  <p className="font-sans text-sm text-gray-800 font-medium mt-0.5">{v}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center border border-gray-200">
                <button onClick={() => setQty(q => Math.max(1,q-1))} className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 text-lg">−</button>
                <span className="w-10 text-center font-sans font-semibold text-sm">{qty}</span>
                <button onClick={() => setQty(q => q+1)} className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 text-lg">+</button>
              </div>
              <button className="flex-1 btn-crimson justify-center gap-2">
                <FiShoppingBag size={16} /> ADD TO CART
              </button>
              <button onClick={() => setWishlisted(w => !w)}
                className={`w-12 h-12 border flex items-center justify-center transition-colors ${wishlisted ? 'bg-[#8B1A4A] border-[#8B1A4A] text-white' : 'border-gray-200 text-gray-500 hover:border-[#8B1A4A] hover:text-[#8B1A4A]'}`}>
                <FiHeart size={18} />
              </button>
            </div>
            <button className="w-full btn-gold justify-center mb-6">BUY NOW</button>

            <div className="grid grid-cols-3 gap-3 py-5 border-y border-gray-100 mb-6">
              {[[FiShield,'BIS Hallmarked'],[FiTruck,'Free Delivery'],[FiRotateCcw,'30 Day Return']].map(([Icon, label]) => (
                <div key={label} className="flex flex-col items-center text-center gap-1">
                  <Icon size={18} className="text-[#C8963C]" />
                  <span className="font-sans text-[10px] text-gray-500 uppercase tracking-wide">{label}</span>
                </div>
              ))}
            </div>

            <div className="flex border-b border-gray-100 mb-4">
              {['description','details','reviews'].map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-5 py-2.5 font-sans text-xs font-bold uppercase tracking-wide border-b-2 -mb-px transition-all ${tab===t ? 'border-[#8B1A4A] text-[#8B1A4A]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                  {t}
                </button>
              ))}
            </div>
            {tab==='description' && <p className="font-sans text-gray-600 text-sm leading-relaxed">{p.desc}</p>}
            {tab==='details' && (
              <ul className="font-sans text-sm text-gray-600 space-y-2">
                <li>• Purity: {p.purity}</li><li>• Approximate Weight: {p.weight}</li>
                <li>• BIS Hallmarked — 916 Purity</li><li>• Handcrafted by Kolhapuri artisans</li>
                <li>• Comes in branded gift box</li><li>• Lifetime free re-polishing</li>
              </ul>
            )}
            {tab==='reviews' && (
              <div className="space-y-4">
                {[['Priya S.','Beautiful craftsmanship, exactly like the photo.'],['Anita K.','Bought for my daughter\'s wedding — everyone loved it!'],['Rekha M.','Great quality, fast delivery, highly recommend.']].map(([name,review]) => (
                  <div key={name} className="border-b border-gray-50 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      {[...Array(5)].map((_,i) => <FiStar key={i} size={12} className="text-[#C8963C] fill-[#C8963C]" />)}
                      <span className="font-sans text-xs font-bold text-gray-700">{name}</span>
                    </div>
                    <p className="font-sans text-sm text-gray-600">{review}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-2xl text-gray-900">You May Also Like</h2>
            <Link to="/shop" className="text-[#8B1A4A] text-sm font-sans font-semibold flex items-center gap-1 hover:underline">View All <FiArrowRight size={14}/></Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {RELATED.map(r => (
              <Link key={r.id} to="/shop" className="group block card-product">
                <div className="aspect-square overflow-hidden bg-gray-50">
                  <img src={r.image} alt={r.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <h3 className="font-sans text-sm font-medium text-gray-800 group-hover:text-[#8B1A4A] transition-colors">{r.name}</h3>
                  <p className="text-[#C8963C] font-bold text-sm mt-1">{fmt(r.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
