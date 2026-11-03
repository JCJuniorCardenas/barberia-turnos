import { site } from '../../data/site'

export function Marquee() {
  const items = site.marquee.map((text) => text.toUpperCase())
  const track = [...items, ...items]

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <div className="marquee-group" key={copy}>
            {track.map((text, index) => <span key={`${text}-${index}`}>{text}<i>✦</i></span>)}
          </div>
        ))}
      </div>
    </div>
  )
}
