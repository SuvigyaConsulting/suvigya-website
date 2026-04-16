'use client'

import { useEffect } from 'react'

export default function GlobeDemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Hide root layout elements that overlap the globe demo
  useEffect(() => {
    const nav = document.querySelector('nav[aria-label="Main navigation"]') as HTMLElement
    const plantGrowth = document.querySelector('[aria-hidden="true"].fixed.inset-0') as HTMLElement

    if (nav) nav.style.display = 'none'
    if (plantGrowth) plantGrowth.style.display = 'none'

    return () => {
      if (nav) nav.style.display = ''
      if (plantGrowth) plantGrowth.style.display = ''
    }
  }, [])

  return <>{children}</>
}
