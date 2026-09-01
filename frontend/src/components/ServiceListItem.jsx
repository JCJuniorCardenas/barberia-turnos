export function ServiceListItem({ service, selected, onSelect }) {
  return (
    <button
      className={`service-item ${selected ? 'service-item--selected' : ''}`}
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
    >
      <span>
        <strong>{service.nombre}</strong>
        <small>{service.duracionMinutos} minutos</small>
      </span>
      <span className="service-price">${Number(service.precio).toLocaleString('es-AR')}</span>
    </button>
  )
}
