import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  RiShoppingBagLine, RiUserLine, RiMoneyDollarCircleLine, RiBox3Line,
  RiArrowUpLine, RiArrowDownLine, RiAlertLine, RiTrophyLine,
  RiTimeLine, RiCheckLine, RiTruckLine, RiCloseLine,
} from 'react-icons/ri'
import api from '@/lib/axios'

const fmt = (n) => '₹' + Number(n || 0).toLocaleString('en-IN')
const fmtL = (n) => '₹' + (Number(n || 0) / 100000).toFixed(1) + 'L'

const STATUS_COLORS = {
  pending:    'bg-yellow-100 text-yellow-700',
  confirmed:  'bg-blue-100 text-blue-700',
  processing: 'bg-indigo-100 text-indigo-700',
  shipped:    'bg-purple-100 text-purple-700',
  delivered:  'bg-green-100 text-green-700',
  cancelled:  'bg-red-100 text-red-700',
}
const STATUS_ICONS = {
  pending: RiTimeLine, confirmed: RiCheckLine,
  shipped: RiTruckLine, delivered: RiCheckLine,
  cancelled: RiCloseLine, processing: RiBox3Line,
}

export default function AdminDashboard() {
  const [range, setRange] = useState('30')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-stats', range],
    queryFn: () => api.get(`/admin/dashboard?days=${range}`),
    placeholderData: {
      stats: { revenue: 0, orders: 0, customers: 0, products: 0,
               prevRevenue: 0, prevOrders: 0 },
      recentOrders: [], topProducts: [], monthlyRevenue: [],
      ordersByStatus: [], lowStock: [],
    },
  })

  const s = data?.stats || {}
  const revChange = s.prevRevenue > 0 ? (((s.revenue - s.prevRevenue) / s.prevRevenue) * 100).toFixed(1) : null
  const ordChange = s.prevOrders  > 0 ? (((s.orders  - s.prevOrders)  / s.prevOrders)  * 100).toFixed(1) : null

  const STAT_CARDS = [
    {
      label: 'Total Revenue', value: fmtL(s.revenue), icon: RiMoneyDollarCircleLine,
      bg: 'bg-[#8B1A4A]/10', color: 'text-[#8B1A4A]', change: revChange,
      sub: `vs prev ${range}d`,
    },
    {
      label: 'Total Orders', value: Number(s.orders || 0).toLocaleString(), icon: RiShoppingBagLine,
      bg: 'bg-blue-500/10', color: 'text-blue-600', change: ordChange,
      sub: `vs prev ${range}d`,
    },
    {
      label: 'Total Customers', value: Number(s.customers || 0).toLocaleString(), icon: RiUserLine,
      bg: 'bg-purple-500/10', color: 'text-purple-600', change: null, sub: 'registered users',
    },
    {
      label: 'Active Products', value: Number(s.products || 0).toLocaleString(), icon: RiBox3Line,
      bg: 'bg-green-500/10', color: 'text-green-600', change: null, sub: 'in catalogue',
    },
  ]

  return (
    <>
      <Helmet><title>Dashboard | Chipade Saraf Admin</title></Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-playfair text-2xl md:text-3xl text-gray-900 font-semibold">Dashboard</h1>
            <p className="font-poppins text-sm text-gray-400 mt-0.5">Store performance overview</p>
          </div>
          <select value={range} onChange={e => setRange(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 font-poppins text-xs text-gray-600 bg-white focus:outline-none focus:border-[#C8963C]">
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STAT_CARDS.map(({ label, value, icon: Icon, bg, color, change, sub }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bg}`}>
                  <Icon size={20} className={color} />
                </div>
                {change !== null && (
                  <span className={`flex items-center gap-0.5 font-poppins text-xs font-semibold
                    ${Number(change) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {Number(change) >= 0 ? <RiArrowUpLine size={12} /> : <RiArrowDownLine size={12} />}
                    {Math.abs(change)}%
                  </span>
                )}
              </div>
              <p className="font-playfair text-2xl font-bold text-gray-900">{value}</p>
              <p className="font-poppins text-xs text-gray-400 mt-1">{label}</p>
              <p className="font-poppins text-[10px] text-gray-300 mt-0.5">{sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Revenue Chart + Orders by Status */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Revenue Trend */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h2 className="font-playfair text-lg text-gray-900 font-semibold mb-5">Revenue Trend</h2>
            {data?.monthlyRevenue?.length === 0 ? (
              <div className="h-40 flex items-center justify-center text-gray-300 font-poppins text-sm">No data yet</div>
            ) : (
              <div className="flex items-end gap-1.5 h-40">
                {(data?.monthlyRevenue || []).map((m, i) => {
                  const max = Math.max(...(data.monthlyRevenue || []).map(x => x.revenue))
                  const pct = max > 0 ? (m.revenue / max) * 100 : 0
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-poppins px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        {fmt(m.revenue)}
                      </div>
                      <div className="w-full bg-[#8B1A4A]/80 rounded-t hover:bg-[#8B1A4A] transition-colors"
                        style={{ height: `${Math.max(pct, 4)}%` }} />
                      <span className="font-poppins text-[9px] text-gray-400 truncate w-full text-center">
                        {m.month?.slice(5)}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Orders by Status */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h2 className="font-playfair text-lg text-gray-900 font-semibold mb-5">Orders by Status</h2>
            <div className="space-y-3">
              {(data?.ordersByStatus || []).length === 0 ? (
                <p className="text-center font-poppins text-sm text-gray-300 py-6">No orders yet</p>
              ) : (
                (data?.ordersByStatus || []).map(({ status, count }) => {
                  const Icon = STATUS_ICONS[status] || RiTimeLine
                  return (
                    <div key={status} className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-poppins font-bold capitalize min-w-[90px] text-center ${STATUS_COLORS[status] || 'bg-gray-100 text-gray-500'}`}>
                        {status}
                      </span>
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div className="bg-[#C8963C] h-2 rounded-full"
                          style={{ width: `${Math.min((count / (data?.stats?.orders || 1)) * 100, 100)}%` }} />
                      </div>
                      <span className="font-poppins text-xs font-semibold text-gray-700 min-w-[24px] text-right">{count}</span>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>

        {/* Recent Orders + Top Products + Low Stock */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
              <h2 className="font-playfair text-lg text-gray-900 font-semibold">Recent Orders</h2>
              <Link to="/admin/orders" className="font-poppins text-xs text-[#C8963C] hover:text-[#b07830]">View All →</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead className="bg-gray-50">
                  <tr>
                    {['Order', 'Customer', 'Total', 'Status'].map(h => (
                      <th key={h} className="text-left px-5 py-3 font-poppins text-[10px] tracking-widest uppercase text-gray-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {isLoading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i}>{[...Array(4)].map((_, j) => (
                        <td key={j} className="px-5 py-3.5"><div className="h-3 bg-gray-100 rounded animate-pulse" /></td>
                      ))}</tr>
                    ))
                  ) : data?.recentOrders?.length === 0 ? (
                    <tr><td colSpan={4} className="px-5 py-10 text-center font-poppins text-sm text-gray-300">No orders yet</td></tr>
                  ) : (
                    (data?.recentOrders || []).map(o => (
                      <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3 font-poppins text-sm font-semibold text-gray-900">#{o.id}</td>
                        <td className="px-5 py-3 font-poppins text-sm text-gray-600">{o.customer}</td>
                        <td className="px-5 py-3 font-poppins text-sm font-semibold text-gray-900">{fmt(o.total)}</td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-poppins font-bold capitalize ${STATUS_COLORS[o.status] || 'bg-gray-100 text-gray-500'}`}>
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Products + Low Stock */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-playfair text-lg text-gray-900 font-semibold">Top Products</h2>
                <RiTrophyLine className="text-[#C8963C]" size={18} />
              </div>
              {(data?.topProducts || []).length === 0 ? (
                <p className="text-center font-poppins text-sm text-gray-300 py-4">No sales yet</p>
              ) : (
                (data?.topProducts || []).map((p, i) => (
                  <div key={p.id} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                    <span className="font-playfair text-lg font-bold text-gray-200 w-5 text-center">{i + 1}</span>
                    {p.thumbnail && <img src={p.thumbnail} alt="" className="w-9 h-9 rounded-lg object-cover shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="font-poppins text-xs text-gray-800 font-medium line-clamp-1">{p.name}</p>
                      <p className="font-poppins text-[10px] text-gray-400">{p.sold} sold</p>
                    </div>
                    <p className="font-poppins text-xs font-semibold text-[#C8963C]">
                      ₹{(p.revenue / 1000).toFixed(0)}K
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Low Stock Alert */}
            {(data?.lowStock || []).length > 0 && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <RiAlertLine className="text-red-500" size={16} />
                  <h3 className="font-poppins text-sm font-semibold text-red-700">Low Stock Alert</h3>
                </div>
                {(data?.lowStock || []).map(p => (
                  <div key={p.id} className="flex items-center justify-between py-1.5">
                    <p className="font-poppins text-xs text-red-700 line-clamp-1 flex-1">{p.name}</p>
                    <span className="font-poppins text-xs font-bold text-red-600 ml-2">{p.stock} left</span>
                  </div>
                ))}
                <Link to="/admin/products" className="block mt-3 font-poppins text-xs text-red-600 hover:text-red-800 underline">
                  Manage Inventory →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
