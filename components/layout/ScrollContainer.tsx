'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
gsap.defaults({ force3D: true })

interface ScrollContainerProps {
  children: React.ReactNode
}

export default function ScrollContainer({ children }: ScrollContainerProps) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    const lenis = new Lenis({
      smoothWheel: !prefersReducedMotion,
      lerp: 0.08,
    })

    lenisRef.current = lenis

    // Connect Lenis scroll events to ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    // Connect Lenis to GSAP ticker for synchronized frame updates
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(tickerCallback)

    // Disable lag smoothing for consistent frame rate
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tickerCallback)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return <div>{children}</div>
}
