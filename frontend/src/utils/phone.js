// Arma el número para wa.me a partir de un teléfono argentino escrito de cualquier forma
// (ej: "3772 15 692892", "0377215692892", "+54 9 3772 692892"). Si no parece argentino, lo devuelve solo con dígitos.
export function toWhatsappNumber(phone) {
  let digits = String(phone || '').replace(/\D/g, '').replace(/^00/, '')
  if (!digits) return ''
  if (digits.startsWith('54')) {
    const national = digits.slice(2).replace(/^9/, '')
    return national.length === 10 ? `549${national}` : digits
  }
  digits = digits.replace(/^0/, '')
  for (const areaLength of [2, 3, 4]) {
    if (digits.length === 12 && digits.slice(areaLength, areaLength + 2) === '15') {
      digits = digits.slice(0, areaLength) + digits.slice(areaLength + 2)
      break
    }
  }
  return digits.length === 10 ? `549${digits}` : digits
}
