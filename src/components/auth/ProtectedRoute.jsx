import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function ProtectedRoute({children}){
  const { isAuthenticated, authLoading } = useAuth()
  const location = useLocation()

  if(authLoading){
    return (
      <div className="auth-boot-screen" role="status" aria-live="polite">
        Restoring your session...
      </div>
    )
  }

  if(!isAuthenticated){
    return <Navigate to="/login" replace state={{from: location}} />
  }

  return children
}
