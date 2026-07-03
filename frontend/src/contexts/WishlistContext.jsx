import { createContext, useContext, useReducer, useEffect } from 'react'
import toast from 'react-hot-toast'

const WishlistContext = createContext(null)

function wishlistReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE': {
      const exists = state.items.find(i => i.id === action.payload.id)
      return exists
        ? { ...state, items: state.items.filter(i => i.id !== action.payload.id) }
        : { ...state, items: [...state.items, action.payload] }
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter(i => i.id !== action.payload) }
    case 'HYDRATE':
      return { ...state, items: action.payload }
    default:
      return state
  }
}

export function WishlistProvider({ children }) {
  const [state, dispatch] = useReducer(wishlistReducer, { items: [] })

  useEffect(() => {
    try {
      const saved = localStorage.getItem('arae_wishlist')
      if (saved) dispatch({ type: 'HYDRATE', payload: JSON.parse(saved) })
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem('arae_wishlist', JSON.stringify(state.items))
  }, [state.items])

  const toggle = (product) => {
    const exists = state.items.find(i => i.id === product.id)
    dispatch({ type: 'TOGGLE', payload: product })
    toast.success(exists ? 'Removed from wishlist' : 'Added to wishlist')
  }

  const isWishlisted = (id) => state.items.some(i => i.id === id)

  return (
    <WishlistContext.Provider value={{ ...state, toggle, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
