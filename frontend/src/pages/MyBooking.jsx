import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '../components/Button'
import { api } from '../services/api'

export function MyBooking() {
  const { codigo } = useParams()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    api.getMyBooking(codigo)
      .then(setBooking)
      .catch(() => setError('No encontramos ese turno'))
      .finally(() => setLoading(false))
  }, [codigo])

  async function cancel() {
    if (!window.confirm('¿Querés cancelar este turno?')) return
    setCancelling(true); setError('')
    try { setBooking(await api.cancelMyBooking(codigo)) } catch (err) { setError(err.message) }
    finally { setCancelling(false) }
  }

  if (loading) return <main className="booking-shell confirmation-screen"><div className="confirmation-content"><span className="loading-spinner" aria-label="Cargando" /></div></main>
  if (error || !booking) return <main className="booking-shell confirmation-screen"><div className="confirmation-content"><p className="brand-mark">EL VASCO</p><h1>No encontramos ese turno.</h1><p>Revisá el link e intentá nuevamente.</p><a className="button button--primary" href="/">Volver a reservar</a></div></main>

  const canCancel = ['pendiente', 'confirmado'].includes(booking.estado)
  return <main className="booking-shell confirmation-screen"><div className="confirmation-content"><p className="brand-mark">EL VASCO</p><span className="confirmation-mark" aria-hidden="true">✓</span><h1>Tu turno</h1><div className="summary summary--confirmed"><strong>{booking.servicio.nombre}</strong><span>{booking.fecha} · {String(booking.hora).slice(0, 5)}</span><span className={`status status--${booking.estado}`}>{booking.estado}</span></div>{error && <p className="error-message" role="alert">{error}</p>}{canCancel && <Button variant="text" disabled={cancelling} onClick={cancel}>{cancelling ? 'Cancelando…' : 'Cancelar mi turno'}</Button>}</div></main>
}
