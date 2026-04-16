'use client'

import { useRef, useLayoutEffect, useMemo, createElement } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface TextRevealProps {
  children: string
  as?: keyof JSX.IntrinsicElements
  className?: string
  delay?: number
  stagger?: number
  trigger?: 'load' | 'scroll'
}

function usePrefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
  return mql.matches
}

export default function TextReveal({
  children,
  as: Tag = 'h1',
  className = '',
  delay = 0,
  stagger = 0.03,
  trigger = 'scroll',
}: TextRevealProps) {
  const containerRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  // Split text into character data, preserving spaces
  const characters = useMemo(() => {
    return children.split('').map((char, i) => ({
      char,
      isSpace: char === ' ',
      key: `${char}-${i}`,
    }))
  }, [children])

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container || prefersReducedMotion) return

    const charSpans =
      container.querySelectorAll<HTMLSpanElement>('.text-reveal-char')

    if (charSpans.length === 0) return

    const ctx = gsap.context(() => {
      if (trigger === 'scroll') {
        gsap.from(charSpans, {
          opacity: 0,
          y: 30,
          filter: 'blur(4px)',
          duration: 0.6,
          ease: 'power2.out',
          stagger,
          scrollTrigger: {
            trigger: container,
            start: 'top 80%',
            once: true,
          },
        })
      } else {
        // trigger === 'load'
        gsap.from(charSpans, {
          opacity: 0,
          y: 30,
          filter: 'blur(4px)',
          duration: 0.6,
          ease: 'power2.out',
          stagger,
          delay,
        })
      }
    }, container)

    return () => ctx.revert()
  }, [trigger, delay, stagger, prefersReducedMotion])

  const content = characters.map(({ char, isSpace, key }) => {
    if (isSpace) {
      return (
        <span
          key={key}
          className="text-reveal-char"
          style={{ display: 'inline-block' }}
        >
          {'\u00A0'}
        </span>
      )
    }
    return (
      <span
        key={key}
        className="text-reveal-char"
        style={{ display: 'inline-block' }}
      >
        {char}
      </span>
    )
  })

  return createElement(
    Tag,
    {
      ref: containerRef,
      className,
      'aria-label': children,
    },
    content
  )
}
