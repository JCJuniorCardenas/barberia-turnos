import { useEffect, useState } from 'react'
import { site } from '../../data/site'
import { api } from '../../services/api'
import local from '../../assets/gallery/local.webp'
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

  return (
    <section className="section" id="contacto">
      <div className="section-inner contact-grid">
        <div>
          <Reveal as="p" className="section-kicker">Ubicación y contacto</Reveal>
          <Reveal as="h2" className="section-title" delay={80}>Visitame</Reveal>
          <Reveal as="p" className="section-text" delay={140}>{site.address}</Reveal>
          <Reveal className="contact-actions" delay={200}>
            <a className="landing-btn" href={site.whatsappUrl} target="_blank" rel="noreferrer">Escribime por WhatsApp</a>
            <a className="landing-btn landing-btn--ghost" href={site.instagramUrl} target="_blank" rel="noreferrer">@{site.instagram}</a>
            {site.mapUrl && <a className="landing-btn landing-btn--ghost" href={site.mapUrl} target="_blank" rel="noreferrer">Cómo llegar</a>}
          </Reveal>
        </div>
        <div className="contact-side">
        <img className="side-photo side-photo--wide" src={local} alt="Interior de una barbería con sillas y espejos" width="1000" height="684" loading="lazy" />
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
        </div>
      </div>
    </section>
  )
}
