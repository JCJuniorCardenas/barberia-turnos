import { useEffect, useState } from 'react'
import { site } from '../../data/site'

export function FloatingCTA() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.7)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null
  return (
    <div className="floating-cta">
      <a className="landing-btn landing-btn--ghost" href={site.whatsappUrl} target="_blank" rel="noreferrer" aria-label="Escribir por WhatsApp">WhatsApp</a>
      <a className="landing-btn" href="#reservar">Reservar</a>
    </div>
  )
}
