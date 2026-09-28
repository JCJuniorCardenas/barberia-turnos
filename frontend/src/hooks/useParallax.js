import { useEffect, useRef } from 'react'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/** Aplica un desplazamiento vertical sutil a un elemento en función del scroll. */
export function useParallax(strength = 0.15) {
  const ref = useRef(null)

  useEffect(() => {
    const node = ref.current
    if (!node || prefersReducedMotion()) return

    let frame = null
    function update() {
      frame = null
      const rect = node.getBoundingClientRect()
      const offset = rect.top * strength
      node.style.transform = `translateY(${offset.toFixed(1)}px)`
    }
    function onScroll() {
      if (frame === null) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [strength])

  return ref
}
