import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { RiAddLine, RiDeleteBin2Line } from 'react-icons/ri'
import api from '@/lib/axios'
import toast from 'react-hot-toast'

export default function AdminCoupons() {
  const [showForm, setShowForm] = useState(false)
  const qc = useQueryClient()
  const { register, handleSubmit, reset } = useForm()

  const { data } = useQuery({
    queryKey: ['admin-coupons'],
    queryFn: () => api.get('/admin/coupons'),
    placeholderData: { coupons: [] },
  })

  const createMut = useMutation({
    mutationFn: (d) => api.post('/admin/coupons', d),
    onSuccess: () => { qc.invalidateQueries(['admin-coupons']); toast.success('Coupon created'); reset(); setShowForm(false) },
  })

  const deleteMut = useMutation({
    mutationFn: (id) => api.delete(`/admin/coupons/${id}`),
    onSuccess: () => { qc.invalidateQueries(['admin-coupons']); toast.success('Coupon deleted') },
  })

  return (
    <>
      <Helmet><title>Coupons | Chipade Saraf Admin</title></Helmet>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-playfair text-3xl text-gray-900 font-semibold">Coupons</h1>
          <button onClick={() => setShowForm(s => !s)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gold-500 text-dark font-poppins text-sm font-semibold">
            <RiAddLine /> Create Coupon
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit(d => createMut.mutate(d))}
            className="bg-white rounded-lg border border-gray-100 p-6 mb-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'code', label: 'Code', type: 'text', placeholder: 'SAVE20' },
              { name: 'type', label: 'Type' },
              { name: 'value', label: 'Value', type: 'number', placeholder: '20' },
              { name: 'minOrder', label: 'Min. Order (₹)', type: 'number', placeholder: '5000' },
            ].map(({ name, label, type = 'text', placeholder }) => (
              name === 'type' ? (
                <div key={name}>
                  <label className="font-poppins text-[10px] tracking-widest uppercase text-gray-400 block mb-1">{label}</label>
                  <select {...register(name)} className="w-full border border-gray-200 rounded px-3 py-2 font-inter text-sm focus:outline-none focus:border-gold-500">
                    <option value="percent">Percent (%)</option>
                    <option value="flat">Flat (₹)</option>
                  </select>
                </div>
              ) : (
                <div key={name}>
                  <label className="font-poppins text-[10px] tracking-widest uppercase text-gray-400 block mb-1">{label}</label>
                  <input {...register(name, { required: true })} type={type} placeholder={placeholder}
                    className="w-full border border-gray-200 rounded px-3 py-2 font-inter text-sm focus:outline-none focus:border-gold-500" />
                </div>
              )
            ))}
            <div className="sm:col-span-2 lg:col-span-4 flex gap-3">
              <button type="submit" className="btn-gold">Create</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-outline-gold">Cancel</button>
            </div>
          </form>
        )}

        <div className="bg-white rounded-lg border border-gray-100 overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['Code', 'Type', 'Value', 'Min Order', 'Used', 'Status', 'Action'].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 font-poppins text-[10px] tracking-widest uppercase text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data?.coupons?.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3.5 font-poppins text-sm font-bold text-gold-600">{c.code}</td>
                  <td className="px-5 py-3.5 font-inter text-sm text-gray-600">{c.type}</td>
                  <td className="px-5 py-3.5 font-inter text-sm text-gray-600">{c.type === 'percent' ? `${c.value}%` : `₹${c.value}`}</td>
                  <td className="px-5 py-3.5 font-inter text-sm text-gray-600">₹{Number(c.minOrder).toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3.5 font-inter text-sm text-gray-600">{c.usedCount}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-poppins font-semibold ${c.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {c.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => deleteMut.mutate(c.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded">
                      <RiDeleteBin2Line size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
