import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/axios'

export default function OrderDetail() {
  const { id } = useParams()
  const { data, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => api.get(`/orders/${id}`),
  })

  if (isLoading) return <div className="min-h-screen bg-cream dark:bg-dark flex items-center justify-center"><div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" /></div>

  const order = data?.order
  if (!order) return <div className="min-h-screen bg-cream dark:bg-dark flex items-center justify-center"><p className="font-cormorant text-2xl text-dark/30 italic">Order not found</p></div>

  return (
    <>
      <Helmet><title>Order #{order.id} | Chipade Saraf</title></Helmet>
      <div className="min-h-screen bg-cream dark:bg-dark py-10">
        <div className="section-padding max-w-4xl mx-auto">
          <Link to="/account/orders" className="font-poppins text-xs text-dark/40 dark:text-cream/40 hover:text-gold-500 transition-colors mb-6 inline-block">
            ← Back to Orders
          </Link>
          <h1 className="font-playfair text-4xl text-dark dark:text-cream mb-2">Order #{order.id}</h1>
          <p className="font-inter text-sm text-dark/40 dark:text-cream/40 mb-10">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="bg-white dark:bg-charcoal p-6">
                <h3 className="font-playfair text-xl text-dark dark:text-cream mb-5">Items Ordered</h3>
                {order.items?.map(item => (
                  <div key={item.id} className="flex gap-4 py-4 border-b border-dark/5 dark:border-cream/5 last:border-0">
                    <div className="w-16 h-20 bg-cream dark:bg-dark overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="font-playfair text-sm text-dark dark:text-cream">{item.name}</p>
                      <p className="font-inter text-xs text-dark/40 dark:text-cream/40 mt-1">Qty: {item.qty}</p>
                    </div>
                    <p className="font-cormorant text-base font-semibold text-gold-500">
                      ₹{Number(item.price * item.qty).toLocaleString('en-IN')}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white dark:bg-charcoal p-5">
                <h4 className="font-playfair text-lg text-dark dark:text-cream mb-3">Order Summary</h4>
                <div className="flex justify-between font-playfair text-lg font-semibold text-gold-500">
                  <span>Total</span>
                  <span>₹{Number(order.total).toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div className="bg-white dark:bg-charcoal p-5">
                <h4 className="font-playfair text-lg text-dark dark:text-cream mb-3">Shipping To</h4>
                <p className="font-inter text-sm text-dark/60 dark:text-cream/60 leading-relaxed">
                  {order.shipping?.address}<br />
                  {order.shipping?.city}, {order.shipping?.state} — {order.shipping?.pincode}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
