import { galleryItems } from '../../data/gallery'

// Mosaico fijo de fotos detrás de toda la landing (mismo recurso que el sitio de Imported Beauty Bar).
const ids = ['cortes-ig-1', 'cabellos-ig-1', 'cortes-ig-2', 'makeup-ig-1', 'cortes-ig-3', 'cabellos-1']
const photos = ids.map((id) => galleryItems.find((item) => item.id === id)).filter((item) => item?.src)

export function Backdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <div className="backdrop-grid">
        {photos.map((item) => <img key={item.id} src={item.src} alt="" decoding="async" />)}
      </div>
      <div className="backdrop-shade" />
    </div>
  )
}
