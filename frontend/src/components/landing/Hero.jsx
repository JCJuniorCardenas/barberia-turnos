import { site } from '../../data/site'

export function Hero() {
  return (
    <section className="hero-landing" id="inicio" aria-label="Presentación">
      <div className="hero-content">
        <p className="hero-kicker">{site.name} · {site.city}</p>
        <h1 className="hero-title">
          {site.headline.map((line) => <span className="hero-line" key={line}><span>{line}</span></span>)}
        </h1>
        <p className="hero-subtitle">{site.intro}</p>
        <div className="hero-actions">
          <a className="landing-btn" href="#reservar">Reservar turno</a>
          <a className="landing-btn landing-btn--ghost" href="#trabajos">Ver trabajos</a>
        </div>
      </div>
      <a className="scroll-indicator" href="#reservar">Bajá para reservar</a>
    </section>
  )
}
