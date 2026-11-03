import { useEffect, useRef } from 'react'
import { site } from '../../data/site'

export function Hero() {
  const bgRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        if (bgRef.current) bgRef.current.style.transform = `translate3d(0, ${window.scrollY * 0.25}px, 0) scale(1.1)`
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <section className="hero-landing" id="inicio" aria-label="Presentación">
      <div className="hero-bg" ref={bgRef} aria-hidden="true">
        {site.heroImage && <img src={site.heroImage} alt="" fetchPriority="high" />}
      </div>
      <div className="hero-overlay" aria-hidden="true" />
      <div className="hero-content">
        <p className="hero-kicker">{site.city}</p>
        <h1 className="hero-title">
          <span className="hero-line"><span>FABIÁN</span></span>
          <span className="hero-line"><span>DÍAZ</span></span>
        </h1>
        <p className="hero-subtitle">{site.tagline}</p>
        <div className="hero-actions">
          <a className="landing-btn" href="#reservar">Reservar turno</a>
          <a className="landing-btn landing-btn--ghost" href={site.whatsappUrl} target="_blank" rel="noreferrer">WhatsApp</a>
        </div>
      </div>
      <a className="scroll-indicator" href="#sobre" aria-label="Bajar">
        <span />
      </a>
    </section>
  )
}
