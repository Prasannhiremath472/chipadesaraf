import { Helmet } from 'react-helmet-async'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { RiCheckLine, RiDeleteBin2Line } from 'react-icons/ri'
import api from '@/lib/axios'
import toast from 'react-hot-toast'

export default function AdminReviews() {
  const qc = useQueryClient()
  const { data } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: () => api.get('/admin/reviews'),
    placeholderData: { reviews: [] },
  })

  const approveMut = useMutation({
    mutationFn: (id) => api.patch(`/admin/reviews/${id}/approve`),
    onSuccess: () => { qc.invalidateQueries(['admin-reviews']); toast.success('Review approved') },
  })
  const deleteMut = useMutation({
    mutationFn: (id) => api.delete(`/admin/reviews/${id}`),
    onSuccess: () => { qc.invalidateQueries(['admin-reviews']); toast.success('Review deleted') },
  })

  return (
    <>
      <Helmet><title>Reviews | Chipade Saraf Admin</title></Helmet>
      <div>
        <h1 className="font-playfair text-3xl text-gray-900 font-semibold mb-6">Reviews</h1>
        <div className="bg-white rounded-lg border border-gray-100 overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['Customer', 'Product', 'Rating', 'Review', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 font-poppins text-[10px] tracking-widest uppercase text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data?.reviews?.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3.5 font-inter text-sm font-medium text-gray-900">{r.userName}</td>
                  <td className="px-5 py-3.5 font-inter text-sm text-gray-600 line-clamp-1 max-w-[120px]">{r.productName}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex text-gold-500 text-sm">
                      {[...Array(r.rating)].map((_, i) => <span key={i}>★</span>)}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-inter text-sm text-gray-600 max-w-xs">
                    <p className="line-clamp-2">{r.comment}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-poppins font-semibold ${r.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {r.approved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      {!r.approved && (
                        <button onClick={() => approveMut.mutate(r.id)} className="p-1.5 text-green-500 hover:bg-green-50 rounded">
                          <RiCheckLine size={16} />
                        </button>
                      )}
                      <button onClick={() => deleteMut.mutate(r.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded">
                        <RiDeleteBin2Line size={16} />
                      </button>
                    </div>
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
