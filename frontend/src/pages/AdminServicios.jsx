import { useEffect, useState } from 'react'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Reveal } from '../components/Reveal'
import { api } from '../services/api'

const emptyForm = { nombre: '', duracionMinutos: '', precio: '' }

export function AdminServicios() {
  const [services, setServices] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  async function load() { try { setServices(await api.getServices(true)) } catch (err) { setError(err.message) } finally { setLoading(false) } }
  // oxlint-disable-next-line react/set-state-in-effect
  useEffect(() => { load() }, [])
  function change(e) { setForm({ ...form, [e.target.name]: e.target.value }) }
  function edit(service) { setEditing(service.id); setForm({ nombre: service.nombre, duracionMinutos: service.duracionMinutos, precio: service.precio }) }
  function reset() { setEditing(null); setForm(emptyForm) }
  async function submit(e) {
    e.preventDefault(); setSaving(true); setError(''); setMessage('')
    const data = { nombre: form.nombre.trim(), duracionMinutos: Number(form.duracionMinutos), precio: Number(form.precio) }
    try { if (editing) await api.updateServicio(editing, data); else await api.crearServicio(data); await load(); reset(); setMessage(editing ? 'Servicio actualizado' : 'Servicio creado'); setTimeout(() => setMessage(''), 2500) } catch (err) { setError(err.message) } finally { setSaving(false) }
  }
  async function remove(service) { if (!window.confirm(`¿Desactivar el servicio ${service.nombre}? Dejará de ofrecerse para reservar, pero podés reactivarlo cuando quieras.`)) return; setError(''); try { await api.deleteServicio(service.id); await load(); setMessage('Servicio desactivado'); setTimeout(() => setMessage(''), 2500) } catch (err) { setError(err.message) } }
  async function reactivate(service) { setError(''); try { await api.updateServicio(service.id, { activo: true }); await load(); setMessage('Servicio reactivado'); setTimeout(() => setMessage(''), 2500) } catch (err) { setError(err.message) } }

  return <section className="admin-content"><div className="admin-title-row"><div><p className="section-kicker">Catálogo</p><h1>Servicios</h1></div></div>{message && <p className="success-message" role="status">{message}</p>}{error && <p className="error-message" role="alert">{error}</p>}<form className="service-form" onSubmit={submit}><h2>{editing ? 'Editar servicio' : 'Nuevo servicio'}</h2><Input id="service-name" name="nombre" label="Nombre" value={form.nombre} onChange={change} required /><div className="form-row"><Input id="service-duration" name="duracionMinutos" label="Duración (minutos)" type="number" min="5" max="480" value={form.duracionMinutos} onChange={change} required /><Input id="service-price" name="precio" label="Precio" type="number" min="0" step="0.01" value={form.precio} onChange={change} required /></div><div className="form-actions"><Button variant="text" onClick={reset} type="button">Limpiar</Button><Button type="submit" disabled={saving}>{saving ? 'Guardando…' : editing ? 'Actualizar' : 'Crear servicio'}</Button></div></form>{loading ? <p className="loading-state">Cargando servicios…</p> : services.length === 0 ? <p className="empty-state">Todavía no cargaste ningún servicio. Creá el primero arriba.</p> : <div className="admin-list">{services.map((service, index) => <Reveal as="article" delay={index * 40} className={`admin-list-item service-admin-item ${service.activo ? '' : 'service-admin-item--inactivo'}`} key={service.id}><div><strong>{service.nombre}</strong><span>{service.duracionMinutos} minutos · ${Number(service.precio).toLocaleString('es-AR')}{!service.activo && <> · <span className="status status--cancelado">desactivado</span></>}</span></div><div className="item-actions">{service.activo ? <><Button variant="text" onClick={() => edit(service)}>Editar</Button><Button variant="text" onClick={() => remove(service)}>Desactivar</Button></> : <Button variant="text" onClick={() => reactivate(service)}>Reactivar</Button>}</div></Reveal>)}</div>}</section>
}
