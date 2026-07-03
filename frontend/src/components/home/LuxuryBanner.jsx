import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { RiArrowRightLine } from 'react-icons/ri'

export default function LuxuryBanner() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-15%'])

  return (
    <section ref={ref} className="relative overflow-hidden h-[60vh] md:h-[70vh] flex items-center">
      {/* Background with parallax */}
      <motion.div style={{ y }} className="absolute inset-0 scale-110">
        <img
          src="https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=1600&auto=format&fit=crop&q=80"
          alt="Luxury jewellery craftsmanship"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-dark/60" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 section-padding max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-xl"
        >
          <p className="label-luxury text-gold-400 mb-4">The Art of Jewellery Making</p>
          <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl text-cream font-bold leading-tight mb-5">
            Crafted by Master<br />
            <em className="font-light text-gold-400">Artisans</em>
          </h2>
          <p className="font-cormorant text-xl text-cream/50 italic leading-relaxed mb-8">
            Each piece passes through 200+ hours of meticulous handcrafting before it reaches you.
            We don't make jewellery — we create memories.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/about" className="btn-gold">
              Our Craft Story <RiArrowRightLine />
            </Link>
            <Link to="/shop" className="btn-outline-gold border-cream/30 text-cream hover:bg-cream/10 hover:border-cream">
              Shop Collection
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
