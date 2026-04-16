'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface StatCounterProps {
  value: number
  suffix?: string
  prefix?: string
  duration?: number
  className?: string
}

function usePrefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
  return mql.matches
}

function formatValue(current: number, target: number, suffix?: string): string {
  // If a suffix is provided that contains M or K, use the raw number + suffix
  // e.g. value=2, suffix="M+" -> "2M+"
  if (suffix) {
    const suffixUpper = suffix.toUpperCase()
    if (suffixUpper.includes('M') || suffixUpper.includes('K')) {
      return `${Math.round(current)}${suffix}`
    }
  }

  // Auto-format based on target magnitude
  if (target >= 1000000) {
    const millions = current / 1000000
    return `${millions.toFixed(1)}M${suffix || ''}`
  }
  if (target >= 1000) {
    const thousands = current / 1000
    return `${Math.round(thousands)}K${suffix || ''}`
  }

  return `${Math.round(current)}${suffix || ''}`
}

export default function StatCounter({
  value,
  suffix = '',
  prefix = '',
  duration = 2,
  className = '',
}: StatCounterProps) {
  const spanRef = useRef<HTMLSpanElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const span = spanRef.current
    if (!span) return

    // Show final value immediately if reduced motion
    if (prefersReducedMotion) {
      span.textContent = `${prefix}${formatValue(value, value, suffix)}`
      return
    }

    const obj = { val: 0 }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: span,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.to(obj, {
            val: value,
            duration,
            ease: 'power2.out',
            onUpdate: () => {
              if (span) {
                span.textContent = `${prefix}${formatValue(obj.val, value, suffix)}`
              }
            },
            onComplete: () => {
              // Ensure final value is exact
              if (span) {
                span.textContent = `${prefix}${formatValue(value, value, suffix)}`
              }
            },
          })
        },
      })
    })

    return () => ctx.revert()
  }, [value, suffix, prefix, duration, prefersReducedMotion])

  // Initial display: show 0 (or final value if reduced motion)
  const initialDisplay = prefersReducedMotion
    ? `${prefix}${formatValue(value, value, suffix)}`
    : `${prefix}0${suffix}`

  return (
    <span ref={spanRef} className={className}>
      {initialDisplay}
    </span>
  )
}
