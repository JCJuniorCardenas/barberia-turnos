import { useEffect, useState } from 'react'
import { site } from '../../data/site'
import { api } from '../../services/api'
import { Reveal } from '../Reveal'

const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const normalizeTime = (value) => String(value || '').slice(0, 5)

export function Contact() {
  const [hours, setHours] = useState([])

  useEffect(() => {
    let active = true
    api.getHorarios()
      .then((data) => { if (active && Array.isArray(data)) setHours([...data].sort((a, b) => ((a.diaSemana + 6) % 7) - ((b.diaSemana + 6) % 7))) })
      .catch(() => {})
    return () => { active = false }
  }, [])

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&output=embed`
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.mapQuery)}`

  return (
    <section className="section" id="contacto">
      <div className="section-inner contact-grid">
        <div className="contact-info">
          <Reveal as="p" className="section-kicker">Ubicación y horarios</Reveal>
          <Reveal as="h2" className="section-title" delay={80}>Dónde estamos</Reveal>
          <Reveal as="p" className="section-text" delay={140}>{site.address}</Reveal>
          <Reveal className="hours-card" delay={160}>
            <h3>Horarios</h3>
            {hours.length ? (
              <ul>
                {hours.map((item) => (
                  <li key={item.diaSemana}>
                    <span>{days[item.diaSemana]}</span>
                    <span>{item.cerrado ? 'Cerrado' : `${normalizeTime(item.horaInicio)} a ${normalizeTime(item.horaFin)}`}</span>
                  </li>
                ))}
              </ul>
            ) : <p>Consultá los horarios por WhatsApp.</p>}
          </Reveal>
          <Reveal className="contact-actions" delay={200}>
            <a className="landing-btn" href={site.whatsappUrl} target="_blank" rel="noreferrer">Escribinos por WhatsApp</a>
            <a className="landing-btn landing-btn--ghost" href={site.instagramUrl} target="_blank" rel="noreferrer">@{site.instagram}</a>
          </Reveal>
        </div>
        <Reveal className="contact-map" delay={120}>
          <iframe title={`Mapa: ${site.address}`} src={mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
          <a className="landing-btn landing-btn--small" href={mapLink} target="_blank" rel="noreferrer">Cómo llegar</a>
        </Reveal>
      </div>
    </section>
  )
}
