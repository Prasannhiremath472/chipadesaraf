import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { RiHeartLine } from 'react-icons/ri'
import { useWishlist } from '@/contexts/WishlistContext'
import ProductCard from '@/components/ui/ProductCard'

export default function Wishlist() {
  const { items } = useWishlist()

  return (
    <>
      <Helmet><title>Wishlist | Chipade Saraf</title></Helmet>
      <div className="min-h-screen bg-cream dark:bg-dark py-10">
        <div className="section-padding max-w-7xl mx-auto">
          <h1 className="font-playfair text-4xl text-dark dark:text-cream mb-3">Wishlist</h1>
          <p className="font-cormorant text-xl text-dark/40 dark:text-cream/40 italic mb-10">
            {items.length} {items.length === 1 ? 'piece' : 'pieces'} saved
          </p>

          {items.length === 0 ? (
            <div className="flex flex-col items-center gap-6 py-20 text-center">
              <RiHeartLine size={64} className="text-dark/10 dark:text-cream/10" />
              <p className="font-cormorant text-2xl text-dark/30 dark:text-cream/30 italic">
                Your wishlist is empty
              </p>
              <Link to="/shop" className="btn-gold">Explore Collections</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {items.map((item, i) => (
                <ProductCard key={item.id} product={{ ...item, thumbnail: item.image }} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
