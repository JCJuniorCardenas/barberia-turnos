import { useEffect, useState } from 'react'
import { galleryItems } from '../../data/gallery'
import { ScrollCarousel } from './ScrollCarousel'

export function Gallery() {
  const [open, setOpen] = useState(null)

  useEffect(() => {
    if (open === null) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(null)
      if (event.key === 'ArrowRight') setOpen((i) => (i + 1) % galleryItems.length)
      if (event.key === 'ArrowLeft') setOpen((i) => (i - 1 + galleryItems.length) % galleryItems.length)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey) }
  }, [open])

  return (
    <section id="trabajos">
      <ScrollCarousel kicker="Mis trabajos" title="Mirá el resultado" help="Seguí bajando y mirá los trabajos →">
        {galleryItems.map((item, index) => (
          <li key={item.id} className="gallery-card">
            <button type="button" className="gallery-item" onClick={() => setOpen(index)} aria-label={`Ampliar: ${item.alt}`}>
              <img src={item.src} alt={item.alt} width={item.width} height={item.height} loading="lazy" />
            </button>
          </li>
        ))}
      </ScrollCarousel>

      {open !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Foto ampliada" onClick={() => setOpen(null)}>
          <button className="lightbox-close" type="button" aria-label="Cerrar" onClick={() => setOpen(null)}>×</button>
          <button className="lightbox-nav lightbox-nav--prev" type="button" aria-label="Anterior" onClick={(e) => { e.stopPropagation(); setOpen((open - 1 + galleryItems.length) % galleryItems.length) }}>‹</button>
          <div className="lightbox-body" onClick={(e) => e.stopPropagation()}>
            <img src={galleryItems[open].src} alt={galleryItems[open].alt} />
          </div>
          <button className="lightbox-nav lightbox-nav--next" type="button" aria-label="Siguiente" onClick={(e) => { e.stopPropagation(); setOpen((open + 1) % galleryItems.length) }}>›</button>
        </div>
      )}
    </section>
  )
}
