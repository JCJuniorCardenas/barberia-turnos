import { useEffect, useState } from 'react'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { api } from '../services/api'

const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const normalizeTime = (value) => String(value || '').slice(0, 5)

export function AdminHorarios() {
  const [hours, setHours] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  useEffect(() => { api.getHorarios().then((data) => setHours(data.map((item) => ({ ...item, horaInicio: normalizeTime(item.horaInicio), horaFin: normalizeTime(item.horaFin) })))).catch((err) => setError(err.message)).finally(() => setLoading(false)) }, [])

  function update(day, field, value) { setHours(hours.map((item) => item.diaSemana === day ? { ...item, [field]: value } : item)) }
  async function save(item) {
    setSaving(item.diaSemana); setError(''); setMessage('')
    try { await api.updateHorario(item.diaSemana, { horaInicio: item.horaInicio, horaFin: item.horaFin, cerrado: item.cerrado }); setMessage(`Horario del ${days[item.diaSemana].toLowerCase()} guardado`); setTimeout(() => setMessage(''), 2500) } catch (err) { setError(err.message) }
    finally { setSaving(null) }
  }

  return <section className="admin-content"><div className="admin-title-row"><div><p className="section-kicker">Configuración</p><h1>Horarios</h1></div></div>{message && <p className="success-message" role="status">{message}</p>}{error && <p className="error-message" role="alert">{error}</p>}{loading ? <p className="loading-state">Cargando horarios…</p> : <div className="hours-list">{hours.sort((a, b) => a.diaSemana - b.diaSemana).map((item) => <article className={`hours-item ${item.cerrado ? 'hours-item--closed' : ''}`} key={item.diaSemana}><div className="hours-day"><strong>{days[item.diaSemana]}</strong><label className="toggle"><input type="checkbox" checked={item.cerrado} onChange={(e) => update(item.diaSemana, 'cerrado', e.target.checked)} /><span>Cerrado</span></label></div><div className="hours-fields"><Input id={`start-${item.diaSemana}`} label="Desde" type="time" value={item.horaInicio} disabled={item.cerrado} onChange={(e) => update(item.diaSemana, 'horaInicio', e.target.value)} /><Input id={`end-${item.diaSemana}`} label="Hasta" type="time" value={item.horaFin} disabled={item.cerrado} onChange={(e) => update(item.diaSemana, 'horaFin', e.target.value)} /></div><Button onClick={() => save(item)} disabled={saving === item.diaSemana}>{saving === item.diaSemana ? 'Guardando…' : 'Guardar'}</Button></article>)}</div>}</section>
}
