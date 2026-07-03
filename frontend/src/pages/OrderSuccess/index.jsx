import { useSearchParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'

export default function OrderSuccess() {
  const [params] = useSearchParams()
  const orderId = params.get('orderId')

  return (
    <>
      <Helmet><title>Order Confirmed | Chipade Saraf</title></Helmet>
      <div className="min-h-screen bg-cream dark:bg-dark flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full text-center"
        >
          {/* Success animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 bg-gradient-gold rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <span className="text-dark text-3xl">✓</span>
          </motion.div>

          <p className="label-luxury mb-3">Order Confirmed</p>
          <h1 className="font-playfair text-4xl text-dark dark:text-cream mb-4">
            Thank You!
          </h1>
          <p className="font-cormorant text-xl text-dark/50 dark:text-cream/50 italic mb-2">
            Your order has been placed successfully.
          </p>
          {orderId && (
            <p className="font-poppins text-sm text-gold-500 mb-8">
              Order ID: <strong>#{orderId}</strong>
            </p>
          )}

          <p className="font-inter text-sm text-dark/50 dark:text-cream/50 mb-8 leading-relaxed">
            You'll receive a confirmation email shortly. Our team will begin preparing your jewellery immediately.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/account/orders" className="btn-gold justify-center">Track My Order</Link>
            <Link to="/shop" className="btn-outline-gold justify-center">Continue Shopping</Link>
          </div>
        </motion.div>
      </div>
    </>
  )
}
