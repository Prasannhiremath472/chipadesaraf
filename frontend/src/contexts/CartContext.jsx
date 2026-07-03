import { createContext, useContext, useReducer, useEffect } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext(null)

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const exists = state.items.find(i => i.id === action.payload.id)
      if (exists) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i
          ),
        }
      }
      return { ...state, items: [...state.items, { ...action.payload, qty: 1 }] }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.payload) }
    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.payload.id ? { ...i, qty: action.payload.qty } : i
        ),
      }
    case 'CLEAR':
      return { ...state, items: [] }
    case 'SET_COUPON':
      return { ...state, coupon: action.payload }
    case 'REMOVE_COUPON':
      return { ...state, coupon: null }
    case 'HYDRATE':
      return { ...state, items: action.payload }
    default:
      return state
  }
}

const initialState = { items: [], coupon: null }

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('arae_cart')
      if (saved) dispatch({ type: 'HYDRATE', payload: JSON.parse(saved) })
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem('arae_cart', JSON.stringify(state.items))
  }, [state.items])

  const addItem = (product) => {
    dispatch({ type: 'ADD_ITEM', payload: product })
    toast.success('Added to cart')
  }

  const removeItem = (id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
    toast.success('Removed from cart')
  }

  const updateQty = (id, qty) => {
    if (qty < 1) { removeItem(id); return }
    dispatch({ type: 'UPDATE_QTY', payload: { id, qty } })
  }

  const clearCart = () => dispatch({ type: 'CLEAR' })

  const applyCoupon = (coupon) => dispatch({ type: 'SET_COUPON', payload: coupon })
  const removeCoupon = ()      => dispatch({ type: 'REMOVE_COUPON' })

  const subtotal = state.items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const discount = state.coupon
    ? state.coupon.type === 'percent'
      ? (subtotal * state.coupon.value) / 100
      : state.coupon.value
    : 0
  const gst       = (subtotal - discount) * 0.03
  const total     = subtotal - discount + gst
  const itemCount = state.items.reduce((sum, i) => sum + i.qty, 0)

  return (
    <CartContext.Provider value={{
      ...state, subtotal, discount, gst, total, itemCount,
      addItem, removeItem, updateQty, clearCart, applyCoupon, removeCoupon,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
