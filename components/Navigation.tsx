'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import Link from 'next/link'
import { useAccessibility } from '@/components/AccessibilityProvider'

const navItems = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Services', href: '#services' },
  { name: 'Projects', href: '#projects' },
  { name: 'Impact', href: '#impact' },
  { name: 'Contact', href: '#contact' },
]

// Animated underline component
function NavLink({ item, onClick, isActive }: { item: typeof navItems[0]; onClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void; isActive?: boolean }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <a
      href={item.href}
      onClick={(e) => onClick(e, item.href)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative font-medium hover:text-sage-600 transition-all py-2 px-1 min-h-[44px] inline-flex items-center ${isActive ? 'text-base font-bold text-text-heading' : 'text-sm text-text-muted'}`}
    >
      {item.name}
      <motion.span
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-sage-400 to-eucalyptus-400"
        initial={{ width: 0 }}
        animate={{ width: isHovered ? '100%' : 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />
    </a>
  )
}

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const { scrollY } = useScroll()
  const { reducedMotion } = useAccessibility()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 50)
  })

  // Track active section (throttled via requestAnimationFrame)
  const ticking = useRef(false)

  const handleScroll = useCallback(() => {
    if (ticking.current) return
    ticking.current = true

    requestAnimationFrame(() => {
      const sections = navItems.map(item => item.href.slice(1))
      const scrollPosition = window.scrollY + 100

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i])
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i])
          break
        }
      }
      ticking.current = false
    })
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleEscape = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  // Focus trap for mobile menu
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!isOpen || !mobileMenuRef.current) return
    const menu = mobileMenuRef.current
    const focusableEls = menu.querySelectorAll<HTMLElement>('a[href], button, [tabindex]:not([tabindex="-1"])')
    if (focusableEls.length === 0) return

    const firstEl = focusableEls[0]
    const lastEl = focusableEls[focusableEls.length - 1]

    // Focus first element when menu opens
    firstEl.focus()

    const trapFocus = (e: globalThis.KeyboardEvent) => {
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault()
          lastEl.focus()
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault()
          firstEl.focus()
        }
      }
    }
    menu.addEventListener('keydown', trapFocus)
    return () => menu.removeEventListener('keydown', trapFocus)
  }, [isOpen])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const id = href.replace('#', '')
    const element = document.getElementById(id)
    if (element) {
      const navbarOffset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - navbarOffset
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
    setIsOpen(false)
  }

  return (
    <>
      <motion.nav
        aria-label="Main navigation"
        className={`fixed top-0 left-0 right-0 z-nav transition-all duration-500 ${
          isScrolled
            ? 'glass py-3 shadow-soft'
            : 'py-5 bg-transparent'
        }`}
        initial={reducedMotion ? false : { y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 100, damping: 20, delay: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative group">
            <motion.span
              className="text-2xl font-bold gradient-text"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              SUVIGYA
            </motion.span>
            <motion.span
              className="absolute -bottom-1 left-0 h-0.5 bg-sage-400 w-0 group-hover:w-full transition-all duration-300"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <div key={item.name} className="relative">
                <NavLink item={item} onClick={handleNavClick} isActive={activeSection === item.href.slice(1)} />
              </div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative w-11 h-11 flex flex-col justify-center items-center gap-1.5 z-nav"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            whileTap={{ scale: 0.9 }}
          >
            <motion.span
              className="w-6 h-0.5 bg-text-heading rounded-full origin-center"
              animate={isOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.span
              className="w-6 h-0.5 bg-text-heading rounded-full"
              animate={isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="w-6 h-0.5 bg-text-heading rounded-full origin-center"
              animate={isOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={mobileMenuRef}
            className="fixed inset-0 z-overlay md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-background-page/98 backdrop-blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Menu Content */}
            <div className="relative h-full flex flex-col items-center justify-center">
              {/* Decorative elements */}
              <div className="absolute top-20 left-10 w-32 h-32 bg-sage-200/30 rounded-full blur-3xl" />
              <div className="absolute bottom-20 right-10 w-40 h-40 bg-eucalyptus-200/30 rounded-full blur-3xl" />

              {/* Navigation Items */}
              <nav aria-label="Mobile navigation" className="flex flex-col items-center gap-6">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`transition-all py-2 min-h-[44px] inline-flex items-center ${
                      activeSection === item.href.slice(1)
                        ? 'text-3xl md:text-4xl font-extrabold text-text-heading'
                        : 'text-2xl md:text-3xl font-bold text-text-heading hover:text-sage-600'
                    }`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.08, duration: 0.4 }}
                  >
                    {item.name}
                  </motion.a>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
