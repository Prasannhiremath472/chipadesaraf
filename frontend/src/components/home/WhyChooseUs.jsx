import { motion } from 'framer-motion'
import {
  RiShieldCheckLine, RiAwardLine, RiRefund2Line,
  RiExchangeLine, RiTruckLine, RiSecurePaymentLine,
} from 'react-icons/ri'
import SectionHeader from '@/components/ui/SectionHeader'
import { WHY_US } from '@/constants'

const ICONS = {
  certificate: RiAwardLine,
  hallmark:    RiShieldCheckLine,
  returns:     RiRefund2Line,
  exchange:    RiExchangeLine,
  shipping:    RiTruckLine,
  secure:      RiSecurePaymentLine,
}

export default function WhyChooseUs() {
  return (
    <section className="section-gap section-padding bg-dark relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'repeating-linear-gradient(45deg, #C8A165 0, #C8A165 1px, transparent 0, transparent 50%)',
        backgroundSize: '30px 30px',
      }} />

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          label="Our Promise"
          title="The Chipade Saraf Guarantee"
          subtitle="Six pillars of trust that make us India's most loved luxury jewellery destination."
          light
        />

        <div className="mt-14 grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {WHY_US.map(({ icon, title, desc }, i) => {
            const Icon = ICONS[icon] || RiAwardLine
            return (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group flex flex-col items-center text-center gap-4 p-6
                           border border-white/5 hover:border-gold-500/20 transition-colors duration-400"
              >
                <div className="w-14 h-14 border border-gold-500/20 flex items-center justify-center
                                group-hover:bg-gold-500/10 transition-colors duration-300">
                  <Icon size={24} className="text-gold-400" />
                </div>

                <div>
                  <h3 className="font-playfair text-lg text-cream mb-2">{title}</h3>
                  <p className="font-inter text-xs text-cream/40 leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
