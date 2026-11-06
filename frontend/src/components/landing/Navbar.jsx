import { useEffect, useState } from 'react'
import { site } from '../../data/site'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => setOpen(false)

  return (
    <header className={`navbar ${scrolled || open ? 'navbar--solid' : ''}`}>
      <div className="navbar-inner">
        <a className="navbar-logo" href="#inicio" onClick={close}><span>{site.brand}</span><small>Barbería &amp; Estilismo</small></a>
        <nav id="navbar-links" className={`navbar-links ${open ? 'navbar-links--open' : ''}`} aria-label="Principal">
          {site.nav.map((item) => <a key={item.href} href={item.href} onClick={close}>{item.label}</a>)}
        </nav>
        <a className="landing-btn landing-btn--small" href="#reservar" onClick={close}>Reservar</a>
        <button
          className="navbar-toggle"
          type="button"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          aria-controls="navbar-links"
          onClick={() => setOpen(!open)}
        >
          <span /><span />
        </button>
      </div>
    </header>
  )
}
