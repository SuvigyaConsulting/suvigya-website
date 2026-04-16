'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const lenis = new Lenis({
      smoothWheel: !prefersReduced,
      lerp: 0.08,
    })
    lenisRef.current = lenis

    // Connect Lenis to GSAP ticker for sync
    const onTick = (time: number) => { lenis.raf(time * 1000) }
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    // Pipe Lenis scroll events into ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    return () => {
      gsap.ticker.remove(onTick)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return <>{children}</>
}
