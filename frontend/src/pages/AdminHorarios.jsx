import { useEffect, useState } from 'react'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { api } from '../services/api'
import { formatArgentinaDateLong } from '../utils/date'

const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const normalizeTime = (value) => String(value || '').slice(0, 5)

export function AdminHorarios() {
  const [hours, setHours] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [blockedDays, setBlockedDays] = useState([])
  const [blockedDate, setBlockedDate] = useState('')
  const [blockedReason, setBlockedReason] = useState('')

  useEffect(() => {
    Promise.all([api.getHorarios(), api.getBlockedDays()])
      .then(([data, blocked]) => {
        setHours(data.map((item) => ({ ...item, horaInicio: normalizeTime(item.horaInicio), horaFin: normalizeTime(item.horaFin) })))
        setBlockedDays(blocked)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  function update(day, field, value) {
    setHours(hours.map((item) => item.diaSemana === day ? { ...item, [field]: value } : item))
  }

  async function save(item) {
    setSaving(item.diaSemana); setError(''); setMessage('')
    try {
      await api.updateHorario(item.diaSemana, { horaInicio: item.horaInicio, horaFin: item.horaFin, cerrado: item.cerrado })
      setMessage(`Horario del ${days[item.diaSemana].toLowerCase()} guardado`)
      setTimeout(() => setMessage(''), 2500)
    } catch (err) { setError(err.message) }
    finally { setSaving(null) }
  }

  async function blockDay(event) {
    event.preventDefault(); setError(''); setMessage('')
    try {
      const blocked = await api.blockDay({ fecha: blockedDate, motivo: blockedReason || undefined })
      setBlockedDays([...blockedDays.filter((item) => item.fecha !== blocked.fecha), blocked].sort((a, b) => a.fecha.localeCompare(b.fecha)))
      setBlockedDate(''); setBlockedReason(''); setMessage('Día bloqueado')
    } catch (err) { setError(err.message) }
  }

  async function unblockDay(fecha) {
    if (!window.confirm(`¿Desbloquear el ${fecha}?`)) return
    try {
      await api.unblockDay(fecha)
      setBlockedDays(blockedDays.filter((item) => item.fecha !== fecha))
    } catch (err) { setError(err.message) }
  }

  return (
    <section className="admin-content">
      <div className="admin-title-row"><div><p className="section-kicker">Configuración</p><h1>Horarios</h1></div></div>
      {message && <p className="success-message" role="status">{message}</p>}
      {error && <p className="error-message" role="alert">{error}</p>}
      {loading ? <p className="loading-state"><span className="loading-spinner" aria-hidden="true" />Cargando horarios…</p> : <>
        <div className="hours-list">
          {hours.sort((a, b) => a.diaSemana - b.diaSemana).map((item) => (
            <article className={`hours-item ${item.cerrado ? 'hours-item--closed' : ''}`} key={item.diaSemana}>
              <div className="hours-day"><strong>{days[item.diaSemana]}</strong><label className="toggle"><input type="checkbox" checked={item.cerrado} onChange={(e) => update(item.diaSemana, 'cerrado', e.target.checked)} /><span>Cerrado</span></label></div>
              <div className="hours-fields"><Input id={`start-${item.diaSemana}`} label="Desde" type="time" value={item.horaInicio} disabled={item.cerrado} onChange={(e) => update(item.diaSemana, 'horaInicio', e.target.value)} /><Input id={`end-${item.diaSemana}`} label="Hasta" type="time" value={item.horaFin} disabled={item.cerrado} onChange={(e) => update(item.diaSemana, 'horaFin', e.target.value)} /></div>
              <Button onClick={() => save(item)} disabled={saving === item.diaSemana}>{saving === item.diaSemana ? 'Guardando…' : 'Guardar'}</Button>
            </article>
          ))}
        </div>
        <section className="block-day-section">
          <h2>Bloquear un día</h2>
          <form className="form-row" onSubmit={blockDay}><Input id="blocked-date" label="Fecha" type="date" value={blockedDate} onChange={(e) => setBlockedDate(e.target.value)} required /><Input id="blocked-reason" label="Motivo (opcional)" placeholder="Vacaciones" value={blockedReason} onChange={(e) => setBlockedReason(e.target.value)} /><Button type="submit">Bloquear día</Button></form>
          <div className="blocked-days-list">{blockedDays.map((item) => <div className="admin-list-item" key={item.id}><div><strong>{formatArgentinaDateLong(item.fecha)}</strong><span>{item.motivo || 'Día cerrado'}</span></div><Button variant="text" onClick={() => unblockDay(item.fecha)}>Desbloquear</Button></div>)}</div>
        </section>
      </>}
    </section>
  )
}
