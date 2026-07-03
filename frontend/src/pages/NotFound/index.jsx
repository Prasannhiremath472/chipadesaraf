import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { FiArrowRight } from 'react-icons/fi'

export default function NotFound() {
  return (
    <>
      <Helmet><title>404 — Page Not Found | Chipade Saraf</title></Helmet>
      <div className="min-h-screen bg-[#1a0a0f] flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
        <img src="/images/imgi_26_selection.jpg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-10" />
        <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7 }} className="relative z-10">
          <p className="font-serif text-[10rem] font-bold text-white/5 leading-none select-none">404</p>
          <div className="-mt-12">
            <img src="/images/imgi_1_CHIPADE_LOGO_PNG.png" alt="Chipade Saraf" className="h-20 w-auto object-contain mx-auto mb-6" />
            <p className="label-gold mb-3">Page Not Found</p>
            <h1 className="font-serif text-4xl text-white mb-4">Lost in Our Collection?</h1>
            <p className="font-sans text-white/40 text-base mb-8">The page you're looking for doesn't exist. Let us guide you back.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/" className="btn-crimson">GO HOME <FiArrowRight className="ml-1 inline"/></Link>
              <Link to="/shop" className="btn-gold">BROWSE JEWELLERY</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}
