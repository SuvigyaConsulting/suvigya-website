'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAccessibility } from '@/components/AccessibilityProvider'

const navItems = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Team', href: '/team' },
  { name: 'Services', href: '#services' },
  { name: 'Projects', href: '#projects' },
  { name: 'Impact', href: '#impact' },
  { name: 'Contact', href: '#contact' },
]

// Animated underline component
function NavLink({ item, onClick, isActive }: { item: typeof navItems[0]; onClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void; isActive?: boolean }) {
  const className = `relative font-medium transition-colors duration-200 py-2 px-1 min-h-[44px] inline-flex items-center nav-link ${isActive ? 'text-base font-bold' : 'text-sm'}`
  if (item.href.startsWith('/')) {
    return (
      <Link href={item.href} className={className}>
        {item.name}
      </Link>
    )
  }
  return (
    <a
      href={item.href}
      onClick={(e) => onClick(e, item.href)}
      className={className}
    >
      {item.name}
    </a>
  )
}

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const { scrollY } = useScroll()
  const { reducedMotion } = useAccessibility()
  const pathname = usePathname()
  const onHomePage = pathname === '/'

  const lastSectionCheck = useRef(0)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 50)

    // Throttle active section detection to every 100ms
    const now = Date.now()
    if (now - lastSectionCheck.current < 100) return
    lastSectionCheck.current = now

    const sections = navItems.map(item => item.href.slice(1))
    const scrollPosition = latest + 100

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = document.getElementById(sections[i])
      if (section && section.offsetTop <= scrollPosition) {
        setActiveSection(sections[i])
        break
      }
    }
  })

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
    // Page routes (e.g. /team) — let Next Link handle navigation, just close mobile menu
    if (href.startsWith('/')) {
      setIsOpen(false)
      return
    }
    e.preventDefault()
    const id = href.replace('#', '')
    const element = document.getElementById(id)
    if (element) {
      const navbarOffset = 80
      const targetY = element.getBoundingClientRect().top + window.scrollY - navbarOffset
      const startY = window.scrollY
      const distance = targetY - startY
      const duration = 800
      let startTime: number | null = null

      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const elapsed = timestamp - startTime
        const progress = Math.min(elapsed / duration, 1)
        const ease = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2
        window.scrollTo(0, startY + distance * ease)
        if (progress < 1) requestAnimationFrame(step)
      }

      requestAnimationFrame(step)
    }
    setIsOpen(false)
  }

  return (
    <>
      <motion.nav
        aria-label="Main navigation"
        className={`fixed top-0 left-0 right-0 z-nav transition-all duration-500 ${
          isScrolled
            ? 'py-3 shadow-soft backdrop-blur-xl'
            : 'py-5 bg-transparent'
        }`}
        style={isScrolled ? { backgroundColor: 'rgba(250, 248, 245, 0.88)' } : {}}
        initial={reducedMotion ? false : { y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 100, damping: 20, delay: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo — hidden at top (hero has SUVIGYA centered), appears on scroll */}
          <Link href="/" className="relative">
            <motion.span
              className={`text-xl font-bold tracking-[0.15em] transition-all duration-500 ${
                isScrolled
                  ? 'gradient-text opacity-100 translate-y-0'
                  : 'text-white opacity-0 -translate-y-2 pointer-events-none'
              }`}
              style={{ fontFamily: 'var(--font-display), system-ui, sans-serif' }}
            >
              SUVIGYA
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = item.href.startsWith('/')
                ? pathname === item.href
                : onHomePage && activeSection === item.href.slice(1)
              return (
                <div key={item.name} className="relative">
                  <NavLink item={item} onClick={handleNavClick} isActive={isActive} />
                </div>
              )
            })}
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
                {navItems.map((item, index) => {
                  const isPageLink = item.href.startsWith('/')
                  const isActive = isPageLink
                    ? pathname === item.href
                    : onHomePage && activeSection === item.href.slice(1)
                  const linkClass = `transition-all py-2 min-h-[44px] inline-flex items-center ${
                    isActive
                      ? 'text-3xl md:text-4xl font-extrabold text-text-heading'
                      : 'text-2xl md:text-3xl font-bold text-text-heading hover:text-sage-600'
                  }`
                  if (isPageLink) {
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.08, duration: 0.4 }}
                      >
                        <Link
                          href={item.href}
                          className={linkClass}
                          onClick={() => setIsOpen(false)}
                        >
                          {item.name}
                        </Link>
                      </motion.div>
                    )
                  }
                  return (
                    <motion.a
                      key={item.name}
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className={linkClass}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.08, duration: 0.4 }}
                    >
                      {item.name}
                    </motion.a>
                  )
                })}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
