'use client'

import { useEffect, useCallback } from 'react'

export function useKeyboardNavigation() {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Skip if user is typing in an input
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement ||
      (e.target as HTMLElement).isContentEditable
    ) {
      return
    }

    // Arrow key navigation
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      const sections = document.querySelectorAll('section[id]')
      const currentSection = Array.from(sections).find((section) => {
        const rect = section.getBoundingClientRect()
        return rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2
      })

      if (currentSection) {
        const currentIndex = Array.from(sections).indexOf(currentSection)
        const nextIndex =
          e.key === 'ArrowDown'
            ? Math.min(currentIndex + 1, sections.length - 1)
            : Math.max(currentIndex - 1, 0)
        const nextSection = sections[nextIndex]
        nextSection?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }

    // Escape key to close modals/menus
    if (e.key === 'Escape') {
      const openMenus = document.querySelectorAll('[data-menu-open="true"]')
      openMenus.forEach((menu) => {
        ;(menu as HTMLElement).setAttribute('data-menu-open', 'false')
      })
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])
}
