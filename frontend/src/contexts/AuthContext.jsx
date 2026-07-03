import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import api from '@/lib/axios'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

const initialState = {
  user:        null,
  token:       localStorage.getItem('arae_token') || null,
  isLoading:   true,
  isLoggedIn:  false,
}

function authReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, isLoggedIn: true, isLoading: false }
    case 'SET_TOKEN':
      return { ...state, token: action.payload }
    case 'LOGOUT':
      return { ...initialState, isLoading: false, token: null }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    default:
      return state
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  const fetchMe = useCallback(async () => {
    const token = localStorage.getItem('arae_token')
    if (!token) { dispatch({ type: 'SET_LOADING', payload: false }); return }
    try {
      const data = await api.get('/auth/me')
      dispatch({ type: 'SET_USER', payload: data.user })
    } catch {
      localStorage.removeItem('arae_token')
      dispatch({ type: 'LOGOUT' })
    }
  }, [])

  useEffect(() => { fetchMe() }, [fetchMe])

  const login = useCallback(async (credentials) => {
    const data = await api.post('/auth/login', credentials)
    localStorage.setItem('arae_token', data.token)
    dispatch({ type: 'SET_TOKEN', payload: data.token })
    dispatch({ type: 'SET_USER',  payload: data.user  })
    toast.success(`Welcome back, ${data.user.firstName}!`)
    return data
  }, [])

  const register = useCallback(async (userData) => {
    const data = await api.post('/auth/register', userData)
    localStorage.setItem('arae_token', data.token)
    dispatch({ type: 'SET_TOKEN', payload: data.token })
    dispatch({ type: 'SET_USER',  payload: data.user  })
    toast.success('Account created successfully!')
    return data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('arae_token')
    dispatch({ type: 'LOGOUT' })
    toast.success('Logged out successfully.')
  }, [])

  const updateUser = useCallback((updates) => {
    dispatch({ type: 'SET_USER', payload: { ...state.user, ...updates } })
  }, [state.user])

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateUser, refetch: fetchMe }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
