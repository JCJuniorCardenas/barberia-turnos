import corte1 from '../assets/gallery/corte-fabian-1.jpg'
import corte2 from '../assets/gallery/corte-fabian-2.jpg'
import corte3 from '../assets/gallery/corte-fabian-3.jpg'

// Trabajos reales de Fabián, tomados de su Instagram público (@studio_fabiandiaz).
// TODO: confirmar con Fabián — pedirle más fotos en buena calidad: copiá los archivos a src/assets/gallery/,
// importalos arriba y sumá un item abajo.

const item = (id, alt, src, width, height) => ({ id, alt, src, width, height })

export const galleryItems = [
  item('corte-1', 'Corte degradé en blanco y negro', corte1, 480, 640),
  item('corte-2', 'Corte con diseño en la nuca', corte2, 480, 640),
  item('corte-3', 'Corte con flequillo y degradé', corte3, 360, 640),
]
