import { useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useQuery } from '@tanstack/react-query'
import { RiSearchLine } from 'react-icons/ri'
import ProductCard from '@/components/ui/ProductCard'
import api from '@/lib/axios'

export default function Search() {
  const [params] = useSearchParams()
  const q = params.get('q') || ''

  const { data, isLoading } = useQuery({
    queryKey: ['search-results', q],
    queryFn: () => api.get(`/products/search?q=${encodeURIComponent(q)}`),
    enabled: q.length >= 2,
    placeholderData: { products: [] },
  })

  return (
    <>
      <Helmet>
        <title>Search: {q} | Chipade Saraf</title>
      </Helmet>
      <div className="min-h-screen bg-cream dark:bg-dark py-10">
        <div className="section-padding max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <RiSearchLine className="text-gold-500" size={22} />
            <h1 className="font-playfair text-3xl text-dark dark:text-cream">
              {q ? `Results for "${q}"` : 'Search Jewellery'}
            </h1>
          </div>
          {data?.products && (
            <p className="font-inter text-sm text-dark/40 dark:text-cream/40 mb-8">
              {data.products.length} piece{data.products.length !== 1 ? 's' : ''} found
            </p>
          )}

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => <div key={i} className="aspect-product shimmer-loading" />)}
            </div>
          ) : data?.products?.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-cormorant text-2xl text-dark/30 dark:text-cream/30 italic">No jewellery found matching "{q}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {data?.products?.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
