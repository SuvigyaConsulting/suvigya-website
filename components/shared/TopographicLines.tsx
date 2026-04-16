'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface TopographicLinesProps {
  variant: 'hero' | 'subtle' | 'rings'
  className?: string
  animate?: boolean
}

const heroPathData = [
  'M0,200 C200,180 400,250 600,200 C800,150 1000,220 1200,190',
  'M0,400 C150,420 350,360 550,400 C750,440 950,380 1200,410',
  'M0,550 C250,530 450,580 650,550 C850,520 1050,560 1200,540',
  'M0,680 C180,700 380,660 580,690 C780,720 980,670 1200,700',
]

const heroStrokeColors = [
  'rgba(20, 184, 166, 0.08)',
  'rgba(20, 184, 166, 0.15)',
  'rgba(20, 184, 166, 0.25)',
  'rgba(20, 184, 166, 0.12)',
]

const heroStrokeWidths = [0.75, 1, 1.5, 0.5]

const subtlePathData = [
  'M0,300 C300,280 500,340 700,300 C900,260 1100,310 1200,290',
  'M0,500 C200,520 400,470 600,500 C800,530 1000,490 1200,510',
  'M0,650 C250,640 450,670 650,650 C850,630 1050,660 1200,645',
]

const subtleStrokeColors = [
  'rgba(20, 184, 166, 0.05)',
  'rgba(20, 184, 166, 0.06)',
  'rgba(20, 184, 166, 0.04)',
]

const subtleStrokeWidths = [0.5, 0.75, 0.5]

const ringRadii = [60, 120, 190, 270]

const ringStrokeColors = [
  'rgba(20, 184, 166, 0.2)',
  'rgba(20, 184, 166, 0.15)',
  'rgba(20, 184, 166, 0.1)',
  'rgba(20, 184, 166, 0.06)',
]

const ringStrokeWidths = [1.5, 1, 0.75, 0.5]

function usePrefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
  return mql.matches
}

export default function TopographicLines({
  variant,
  className = '',
  animate = true,
}: TopographicLinesProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()
  const shouldAnimate = animate && !prefersReducedMotion

  useEffect(() => {
    const svg = svgRef.current
    if (!svg || !shouldAnimate) return

    const ctx = gsap.context(() => {
      if (variant === 'hero') {
        const paths = svg.querySelectorAll<SVGPathElement>('.topo-hero-line')
        paths.forEach((path) => {
          const length = path.getTotalLength()
          gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length,
          })
        })

        gsap.to(paths, {
          strokeDashoffset: 0,
          duration: 3,
          ease: 'power2.inOut',
          stagger: 0.5,
        })
      }

      if (variant === 'rings') {
        const circles = svg.querySelectorAll<SVGCircleElement>('.topo-ring')

        gsap.set(circles, {
          scale: 0,
          transformOrigin: '50% 50%',
          opacity: 0,
        })

        ScrollTrigger.create({
          trigger: svg,
          start: 'top 80%',
          once: true,
          onEnter: () => {
            gsap.to(circles, {
              scale: 1,
              opacity: 1,
              duration: 1.2,
              ease: 'power2.out',
              stagger: 0.2,
            })
          },
        })
      }
    }, svg)

    return () => ctx.revert()
  }, [variant, shouldAnimate])

  if (variant === 'hero') {
    return (
      <svg
        ref={svgRef}
        viewBox="0 0 1200 800"
        preserveAspectRatio="none"
        className={`w-full h-full ${className}`}
        aria-hidden="true"
      >
        {heroPathData.map((d, i) => (
          <path
            key={i}
            className="topo-hero-line"
            d={d}
            fill="none"
            stroke={heroStrokeColors[i]}
            strokeWidth={heroStrokeWidths[i]}
            strokeLinecap="round"
            style={
              !shouldAnimate
                ? { strokeDasharray: 'none', strokeDashoffset: 0 }
                : undefined
            }
          />
        ))}
      </svg>
    )
  }

  if (variant === 'subtle') {
    return (
      <svg
        ref={svgRef}
        viewBox="0 0 1200 800"
        preserveAspectRatio="none"
        className={`w-full h-full ${className}`}
        aria-hidden="true"
      >
        {subtlePathData.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={subtleStrokeColors[i]}
            strokeWidth={subtleStrokeWidths[i]}
            strokeLinecap="round"
          />
        ))}
      </svg>
    )
  }

  // variant === 'rings'
  return (
    <svg
      ref={svgRef}
      viewBox="0 0 1200 800"
      preserveAspectRatio="none"
      className={`w-full h-full ${className}`}
      aria-hidden="true"
    >
      {ringRadii.map((r, i) => (
        <circle
          key={i}
          className="topo-ring"
          cx={600}
          cy={400}
          r={r}
          fill="none"
          stroke={ringStrokeColors[i]}
          strokeWidth={ringStrokeWidths[i]}
          strokeLinecap="round"
          style={
            !shouldAnimate
              ? { transform: 'scale(1)', opacity: 1 }
              : undefined
          }
        />
      ))}
    </svg>
  )
}
