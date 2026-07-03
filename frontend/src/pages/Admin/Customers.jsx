import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RiSearchLine, RiCloseLine, RiUserLine, RiShoppingBagLine,
  RiMoneyDollarCircleLine, RiCheckLine, RiProhibitedLine,
} from 'react-icons/ri'
import api from '@/lib/axios'
import toast from 'react-hot-toast'

const fmt = (n) => '₹' + Number(n || 0).toLocaleString('en-IN')

function CustomerDetailModal({ customer, onClose }) {
  if (!customer) return null
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-6 px-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative bg-white w-full max-w-lg rounded-xl shadow-2xl z-10">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-playfair text-xl text-gray-900">Customer Profile</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"><RiCloseLine size={20} /></button>
        </div>
        <div className="p-6 space-y-5">
          {/* Avatar + name */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#8B1A4A]/10 flex items-center justify-center shrink-0">
              <span className="font-playfair text-2xl font-bold text-[#8B1A4A]">
                {(customer.name || customer.firstName || '?')[0].toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-playfair text-xl text-gray-900 font-semibold">
                {customer.name || `${customer.firstName || ''} ${customer.lastName || ''}`.trim()}
              </p>
              <p className="font-poppins text-sm text-gray-400">{customer.email}</p>
              {customer.phone && <p className="font-poppins text-sm text-gray-400">{customer.phone}</p>}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Total Orders', value: customer.orderCount || 0, icon: RiShoppingBagLine, color: 'text-blue-500' },
              { label: 'Total Spent',  value: fmt(customer.totalSpent), icon: RiMoneyDollarCircleLine, color: 'text-green-500' },
              { label: 'Avg Order',    value: customer.orderCount > 0 ? fmt(customer.totalSpent / customer.orderCount) : '—', icon: RiMoneyDollarCircleLine, color: 'text-[#C8963C]' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-4 text-center">
                <Icon size={18} className={`${color} mx-auto mb-1`} />
                <p className="font-poppins text-sm font-bold text-gray-900">{value}</p>
                <p className="font-poppins text-[10px] text-gray-400">{label}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-between text-sm font-poppins">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">Member Since</p>
              <p className="text-gray-700">{new Date(customer.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">Status</p>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${customer.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                {customer.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function AdminCustomers() {
  const [search, setSearch]     = useState('')
  const [page, setPage]         = useState(1)
  const [selected, setSelected] = useState(null)
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-customers', search, page],
    queryFn: () => api.get(`/admin/customers?search=${search}&page=${page}&limit=20`),
    placeholderData: { customers: [], total: 0 },
  })

  const toggleActive = useMutation({
    mutationFn: ({ id, isActive }) => api.patch(`/admin/customers/${id}/status`, { isActive: !isActive }),
    onSuccess: () => { qc.invalidateQueries(['admin-customers']); toast.success('Customer status updated') },
    onError: () => toast.error('Update failed'),
  })

  const totalPages = Math.ceil((data?.total || 0) / 20)

  return (
    <>
      <Helmet><title>Customers | Chipade Saraf Admin</title></Helmet>

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-playfair text-2xl md:text-3xl text-gray-900 font-semibold">Customers</h1>
            <p className="font-poppins text-sm text-gray-400 mt-0.5">{data?.total || 0} registered customers</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search by name, email or phone…"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg font-poppins text-sm focus:outline-none focus:border-[#C8963C] bg-white" />
        </div>

        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px]">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Customer','Email','Phone','Orders','Total Spent','Avg Order','Joined','Status',''].map(h => (
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
                ) : data?.customers?.length === 0 ? (
                  <tr><td colSpan={9} className="px-5 py-16 text-center font-poppins text-sm text-gray-400">No customers found</td></tr>
                ) : (
                  data?.customers?.map(c => {
                    const name = c.name || `${c.firstName || ''} ${c.lastName || ''}`.trim()
                    const avgOrder = c.orderCount > 0 ? c.totalSpent / c.orderCount : 0
                    return (
                      <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-[#8B1A4A]/10 flex items-center justify-center shrink-0">
                              <span className="font-poppins text-xs font-bold text-[#8B1A4A]">{(name || '?')[0].toUpperCase()}</span>
                            </div>
                            <span className="font-poppins text-sm font-medium text-gray-900">{name || '—'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 font-poppins text-sm text-gray-600">{c.email}</td>
                        <td className="px-4 py-3.5 font-poppins text-sm text-gray-600">{c.phone || '—'}</td>
                        <td className="px-4 py-3.5 font-poppins text-sm font-semibold text-gray-900 text-center">{c.orderCount || 0}</td>
                        <td className="px-4 py-3.5 font-poppins text-sm font-semibold text-gray-900">{fmt(c.totalSpent)}</td>
                        <td className="px-4 py-3.5 font-poppins text-sm text-gray-600">{avgOrder > 0 ? fmt(avgOrder) : '—'}</td>
                        <td className="px-4 py-3.5 font-poppins text-xs text-gray-400 whitespace-nowrap">
                          {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-poppins font-bold
                            ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                            {c.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1">
                            <button onClick={() => setSelected(c)}
                              className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="View profile">
                              <RiUserLine size={15} />
                            </button>
                            <button onClick={() => { if (window.confirm(`${c.isActive ? 'Deactivate' : 'Activate'} this customer?`)) toggleActive.mutate({ id: c.id, isActive: c.isActive }) }}
                              className={`p-2 rounded-lg transition-colors ${c.isActive ? 'text-red-400 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'}`}
                              title={c.isActive ? 'Deactivate' : 'Activate'}>
                              {c.isActive ? <RiProhibitedLine size={15} /> : <RiCheckLine size={15} />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100">
              <p className="font-poppins text-xs text-gray-400">Page {page} of {totalPages} · {data?.total} customers</p>
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
        {selected && <CustomerDetailModal customer={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </>
  )
}
