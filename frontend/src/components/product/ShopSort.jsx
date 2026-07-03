import { useSearchParams } from 'react-router-dom'
import { SORT_OPTIONS } from '@/constants'

export default function ShopSort() {
  const [params, setParams] = useSearchParams()
  const current = params.get('sort') || 'newest'

  const handleChange = (e) => {
    params.set('sort', e.target.value)
    setParams(params)
  }

  return (
    <select
      value={current}
      onChange={handleChange}
      className="font-poppins text-xs tracking-wider text-dark/60 dark:text-cream/60
                 bg-transparent border border-dark/15 dark:border-cream/15 px-3 py-2
                 focus:outline-none focus:border-gold-500 cursor-pointer"
    >
      {SORT_OPTIONS.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  )
}
