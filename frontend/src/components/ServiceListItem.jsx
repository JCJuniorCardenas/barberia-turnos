export function ServiceListItem({ service, selected, onSelect }) {
  return (
    <button
      className={`service-card ${selected ? 'service-card--selected' : ''}`}
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
    >
      <span className="service-card-check" aria-hidden="true">✓</span>
      <strong>{service.nombre}</strong>
      <span className="service-card-meta">
        <span className="service-card-time">{service.duracionMinutos} min</span>
        <span className="service-card-price">${Number(service.precio).toLocaleString('es-AR')}</span>
      </span>
    </button>
  )
}
