import { site } from '../../data/site'

export function FloatingCTA() {
  return (
    <div className="floating-cta">
      <a className="landing-btn landing-btn--ghost" href={site.whatsappUrl} target="_blank" rel="noreferrer" aria-label="Escribir por WhatsApp">WhatsApp</a>
      <a className="landing-btn" href="#reservar">Reservar</a>
    </div>
  )
}
