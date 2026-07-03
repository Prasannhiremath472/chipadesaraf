import { Link } from 'react-router-dom'
import { RiArrowRightLine } from 'react-icons/ri'
import { useQuery } from '@tanstack/react-query'
import SectionHeader from '@/components/ui/SectionHeader'
import ProductCard   from '@/components/ui/ProductCard'
import api from '@/lib/axios'

const DEMO = [
  {
    id: 101, name: 'Floral Diamond Studs', slug: 'floral-diamond-studs',
    price: 58000, category: 'Diamond', metal: '18K Gold',
    thumbnail: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&auto=format&fit=crop&q=80',
    isNew: true, rating: 4.8, reviewCount: 12,
  },
  {
    id: 102, name: 'Layered Gold Chain', slug: 'layered-gold-chain',
    price: 34000, originalPrice: 42000, category: 'Gold', metal: '22K Gold',
    thumbnail: 'https://images.unsplash.com/photo-1598560917807-1bae44bd2be8?w=400&auto=format&fit=crop&q=80',
    isNew: true, rating: 4.7, reviewCount: 8,
  },
  {
    id: 103, name: 'Sapphire Cocktail Ring', slug: 'sapphire-cocktail-ring',
    price: 145000, category: 'Gemstone', metal: '18K White Gold',
    thumbnail: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&auto=format&fit=crop&q=80',
    isNew: true, rating: 4.9, reviewCount: 6,
  },
  {
    id: 104, name: 'Heritage Jhumka Set', slug: 'heritage-jhumka-set',
    price: 28000, category: 'Gold', metal: '22K Gold',
    thumbnail: 'https://images.unsplash.com/photo-1573408301185-9519f94f97f3?w=400&auto=format&fit=crop&q=80',
    isNew: true, rating: 4.6, reviewCount: 21,
  },
]

export default function NewArrivals() {
  const { data } = useQuery({
    queryKey: ['new-arrivals'],
    queryFn: () => api.get('/products?sort=newest&limit=4'),
    placeholderData: { products: DEMO },
  })

  const products = data?.products || DEMO

  return (
    <section className="section-gap section-padding bg-cream dark:bg-dark">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <SectionHeader
            label="Just Arrived"
            title="Fresh from Our Ateliers"
            centered={false}
          />
          <Link to="/shop?sort=newest" className="btn-outline-gold self-start md:self-auto flex-shrink-0">
            New Arrivals <RiArrowRightLine />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
