import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function CustomCursor() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    // Only activate on true pointer (mouse) devices, not touch screens
    if (!window.matchMedia('(pointer: fine)').matches) return

    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = 0, mouseY = 0
    let ringX  = 0, ringY  = 0

    const onMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      gsap.to(dot, { x: mouseX, y: mouseY, duration: 0.1, ease: 'power2.out' })
    }

    const animate = () => {
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12
      gsap.set(ring, { x: ringX, y: ringY })
      requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMove)
    animate()

    const onEnter = () => {
      gsap.to(ring, { scale: 1.5, borderColor: '#C8A165', duration: 0.3 })
      gsap.to(dot,  { scale: 0,   duration: 0.3 })
    }
    const onLeave = () => {
      gsap.to(ring, { scale: 1,   borderColor: 'rgba(200,161,101,0.6)', duration: 0.3 })
      gsap.to(dot,  { scale: 1,   duration: 0.3 })
    }

    const interactables = document.querySelectorAll('a, button, [data-cursor-hover]')
    interactables.forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    const observer = new MutationObserver(() => {
      const els = document.querySelectorAll('a, button, [data-cursor-hover]')
      els.forEach(el => {
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
      })
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <div
        id="cursor-dot"
        ref={dotRef}
        style={{ position:'fixed', top:0, left:0, pointerEvents:'none',
                 width:6, height:6, borderRadius:'50%', background:'#C8A165',
                 zIndex:9999, transform:'translate(-50%,-50%)',
                 display: window.matchMedia('(pointer: fine)').matches ? 'block' : 'none' }}
      />
      <div
        id="cursor-ring"
        ref={ringRef}
        style={{ position:'fixed', top:0, left:0, pointerEvents:'none',
                 width:36, height:36, borderRadius:'50%',
                 border:'1.5px solid rgba(200,161,101,0.6)',
                 zIndex:9999, transform:'translate(-50%,-50%)',
                 display: window.matchMedia('(pointer: fine)').matches ? 'block' : 'none' }}
      />
    </>
  )
}
