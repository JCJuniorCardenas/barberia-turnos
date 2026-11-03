import { useEffect, useRef, useState } from 'react'
import { site } from '../../data/site'
import { Reveal } from '../Reveal'

function Counter({ to, prefix = '' }) {
  const ref = useRef(null)
  const [value, setValue] = useState(0)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      if (reduced) { setValue(to); return }
      const start = performance.now()
      const tick = (now) => {
        const progress = Math.min((now - start) / 1500, 1)
        setValue(Math.round(to * (1 - (1 - progress) ** 3)))
        if (progress < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    }, { threshold: 0.5 })
    observer.observe(node)
    return () => { observer.disconnect(); cancelAnimationFrame(frame) }
  }, [to])

  return <span ref={ref}>{prefix}{value}</span>
}

export function About() {
  return (
    <section className="section about" id="sobre">
      <div className="section-inner about-grid">
        <Reveal className="about-photo">
          {site.aboutPhoto
            ? <img src={site.aboutPhoto} alt="Fabián Díaz en su barbería" loading="lazy" width="800" height="1000" />
            : <div className="photo-placeholder" role="img" aria-label="Foto de Fabián Díaz (próximamente)"><span>FD</span></div>}
        </Reveal>
        <div>
          <Reveal as="p" className="section-kicker">Sobre Fabián</Reveal>
          <Reveal as="h2" className="section-title" delay={80}>Más que un corte,<br />un estilo.</Reveal>
          {site.aboutText.map((text, index) => <Reveal as="p" className="section-text" delay={160 + index * 80} key={text}>{text}</Reveal>)}
          <Reveal className="stats" delay={320}>
            <div className="stat"><strong><Counter to={site.clients} prefix="+" /></strong><span>clientes felices</span></div>
            <div className="stat"><strong>3</strong><span>especialidades: cortes, cabellos y makeup</span></div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
