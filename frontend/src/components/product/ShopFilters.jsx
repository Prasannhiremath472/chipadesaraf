import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { RiArrowDownSLine } from 'react-icons/ri'
import { CATEGORIES, MATERIALS, OCCASIONS, PURITY_OPTIONS } from '@/constants'

function FilterSection({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-dark/5 dark:border-cream/5">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full px-6 py-4
                   font-poppins text-xs font-semibold tracking-widest uppercase
                   text-dark/60 dark:text-cream/60 hover:text-dark dark:hover:text-cream transition-colors"
      >
        {title}
        <RiArrowDownSLine className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-6 pb-4">{children}</div>}
    </div>
  )
}

export default function ShopFilters({ onClose }) {
  const [params, setParams] = useSearchParams()
  const [priceRange, setPriceRange] = useState([0, 1000000])

  const toggle = (key, value) => {
    const current = params.get(key)
    if (current === value) {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    setParams(params)
  }

  const clearAll = () => {
    setParams({})
    onClose?.()
  }

  return (
    <div className="flex-1">
      {/* Clear */}
      <div className="flex items-center justify-end px-6 py-3">
        <button
          onClick={clearAll}
          className="font-poppins text-xs text-gold-500 hover:text-gold-600 tracking-wider"
        >
          Clear All
        </button>
      </div>

      {/* Price */}
      <FilterSection title="Price Range" defaultOpen>
        <div className="flex items-center justify-between mb-3">
          <span className="font-inter text-xs text-dark/50 dark:text-cream/50">
            ₹{priceRange[0].toLocaleString('en-IN')}
          </span>
          <span className="font-inter text-xs text-dark/50 dark:text-cream/50">
            ₹{priceRange[1].toLocaleString('en-IN')}
          </span>
        </div>
        <input
          type="range"
          min="0" max="1000000" step="5000"
          value={priceRange[1]}
          onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
          className="w-full accent-gold-500"
        />
      </FilterSection>

      {/* Category */}
      <FilterSection title="Category" defaultOpen>
        {CATEGORIES.map(cat => (
          <label key={cat.slug} className="flex items-center gap-2.5 py-1.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={params.get('category') === cat.slug}
              onChange={() => toggle('category', cat.slug)}
              className="accent-gold-500"
            />
            <span className="font-inter text-sm text-dark/60 dark:text-cream/60 group-hover:text-gold-500 transition-colors">
              {cat.name}
            </span>
          </label>
        ))}
      </FilterSection>

      {/* Material */}
      <FilterSection title="Material">
        {MATERIALS.map(mat => (
          <label key={mat.slug} className="flex items-center gap-2.5 py-1.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={params.get('material') === mat.slug}
              onChange={() => toggle('material', mat.slug)}
              className="accent-gold-500"
            />
            <span className="font-inter text-sm text-dark/60 dark:text-cream/60 group-hover:text-gold-500 transition-colors">
              {mat.name}
            </span>
          </label>
        ))}
      </FilterSection>

      {/* Purity */}
      <FilterSection title="Purity">
        <div className="flex flex-wrap gap-2">
          {PURITY_OPTIONS.map(p => (
            <button
              key={p}
              onClick={() => toggle('purity', p)}
              className={`px-3 py-1 border text-xs font-poppins tracking-wider transition-all
                ${params.get('purity') === p
                  ? 'border-gold-500 bg-gold-500 text-dark'
                  : 'border-dark/15 dark:border-cream/15 text-dark/50 dark:text-cream/50 hover:border-gold-500'
                }`}
            >
              {p}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Occasion */}
      <FilterSection title="Occasion">
        {OCCASIONS.map(occ => (
          <label key={occ.slug} className="flex items-center gap-2.5 py-1.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={params.get('occasion') === occ.slug}
              onChange={() => toggle('occasion', occ.slug)}
              className="accent-gold-500"
            />
            <span className="font-inter text-sm text-dark/60 dark:text-cream/60 group-hover:text-gold-500 transition-colors">
              {occ.name}
            </span>
          </label>
        ))}
      </FilterSection>

      {/* Gender */}
      <FilterSection title="Gender">
        {['Women', 'Men', 'Kids', 'Unisex'].map(g => (
          <label key={g} className="flex items-center gap-2.5 py-1.5 cursor-pointer group">
            <input
              type="radio"
              name="gender"
              checked={params.get('gender') === g.toLowerCase()}
              onChange={() => toggle('gender', g.toLowerCase())}
              className="accent-gold-500"
            />
            <span className="font-inter text-sm text-dark/60 dark:text-cream/60 group-hover:text-gold-500 transition-colors">
              {g}
            </span>
          </label>
        ))}
      </FilterSection>

      {/* Availability */}
      <FilterSection title="Availability">
        <label className="flex items-center gap-2.5 py-1.5 cursor-pointer">
          <input type="checkbox" className="accent-gold-500"
            onChange={() => toggle('inStock', 'true')} />
          <span className="font-inter text-sm text-dark/60 dark:text-cream/60">In Stock Only</span>
        </label>
        <label className="flex items-center gap-2.5 py-1.5 cursor-pointer">
          <input type="checkbox" className="accent-gold-500"
            onChange={() => toggle('onSale', 'true')} />
          <span className="font-inter text-sm text-dark/60 dark:text-cream/60">On Sale</span>
        </label>
      </FilterSection>

      {/* Apply button */}
      <div className="px-6 py-6">
        <button onClick={onClose} className="btn-gold w-full justify-center">
          Apply Filters
        </button>
      </div>
    </div>
  )
}
