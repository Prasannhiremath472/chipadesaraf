import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import { motion } from 'framer-motion'
import 'swiper/css'
import 'swiper/css/pagination'
import SectionHeader from '@/components/ui/SectionHeader'

const REVIEWS = [
  {
    name:   'Priya Sharma',
    city:   'Mumbai',
    rating: 5,
    review: 'Absolutely stunning bridal set! The craftsmanship is extraordinary. Every guest at my wedding commented on the jewellery. Chipade Saraf truly delivers luxury.',
    product:'Bridal Kundan Set',
    avatar: 'PS',
    verified: true,
  },
  {
    name:   'Ananya Reddy',
    city:   'Hyderabad',
    rating: 5,
    review: 'I ordered the diamond solitaire ring for my engagement — it is beyond perfect. The packaging, service, and quality exceeded every expectation.',
    product:'Solitaire Diamond Ring',
    avatar: 'AR',
    verified: true,
  },
  {
    name:   'Meera Krishnan',
    city:   'Chennai',
    rating: 5,
    review: 'The temple jewellery collection is breathtaking. Received my order within 3 days, fully insured. Will definitely purchase again.',
    product:'Temple Pendant Set',
    avatar: 'MK',
    verified: true,
  },
  {
    name:   'Ritu Agarwal',
    city:   'Delhi',
    rating: 5,
    review: 'Their customer service is impeccable. Helped me customise my anniversary gift — rose gold diamond bracelet. My wife is in love with it!',
    product:'Rose Gold Bracelet',
    avatar: 'RA',
    verified: true,
  },
  {
    name:   'Kavitha Nair',
    city:   'Bangalore',
    rating: 5,
    review: 'Ordered the pearl necklace as a birthday gift for my mother. The quality is of a completely different level. Worth every rupee.',
    product:'Pearl Gold Necklace',
    avatar: 'KN',
    verified: true,
  },
]

export default function CustomerReviews() {
  return (
    <section className="section-gap section-padding bg-cream dark:bg-dark">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <SectionHeader
            label="Client Stories"
            title="Loved by Thousands"
            centered={false}
          />
          {/* Aggregate rating */}
          <div className="flex-shrink-0 text-right">
            <div className="flex items-baseline gap-2 justify-end md:justify-end">
              <span className="font-playfair text-5xl font-bold text-dark dark:text-cream">4.9</span>
              <span className="font-cormorant text-xl text-dark/40 dark:text-cream/40">/ 5.0</span>
            </div>
            <div className="flex text-gold-500 text-lg gap-0.5 justify-end mb-1">
              {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
            </div>
            <p className="font-inter text-xs text-dark/40 dark:text-cream/40">Based on 12,400+ reviews</p>
          </div>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          slidesPerView={1}
          spaceBetween={24}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-12"
        >
          {REVIEWS.map((review, i) => (
            <SwiperSlide key={review.name}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
                className="h-full p-6 bg-white dark:bg-charcoal border border-black/5 dark:border-white/5"
              >
                {/* Stars */}
                <div className="flex text-gold-500 text-sm gap-0.5 mb-4">
                  {[...Array(review.rating)].map((_, j) => <span key={j}>★</span>)}
                </div>

                {/* Quote */}
                <p className="font-cormorant text-lg text-dark/70 dark:text-cream/70 italic leading-relaxed mb-6">
                  "{review.review}"
                </p>

                {/* Reviewer */}
                <div className="flex items-center gap-3 pt-4 border-t border-black/5 dark:border-white/5">
                  <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                    <span className="font-poppins text-xs font-semibold text-gold-500">
                      {review.avatar}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-playfair text-sm text-dark dark:text-cream font-medium">
                        {review.name}
                      </p>
                      {review.verified && (
                        <span className="font-inter text-[9px] text-green-500 tracking-wider uppercase">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                    <p className="font-inter text-xs text-dark/35 dark:text-cream/35">
                      {review.city} · {review.product}
                    </p>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
