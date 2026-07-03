import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RiDeleteBin2Line, RiAddLine, RiSubtractLine,
  RiArrowRightLine, RiShoppingBagLine, RiCoupon2Line,
} from 'react-icons/ri'
import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import api from '@/lib/axios'
import toast from 'react-hot-toast'

function formatINR(n) { return '₹' + Number(n).toLocaleString('en-IN') }

export default function Cart() {
  const { items, removeItem, updateQty, subtotal, discount, gst, total, coupon, applyCoupon, removeCoupon } = useCart()
  const [couponCode, setCouponCode] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return
    setCouponLoading(true)
    try {
      const data = await api.post('/coupons/validate', { code: couponCode, subtotal })
      applyCoupon({ ...data.coupon, code: couponCode })
      toast.success('Coupon applied!')
    } catch (e) {
      toast.error(e?.message || 'Invalid coupon')
    } finally {
      setCouponLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream dark:bg-dark flex flex-col items-center justify-center gap-6 p-8">
        <RiShoppingBagLine size={64} className="text-dark/10 dark:text-cream/10" />
        <h2 className="font-playfair text-3xl text-dark dark:text-cream">Your bag is empty</h2>
        <p className="font-cormorant text-xl text-dark/40 dark:text-cream/40 italic text-center">
          Discover our curated collections and fill it with things you love.
        </p>
        <Link to="/shop" className="btn-gold mt-2">
          Start Shopping <RiArrowRightLine />
        </Link>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Your Bag | Chipade Saraf</title>
      </Helmet>

      <div className="min-h-screen bg-cream dark:bg-dark py-10">
        <div className="section-padding max-w-7xl mx-auto">
          <h1 className="font-playfair text-4xl text-dark dark:text-cream mb-10">Your Bag</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* ── Items ── */}
            <div className="lg:col-span-2 flex flex-col gap-0">
              <AnimatePresence initial={false}>
                {items.map(item => (
                  <motion.div
                    key={item.id}
                    layout
                    exit={{ opacity: 0, height: 0 }}
                    className="flex gap-5 py-6 border-b border-dark/8 dark:border-cream/8"
                  >
                    <Link to={`/product/${item.slug}`} className="flex-shrink-0">
                      <div className="w-24 h-32 overflow-hidden bg-white dark:bg-charcoal">
                        <img src={item.image || 'https://placehold.co/96x128/F9F7F3/C8A165?text=✦'}
                          alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.slug}`}
                        className="font-playfair text-base md:text-lg text-dark dark:text-cream hover:text-gold-500 transition-colors">
                        {item.name}
                      </Link>
                      {item.variant && (
                        <p className="font-inter text-xs text-dark/40 dark:text-cream/40 mt-0.5">{item.variant}</p>
                      )}
                      <p className="font-cormorant text-xl font-semibold text-gold-500 mt-2">
                        {formatINR(item.price)}
                      </p>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-dark/20 dark:border-cream/20">
                          <button onClick={() => updateQty(item.id, item.qty - 1)}
                            className="px-3 py-2 text-dark/50 dark:text-cream/50 hover:text-dark dark:hover:text-cream transition-colors">
                            <RiSubtractLine size={14} />
                          </button>
                          <span className="px-4 font-poppins text-sm text-dark dark:text-cream">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, item.qty + 1)}
                            className="px-3 py-2 text-dark/50 dark:text-cream/50 hover:text-dark dark:hover:text-cream transition-colors">
                            <RiAddLine size={14} />
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-playfair text-lg text-dark dark:text-cream font-medium">
                            {formatINR(item.price * item.qty)}
                          </span>
                          <button onClick={() => removeItem(item.id)}
                            className="p-1.5 text-dark/25 hover:text-red-400 transition-colors">
                            <RiDeleteBin2Line size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* ── Summary ── */}
            <div>
              <div className="bg-white dark:bg-charcoal p-6">
                <h3 className="font-playfair text-xl text-dark dark:text-cream mb-5">Order Summary</h3>

                {/* Coupon */}
                <div className="mb-5">
                  {coupon ? (
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-2">
                        <RiCoupon2Line className="text-green-500" />
                        <span className="font-poppins text-xs font-semibold text-green-600 dark:text-green-400">
                          {coupon.code}
                        </span>
                      </div>
                      <button onClick={removeCoupon}
                        className="font-inter text-xs text-dark/40 hover:text-red-400 transition-colors">
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        value={couponCode}
                        onChange={e => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Coupon Code"
                        className="flex-1 input-luxury border border-dark/15 dark:border-cream/15 px-3 py-2 text-sm"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={couponLoading}
                        className="btn-dark px-4 py-2 text-xs"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>

                {/* Price breakdown */}
                <div className="flex flex-col gap-3 pt-4 border-t border-dark/5 dark:border-cream/5">
                  <div className="flex justify-between font-inter text-sm text-dark/60 dark:text-cream/60">
                    <span>Subtotal ({items.length} items)</span>
                    <span>{formatINR(subtotal)}</span>
                  </div>
                  {coupon && (
                    <div className="flex justify-between font-inter text-sm text-green-500">
                      <span>Discount</span>
                      <span>−{formatINR(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-inter text-sm text-dark/60 dark:text-cream/60">
                    <span>GST (3%)</span>
                    <span>{formatINR(gst)}</span>
                  </div>
                  <div className="flex justify-between font-inter text-sm text-dark/60 dark:text-cream/60">
                    <span>Shipping</span>
                    <span className="text-green-500">Free</span>
                  </div>
                  <div className="flex justify-between font-playfair text-xl font-semibold
                                  text-dark dark:text-cream pt-3 border-t border-dark/10 dark:border-cream/10">
                    <span>Total</span>
                    <span className="text-gold-500">{formatINR(total)}</span>
                  </div>
                </div>

                <Link to="/checkout" className="btn-gold w-full justify-center mt-6">
                  Proceed to Checkout <RiArrowRightLine />
                </Link>
                <Link to="/shop" className="block text-center mt-3 font-poppins text-xs tracking-wider
                                           text-dark/40 dark:text-cream/40 hover:text-gold-500 transition-colors">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
