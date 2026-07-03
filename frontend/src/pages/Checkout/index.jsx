import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import api from '@/lib/axios'
import toast from 'react-hot-toast'

function formatINR(n) { return '₹' + Number(n).toLocaleString('en-IN') }

const STEPS = ['Shipping', 'Payment', 'Review']

export default function Checkout() {
  const [step, setStep] = useState(0)
  const [payMethod, setPayMethod] = useState('razorpay')
  const [loading, setLoading] = useState(false)
  const { items, total, gst, discount, subtotal, coupon, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const { register, handleSubmit, getValues, formState: { errors } } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName:  user?.lastName  || '',
      email:     user?.email     || '',
      phone:     user?.phone     || '',
      address:   '',
      city:      '',
      state:     '',
      pincode:   '',
      notes:     '',
      giftWrap:  false,
    },
  })

  const loadRazorpay = () => new Promise(resolve => {
    if (window.Razorpay) { resolve(true); return }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })

  const handlePayment = async (formData) => {
    setLoading(true)
    try {
      // Create order on backend
      const order = await api.post('/orders', {
        items,
        shipping: formData,
        payment: payMethod,
        couponCode: coupon?.code,
      })

      if (payMethod === 'cod') {
        clearCart()
        navigate(`/order-success?orderId=${order.orderId}`)
        return
      }

      // Razorpay flow
      await loadRazorpay()
      const options = {
        key:         import.meta.env.VITE_RAZORPAY_KEY,
        amount:      order.razorpayAmount,
        currency:    'INR',
        order_id:    order.razorpayOrderId,
        name:        'Chipade Saraf Jewellery',
        description: `Order #${order.orderId}`,
        prefill: {
          name:  `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: '#C8A165' },
        handler: async (response) => {
          await api.post('/payments/verify', {
            orderId: order.orderId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId:   response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          })
          clearCart()
          navigate(`/order-success?orderId=${order.orderId}`)
        },
      }
      new window.Razorpay(options).open()
    } catch (e) {
      toast.error(e?.message || 'Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Helmet><title>Checkout | Chipade Saraf</title></Helmet>

      <div className="min-h-screen bg-cream dark:bg-dark py-10">
        <div className="section-padding max-w-5xl mx-auto">
          <h1 className="font-playfair text-4xl text-dark dark:text-cream mb-8">Checkout</h1>

          {/* Steps */}
          <div className="flex items-center gap-0 mb-10">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={`flex items-center gap-2 cursor-pointer`} onClick={() => i < step && setStep(i)}>
                  <div className={`w-8 h-8 flex items-center justify-center font-poppins text-sm font-semibold
                    ${step >= i ? 'bg-gold-500 text-dark' : 'bg-dark/10 dark:bg-cream/10 text-dark/40 dark:text-cream/40'}`}>
                    {i + 1}
                  </div>
                  <span className={`font-poppins text-xs tracking-wider uppercase hidden sm:block
                    ${step >= i ? 'text-gold-500' : 'text-dark/40 dark:text-cream/40'}`}>{s}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-12 md:w-24 h-px mx-3 ${step > i ? 'bg-gold-500' : 'bg-dark/15 dark:bg-cream/15'}`} />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit(handlePayment)}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* ── Form ── */}
              <div className="lg:col-span-2">
                {step === 0 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-charcoal p-6 md:p-8">
                    <h2 className="font-playfair text-2xl text-dark dark:text-cream mb-6">Shipping Information</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {[
                        { name: 'firstName', label: 'First Name', required: true },
                        { name: 'lastName',  label: 'Last Name',  required: true },
                        { name: 'email',     label: 'Email',      required: true, type: 'email',  sm: false, full: true },
                        { name: 'phone',     label: 'Phone',      required: true, type: 'tel',    sm: false, full: true },
                        { name: 'address',   label: 'Address',    required: true, sm: false, full: true },
                        { name: 'city',      label: 'City',       required: true },
                        { name: 'state',     label: 'State',      required: true },
                        { name: 'pincode',   label: 'Pincode',    required: true },
                      ].map(({ name, label, required, type = 'text', full }) => (
                        <div key={name} className={full ? 'sm:col-span-2' : ''}>
                          <label className="font-poppins text-[10px] tracking-widest uppercase text-dark/40 dark:text-cream/40 block mb-1.5">
                            {label}
                          </label>
                          <input
                            {...register(name, { required: required && `${label} is required` })}
                            type={type}
                            className="input-luxury border border-dark/15 dark:border-cream/15 px-3 py-3 w-full"
                          />
                          {errors[name] && (
                            <p className="font-inter text-xs text-red-400 mt-1">{errors[name].message}</p>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="mt-4">
                      <label className="font-poppins text-[10px] tracking-widest uppercase text-dark/40 dark:text-cream/40 block mb-1.5">
                        Order Notes (Optional)
                      </label>
                      <textarea
                        {...register('notes')}
                        rows={3}
                        className="input-luxury border border-dark/15 dark:border-cream/15 px-3 py-3 w-full resize-none"
                        placeholder="Special instructions for your order…"
                      />
                    </div>

                    <label className="flex items-center gap-3 mt-4 cursor-pointer">
                      <input {...register('giftWrap')} type="checkbox" className="accent-gold-500" />
                      <span className="font-inter text-sm text-dark/60 dark:text-cream/60">
                        Add luxury gift wrapping (+₹500)
                      </span>
                    </label>

                    <button type="button" onClick={() => setStep(1)} className="btn-gold mt-6">
                      Continue to Payment
                    </button>
                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-charcoal p-6 md:p-8">
                    <h2 className="font-playfair text-2xl text-dark dark:text-cream mb-6">Payment</h2>
                    <div className="flex flex-col gap-3">
                      {[
                        { value: 'razorpay', label: 'Razorpay (Cards, UPI, Net Banking)', icon: '💳' },
                        { value: 'cod',      label: 'Cash on Delivery',                   icon: '💰' },
                      ].map(opt => (
                        <label key={opt.value}
                          className={`flex items-center gap-4 p-4 border cursor-pointer transition-colors
                            ${payMethod === opt.value ? 'border-gold-500 bg-gold-500/5' : 'border-dark/15 dark:border-cream/15 hover:border-gold-300'}`}
                        >
                          <input
                            type="radio"
                            name="payMethod"
                            value={opt.value}
                            checked={payMethod === opt.value}
                            onChange={() => setPayMethod(opt.value)}
                            className="accent-gold-500"
                          />
                          <span className="text-lg">{opt.icon}</span>
                          <span className="font-inter text-sm text-dark dark:text-cream">{opt.label}</span>
                        </label>
                      ))}
                    </div>

                    <div className="flex gap-3 mt-6">
                      <button type="button" onClick={() => setStep(0)} className="btn-outline-gold">
                        ← Back
                      </button>
                      <button type="button" onClick={() => setStep(2)} className="btn-gold">
                        Review Order
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-charcoal p-6 md:p-8">
                    <h2 className="font-playfair text-2xl text-dark dark:text-cream mb-6">Review & Place Order</h2>

                    {/* Shipping summary */}
                    <div className="mb-6 p-4 bg-cream dark:bg-dark">
                      <p className="label-luxury mb-2">Shipping To</p>
                      <p className="font-inter text-sm text-dark/60 dark:text-cream/60">
                        {getValues('firstName')} {getValues('lastName')}<br />
                        {getValues('address')}, {getValues('city')}, {getValues('state')} — {getValues('pincode')}
                      </p>
                    </div>

                    {/* Items summary */}
                    {items.map(item => (
                      <div key={item.id} className="flex items-center gap-3 py-3 border-b border-dark/5 dark:border-cream/5">
                        <div className="w-12 h-14 overflow-hidden bg-cream dark:bg-dark flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="font-playfair text-sm text-dark dark:text-cream">{item.name}</p>
                          <p className="font-inter text-xs text-dark/40">Qty: {item.qty}</p>
                        </div>
                        <p className="font-cormorant text-base font-semibold text-gold-500">
                          {formatINR(item.price * item.qty)}
                        </p>
                      </div>
                    ))}

                    <div className="flex gap-3 mt-6">
                      <button type="button" onClick={() => setStep(1)} className="btn-outline-gold">
                        ← Back
                      </button>
                      <button type="submit" disabled={loading} className="btn-gold flex-1 justify-center">
                        {loading ? 'Processing…' : `Place Order — ${formatINR(total)}`}
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* ── Summary sidebar ── */}
              <div className="bg-white dark:bg-charcoal p-6 h-fit">
                <h3 className="font-playfair text-xl text-dark dark:text-cream mb-5">Order Total</h3>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between font-inter text-sm text-dark/60 dark:text-cream/60">
                    <span>Subtotal</span><span>{formatINR(subtotal)}</span>
                  </div>
                  {coupon && (
                    <div className="flex justify-between font-inter text-sm text-green-500">
                      <span>Coupon</span><span>−{formatINR(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-inter text-sm text-dark/60 dark:text-cream/60">
                    <span>GST</span><span>{formatINR(gst)}</span>
                  </div>
                  <div className="flex justify-between font-inter text-sm text-dark/60 dark:text-cream/60">
                    <span>Shipping</span><span className="text-green-500">Free</span>
                  </div>
                  <div className="flex justify-between font-playfair text-xl font-semibold text-dark dark:text-cream
                                  pt-3 border-t border-dark/10 dark:border-cream/10">
                    <span>Total</span><span className="text-gold-500">{formatINR(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
