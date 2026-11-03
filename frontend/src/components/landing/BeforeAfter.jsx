import { useState } from 'react'
import { beforeAfter } from '../../data/gallery'
import { Reveal } from '../Reveal'

export function BeforeAfter() {
  const [position, setPosition] = useState(50)

  return (
    <section className="section section--alt" id="antes-despues">
      <div className="section-inner">
        <Reveal as="p" className="section-kicker">Transformaciones</Reveal>
        <Reveal as="h2" className="section-title" delay={80}>Antes / Después</Reveal>
        <Reveal className="compare" delay={160} style={{ '--pos': `${position}%` }}>
          <div className="compare-layer compare-layer--after">
            {beforeAfter.after ? <img src={beforeAfter.after} alt="Después" loading="lazy" draggable="false" /> : <div className="photo-placeholder"><span>DESPUÉS</span></div>}
          </div>
          <div className="compare-layer compare-layer--before">
            {beforeAfter.before ? <img src={beforeAfter.before} alt="Antes" loading="lazy" draggable="false" /> : <div className="photo-placeholder photo-placeholder--dim"><span>ANTES</span></div>}
          </div>
          <div className="compare-handle" aria-hidden="true"><span>⇄</span></div>
          <input className="compare-range" type="range" min="0" max="100" value={position} onChange={(event) => setPosition(Number(event.target.value))} aria-label="Deslizá para comparar antes y después" />
        </Reveal>
      </div>
    </section>
  )
}
