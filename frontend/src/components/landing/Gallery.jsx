import { useEffect, useState } from 'react'
import { galleryCategories, galleryItems } from '../../data/gallery'
import { ScrollCarousel } from './ScrollCarousel'

function Photo({ item, className }) {
  if (item.src) return <img className={className} src={item.src} alt={item.alt} width={item.width} height={item.height} loading="lazy" />
  return <div className={`photo-placeholder ${className || ''}`} role="img" aria-label={`${item.alt} (foto próximamente)`} style={{ aspectRatio: `${item.width} / ${item.height}` }}><span>FD</span></div>
}

export function Gallery() {
  const [category, setCategory] = useState(galleryCategories[0].id)
  const [open, setOpen] = useState(null)
  const items = galleryItems.filter((item) => item.category === category)

  useEffect(() => {
    if (open === null) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(null)
      if (event.key === 'ArrowRight') setOpen((i) => (i + 1) % items.length)
      if (event.key === 'ArrowLeft') setOpen((i) => (i - 1 + items.length) % items.length)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey) }
  }, [open, items.length])

  function changeCategory(id) {
    setCategory(id)
    setOpen(null)
  }

  return (
    <section id="trabajos">
      <ScrollCarousel
        kicker="Trabajos"
        title="Mirá el resultado"
        help="Seguí bajando y mirá los trabajos →"
        resetKey={category}
        controls={(
          <div className="gallery-tabs" role="tablist" aria-label="Categorías">
            {galleryCategories.map((cat) => (
              <button key={cat.id} type="button" role="tab" aria-selected={category === cat.id} className={`gallery-tab ${category === cat.id ? 'gallery-tab--active' : ''}`} onClick={() => changeCategory(cat.id)}>{cat.label}</button>
            ))}
          </div>
        )}
      >
        {items.map((item, index) => (
          <li key={item.id} className="gallery-card">
            <button type="button" className="gallery-item" onClick={() => setOpen(index)} aria-label={`Ampliar: ${item.alt}`}>
              <Photo item={item} />
            </button>
          </li>
        ))}
      </ScrollCarousel>

      {open !== null && items[open] && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Foto ampliada" onClick={() => setOpen(null)}>
          <button className="lightbox-close" type="button" aria-label="Cerrar" onClick={() => setOpen(null)}>×</button>
          <button className="lightbox-nav lightbox-nav--prev" type="button" aria-label="Anterior" onClick={(e) => { e.stopPropagation(); setOpen((open - 1 + items.length) % items.length) }}>‹</button>
          <div className="lightbox-body" onClick={(e) => e.stopPropagation()}><Photo item={items[open]} /></div>
          <button className="lightbox-nav lightbox-nav--next" type="button" aria-label="Siguiente" onClick={(e) => { e.stopPropagation(); setOpen((open + 1) % items.length) }}>›</button>
        </div>
      )}
    </section>
  )
}
