import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { api, hasValidToken, TOKEN_KEY } from '../services/api'

export function AdminLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (hasValidToken()) navigate('/admin/dashboard', { replace: true })
  }, [navigate])

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true); setError('')
    try {
      const { access_token: token } = await api.login(form)
      localStorage.setItem(TOKEN_KEY, token)
      navigate(location.state?.from?.pathname || '/admin/dashboard', { replace: true })
    } catch (err) { setError(err.message === 'No se pudo completar la solicitud.' ? 'Email o contraseña incorrectos' : err.message) }
    finally { setLoading(false) }
  }

  return (
    <main className="admin-login">
      <div className="admin-login__content">
        <p className="brand-mark">EL VASCO</p>
        <h1>Ingresá al panel.</h1>
        <p className="admin-intro">Gestioná tus turnos y la agenda de la barbería.</p>
        <form onSubmit={handleSubmit}>
          <Input id="email" label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" required />
          <Input id="password" label="Contraseña" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete="current-password" required />
          {error && <p className="error-message" role="alert">{error}</p>}
          <Button type="submit" disabled={loading}>{loading ? 'Ingresando…' : 'Iniciar sesión'}</Button>
        </form>
      </div>
    </main>
  )
}
