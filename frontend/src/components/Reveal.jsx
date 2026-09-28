import { useInView } from '../hooks/useInView'

/**
 * Envuelve contenido y lo anima al entrar en el viewport (fade + slide up).
 * `delay` (ms) permite escalonar animaciones en listas.
 */
export function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const [ref, inView] = useInView()
  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? 'reveal--visible' : ''} ${className}`.trim()}
      style={{ transitionDelay: inView ? `${delay}ms` : '0ms' }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
