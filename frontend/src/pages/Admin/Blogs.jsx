import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { RiAddLine, RiEditLine, RiDeleteBin2Line, RiCloseLine, RiUploadLine } from 'react-icons/ri'
import { motion, AnimatePresence } from 'framer-motion'
import api from '@/lib/axios'
import toast from 'react-hot-toast'

const CATEGORIES = ['Heritage', 'Gold Guide', 'Bridal', 'Care Tips', 'Forming', 'News']

function BlogModal({ open, onClose, editing }) {
  const qc = useQueryClient()
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: editing || { category: 'Heritage', published: '1' }
  })
  const [imgPreview, setImgPreview] = useState(editing?.image || null)

  const saveMut = useMutation({
    mutationFn: (fd) => editing
      ? api.put(`/blogs/${editing.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      : api.post('/blogs', fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
    onSuccess: () => {
      qc.invalidateQueries(['admin-blogs'])
      toast.success(editing ? 'Blog updated!' : 'Blog created!')
      reset(); onClose()
    },
    onError: (e) => toast.error(e?.response?.data?.message || 'Save failed'),
  })

  const onSubmit = (data) => {
    const fd = new FormData()
    Object.entries(data).forEach(([k, v]) => {
      if (k === 'image' && v?.[0]) fd.append('image', v[0])
      else if (v !== undefined && v !== '') fd.append(k, v)
    })
    saveMut.mutate(fd)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-6 px-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative bg-white w-full max-w-2xl rounded-xl shadow-2xl z-10">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-playfair text-xl text-gray-900">{editing ? 'Edit Blog Post' : 'New Blog Post'}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"><RiCloseLine size={20} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-4">
          <div>
            <label className="block font-poppins text-[10px] tracking-widest uppercase text-gray-400 mb-1.5">Title *</label>
            <input {...register('title', { required: true })}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 font-poppins text-sm focus:outline-none focus:border-[#C8963C]"
              placeholder="e.g. The Complete Guide to Kolhapuri Saaj" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-poppins text-[10px] tracking-widest uppercase text-gray-400 mb-1.5">Category</label>
              <select {...register('category')}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 font-poppins text-sm focus:outline-none focus:border-[#C8963C] bg-white">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-poppins text-[10px] tracking-widest uppercase text-gray-400 mb-1.5">Status</label>
              <select {...register('published')}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 font-poppins text-sm focus:outline-none focus:border-[#C8963C] bg-white">
                <option value="1">Published</option>
                <option value="0">Draft</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-poppins text-[10px] tracking-widest uppercase text-gray-400 mb-1.5">Excerpt (short summary)</label>
            <textarea {...register('excerpt')} rows={2}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 font-poppins text-sm focus:outline-none focus:border-[#C8963C] resize-none"
              placeholder="Short description shown on blog listing..." />
          </div>

          <div>
            <label className="block font-poppins text-[10px] tracking-widest uppercase text-gray-400 mb-1.5">Content *</label>
            <textarea {...register('content', { required: true })} rows={8}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 font-poppins text-sm focus:outline-none focus:border-[#C8963C] resize-none"
              placeholder="Write the full blog content here..." />
          </div>

          <div>
            <label className="block font-poppins text-[10px] tracking-widest uppercase text-gray-400 mb-1.5">Cover Image</label>
            <label className="flex items-center gap-4 border-2 border-dashed border-gray-200 rounded-xl p-4 cursor-pointer hover:border-[#C8963C] transition-colors">
              {imgPreview
                ? <img src={imgPreview} alt="" className="h-16 w-24 object-cover rounded-lg" />
                : <RiUploadLine size={28} className="text-gray-300" />
              }
              <span className="font-poppins text-xs text-gray-400">Click to upload cover image</span>
              <input type="file" accept="image/*" className="hidden" {...register('image')}
                onChange={e => { if (e.target.files[0]) setImgPreview(URL.createObjectURL(e.target.files[0])) }} />
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 border border-gray-200 text-gray-600 font-poppins text-sm rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saveMut.isPending}
              className="px-6 py-2.5 bg-[#C8963C] text-white font-poppins text-sm font-semibold rounded-lg hover:bg-[#b07830] disabled:opacity-60 transition-colors">
              {saveMut.isPending ? 'Saving…' : editing ? 'Update Post' : 'Publish Post'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default function AdminBlogs() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing]     = useState(null)
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-blogs'],
    queryFn: () => api.get('/blogs?limit=50'),
    placeholderData: { blogs: [] },
  })

  const deleteMut = useMutation({
    mutationFn: (id) => api.delete(`/blogs/${id}`),
    onSuccess: () => { qc.invalidateQueries(['admin-blogs']); toast.success('Post deleted') },
    onError: () => toast.error('Delete failed'),
  })

  const openAdd  = () => { setEditing(null); setModalOpen(true) }
  const openEdit = (b) => { setEditing(b);   setModalOpen(true) }

  return (
    <>
      <Helmet><title>Blogs | Chipade Saraf Admin</title></Helmet>

      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-playfair text-2xl md:text-3xl text-gray-900 font-semibold">Blog Posts</h1>
            <p className="font-poppins text-sm text-gray-400 mt-0.5">{data?.blogs?.length || 0} posts</p>
          </div>
          <button onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#C8963C] text-white font-poppins text-sm font-semibold hover:bg-[#b07830] transition-colors rounded-lg">
            <RiAddLine size={16} /> New Post
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Post', 'Category', 'Date', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 font-poppins text-[10px] tracking-widest uppercase text-gray-400 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  [...Array(4)].map((_, i) => (
                    <tr key={i}>{[...Array(5)].map((_, j) => (
                      <td key={j} className="px-5 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                    ))}</tr>
                  ))
                ) : data?.blogs?.length === 0 ? (
                  <tr><td colSpan={5} className="px-5 py-16 text-center font-poppins text-sm text-gray-400">No blog posts yet</td></tr>
                ) : (
                  data?.blogs?.map(b => (
                    <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {b.image && <img src={b.image} alt="" className="w-12 h-10 object-cover rounded-lg shrink-0" />}
                          <p className="font-poppins text-sm text-gray-900 font-medium line-clamp-1">{b.title}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="px-2 py-1 bg-[#8B1A4A]/10 text-[#8B1A4A] font-poppins text-[10px] font-semibold rounded">{b.category}</span>
                      </td>
                      <td className="px-5 py-3.5 font-poppins text-xs text-gray-400">
                        {new Date(b.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-poppins font-bold
                          ${b.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {b.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1">
                          <button onClick={() => openEdit(b)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                            <RiEditLine size={15} />
                          </button>
                          <button onClick={() => { if (window.confirm('Delete this post?')) deleteMut.mutate(b.id) }}
                            className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
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
        </div>
      </div>

      <AnimatePresence>
        {modalOpen && <BlogModal open={modalOpen} onClose={() => setModalOpen(false)} editing={editing} />}
      </AnimatePresence>
    </>
  )
}
