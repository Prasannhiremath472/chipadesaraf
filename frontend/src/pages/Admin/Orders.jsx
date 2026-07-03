import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RiSearchLine, RiCloseLine, RiEyeLine, RiDownloadLine,
  RiTruckLine, RiUserLine, RiMapPinLine, RiPhoneLine,
} from 'react-icons/ri'
import api from '@/lib/axios'
import toast from 'react-hot-toast'

const STATUSES = ['pending','confirmed','processing','shipped','delivered','cancelled']
const STATUS_COLORS = {
  pending:    'bg-yellow-100 text-yellow-700',
  confirmed:  'bg-blue-100 text-blue-700',
  processing: 'bg-indigo-100 text-indigo-700',
  shipped:    'bg-purple-100 text-purple-700',
  delivered:  'bg-green-100 text-green-700',
  cancelled:  'bg-red-100 text-red-700',
}
const fmt = (n) => '₹' + Number(n || 0).toLocaleString('en-IN')

function OrderDetailModal({ order, onClose }) {
  if (!order) return null
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-6 px-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative bg-white w-full max-w-2xl rounded-xl shadow-2xl z-10">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-playfair text-xl text-gray-900">Order #{order.id}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"><RiCloseLine size={20} /></button>
        </div>

        <div className="p-6 space-y-5">
          {/* Status + Date */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-xs font-poppins font-bold capitalize ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-500'}`}>
              {order.status}
            </span>
            <span className="font-poppins text-xs text-gray-400">
              {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-poppins font-bold capitalize ml-auto
              ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {order.paymentStatus || 'pending'} payment
            </span>
          </div>

          {/* Customer Info */}
          <div className="bg-gray-50 rounded-xl p-4 grid sm:grid-cols-2 gap-3">
            <div className="flex items-start gap-2">
              <RiUserLine className="text-gray-400 mt-0.5 shrink-0" size={15} />
              <div>
                <p className="font-poppins text-[10px] text-gray-400 uppercase tracking-widest">Customer</p>
                <p className="font-poppins text-sm text-gray-800 font-medium">{order.customer}</p>
                <p className="font-poppins text-xs text-gray-500">{order.email}</p>
              </div>
            </div>
            {order.phone && (
              <div className="flex items-start gap-2">
                <RiPhoneLine className="text-gray-400 mt-0.5 shrink-0" size={15} />
                <div>
                  <p className="font-poppins text-[10px] text-gray-400 uppercase tracking-widest">Phone</p>
                  <p className="font-poppins text-sm text-gray-800">{order.phone}</p>
                </div>
              </div>
            )}
            {order.shippingAddress && (
              <div className="flex items-start gap-2 sm:col-span-2">
                <RiMapPinLine className="text-gray-400 mt-0.5 shrink-0" size={15} />
                <div>
                  <p className="font-poppins text-[10px] text-gray-400 uppercase tracking-widest">Shipping Address</p>
                  <p className="font-poppins text-sm text-gray-800">
                    {typeof order.shippingAddress === 'string'
                      ? order.shippingAddress
                      : `${order.shippingAddress.line1 || ''}, ${order.shippingAddress.city || ''}, ${order.shippingAddress.state || ''} ${order.shippingAddress.pincode || ''}`
                    }
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Order Items */}
          {order.items?.length > 0 && (
            <div>
              <p className="font-poppins text-[10px] text-gray-400 uppercase tracking-widest mb-3">Items Ordered</p>
              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    {item.thumbnail && <img src={item.thumbnail} alt="" className="w-12 h-12 object-cover rounded-lg shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="font-poppins text-sm text-gray-900 font-medium line-clamp-1">{item.name}</p>
                      <p className="font-poppins text-xs text-gray-400">Qty: {item.qty} × {fmt(item.price)}</p>
                    </div>
                    <p className="font-poppins text-sm font-semibold text-gray-900">{fmt(item.qty * item.price)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Totals */}
          <div className="border-t border-gray-100 pt-4 space-y-2">
            {order.discount > 0 && (
              <div className="flex justify-between font-poppins text-sm text-green-600">
                <span>Discount</span><span>−{fmt(order.discount)}</span>
              </div>
            )}
            {order.shippingCharge >= 0 && (
              <div className="flex justify-between font-poppins text-sm text-gray-600">
                <span>Shipping</span>
                <span>{order.shippingCharge === 0 ? 'Free' : fmt(order.shippingCharge)}</span>
              </div>
            )}
            <div className="flex justify-between font-playfair text-lg font-bold text-gray-900 pt-2 border-t border-gray-100">
              <span>Total</span><span>{fmt(order.total)}</span>
            </div>
          </div>

          {order.notes && (
            <div className="bg-amber-50 rounded-xl p-4">
              <p className="font-poppins text-[10px] text-amber-600 uppercase tracking-widest mb-1">Order Notes</p>
              <p className="font-poppins text-sm text-amber-800">{order.notes}</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default function AdminOrders() {
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', statusFilter, search, page],
    queryFn: () => api.get(`/admin/orders?status=${statusFilter}&search=${search}&page=${page}&limit=20`),
    placeholderData: { orders: [], total: 0 },
  })

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => api.patch(`/admin/orders/${id}/status`, { status }),
    onSuccess: () => { qc.invalidateQueries(['admin-orders']); toast.success('Order status updated') },
    onError: () => toast.error('Update failed'),
  })

  const totalPages = Math.ceil((data?.total || 0) / 20)

  return (
    <>
      <Helmet><title>Orders | Chipade Saraf Admin</title></Helmet>

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-playfair text-2xl md:text-3xl text-gray-900 font-semibold">Orders</h1>
            <p className="font-poppins text-sm text-gray-400 mt-0.5">{data?.total || 0} total orders</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search by order ID or customer name…"
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg font-poppins text-sm focus:outline-none focus:border-[#C8963C] bg-white" />
          </div>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
            className="border border-gray-200 rounded-lg px-3 py-2.5 font-poppins text-sm text-gray-600 bg-white focus:outline-none focus:border-[#C8963C]">
            <option value="">All Status</option>
            {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>

        {/* Status summary pills */}
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map(s => (
            <button key={s} onClick={() => { setStatusFilter(statusFilter === s ? '' : s); setPage(1) }}
              className={`px-3 py-1 rounded-full font-poppins text-[11px] font-semibold capitalize transition-all
                ${statusFilter === s ? STATUS_COLORS[s] + ' ring-2 ring-offset-1 ring-current' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
              {s}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Order ID','Customer','Date','Items','Total','Payment','Status','Update',''].map(h => (
                    <th key={h} className="text-left px-4 py-3.5 font-poppins text-[10px] tracking-widest uppercase text-gray-400 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  [...Array(6)].map((_, i) => (
                    <tr key={i}>{[...Array(9)].map((_, j) => (
                      <td key={j} className="px-4 py-4"><div className="h-3 bg-gray-100 rounded animate-pulse" /></td>
                    ))}</tr>
                  ))
                ) : data?.orders?.length === 0 ? (
                  <tr><td colSpan={9} className="px-5 py-16 text-center font-poppins text-sm text-gray-400">No orders found</td></tr>
                ) : (
                  data?.orders?.map(o => (
                    <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3.5 font-poppins text-sm font-semibold text-gray-900">#{o.id}</td>
                      <td className="px-4 py-3.5">
                        <p className="font-poppins text-sm text-gray-800 font-medium">{o.customer}</p>
                        <p className="font-poppins text-[10px] text-gray-400">{o.email}</p>
                      </td>
                      <td className="px-4 py-3.5 font-poppins text-xs text-gray-400 whitespace-nowrap">
                        {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3.5 font-poppins text-sm text-gray-600 text-center">{o.itemCount || '—'}</td>
                      <td className="px-4 py-3.5 font-poppins text-sm font-semibold text-gray-900 whitespace-nowrap">{fmt(o.total)}</td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-poppins font-bold capitalize
                          ${o.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {o.paymentStatus || 'pending'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-poppins font-bold capitalize ${STATUS_COLORS[o.status] || 'bg-gray-100 text-gray-500'}`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <select value={o.status}
                          onChange={e => updateStatus.mutate({ id: o.id, status: e.target.value })}
                          className="border border-gray-200 rounded-lg px-2 py-1.5 font-poppins text-xs focus:outline-none focus:border-[#C8963C] bg-white">
                          {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3.5">
                        <button onClick={() => setSelectedOrder(o)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="View details">
                          <RiEyeLine size={15} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100">
              <p className="font-poppins text-xs text-gray-400">Page {page} of {totalPages} · {data?.total} orders</p>
              <div className="flex gap-2">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                  className="px-3 py-1.5 border border-gray-200 rounded font-poppins text-xs disabled:opacity-40 hover:bg-gray-50 transition-colors">← Prev</button>
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                  className="px-3 py-1.5 border border-gray-200 rounded font-poppins text-xs disabled:opacity-40 hover:bg-gray-50 transition-colors">Next →</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedOrder && <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
      </AnimatePresence>
    </>
  )
}
