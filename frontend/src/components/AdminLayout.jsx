import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Button } from './Button'
import { TOKEN_KEY } from '../services/api'

export function AdminLayout() {
  const navigate = useNavigate()
  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    navigate('/admin/login', { replace: true })
  }
  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div><p className="brand-mark">EL VASCO</p><span className="admin-label">Administración</span></div>
        <Button variant="text" onClick={logout}>Cerrar sesión</Button>
      </header>
      <nav className="admin-nav" aria-label="Administración">
        <NavLink to="/admin/dashboard">Turnos</NavLink>
        <NavLink to="/admin/horarios">Horarios</NavLink>
        <NavLink to="/admin/servicios">Servicios</NavLink>
      </nav>
      <Outlet />
    </main>
  )
}
