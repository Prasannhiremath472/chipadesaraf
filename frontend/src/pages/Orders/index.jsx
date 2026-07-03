import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/axios'

const STATUS_COLORS = {
  pending:    'bg-yellow-100 text-yellow-700',
  confirmed:  'bg-blue-100 text-blue-700',
  shipped:    'bg-purple-100 text-purple-700',
  delivered:  'bg-green-100 text-green-700',
  cancelled:  'bg-red-100 text-red-700',
}

export default function Orders() {
  const { data, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => api.get('/orders/mine'),
    placeholderData: { orders: [] },
  })

  return (
    <>
      <Helmet><title>My Orders | Chipade Saraf</title></Helmet>
      <div className="min-h-screen bg-cream dark:bg-dark py-10">
        <div className="section-padding max-w-4xl mx-auto">
          <h1 className="font-playfair text-4xl text-dark dark:text-cream mb-10">My Orders</h1>

          {isLoading ? (
            <div className="flex flex-col gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 shimmer-loading" />
              ))}
            </div>
          ) : data?.orders?.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-cormorant text-2xl text-dark/30 dark:text-cream/30 italic mb-6">
                You haven't placed any orders yet.
              </p>
              <Link to="/shop" className="btn-gold">Start Shopping</Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {data.orders.map(order => (
                <Link
                  key={order.id}
                  to={`/account/orders/${order.id}`}
                  className="bg-white dark:bg-charcoal p-5 flex items-center gap-4 hover:shadow-card transition-shadow"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-playfair text-base text-dark dark:text-cream">Order #{order.id}</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-poppins font-semibold ${STATUS_COLORS[order.status] || ''}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="font-inter text-xs text-dark/40 dark:text-cream/40">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      {' · '}{order.items?.length} item(s)
                    </p>
                  </div>
                  <p className="font-playfair text-lg text-gold-500 font-semibold">
                    ₹{Number(order.total).toLocaleString('en-IN')}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
