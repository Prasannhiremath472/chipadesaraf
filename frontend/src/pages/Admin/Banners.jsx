import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { RiAddLine, RiDeleteBin2Line, RiCloseLine, RiUploadLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri'
import { motion, AnimatePresence } from 'framer-motion'
import api from '@/lib/axios'
import toast from 'react-hot-toast'

function BannerModal({ open, onClose }) {
  const qc = useQueryClient()
  const { register, handleSubmit, reset } = useForm()
  const [preview, setPreview] = useState(null)

  const createMut = useMutation({
    mutationFn: (fd) => api.post('/admin/banners', fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
    onSuccess: () => {
      qc.invalidateQueries(['admin-banners'])
      toast.success('Banner uploaded!')
      reset(); setPreview(null); onClose()
    },
    onError: (e) => toast.error(e?.response?.data?.message || 'Upload failed'),
  })

  const onSubmit = (data) => {
    const fd = new FormData()
    if (data.image?.[0]) fd.append('image', data.image[0])
    if (data.title)  fd.append('title', data.title)
    if (data.link)   fd.append('link', data.link)
    fd.append('active', data.active || '1')
    fd.append('sortOrder', data.sortOrder || '0')
    createMut.mutate(fd)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative bg-white w-full max-w-lg rounded-xl shadow-2xl z-10">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-playfair text-xl text-gray-900">Upload New Banner</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"><RiCloseLine size={20} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-4">
          {/* Image upload */}
          <div>
            <label className="block font-poppins text-[10px] tracking-widest uppercase text-gray-400 mb-1.5">Banner Image *</label>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-6 cursor-pointer hover:border-[#C8963C] transition-colors">
              {preview ? (
                <img src={preview} alt="" className="w-full h-32 object-cover rounded-lg mb-2" />
              ) : (
                <>
                  <RiUploadLine size={32} className="text-gray-300 mb-2" />
                  <span className="font-poppins text-xs text-gray-400">Click to upload banner image</span>
                  <span className="font-poppins text-[10px] text-gray-300 mt-1">Recommended: 1500×525px</span>
                </>
              )}
              <input type="file" accept="image/*" className="hidden" {...register('image', { required: true })}
                onChange={e => { if (e.target.files[0]) setPreview(URL.createObjectURL(e.target.files[0])) }} />
            </label>
          </div>

          <div>
            <label className="block font-poppins text-[10px] tracking-widest uppercase text-gray-400 mb-1.5">Banner Title</label>
            <input {...register('title')}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 font-poppins text-sm focus:outline-none focus:border-[#C8963C]"
              placeholder="e.g. Bridal Season 2025" />
          </div>

          <div>
            <label className="block font-poppins text-[10px] tracking-widest uppercase text-gray-400 mb-1.5">Link URL (optional)</label>
            <input {...register('link')}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 font-poppins text-sm focus:outline-none focus:border-[#C8963C]"
              placeholder="/shop?occasion=bridal" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-poppins text-[10px] tracking-widest uppercase text-gray-400 mb-1.5">Sort Order</label>
              <input type="number" {...register('sortOrder')} defaultValue="0"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 font-poppins text-sm focus:outline-none focus:border-[#C8963C]" />
            </div>
            <div>
              <label className="block font-poppins text-[10px] tracking-widest uppercase text-gray-400 mb-1.5">Status</label>
              <select {...register('active')}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 font-poppins text-sm focus:outline-none focus:border-[#C8963C] bg-white">
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 border border-gray-200 text-gray-600 font-poppins text-sm rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={createMut.isPending}
              className="px-6 py-2.5 bg-[#C8963C] text-white font-poppins text-sm font-semibold rounded-lg hover:bg-[#b07830] disabled:opacity-60 transition-colors">
              {createMut.isPending ? 'Uploading…' : 'Upload Banner'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default function AdminBanners() {
  const [modalOpen, setModalOpen] = useState(false)
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-banners'],
    queryFn: () => api.get('/admin/banners'),
    placeholderData: { banners: [] },
  })

  const deleteMut = useMutation({
    mutationFn: (id) => api.delete(`/admin/banners/${id}`),
    onSuccess: () => { qc.invalidateQueries(['admin-banners']); toast.success('Banner deleted') },
    onError: () => toast.error('Delete failed'),
  })

  const toggleMut = useMutation({
    mutationFn: ({ id, active }) => api.put(`/admin/banners/${id}`, { active: !active }),
    onSuccess: () => { qc.invalidateQueries(['admin-banners']); toast.success('Banner updated') },
  })

  return (
    <>
      <Helmet><title>Banners | Chipade Saraf Admin</title></Helmet>

      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-playfair text-2xl md:text-3xl text-gray-900 font-semibold">Banners</h1>
            <p className="font-poppins text-sm text-gray-400 mt-0.5">Manage homepage slider banners</p>
          </div>
          <button onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#C8963C] text-white font-poppins text-sm font-semibold hover:bg-[#b07830] transition-colors rounded-lg">
            <RiAddLine size={16} /> Upload Banner
          </button>
        </div>

        {/* Info note */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-6">
          <p className="font-poppins text-xs text-amber-700">
            <strong>Tip:</strong> Recommended banner size is <strong>1500 × 525px</strong> (landscape). Banners are shown in sort order, lowest first.
          </p>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-36 bg-gray-100" />
                <div className="p-4"><div className="h-3 bg-gray-100 rounded w-2/3" /></div>
              </div>
            ))}
          </div>
        ) : data?.banners?.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
            <RiUploadLine size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="font-poppins text-sm text-gray-400">No banners yet. Upload your first banner.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.banners?.map((b, i) => (
              <motion.div key={b.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                {/* Preview */}
                <div className="relative h-36 bg-gray-100">
                  <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                  {!b.active && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="font-poppins text-xs text-white font-semibold bg-black/50 px-3 py-1 rounded-full">Inactive</span>
                    </div>
                  )}
                  <span className="absolute top-2 left-2 bg-black/50 text-white font-poppins text-[10px] px-2 py-0.5 rounded">
                    #{b.sortOrder ?? i + 1}
                  </span>
                </div>
                {/* Info + actions */}
                <div className="p-4 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-poppins text-sm text-gray-800 font-medium truncate">{b.title || 'Untitled Banner'}</p>
                    {b.link && <p className="font-poppins text-[10px] text-gray-400 truncate">{b.link}</p>}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => toggleMut.mutate({ id: b.id, active: b.active })}
                      className={`p-2 rounded-lg transition-colors ${b.active ? 'text-green-500 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'}`}
                      title={b.active ? 'Deactivate' : 'Activate'}>
                      {b.active ? <RiEyeLine size={16} /> : <RiEyeOffLine size={16} />}
                    </button>
                    <button onClick={() => { if (window.confirm('Delete this banner?')) deleteMut.mutate(b.id) }}
                      className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                      <RiDeleteBin2Line size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {modalOpen && <BannerModal open={modalOpen} onClose={() => setModalOpen(false)} />}
      </AnimatePresence>
    </>
  )
}
