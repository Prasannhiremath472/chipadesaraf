import { Link } from 'react-router-dom'
import { RiArrowRightLine } from 'react-icons/ri'
import { useQuery } from '@tanstack/react-query'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import SectionHeader from '@/components/ui/SectionHeader'
import ProductCard   from '@/components/ui/ProductCard'
import api from '@/lib/axios'

const DEMO_PRODUCTS = [
  {
    id: 1, name: 'Celestial Diamond Necklace', slug: 'celestial-diamond-necklace',
    price: 245000, originalPrice: 280000, category: 'Diamond', metal: '18K White Gold',
    thumbnail: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&auto=format&fit=crop&q=80',
    isNew: true, rating: 4.9, reviewCount: 124,
  },
  {
    id: 2, name: 'Royal Kundan Choker', slug: 'royal-kundan-choker',
    price: 185000, originalPrice: null, category: 'Gold', metal: '22K Gold',
    thumbnail: 'https://images.unsplash.com/photo-1573408301185-9519f94f97f3?w=400&auto=format&fit=crop&q=80',
    isBestseller: true, rating: 4.8, reviewCount: 89,
  },
  {
    id: 3, name: 'Emerald Drop Earrings', slug: 'emerald-drop-earrings',
    price: 95000, originalPrice: 120000, category: 'Gemstone', metal: '18K Gold',
    thumbnail: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&auto=format&fit=crop&q=80',
    isNew: false, rating: 4.7, reviewCount: 56,
  },
  {
    id: 4, name: 'Bridal Mangalsutra', slug: 'bridal-mangalsutra',
    price: 68000, originalPrice: null, category: 'Gold', metal: '22K Gold',
    thumbnail: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&auto=format&fit=crop&q=80',
    isBestseller: true, rating: 4.9, reviewCount: 203,
  },
  {
    id: 5, name: 'Solitaire Diamond Ring', slug: 'solitaire-diamond-ring',
    price: 320000, originalPrice: null, category: 'Diamond', metal: 'Platinum',
    thumbnail: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&auto=format&fit=crop&q=80',
    isNew: true, rating: 5.0, reviewCount: 45,
  },
  {
    id: 6, name: 'Pearl & Gold Bracelet', slug: 'pearl-gold-bracelet',
    price: 42000, originalPrice: 55000, category: 'Pearl', metal: '18K Gold',
    thumbnail: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&auto=format&fit=crop&q=80',
    isNew: false, rating: 4.6, reviewCount: 78,
  },
  {
    id: 7, name: 'Antique Temple Pendant', slug: 'antique-temple-pendant',
    price: 38000, originalPrice: null, category: 'Temple', metal: '22K Gold',
    thumbnail: 'https://images.unsplash.com/photo-1601924921557-45e6dea0a157?w=400&auto=format&fit=crop&q=80',
    isBestseller: true, rating: 4.8, reviewCount: 112,
  },
  {
    id: 8, name: 'Rose Gold Diamond Bangle', slug: 'rose-gold-diamond-bangle',
    price: 175000, originalPrice: 210000, category: 'Diamond', metal: '18K Rose Gold',
    thumbnail: 'https://images.unsplash.com/photo-1598560917807-1bae44bd2be8?w=400&auto=format&fit=crop&q=80',
    isNew: true, rating: 4.7, reviewCount: 34,
  },
]

export default function TrendingProducts() {
  const { data, isLoading } = useQuery({
    queryKey: ['trending-products'],
    queryFn: () => api.get('/products?sort=popular&limit=8'),
    placeholderData: { products: DEMO_PRODUCTS },
  })

  const products = data?.products || DEMO_PRODUCTS

  return (
    <section className="section-gap section-padding bg-white dark:bg-charcoal">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <SectionHeader
            label="Trending Now"
            title="Most Coveted Pieces"
            subtitle="Our bestselling designs, chosen by thousands of jewellery lovers."
            centered={false}
          />
          <Link to="/shop?sort=popular" className="btn-outline-gold flex-shrink-0 self-start md:self-auto">
            View All <RiArrowRightLine />
          </Link>
        </div>

        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {products.slice(0, 8).map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {/* Mobile swiper */}
        <div className="md:hidden">
          <Swiper
            modules={[Pagination, Autoplay]}
            slidesPerView={1.3}
            spaceBetween={16}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            className="pb-10"
          >
            {products.slice(0, 6).map((product, i) => (
              <SwiperSlide key={product.id}>
                <ProductCard product={product} index={i} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  )
}
