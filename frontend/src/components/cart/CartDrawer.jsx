import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RiCloseLine, RiDeleteBin2Line, RiAddLine, RiSubtractLine,
  RiShoppingBagLine, RiArrowRightLine,
} from 'react-icons/ri'
import { useCart } from '@/contexts/CartContext'
import { useState } from 'react'

function formatINR(n) {
  return '₹' + Number(n).toLocaleString('en-IN')
}

export default function CartDrawer() {
  const [open, setOpen] = useState(false)
  const { items, removeItem, updateQty, subtotal, discount, gst, total, coupon } = useCart()

  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener('open-cart', handler)
    return () => window.removeEventListener('open-cart', handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-dark/60 z-60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-charcoal
                       z-70 flex flex-col shadow-luxury-lg"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-black/5 dark:border-white/5">
              <div>
                <h2 className="font-playfair text-xl text-dark dark:text-cream font-medium">Your Cart</h2>
                <p className="font-poppins text-xs text-dark/40 dark:text-cream/40 mt-0.5">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 text-dark/50 dark:text-cream/50 hover:text-dark dark:hover:text-cream transition-colors"
              >
                <RiCloseLine size={22} />
              </button>
            </div>

            {/* Items */}
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
                <RiShoppingBagLine size={48} className="text-dark/10 dark:text-cream/10" />
                <p className="font-cormorant text-xl text-dark/40 dark:text-cream/40 italic">
                  Your cart is empty
                </p>
                <button
                  onClick={() => setOpen(false)}
                  className="btn-outline-gold mt-2"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto py-4 no-scrollbar">
                  <AnimatePresence initial={false}>
                    {items.map(item => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex gap-4 px-6 py-4 border-b border-black/5 dark:border-white/5 last:border-0"
                      >
                        {/* Image */}
                        <Link to={`/product/${item.slug}`} onClick={() => setOpen(false)}>
                          <div className="w-20 h-24 bg-cream flex-shrink-0 overflow-hidden">
                            <img
                              src={item.image || 'https://placehold.co/80x96/F9F7F3/C8A165?text=✦'}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </Link>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/product/${item.slug}`}
                            onClick={() => setOpen(false)}
                            className="font-playfair text-sm text-dark dark:text-cream
                                       hover:text-gold-500 transition-colors line-clamp-2"
                          >
                            {item.name}
                          </Link>
                          {item.variant && (
                            <p className="font-poppins text-xs text-dark/40 dark:text-cream/40 mt-0.5">
                              {item.variant}
                            </p>
                          )}
                          <p className="font-cormorant text-base font-semibold text-gold-500 mt-1">
                            {formatINR(item.price)}
                          </p>

                          {/* Qty control */}
                          <div className="flex items-center gap-3 mt-2">
                            <button
                              onClick={() => updateQty(item.id, item.qty - 1)}
                              className="w-6 h-6 border border-dark/20 dark:border-cream/20 flex items-center justify-center
                                         text-dark/60 dark:text-cream/60 hover:border-gold-500 hover:text-gold-500 transition-colors"
                            >
                              <RiSubtractLine size={12} />
                            </button>
                            <span className="font-poppins text-sm text-dark dark:text-cream w-5 text-center">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => updateQty(item.id, item.qty + 1)}
                              className="w-6 h-6 border border-dark/20 dark:border-cream/20 flex items-center justify-center
                                         text-dark/60 dark:text-cream/60 hover:border-gold-500 hover:text-gold-500 transition-colors"
                            >
                              <RiAddLine size={12} />
                            </button>
                          </div>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="self-start mt-0.5 p-1.5 text-dark/30 dark:text-cream/30
                                     hover:text-red-400 transition-colors"
                        >
                          <RiDeleteBin2Line size={15} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Summary */}
                <div className="border-t border-black/5 dark:border-white/5 px-6 py-5">
                  <div className="flex flex-col gap-2 mb-4">
                    <div className="flex justify-between font-inter text-sm text-dark/60 dark:text-cream/60">
                      <span>Subtotal</span><span>{formatINR(subtotal)}</span>
                    </div>
                    {coupon && (
                      <div className="flex justify-between font-inter text-sm text-green-500">
                        <span>Coupon ({coupon.code})</span>
                        <span>−{formatINR(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-inter text-sm text-dark/60 dark:text-cream/60">
                      <span>GST (3%)</span><span>{formatINR(gst)}</span>
                    </div>
                    <div className="flex justify-between font-playfair text-base font-semibold
                                    text-dark dark:text-cream border-t border-black/5 dark:border-white/5 pt-2 mt-1">
                      <span>Total</span><span className="text-gold-500">{formatINR(total)}</span>
                    </div>
                  </div>

                  <Link
                    to="/checkout"
                    onClick={() => setOpen(false)}
                    className="btn-gold w-full justify-center"
                  >
                    Proceed to Checkout
                    <RiArrowRightLine />
                  </Link>

                  <Link
                    to="/cart"
                    onClick={() => setOpen(false)}
                    className="block text-center mt-3 font-poppins text-xs tracking-wider
                               text-dark/40 dark:text-cream/40 hover:text-gold-500 transition-colors"
                  >
                    View Full Cart
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
