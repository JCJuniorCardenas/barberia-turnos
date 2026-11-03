import { site } from '../../data/site'

export function Footer() {
  return (
    <footer className="site-footer">
      <p className="site-footer-brand">{site.brand}</p>
      <p>{site.tagline} · {site.city}</p>
      <p><a href={site.instagramUrl} target="_blank" rel="noreferrer">@{site.instagram}</a></p>
      <small>© {new Date().getFullYear()} {site.name}</small>
    </footer>
  )
}
