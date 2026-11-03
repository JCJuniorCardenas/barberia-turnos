import { useEffect, useState } from 'react'
import { site } from '../../data/site'

// Todo lo que el dueño copie a src/assets/hero/ se usa solo: un .mp4/.webm como video de fondo,
// o varias fotos (.jpg/.webp/...) como slideshow. Sin archivos se ve un fondo degradado.
const media = Object.values(import.meta.glob('../../assets/hero/*.{mp4,webm,jpg,jpeg,png,webp,avif}', { eager: true, query: '?url', import: 'default' }))
const video = media.find((url) => /\.(mp4|webm)(\?|$)/.test(url))
const images = media.filter((url) => url !== video)

export function Hero() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (video || images.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const timer = setInterval(() => setActive((current) => (current + 1) % images.length), 5500)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="hero-landing" id="inicio" aria-label="Presentación">
      <div className="hero-bg" aria-hidden="true">
        {video
          ? <video src={video} autoPlay muted loop playsInline />
          : images.map((src, index) => <img key={src} className={`hero-slide ${index === active ? 'hero-slide--active' : ''}`} src={src} alt="" fetchPriority={index === 0 ? 'high' : undefined} />)}
      </div>
      <div className="hero-overlay" aria-hidden="true" />
      <div className="hero-content">
        <div>
          <p className="hero-kicker">{site.name} · {site.city}</p>
          <h1 className="hero-title">
            {site.headline.map((line) => <span className="hero-line" key={line}><span>{line}</span></span>)}
          </h1>
          <p className="hero-subtitle">{site.intro}</p>
        </div>
        <div className="hero-actions">
          <a className="landing-btn" href="#reservar">Reservar turno</a>
          <a className="landing-btn landing-btn--ghost" href="#trabajos">Ver trabajos</a>
        </div>
      </div>
      <a className="scroll-indicator" href="#reservar">Bajá para reservar</a>
    </section>
  )
}
