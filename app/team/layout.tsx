'use client'

import { useEffect } from 'react'

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Hide background plant growth on /team (nav stays visible — it now includes a Team link)
  useEffect(() => {
    const plantGrowth = document.querySelector('[aria-hidden="true"].fixed.inset-0') as HTMLElement
    if (plantGrowth) plantGrowth.style.display = 'none'

    return () => {
      if (plantGrowth) plantGrowth.style.display = ''
    }
  }, [])

  return <>{children}</>
}
