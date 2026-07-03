import { useEffect, useRef, useState } from 'react'

export function useIntersection(options = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (options.once !== false) obs.disconnect()
        }
      },
      { threshold: options.threshold || 0.1, rootMargin: options.rootMargin || '0px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return [ref, inView]
}
