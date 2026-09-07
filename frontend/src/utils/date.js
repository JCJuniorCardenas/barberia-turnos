export function getArgentinaToday() {
  const parts = new Intl.DateTimeFormat('en', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]))
  return `${values.year}-${values.month}-${values.day}`
}

function argentinaDateValue(fecha) {
  const [year, month, day] = String(fecha).split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day, 15))
}

export function formatArgentinaDateLong(fecha) {
  if (!fecha) return ''
  return new Intl.DateTimeFormat('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(argentinaDateValue(fecha))
}

export function formatArgentinaDateShort(fecha) {
  if (!fecha) return ''
  return new Intl.DateTimeFormat('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(argentinaDateValue(fecha))
}
