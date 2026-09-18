import { useEffect, useState } from 'react'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { api } from '../services/api'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export function AdminFinanzas() {
  const [balance, setBalance] = useState({ ingresos: 0, egresos: 0, balance: 0 })
  const [movimientos, setMovimientos] = useState([])
  const [form, setForm] = useState({ monto: '', concepto: '' })
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  function chartData() {
    const grouped = movimientos.reduce((accumulator, movimiento) => {
      const date = movimiento.fecha
      if (!accumulator[date]) accumulator[date] = { fecha: date, ingresos: 0, egresos: 0 }
      accumulator[date][movimiento.tipo === 'ingreso' ? 'ingresos' : 'egresos'] += Number(movimiento.monto)
      return accumulator
    }, {})
    return Object.values(grouped).sort((a, b) => a.fecha.localeCompare(b.fecha))
  }

  async function load() {
    try {
      const [summary, items] = await Promise.all([api.getBalance(), api.getMovimientos()])
      setBalance(summary); setMovimientos(items)
    } catch (err) { setError(err.message) }
  }

  // oxlint-disable-next-line react/set-state-in-effect
  useEffect(() => { load() }, [])

  async function submit(event) {
    event.preventDefault(); setError(''); setMessage('')
    try {
      await api.crearEgreso({ monto: Number(form.monto), concepto: form.concepto })
      setForm({ monto: '', concepto: '' }); setMessage('Egreso registrado'); await load()
    } catch (err) { setError(err.message) }
  }

  return <section className="admin-content">
    <p className="section-kicker">Administración</p><h1>Registro financiero</h1>
    {error && <p className="error-message" role="alert">{error}</p>}{message && <p className="success-message" role="status">{message}</p>}
    <div className="summary-grid"><article><span>Ingresos</span><strong>${Number(balance.ingresos).toLocaleString('es-AR')}</strong></article><article><span>Egresos</span><strong>${Number(balance.egresos).toLocaleString('es-AR')}</strong></article><article><span>Balance neto</span><strong>${Number(balance.balance).toLocaleString('es-AR')}</strong></article></div>
    <section className="finance-chart-card"><div className="finance-chart-heading"><div><p className="section-kicker">Evolución</p><h2>Ingresos vs. egresos</h2></div><span>Por fecha</span></div><div className="finance-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData()} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}><CartesianGrid strokeDasharray="3 3" stroke="#2a2926" vertical={false} /><XAxis dataKey="fecha" tick={{ fill: '#a8a29a', fontSize: 11 }} tickFormatter={(value) => value.slice(5)} axisLine={false} tickLine={false} /><YAxis tick={{ fill: '#a8a29a', fontSize: 11 }} tickFormatter={(value) => `$${value}`} axisLine={false} tickLine={false} width={70} /><Tooltip cursor={{ fill: 'rgba(255,255,255,.04)' }} formatter={(value, name) => [`$${Number(value).toLocaleString('es-AR')}`, name === 'ingresos' ? 'Ingresos' : 'Egresos']} labelFormatter={(label) => `Fecha: ${label}`} contentStyle={{ background: '#1b1a18', border: '1px solid #3a3834', borderRadius: 12, color: '#f2ece4' }} /><Legend formatter={(value) => value === 'ingresos' ? 'Ingresos' : 'Egresos'} /><Bar dataKey="ingresos" name="ingresos" fill="#10b981" radius={[6, 6, 0, 0]} /><Bar dataKey="egresos" name="egresos" fill="#ef4444" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div></section>
    <section className="form-section"><h2>Cargar egreso</h2><form className="form-row" onSubmit={submit}><Input id="expense-amount" label="Monto" type="number" min="0.01" step="0.01" value={form.monto} onChange={(e) => setForm({ ...form, monto: e.target.value })} required /><Input id="expense-concept" label="Concepto" placeholder="Compra de tijeras" value={form.concepto} onChange={(e) => setForm({ ...form, concepto: e.target.value })} required /><Button type="submit">Registrar egreso</Button></form></section>
    <section><h2>Movimientos</h2><div className="admin-list">{movimientos.map((item) => <div className="admin-list-item" key={item.id}><div><strong>{item.concepto}</strong><span>{item.fecha} · {item.tipo}</span></div><strong className={item.tipo === 'egreso' ? 'financial-expense' : 'financial-income'}>{item.tipo === 'egreso' ? '-' : '+'}${Number(item.monto).toLocaleString('es-AR')}</strong></div>)}</div></section>
  </section>
}
