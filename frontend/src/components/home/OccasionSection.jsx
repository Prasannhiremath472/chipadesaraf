import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import SectionHeader from '@/components/ui/SectionHeader'

const OCCASIONS = [
  {
    name:   'Wedding',
    icon:   '♥',
    slug:   'wedding',
    desc:   'Bridal sets, necklaces & more',
    color:  'from-rose-900 to-rose-950',
    image:  'https://images.unsplash.com/photo-1601924921557-45e6dea0a157?w=500&auto=format&fit=crop&q=80',
  },
  {
    name:   'Engagement',
    icon:   '◆',
    slug:   'engagement',
    desc:   'Rings, solitaires & bands',
    color:  'from-blue-900 to-blue-950',
    image:  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&auto=format&fit=crop&q=80',
  },
  {
    name:   'Anniversary',
    icon:   '★',
    slug:   'anniversary',
    desc:   'Timeless gifts of love',
    color:  'from-amber-900 to-amber-950',
    image:  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&auto=format&fit=crop&q=80',
  },
  {
    name:   'Birthday',
    icon:   '✦',
    slug:   'birthday',
    desc:   'Make every year memorable',
    color:  'from-purple-900 to-purple-950',
    image:  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop&q=80',
  },
  {
    name:   'Festival',
    icon:   '✤',
    slug:   'festival',
    desc:   'Celebrate in gold & silver',
    color:  'from-orange-900 to-orange-950',
    image:  'https://images.unsplash.com/photo-1573408301185-9519f94f97f3?w=500&auto=format&fit=crop&q=80',
  },
  {
    name:   'Corporate Gift',
    icon:   '▲',
    slug:   'corporate',
    desc:   'Prestigious gifting solutions',
    color:  'from-gray-800 to-gray-900',
    image:  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&auto=format&fit=crop&q=80',
  },
]

export default function OccasionSection() {
  return (
    <section className="section-gap section-padding bg-cream dark:bg-dark">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          label="Shop by Occasion"
          title="The Perfect Piece for Every Moment"
        />

        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {OCCASIONS.map((occ, i) => (
            <motion.div
              key={occ.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <Link
                to={`/shop?occasion=${occ.slug}`}
                className="group flex flex-col items-center text-center gap-3"
              >
                {/* Icon circle */}
                <div className="relative w-20 h-20 md:w-24 md:h-24 overflow-hidden
                                rounded-full border-2 border-transparent
                                group-hover:border-gold-500 transition-all duration-300">
                  <img
                    src={occ.image}
                    alt={occ.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-dark/30 group-hover:bg-dark/10 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl text-cream">{occ.icon}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-playfair text-sm md:text-base text-dark dark:text-cream
                                 group-hover:text-gold-500 transition-colors">
                    {occ.name}
                  </h3>
                  <p className="font-inter text-[10px] text-dark/40 dark:text-cream/40 mt-0.5">
                    {occ.desc}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
