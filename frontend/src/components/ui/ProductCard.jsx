import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  RiHeartLine, RiHeartFill, RiShoppingBagLine, RiEyeLine,
  RiArrowRightLine,
} from 'react-icons/ri'
import { useCart }     from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'

function formatINR(n) {
  return '₹' + Number(n).toLocaleString('en-IN')
}

export default function ProductCard({ product, index = 0 }) {
  const [hovered, setHovered] = useState(false)
  const [imgIdx, setImgIdx]   = useState(0)

  const { addItem }      = useCart()
  const { toggle, isWishlisted } = useWishlist()
  const wishlisted = isWishlisted(product.id)

  const images = product.images?.length > 1 ? product.images : [product.thumbnail || product.images?.[0]]
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleAddToCart = (e) => {
    e.preventDefault()
    addItem({
      id:    product.id,
      name:  product.name,
      price: product.price,
      image: images[0],
      slug:  product.slug,
    })
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    toggle({
      id:    product.id,
      name:  product.name,
      price: product.price,
      image: images[0],
      slug:  product.slug,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      viewport={{ once: true }}
      onMouseEnter={() => { setHovered(true); setImgIdx(1) }}
      onMouseLeave={() => { setHovered(false); setImgIdx(0) }}
      className="group relative"
    >
      <Link to={`/product/${product.slug}`} className="block">
        {/* ── Image ── */}
        <div className="relative aspect-product overflow-hidden bg-cream dark:bg-charcoal">
          <img
            src={images[imgIdx] || images[0] || 'https://placehold.co/400x533/F9F7F3/C8A165?text=✦'}
            alt={product.name}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700
              ${hovered ? 'scale-105' : 'scale-100'}`}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="badge-dark text-[10px]">New</span>
            )}
            {discount > 0 && (
              <span className="badge-gold text-[10px]">−{discount}%</span>
            )}
            {product.isBestseller && (
              <span className="bg-white text-dark border border-dark/10 rounded-full
                               px-2 py-0.5 text-[10px] font-poppins font-semibold tracking-wider uppercase">
                Bestseller
              </span>
            )}
          </div>

          {/* Actions */}
          <motion.div
            initial={false}
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
            transition={{ duration: 0.25 }}
            className="absolute top-3 right-3 flex flex-col gap-2"
          >
            <button
              onClick={handleWishlist}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              className="w-9 h-9 bg-white/90 dark:bg-dark/80 backdrop-blur-sm flex items-center
                         justify-center shadow-sm hover:scale-110 transition-transform"
            >
              {wishlisted
                ? <RiHeartFill size={16} className="text-red-400" />
                : <RiHeartLine size={16} className="text-dark dark:text-cream" />
              }
            </button>

            <Link
              to={`/product/${product.slug}`}
              aria-label="Quick view"
              className="w-9 h-9 bg-white/90 dark:bg-dark/80 backdrop-blur-sm flex items-center
                         justify-center shadow-sm hover:scale-110 transition-transform"
            >
              <RiEyeLine size={16} className="text-dark dark:text-cream" />
            </Link>
          </motion.div>

          {/* Add to cart overlay */}
          <motion.button
            initial={false}
            animate={{ y: hovered ? 0 : '100%', opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleAddToCart}
            className="absolute bottom-0 inset-x-0 py-3 bg-dark/90 dark:bg-cream/90
                       text-cream dark:text-dark font-poppins text-xs font-semibold tracking-widest
                       uppercase flex items-center justify-center gap-2 hover:bg-gold-500 transition-colors"
          >
            <RiShoppingBagLine size={14} />
            Add to Bag
          </motion.button>
        </div>

        {/* ── Info ── */}
        <div className="pt-4 pb-2">
          {product.category && (
            <p className="font-poppins text-[10px] tracking-widest uppercase text-gold-500 mb-1">
              {product.category}
            </p>
          )}

          <h3 className="font-playfair text-sm md:text-base text-dark dark:text-cream
                         leading-snug group-hover:text-gold-500 transition-colors line-clamp-2">
            {product.name}
          </h3>

          {product.metal && (
            <p className="font-inter text-xs text-dark/40 dark:text-cream/40 mt-0.5">
              {product.metal}
            </p>
          )}

          <div className="flex items-baseline gap-2 mt-2">
            <span className="font-cormorant text-lg font-semibold text-dark dark:text-cream">
              {formatINR(product.price)}
            </span>
            {product.originalPrice && (
              <span className="font-inter text-xs text-dark/35 dark:text-cream/35 line-through">
                {formatINR(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Rating */}
          {product.rating > 0 && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-[10px] ${i < Math.floor(product.rating) ? 'text-gold-500' : 'text-dark/15 dark:text-cream/15'}`}>
                    ★
                  </span>
                ))}
              </div>
              <span className="font-inter text-[10px] text-dark/40 dark:text-cream/40">
                ({product.reviewCount || 0})
              </span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
