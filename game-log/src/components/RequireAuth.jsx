import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

/**
 * Wraps protected routes. Redirects to /login if no user is logged in.
 * @param {{ children: React.ReactNode }} props
 */
function RequireAuth({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default RequireAuth
