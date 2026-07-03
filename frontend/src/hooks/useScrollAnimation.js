import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useScrollReveal(options = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const {
      from       = { opacity: 0, y: 40 },
      to         = { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      start      = 'top 85%',
      once       = true,
    } = options

    gsap.fromTo(el, from, {
      ...to,
      scrollTrigger: { trigger: el, start, toggleActions: once ? 'play none none none' : 'play reverse play reverse' },
    })

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return ref
}

export function useParallax(speed = 0.3) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    gsap.to(el, {
      yPercent: -30 * speed,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
    })

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [speed])

  return ref
}
