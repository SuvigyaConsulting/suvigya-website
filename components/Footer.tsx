'use client'

const quickLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Services', href: '#services' },
  { name: 'Projects', href: '#projects' },
  { name: 'Impact', href: '#impact' },
  { name: 'Contact', href: '#contact' },
]

export default function Footer() {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
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
  }

  return (
    <footer className="relative overflow-hidden section-dark border-t border-eucalyptus-500/20">
      {/* Tessellation SVG pattern - very subtle */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.04 }}
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="footer-triangles" x="0" y="0" width="60" height="104" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="60" y2="0" stroke="#14b8a6" strokeWidth="0.8" />
              <line x1="30" y1="0" x2="0" y2="52" stroke="#14b8a6" strokeWidth="0.8" />
              <line x1="30" y1="0" x2="60" y2="52" stroke="#14b8a6" strokeWidth="0.8" />
              <line x1="0" y1="52" x2="60" y2="52" stroke="#14b8a6" strokeWidth="0.8" />
              <line x1="0" y1="52" x2="30" y2="104" stroke="#14b8a6" strokeWidth="0.8" />
              <line x1="60" y1="52" x2="30" y2="104" stroke="#14b8a6" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footer-triangles)" />
        </svg>
      </div>

      {/* Main footer content */}
      <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">

          {/* Left column - Brand */}
          <div className="space-y-4">
            <span className="text-2xl font-bold text-white tracking-tight">
              SUVIGYA
            </span>
            <p
              className="text-sm font-medium tracking-wide"
              style={{ color: '#14b8a6' }}
            >
              Inspiring Solutions
            </p>
            <p
              className="text-sm leading-relaxed max-w-xs"
              style={{ color: 'rgba(249, 250, 251, 0.6)' }}
            >
              Development management consulting for multilateral and government programmes across climate, agriculture, and livelihoods.
            </p>
          </div>

          {/* Middle column - Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">
              Quick Links
            </h3>
            <nav aria-label="Footer navigation">
              <ul className="space-y-1">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className="inline-flex items-center min-h-[44px] text-sm transition-colors duration-200"
                      style={{ color: 'rgba(249, 250, 251, 0.6)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#14b8a6'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'rgba(249, 250, 251, 0.6)'
                      }}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Right column - Connect */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">
              Connect
            </h3>
            <ul className="space-y-1">
              <li>
                <a
                  href="mailto:contact@suvigya.org"
                  className="inline-flex items-center gap-3 min-h-[44px] text-sm transition-colors duration-200"
                  style={{ color: 'rgba(249, 250, 251, 0.6)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#14b8a6'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(249, 250, 251, 0.6)'
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M22 4L12 13L2 4" />
                  </svg>
                  contact@suvigya.org
                </a>
              </li>
              <li>
                <a
                  href="tel:+919900393800"
                  className="inline-flex items-center gap-3 min-h-[44px] text-sm transition-colors duration-200"
                  style={{ color: 'rgba(249, 250, 251, 0.6)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#14b8a6'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(249, 250, 251, 0.6)'
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                  </svg>
                  +91 9900 393 800
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="inline-flex items-center gap-3 min-h-[44px] text-sm transition-colors duration-200"
                  style={{ color: 'rgba(249, 250, 251, 0.6)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#14b8a6'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(249, 250, 251, 0.6)'
                  }}
                  aria-label="LinkedIn"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="relative border-t"
        style={{ borderColor: 'rgba(20, 184, 166, 0.1)' }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-2">
          <p
            className="text-xs text-center md:text-left"
            style={{ color: 'rgba(249, 250, 251, 0.4)' }}
          >
            &copy; 2024 Suvigya Management Consultants Private Limited. All rights reserved.
          </p>
          <p
            className="text-xs"
            style={{ color: 'rgba(249, 250, 251, 0.3)' }}
          >
            Bengaluru, India
          </p>
        </div>
      </div>
    </footer>
  )
}
