// VITE_API_URL debe ser la URL pública del backend, incluyendo el prefijo si el
// servidor está publicado detrás de /api (por ejemplo: https://api.example.com/api).
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '')
const TOKEN_KEY = 'elvasco_token'

export function hasValidToken() {
  const token = localStorage.getItem(TOKEN_KEY)
  if (!token) return false
  try {
    const encodedPayload = token.split('.')[1]
      .replaceAll('-', '+')
      .replaceAll('_', '/')
    const payload = JSON.parse(atob(encodedPayload.padEnd(encodedPayload.length + (4 - encodedPayload.length % 4) % 4, '=')))
    return typeof payload.exp === 'number' && payload.exp * 1000 > Date.now()
  } catch {
    return false
  }
}

async function request(path, options = {}, requiresAuth = false) {
  const token = localStorage.getItem(TOKEN_KEY)
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (requiresAuth && token) headers.Authorization = `Bearer ${token}`

  let response
  try {
    response = await fetch(`${API_URL}${path.startsWith('/') ? path : `/${path}`}`, { ...options, headers })
  } catch {
    throw new Error('No pudimos conectar, revisá tu conexión e intentá de nuevo')
  }
  if (response.status === 401 && requiresAuth) {
    localStorage.removeItem(TOKEN_KEY)
    window.location.href = '/admin/login'
    throw new Error('Sesión expirada. Volvé a iniciar sesión.')
  }
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    const error = new Error(Array.isArray(body.message) ? body.message.join(', ') : body.message || 'No se pudo completar la solicitud.')
    error.status = response.status
    throw error
  }
  return response.status === 204 ? null : response.json()
}

export const api = {
  getServices: () => request('/servicios'),
  getAvailableSlots: (date, serviceId) => request(`/turnos/disponibles?fecha=${encodeURIComponent(date)}&servicioId=${encodeURIComponent(serviceId)}`),
  createBooking: (booking) => request('/turnos', { method: 'POST', body: JSON.stringify(booking) }),
  getMyBooking: (code) => request(`/turnos/mi-turno/${encodeURIComponent(code)}`),
  cancelMyBooking: (code) => request(`/turnos/mi-turno/${encodeURIComponent(code)}/cancelar`, { method: 'PATCH' }),
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  getHorarios: () => request('/horarios'),
  getBlockedDays: () => request('/horarios/dias-bloqueados'),
  blockDay: (data) => request('/horarios/bloquear-dia', { method: 'POST', body: JSON.stringify(data) }, true),
  unblockDay: (date) => request(`/horarios/bloquear-dia/${encodeURIComponent(date)}`, { method: 'DELETE' }, true),
  updateHorario: (day, data) => request(`/horarios/${day}`, { method: 'PATCH', body: JSON.stringify(data) }, true),
  getTurnos: (date, name = '') => request(`/turnos?fecha=${encodeURIComponent(date)}&nombreCliente=${encodeURIComponent(name)}`, {}, true),
  getTurnosSummary: (date) => request(`/turnos/resumen?fecha=${encodeURIComponent(date)}`, {}, true),
  cancelarTurno: (id) => request(`/turnos/${id}/cancelar`, { method: 'PATCH' }, true),
  confirmarTurno: (id) => request(`/turnos/${id}/confirmar`, { method: 'PATCH' }, true),
  completarTurno: (id) => request(`/turnos/${encodeURIComponent(id)}/completar`, { method: 'PATCH' }, true),
  getMovimientos: (fechaDesde, fechaHasta) => {
    const params = new URLSearchParams()
    if (fechaDesde) params.set('fechaDesde', fechaDesde)
    if (fechaHasta) params.set('fechaHasta', fechaHasta)
    return request(`/finanzas/movimientos${params.toString() ? `?${params}` : ''}`, {}, true)
  },
  getBalance: (fechaDesde, fechaHasta) => {
    const params = new URLSearchParams()
    if (fechaDesde) params.set('fechaDesde', fechaDesde)
    if (fechaHasta) params.set('fechaHasta', fechaHasta)
    return request(`/finanzas/balance${params.toString() ? `?${params}` : ''}`, {}, true)
  },
  crearEgreso: (data) => request('/finanzas/egresos', { method: 'POST', body: JSON.stringify(data) }, true),
  crearServicio: (data) => request('/servicios', { method: 'POST', body: JSON.stringify(data) }, true),
  updateServicio: (id, data) => request(`/servicios/${id}`, { method: 'PATCH', body: JSON.stringify(data) }, true),
  deleteServicio: (id) => request(`/servicios/${id}`, { method: 'DELETE' }, true),
}

export { TOKEN_KEY }
