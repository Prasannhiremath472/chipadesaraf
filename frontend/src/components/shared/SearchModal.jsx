import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { RiSearchLine, RiCloseLine, RiArrowRightLine, RiTimeLine } from 'react-icons/ri'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/axios'
import { useDebounce } from '@/hooks/useDebounce'

const RECENT_KEY = 'arae_recent_searches'

export default function SearchModal() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [recent, setRecent] = useState([])
  const inputRef = useRef(null)
  const debouncedQuery = useDebounce(query, 350)

  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener('open-search', handler)
    return () => window.removeEventListener('open-search', handler)
  }, [])

  useEffect(() => {
    if (open) {
      const saved = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]')
      setRecent(saved)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  const { data, isLoading } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => api.get(`/products/search?q=${debouncedQuery}&limit=6`),
    enabled: debouncedQuery.length >= 2,
  })

  const saveRecent = (q) => {
    if (!q.trim()) return
    const updated = [q, ...recent.filter(r => r !== q)].slice(0, 6)
    setRecent(updated)
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated))
  }

  const handleSelect = (q) => {
    saveRecent(q)
    setOpen(false)
    setQuery('')
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-80 flex items-start justify-center pt-16 px-4
                     bg-dark/80 backdrop-blur-md"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,   scale: 1 }}
            exit={{ opacity: 0,    y: -20,  scale: 0.97 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl bg-white dark:bg-charcoal shadow-luxury-lg"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-black/5 dark:border-white/5">
              <RiSearchLine size={20} className="text-dark/40 dark:text-cream/40 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && query.trim()) {
                    handleSelect(query)
                    window.location.href = `/search?q=${encodeURIComponent(query)}`
                  }
                }}
                placeholder="Search jewellery, collections, occasions…"
                className="flex-1 bg-transparent font-inter text-base text-dark dark:text-cream
                           placeholder:text-dark/30 dark:placeholder:text-cream/30 focus:outline-none"
              />
              <button onClick={() => setOpen(false)}
                className="p-1 text-dark/40 dark:text-cream/40 hover:text-dark dark:hover:text-cream transition-colors">
                <RiCloseLine size={20} />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto no-scrollbar">
              {/* Recent searches */}
              {!debouncedQuery && recent.length > 0 && (
                <div className="p-4">
                  <p className="label-luxury mb-3">Recent Searches</p>
                  {recent.map(r => (
                    <Link
                      key={r}
                      to={`/search?q=${encodeURIComponent(r)}`}
                      onClick={() => handleSelect(r)}
                      className="flex items-center gap-3 py-2.5 px-2
                                 text-dark/60 dark:text-cream/60 hover:text-gold-500 transition-colors group"
                    >
                      <RiTimeLine size={14} className="flex-shrink-0" />
                      <span className="font-inter text-sm">{r}</span>
                      <RiArrowRightLine size={12} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                </div>
              )}

              {/* Live results */}
              {debouncedQuery.length >= 2 && (
                <div className="p-4">
                  {isLoading ? (
                    <div className="flex flex-col gap-3">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex gap-3 animate-pulse">
                          <div className="w-12 h-12 bg-gray-100 dark:bg-white/5 flex-shrink-0" />
                          <div className="flex-1 space-y-2 py-1">
                            <div className="h-3 bg-gray-100 dark:bg-white/5 rounded w-3/4" />
                            <div className="h-2 bg-gray-100 dark:bg-white/5 rounded w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : data?.products?.length > 0 ? (
                    <>
                      <p className="label-luxury mb-3">Products</p>
                      {data.products.map(p => (
                        <Link
                          key={p.id}
                          to={`/product/${p.slug}`}
                          onClick={() => handleSelect(p.name)}
                          className="flex items-center gap-3 py-2.5 hover:bg-cream dark:hover:bg-white/5
                                     transition-colors -mx-2 px-2 group"
                        >
                          <div className="w-12 h-12 flex-shrink-0 overflow-hidden bg-cream dark:bg-dark/50">
                            <img
                              src={p.thumbnail || 'https://placehold.co/48x48/F9F7F3/C8A165?text=✦'}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-playfair text-sm text-dark dark:text-cream line-clamp-1 group-hover:text-gold-500 transition-colors">
                              {p.name}
                            </p>
                            <p className="font-inter text-xs text-dark/40 dark:text-cream/40">{p.category}</p>
                          </div>
                          <p className="font-cormorant text-sm font-semibold text-gold-500 flex-shrink-0">
                            ₹{Number(p.price).toLocaleString('en-IN')}
                          </p>
                        </Link>
                      ))}
                      <Link
                        to={`/search?q=${encodeURIComponent(debouncedQuery)}`}
                        onClick={() => handleSelect(debouncedQuery)}
                        className="flex items-center justify-center gap-2 mt-4 py-2.5
                                   border border-gold-500/30 text-gold-500 font-poppins text-xs tracking-wider
                                   uppercase hover:bg-gold-500/5 transition-colors"
                      >
                        View all results for "{debouncedQuery}" <RiArrowRightLine />
                      </Link>
                    </>
                  ) : (
                    <p className="text-center font-cormorant text-lg text-dark/30 dark:text-cream/30 italic py-6">
                      No results for "{debouncedQuery}"
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
