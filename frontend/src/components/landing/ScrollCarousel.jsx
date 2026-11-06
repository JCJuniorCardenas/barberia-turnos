import { useEffect, useRef } from 'react'

// Alto de la navbar fija: el carrusel queda pegado justo debajo.
const NAVBAR_HEIGHT = 66

/**
 * Pista horizontal que avanza de derecha a izquierda mientras se baja con el scroll.
 * La sección es alta; adentro, un bloque "sticky" queda fijo y la pista de tarjetas se desplaza.
 * `resetKey` re-mide el recorrido cuando cambian las tarjetas. Con movimiento reducido es un scroll horizontal común.
 */
export function ScrollCarousel({ kicker, title, help, controls, resetKey, children }) {
  const section = useRef(null)
  const track = useRef(null)
  const bar = useRef(null)

  useEffect(() => {
    const s = section.current
    const t = track.current
    const b = bar.current
    if (!s || !t || !b || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    let raf = 0

    const distance = () => Math.max(0, t.scrollWidth - window.innerWidth)

    const update = () => {
      raf = 0
      const total = distance()
      const progress = total === 0 ? 0 : Math.min(1, Math.max(0, (NAVBAR_HEIGHT - s.getBoundingClientRect().top) / total))
      t.style.transform = `translate3d(${-progress * total}px,0,0)`
      b.style.transform = `scaleX(${progress})`
    }

    const measure = () => {
      s.style.height = `${distance() + window.innerHeight - NAVBAR_HEIGHT}px`
      update()
    }

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
      if (raf) cancelAnimationFrame(raf)
      s.style.height = ''
      t.style.transform = ''
    }
  }, [resetKey])

  return (
    <div ref={section} className="carousel">
      <div className="carousel-pin">
        <div className="carousel-head">
          <p className="section-kicker">{kicker}</p>
          <h2 className="section-title">{title}</h2>
          <p className="carousel-help">{help}</p>
          {controls}
        </div>
        <ul ref={track} className="carousel-track">{children}</ul>
        <div className="carousel-bar" aria-hidden="true"><div ref={bar} /></div>
      </div>
    </div>
  )
}
