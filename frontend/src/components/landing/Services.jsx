import { Reveal } from '../Reveal'

export function Services({ services, loading, error, onSelect }) {
  return (
    <section className="section section--alt" id="servicios">
      <div className="section-inner">
        <Reveal as="p" className="section-kicker">Servicios</Reveal>
        <Reveal as="h2" className="section-title" delay={80}>Elegí lo tuyo</Reveal>
        {loading && <p className="section-text">Cargando servicios…</p>}
        {!loading && !services.length && <p className="section-text">{error || 'Muy pronto vas a ver los servicios acá.'}</p>}
        <div className="service-cards">
          {services.map((item, index) => (
            <Reveal key={item.id} delay={index * 80}>
              <button className="service-card" type="button" onClick={() => onSelect(item)}>
                <span className="service-card-name">{item.nombre}</span>
                <span className="service-card-meta">{item.duracionMinutos} minutos</span>
                <span className="service-card-bottom">
                  <span className="service-card-price">${Number(item.precio).toLocaleString('es-AR')}</span>
                  <span className="service-card-cta">Reservar →</span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
