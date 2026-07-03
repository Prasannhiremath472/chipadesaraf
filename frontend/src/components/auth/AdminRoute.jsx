import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import PageLoader  from '@/components/ui/PageLoader'

export default function AdminRoute({ children }) {
  const { user, isLoading, isLoggedIn } = useAuth()

  if (isLoading)   return <PageLoader />
  if (!isLoggedIn) return <Navigate to="/auth/login" replace />
  if (user?.role !== 'admin') return <Navigate to="/" replace />
  return children
}
