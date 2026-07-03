import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import PageLoader  from '@/components/ui/PageLoader'

export default function ProtectedRoute() {
  const { isLoggedIn, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return <PageLoader />
  if (!isLoggedIn) return <Navigate to="/auth/login" state={{ from: location }} replace />
  return <Outlet />
}
