export function ServiceListItem({ service, selected, onSelect }) {
  const serviceName = service.nombre.toLocaleLowerCase('es-AR')
  const imageUrl = serviceName.includes('corte') && serviceName.includes('barba')
    ? 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&q=80'
    : 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80'
  const imageAlt = serviceName.includes('corte') && serviceName.includes('barba')
    ? `Corte y barba para ${service.nombre}`
    : `Corte de pelo para ${service.nombre}`

  return (
    <button
      className={`service-item ${selected ? 'service-item--selected' : ''}`}
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
    >
      <span className="service-image">
        <img src={imageUrl} alt={imageAlt} loading="lazy" onError={(event) => { event.currentTarget.style.display = 'none' }} />
      </span>
      <span>
        <strong>{service.nombre}</strong>
        <small>{service.duracionMinutos} minutos</small>
      </span>
      <span className="service-price">${Number(service.precio).toLocaleString('es-AR')}</span>
    </button>
  )
}
