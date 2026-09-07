import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { ProgressBar } from '../components/ProgressBar'
import { ServiceListItem } from '../components/ServiceListItem'
import { TimeSlotPicker } from '../components/TimeSlotPicker'
import { api } from '../services/api'
import { getArgentinaToday } from '../utils/date'

const today = getArgentinaToday()

export function Booking() {
  const [step, setStep] = useState(1)
  const [services, setServices] = useState([])
  const [service, setService] = useState(null)
  const [date, setDate] = useState(today)
  const [slots, setSlots] = useState([])
  const [time, setTime] = useState('')
  const [form, setForm] = useState({ nombre: '', telefono: '' })
  const [loading, setLoading] = useState(true)
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [error, setError] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [accessCode, setAccessCode] = useState('')

  const loadServices = useCallback(() => {
    setLoading(true)
    return api.getServices()
      .then(setServices)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const loadSlots = useCallback(() => {
    if (!service || !date) return Promise.resolve()
    setSlotsLoading(true)
    return api.getAvailableSlots(date, service.id)
      .then((data) => setSlots(Array.isArray(data) ? data : data.horarios || data.slots || []))
      .catch((err) => { setSlots([]); setError(err.message) })
      .finally(() => setSlotsLoading(false))
  }, [service, date])

  useEffect(() => { queueMicrotask(loadServices) }, [loadServices])
  useEffect(() => { queueMicrotask(loadSlots) }, [loadSlots])

  const canContinue = useMemo(() => {
    if (step === 1) return Boolean(service)
    if (step === 2) return Boolean(date && time)
    return Boolean(form.nombre.trim() && form.telefono.trim())
  }, [step, service, date, time, form])

  function selectService(nextService) {
    setService(nextService)
    setSlotsLoading(true)
    setTime('')
    setError('')
    setStep(2)
  }

  function selectDate(event) {
    setDate(event.target.value)
    setSlotsLoading(true)
    setTime('')
  }

  function handleFormChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (step < 3) {
      setStep(step + 1)
      return
    }

    setError('')
    setLoading(true)
    try {
      const booking = await api.createBooking({
        servicioId: service.id,
        nombreCliente: form.nombre.trim(),
        telefonoCliente: form.telefono.trim(),
        fecha: date,
        hora: time,
      })
      setAccessCode(booking.codigoAcceso)
      setConfirmed(true)
      setStep(4)
    } catch (err) {
      if (err.status === 409) {
        setError('Uy, justo se ocupó ese horario. Elegí otro, por favor')
        setTime('')
        setStep(2)
        await loadSlots()
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const whatsappText = `Hola! Quiero confirmar mi turno para ${service?.nombre} el ${date} a las ${time}. Mi nombre es ${form.nombre}.`
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER
  const myBookingUrl = `${window.location.origin}/mi-turno/${accessCode}`
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`${whatsappText} Podés ver o cancelar tu turno acá: ${myBookingUrl}`)}`

  function retry() {
    setError('')
    if (step === 1) loadServices()
    else if (step === 2) loadSlots()
    else handleSubmit({ preventDefault() {} })
  }

  if (confirmed) {
    return (
      <main className="booking-shell confirmation-screen">
        <p className="brand-mark">EL VASCO</p>
        <div className="confirmation-content">
          <span className="confirmation-mark" aria-hidden="true">✓</span>
          <h1>Tu turno está reservado.</h1>
          <p>Solo falta enviarnos la confirmación por WhatsApp.</p>
          <div className="summary summary--confirmed">
            <strong>{service.nombre}</strong>
            <span>{date} · {time}</span>
            <span>{form.nombre}</span>
          </div>
          <a className="button button--primary" href={whatsappUrl} target="_blank" rel="noreferrer">
            Confirmar por WhatsApp
          </a>
          <a className="booking-link" href={myBookingUrl}>Guardá este link para ver o cancelar tu turno más adelante</a>
        </div>
      </main>
    )
  }

  return (
    <main className="booking-shell">
      <header className="hero">
        {/* TODO: reemplazar este bloque por la foto real de ambiente del cliente. */}
        <div className="hero-image" role="img" aria-label="Ambiente de barbería placeholder" />
        <div className="hero-copy">
          <p className="brand-mark">EL VASCO</p>
          <h1>Tu próximo corte,<br />a tu tiempo.</h1>
          <p>Reservá tu turno en unos pocos pasos.</p>
        </div>
      </header>

      <section className="booking-panel" aria-label="Reserva de turno">
        <ProgressBar step={step} />
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message" role="alert"><p>{error}</p><button className="button button--text retry-button" type="button" onClick={retry}>Reintentar</button></div>}

          {step === 1 && (
            <div className="step-content">
              <div className="step-heading"><span>Elegí tu servicio</span><small>El comienzo</small></div>
              {loading ? <p className="loading-state"><span className="loading-spinner" aria-hidden="true" />Cargando servicios…</p> : (
                <div className="service-list">
                  {services.map((item) => <ServiceListItem key={item.id} service={item} selected={service?.id === item.id} onSelect={() => selectService(item)} />)}
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="step-content">
              <div className="step-heading"><span>Elegí fecha y hora</span><small>{service?.nombre}</small></div>
              <label className="field" htmlFor="date"><span>Fecha</span><input id="date" type="date" min={today} value={date} onChange={selectDate} /></label>
              <div className="slot-heading"><span>Horarios disponibles</span>{slotsLoading && <small className="loading-inline"><span className="loading-spinner" aria-hidden="true" />Cargando…</small>}</div>
              <TimeSlotPicker slots={slots} selected={time} onSelect={setTime} />
            </div>
          )}

          {step === 3 && (
            <div className="step-content">
              <div className="step-heading"><span>Dejanos tus datos</span><small>Para guardar tu turno</small></div>
              <Input id="nombre" name="nombre" label="Nombre" placeholder="Tu nombre" value={form.nombre} onChange={handleFormChange} autoComplete="name" required />
              <Input id="telefono" name="telefono" label="Teléfono" type="tel" placeholder="1123456789" value={form.telefono} onChange={handleFormChange} autoComplete="tel" required />
              <div className="summary"><span>{service?.nombre}</span><span>{date} · {time}</span></div>
            </div>
          )}

          <div className="form-actions">
            {step > 1 && <Button variant="text" onClick={() => setStep(step - 1)}>Volver</Button>}
            {step < 4 && <Button type="submit" disabled={!canContinue || loading}>{step === 3 ? (loading ? 'Guardando…' : 'Reservar turno') : 'Continuar'}</Button>}
          </div>
        </form>
      </section>
    </main>
  )
}
