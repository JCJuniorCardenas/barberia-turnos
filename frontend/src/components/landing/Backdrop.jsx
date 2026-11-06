import { galleryItems } from '../../data/gallery'

// Fondo fijo con las fotos de Fabián detrás de toda la landing.
export function Backdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <div className="backdrop-grid">
        {galleryItems.map((item) => <img key={item.id} src={item.src} alt="" decoding="async" />)}
      </div>
      <div className="backdrop-shade" />
    </div>
  )
}
