import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RiArrowRightLine } from 'react-icons/ri'
import SectionHeader from '@/components/ui/SectionHeader'

const COLLECTIONS = [
  {
    name:    'Gold Jewellery',
    slug:    'gold',
    count:   '240+ Designs',
    image:   'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&auto=format&fit=crop&q=80',
    accent:  'linear-gradient(135deg, #C8A165, #e9c070)',
    size:    'lg',
  },
  {
    name:    'Diamond Jewellery',
    slug:    'diamond',
    count:   '180+ Designs',
    image:   'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80',
    accent:  'linear-gradient(135deg, #a0b5c8, #d0e0f0)',
    size:    'sm',
  },
  {
    name:    'Bridal Collection',
    slug:    'bridal',
    count:   '120+ Designs',
    image:   'https://images.unsplash.com/photo-1601924921557-45e6dea0a157?w=600&auto=format&fit=crop&q=80',
    accent:  'linear-gradient(135deg, #c8a165, #8b5e3c)',
    size:    'sm',
  },
  {
    name:    'Temple Jewellery',
    slug:    'temple',
    count:   '90+ Designs',
    image:   'https://images.unsplash.com/photo-1573408301185-9519f94f97f3?w=600&auto=format&fit=crop&q=80',
    accent:  'linear-gradient(135deg, #C8A165, #a87c4f)',
    size:    'md',
  },
  {
    name:    'Silver Jewellery',
    slug:    'silver',
    count:   '200+ Designs',
    image:   'https://images.unsplash.com/photo-1598560917807-1bae44bd2be8?w=600&auto=format&fit=crop&q=80',
    accent:  'linear-gradient(135deg, #c0c0c0, #e8e8e8)',
    size:    'md',
  },
]

function CollectionCard({ item, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden"
    >
      <Link to={`/shop/${item.slug}`} className="block">
        {/* Image */}
        <div className={`relative overflow-hidden
          ${item.size === 'lg' ? 'aspect-[3/4]' : item.size === 'md' ? 'aspect-square' : 'aspect-[4/3]'}`}
        >
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent
                          transition-opacity duration-300" />

          {/* Content */}
          <div className="absolute bottom-0 inset-x-0 p-5 md:p-6">
            <p className="font-inter text-xs text-cream/50 tracking-widest uppercase mb-1.5">
              {item.count}
            </p>
            <h3 className="font-playfair text-xl md:text-2xl text-cream font-medium leading-tight mb-3">
              {item.name}
            </h3>

            <motion.div
              initial={{ x: -10, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              className="flex items-center gap-2 overflow-hidden"
            >
              <span
                className="font-poppins text-xs font-semibold tracking-widest uppercase
                           flex items-center gap-1.5 transition-colors duration-300 text-cream/60
                           group-hover:text-gold-400"
              >
                Explore
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <RiArrowRightLine />
                </motion.span>
              </span>
            </motion.div>
          </div>

          {/* Hover border */}
          <div className="absolute inset-0 border border-transparent group-hover:border-gold-500/30
                          transition-colors duration-300 pointer-events-none" />
        </div>
      </Link>
    </motion.div>
  )
}

export default function FeaturedCollections() {
  return (
    <section className="section-gap section-padding bg-cream dark:bg-dark">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          label="Curated Collections"
          title="A World of Luxury Awaits"
          subtitle="From timeless gold to breathtaking diamonds — explore collections crafted for every chapter of life."
        />

        {/* Bento grid */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {/* Large card */}
          <div className="col-span-2 row-span-2">
            <CollectionCard item={COLLECTIONS[0]} index={0} />
          </div>
          {/* Small cards */}
          {COLLECTIONS.slice(1, 3).map((item, i) => (
            <CollectionCard key={item.slug} item={item} index={i + 1} />
          ))}
          {/* Medium cards */}
          {COLLECTIONS.slice(3).map((item, i) => (
            <CollectionCard key={item.slug} item={item} index={i + 3} />
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Link to="/shop" className="btn-outline-gold">
            View All Collections <RiArrowRightLine />
          </Link>
        </div>
      </div>
    </section>
  )
}
