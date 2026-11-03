import corte1 from '../assets/gallery/corte-1.webp'
import corte2 from '../assets/gallery/corte-2.webp'
import corte3 from '../assets/hero/hero-1.webp'
import corte4 from '../assets/hero/hero-3.webp'
import corte5 from '../assets/hero/hero-4.webp'
import cabello1 from '../assets/gallery/cabello-1.webp'
import cabello2 from '../assets/gallery/cabello-2.webp'
import cabello3 from '../assets/gallery/cabello-3.webp'
import cabello4 from '../assets/gallery/cabello-4.webp'
import makeup1 from '../assets/gallery/makeup-1.webp'
import makeup2 from '../assets/gallery/makeup-2.webp'
import makeup3 from '../assets/gallery/makeup-3.webp'
import makeup4 from '../assets/gallery/makeup-4.webp'

// Fotos de relleno de Unsplash (ver src/assets/CREDITOS.md).
// TODO: confirmar con Fabián — reemplazar por sus trabajos reales: copiá los .webp a src/assets/gallery/,
// importalos arriba y cambiá `src`. Si `src` es null se muestra un placeholder.

export const galleryCategories = [
  { id: 'cortes', label: 'Cortes' },
  { id: 'cabellos', label: 'Cabellos' },
  { id: 'makeup', label: 'Makeup' },
]

const item = (id, category, alt, src, width, height) => ({ id, category, alt, src, width, height })

export const galleryItems = [
  item('cortes-1', 'cortes', 'Corte de pelo con tijera', corte1, 1000, 1250),
  item('cortes-2', 'cortes', 'Cliente en la silla del barbero', corte2, 1000, 667),
  item('cortes-3', 'cortes', 'Barbero secando el pelo de un cliente', corte3, 1600, 2400),
  item('cortes-4', 'cortes', 'Corte con tijera y peine', corte4, 1600, 2400),
  item('cortes-5', 'cortes', 'Barberos trabajando en un salón moderno', corte5, 1600, 2000),
  item('cabellos-1', 'cabellos', 'Perfil de hombre con barba y pelo oscuro', cabello1, 1000, 1500),
  item('cabellos-2', 'cabellos', 'Estilo mohawk', cabello2, 1000, 666),
  item('cabellos-3', 'cabellos', 'Peinado clásico', cabello3, 1000, 1525),
  item('cabellos-4', 'cabellos', 'Retrato en blanco y negro', cabello4, 1000, 1500),
  item('makeup-1', 'makeup', 'Maquillaje con brocha', makeup1, 1000, 1500),
  item('makeup-2', 'makeup', 'Brochas de maquillaje', makeup2, 1000, 1332),
  item('makeup-3', 'makeup', 'Paleta de maquillaje', makeup3, 1000, 1332),
  item('makeup-4', 'makeup', 'Maquillador aplicando colorete', makeup4, 1000, 1500),
]
