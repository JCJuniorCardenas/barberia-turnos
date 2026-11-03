// Cargá acá las fotos reales de Fabián: copiá los archivos (.webp) a src/assets/gallery/,
// importalos arriba y reemplazá `src: null` por la imagen importada. Ejemplo:
//   import corte1 from '../assets/gallery/corte-1.webp'
//   { id: 'c1', src: corte1, alt: 'Fade con barba perfilada', width: 800, height: 1000 }
// Mientras `src` sea null se muestra un placeholder.

export const galleryCategories = [
  { id: 'cortes', label: 'Cortes' },
  { id: 'cabellos', label: 'Cabellos' },
  { id: 'makeup', label: 'Makeup' },
]

const placeholder = (id, category, alt, height = 1000) => ({ id, category, alt, src: null, width: 800, height }) // TODO: confirmar con Fabián

export const galleryItems = [
  placeholder('cortes-1', 'cortes', 'Corte masculino de Fabián Díaz'),
  placeholder('cortes-2', 'cortes', 'Degradado con barba perfilada', 800),
  placeholder('cortes-3', 'cortes', 'Corte clásico con textura', 1200),
  placeholder('cortes-4', 'cortes', 'Corte y barba', 900),
  placeholder('cabellos-1', 'cabellos', 'Estilismo de cabello', 1100),
  placeholder('cabellos-2', 'cabellos', 'Color y estilo', 900),
  placeholder('cabellos-3', 'cabellos', 'Peinado de evento', 1000),
  placeholder('makeup-1', 'makeup', 'Maquillaje profesional', 1000),
  placeholder('makeup-2', 'makeup', 'Makeup para evento', 1100),
  placeholder('makeup-3', 'makeup', 'Maquillaje de cerca', 900),
]

