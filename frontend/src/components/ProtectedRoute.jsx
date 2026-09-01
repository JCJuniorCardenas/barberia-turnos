import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { hasValidToken } from '../services/api'

export function ProtectedRoute() {
  const location = useLocation()
  return hasValidToken()
    ? <Outlet />
    : <Navigate to="/admin/login" replace state={{ from: location }} />
}
