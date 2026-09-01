import { useCallback, useEffect, useState } from 'react'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { api } from '../services/api'
import { getArgentinaToday } from '../utils/date'

const today = getArgentinaToday()

export function AdminDashboard() {
  const [date, setDate] = useState(today)
  const [turnos, setTurnos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancelling, setCancelling] = useState('')
  const [confirming, setConfirming] = useState('')

  const loadTurnos = useCallback(async () => {
    setError('')
    try { setTurnos(await api.getTurnos(date)) } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }, [date])
  // oxlint-disable-next-line react/set-state-in-effect
  useEffect(() => { loadTurnos() }, [loadTurnos])

  async function cancel(id) {
    if (!window.confirm('¿Querés cancelar este turno?')) return
    setCancelling(id); setError('')
    try { await api.cancelarTurno(id); setLoading(true); await loadTurnos() } catch (err) { setError(err.message) }
    finally { setCancelling('') }
  }

  async function confirm(id) {
    if (!window.confirm('¿Querés marcar este turno como confirmado?')) return
    setConfirming(id); setError('')
    try { await api.confirmarTurno(id); setLoading(true); await loadTurnos() } catch (err) { setError(err.message) }
    finally { setConfirming('') }
  }

  return (
    <section className="admin-content">
      <div className="admin-title-row"><div><p className="section-kicker">Agenda</p><h1>Turnos</h1></div><Input id="turnos-date" label="Fecha" type="date" value={date} onChange={(e) => { setLoading(true); setDate(e.target.value) }} /></div>
      {error && <p className="error-message" role="alert">{error}</p>}
      {loading ? <p className="loading-state"><span className="loading-spinner" aria-hidden="true" />Cargando turnos…</p> : turnos.length === 0 ? <p className="empty-state">No hay turnos para esta fecha</p> : (
        <div className="admin-list">
          {turnos.map((turno) => <article className="admin-list-item" key={turno.id}>
            <div className="turno-time">{String(turno.hora).slice(0, 5)}</div>
            <div className="turno-info"><strong>{turno.nombreCliente}</strong><span>{turno.servicio?.nombre || 'Servicio'} · {turno.telefonoCliente}</span><small className={`status status--${turno.estado}`}>{turno.estado}</small></div>
            {turno.estado === 'pendiente' && <Button variant="text" disabled={confirming === turno.id} onClick={() => confirm(turno.id)}>{confirming === turno.id ? '…' : 'Confirmar'}</Button>}
            {turno.estado !== 'cancelado' && <Button variant="text" disabled={cancelling === turno.id} onClick={() => cancel(turno.id)}>{cancelling === turno.id ? '…' : 'Cancelar'}</Button>}
          </article>)}
        </div>
      )}
    </section>
  )
}
