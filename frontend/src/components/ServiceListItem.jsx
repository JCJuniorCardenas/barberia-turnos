export function ServiceListItem({ service, selected, onSelect }) {
  // Placeholder de Unsplash Source; reemplazar por fotos reales del cliente al vender el sistema.
  const imageUrl = `https://source.unsplash.com/400x300/?barbershop,${encodeURIComponent(service.nombre)}`
  return (
    <button
      className={`service-item ${selected ? 'service-item--selected' : ''}`}
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
    >
      <span className="service-image" style={{ backgroundImage: `url(${imageUrl})` }} aria-hidden="true" />
      <span>
        <strong>{service.nombre}</strong>
        <small>{service.duracionMinutos} minutos</small>
      </span>
      <span className="service-price">${Number(service.precio).toLocaleString('es-AR')}</span>
    </button>
  )
}
