import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { RiAddLine, RiEditLine, RiDeleteBin2Line, RiSearchLine, RiCloseLine, RiUploadLine } from 'react-icons/ri'
import { motion, AnimatePresence } from 'framer-motion'
import api from '@/lib/axios'
import toast from 'react-hot-toast'

const CATEGORIES = ['Gold', 'Diamond', 'Silver', 'Forming', 'Bridal', 'Daily Wear', 'Necklaces', 'Earrings', 'Bangles', 'Bracelets', 'Rings', 'Pendants', 'Bullions']
const PURITY_OPTIONS = ['24K (999)', '22K (916)', '18K (750)', '14K (585)', '925 Silver', '999 Silver', 'Forming']

function ProductModal({ open, onClose, editing }) {
  const qc = useQueryClient()
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: editing || { active: '1' }
  })
  const [thumbPreview, setThumbPreview] = useState(editing?.thumbnail || null)

  const saveMut = useMutation({
    mutationFn: (formData) => editing
      ? api.put(`/products/${editing.id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      : api.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    onSuccess: () => {
      qc.invalidateQueries(['admin-products'])
      toast.success(editing ? 'Product updated!' : 'Product created!')
      reset()
      onClose()
    },
    onError: (e) => toast.error(e?.response?.data?.message || 'Save failed'),
  })

  const onSubmit = (data) => {
    const fd = new FormData()
    Object.entries(data).forEach(([k, v]) => {
      if (k === 'thumbnail' && v?.[0]) fd.append('thumbnail', v[0])
      else if (k === 'images' && v?.length) Array.from(v).forEach(f => fd.append('images', f))
      else if (v !== undefined && v !== '') fd.append(k, v)
    })
    saveMut.mutate(fd)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-6 px-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative bg-white w-full max-w-3xl rounded-xl shadow-2xl z-10">

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-playfair text-xl text-gray-900">{editing ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"><RiCloseLine size={20} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div className="md:col-span-2">
              <label className="block font-poppins text-[10px] tracking-widest uppercase text-gray-400 mb-1.5">Product Name *</label>
              <input {...register('name', { required: 'Name is required' })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 font-poppins text-sm focus:outline-none focus:border-[#C8963C]"
                placeholder="e.g. Kolhapuri Gold Necklace Set" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block font-poppins text-[10px] tracking-widest uppercase text-gray-400 mb-1.5">Category *</label>
              <select {...register('category', { required: true })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 font-poppins text-sm focus:outline-none focus:border-[#C8963C] bg-white">
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block font-poppins text-[10px] tracking-widest uppercase text-gray-400 mb-1.5">Price (₹) *</label>
              <input type="number" {...register('price', { required: 'Price required', min: 1 })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 font-poppins text-sm focus:outline-none focus:border-[#C8963C]"
                placeholder="25000" />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
            </div>

            <div>
              <label className="block font-poppins text-[10px] tracking-widest uppercase text-gray-400 mb-1.5">Discount Price (₹)</label>
              <input type="number" {...register('discountPrice')}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 font-poppins text-sm focus:outline-none focus:border-[#C8963C]"
                placeholder="Optional" />
            </div>

            <div>
              <label className="block font-poppins text-[10px] tracking-widest uppercase text-gray-400 mb-1.5">Stock Qty *</label>
              <input type="number" {...register('stock', { required: true, min: 0 })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 font-poppins text-sm focus:outline-none focus:border-[#C8963C]"
                placeholder="10" />
            </div>

            <div>
              <label className="block font-poppins text-[10px] tracking-widest uppercase text-gray-400 mb-1.5">SKU</label>
              <input {...register('sku')}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 font-poppins text-sm focus:outline-none focus:border-[#C8963C]"
                placeholder="CS-NECK-001" />
            </div>

            <div>
              <label className="block font-poppins text-[10px] tracking-widest uppercase text-gray-400 mb-1.5">Gold Purity</label>
              <select {...register('purity')}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 font-poppins text-sm focus:outline-none focus:border-[#C8963C] bg-white">
                <option value="">Select purity</option>
                {PURITY_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div>
              <label className="block font-poppins text-[10px] tracking-widest uppercase text-gray-400 mb-1.5">Weight (grams)</label>
              <input type="number" step="0.01" {...register('weight')}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 font-poppins text-sm focus:outline-none focus:border-[#C8963C]"
                placeholder="12.5" />
            </div>

            <div>
              <label className="block font-poppins text-[10px] tracking-widest uppercase text-gray-400 mb-1.5">Occasion</label>
              <select {...register('occasion')}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 font-poppins text-sm focus:outline-none focus:border-[#C8963C] bg-white">
                <option value="">Select occasion</option>
                {['Bridal', 'Daily Wear', 'Festive', 'Gifting', 'Office'].map(o =>
                  <option key={o} value={o.toLowerCase()}>{o}</option>)}
              </select>
            </div>

            <div>
              <label className="block font-poppins text-[10px] tracking-widest uppercase text-gray-400 mb-1.5">Status</label>
              <select {...register('active')}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 font-poppins text-sm focus:outline-none focus:border-[#C8963C] bg-white">
                <option value="1">Active</option>
                <option value="0">Draft</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block font-poppins text-[10px] tracking-widest uppercase text-gray-400 mb-1.5">Description</label>
              <textarea {...register('description')} rows={3}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 font-poppins text-sm focus:outline-none focus:border-[#C8963C] resize-none"
                placeholder="Product description..." />
            </div>

            {/* Thumbnail */}
            <div>
              <label className="block font-poppins text-[10px] tracking-widest uppercase text-gray-400 mb-1.5">Thumbnail Image</label>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-5 cursor-pointer hover:border-[#C8963C] transition-colors">
                {thumbPreview
                  ? <img src={thumbPreview} alt="" className="h-20 w-20 object-cover rounded-lg mb-2" />
                  : <RiUploadLine size={28} className="text-gray-300 mb-2" />
                }
                <span className="font-poppins text-xs text-gray-400">Click to upload</span>
                <input type="file" accept="image/*" className="hidden"
                  {...register('thumbnail')}
                  onChange={e => { if (e.target.files[0]) setThumbPreview(URL.createObjectURL(e.target.files[0])) }} />
              </label>
            </div>

            {/* Gallery */}
            <div>
              <label className="block font-poppins text-[10px] tracking-widest uppercase text-gray-400 mb-1.5">Gallery Images (up to 10)</label>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-5 cursor-pointer hover:border-[#C8963C] transition-colors h-[120px]">
                <RiUploadLine size={28} className="text-gray-300 mb-2" />
                <span className="font-poppins text-xs text-gray-400">Select multiple images</span>
                <input type="file" accept="image/*" multiple className="hidden" {...register('images')} />
              </label>
            </div>

          </div>

          <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-gray-100">
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 border border-gray-200 text-gray-600 font-poppins text-sm rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saveMut.isPending}
              className="px-6 py-2.5 bg-[#C8963C] text-white font-poppins text-sm font-semibold rounded-lg hover:bg-[#b07830] disabled:opacity-60 transition-colors">
              {saveMut.isPending ? 'Saving…' : editing ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default function AdminProducts() {
  const [search, setSearch]       = useState('')
  const [page, setPage]           = useState(1)
  const [category, setCategory]   = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing]     = useState(null)
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', search, page, category],
    queryFn: () => api.get(`/admin/products?search=${search}&page=${page}&limit=20&category=${category}`),
    placeholderData: { products: [], total: 0 },
  })

  const deleteMut = useMutation({
    mutationFn: (id) => api.delete(`/products/${id}`),
    onSuccess: () => { qc.invalidateQueries(['admin-products']); toast.success('Product deleted') },
    onError: () => toast.error('Delete failed'),
  })

  const openAdd  = () => { setEditing(null); setModalOpen(true) }
  const openEdit = (p) => { setEditing(p);   setModalOpen(true) }
  const totalPages = Math.ceil((data?.total || 0) / 20)

  return (
    <>
      <Helmet><title>Products | Chipade Saraf Admin</title></Helmet>

      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-playfair text-2xl md:text-3xl text-gray-900 font-semibold">Products</h1>
            <p className="font-poppins text-sm text-gray-400 mt-0.5">{data?.total || 0} products listed</p>
          </div>
          <button onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#C8963C] text-white font-poppins text-sm font-semibold hover:bg-[#b07830] transition-colors rounded-lg self-start">
            <RiAddLine size={16} /> Add Product
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search by name or SKU…"
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg font-poppins text-sm focus:outline-none focus:border-[#C8963C] bg-white" />
          </div>
          <select value={category} onChange={e => { setCategory(e.target.value); setPage(1) }}
            className="border border-gray-200 rounded-lg px-3 py-2.5 font-poppins text-sm text-gray-600 focus:outline-none focus:border-[#C8963C] bg-white">
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 font-poppins text-[10px] tracking-widest uppercase text-gray-400 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  [...Array(6)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(6)].map((_, j) => (
                        <td key={j} className="px-5 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                      ))}
                    </tr>
                  ))
                ) : data?.products?.length === 0 ? (
                  <tr><td colSpan={6} className="px-5 py-16 text-center font-poppins text-sm text-gray-400">No products found</td></tr>
                ) : (
                  data?.products?.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                            {p.thumbnail && <img src={p.thumbnail} alt="" className="w-full h-full object-cover" />}
                          </div>
                          <div>
                            <p className="font-poppins text-sm text-gray-900 font-medium line-clamp-1">{p.name}</p>
                            <p className="font-poppins text-xs text-gray-400">SKU: {p.sku || '—'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-poppins text-sm text-gray-600">{p.category}</td>
                      <td className="px-5 py-3.5 font-poppins text-sm font-semibold text-gray-900">
                        ₹{Number(p.price).toLocaleString('en-IN')}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`font-poppins text-sm font-semibold ${p.stock <= 5 ? 'text-red-500' : 'text-gray-700'}`}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-poppins font-bold tracking-wide
                          ${p.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {p.active ? 'Active' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1">
                          <button onClick={() => openEdit(p)}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                            <RiEditLine size={15} />
                          </button>
                          <button
                            onClick={() => { if (window.confirm('Delete this product?')) deleteMut.mutate(p.id) }}
                            className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                            <RiDeleteBin2Line size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100">
              <p className="font-poppins text-xs text-gray-400">
                Page {page} of {totalPages} · {data?.total} total
              </p>
              <div className="flex gap-2">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                  className="px-3 py-1.5 border border-gray-200 rounded font-poppins text-xs disabled:opacity-40 hover:bg-gray-50 transition-colors">
                  ← Prev
                </button>
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                  className="px-3 py-1.5 border border-gray-200 rounded font-poppins text-xs disabled:opacity-40 hover:bg-gray-50 transition-colors">
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {modalOpen && <ProductModal open={modalOpen} onClose={() => setModalOpen(false)} editing={editing} />}
      </AnimatePresence>
    </>
  )
}
