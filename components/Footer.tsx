'use client'

export default function Footer() {
  return (
    <footer className="section-dark border-t border-sage-500/20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-2">
        <p
          className="text-xs text-center md:text-left"
          style={{ color: 'rgba(249, 250, 251, 0.45)' }}
        >
          &copy; 2026 Suvigya Management Consultants Private Limited. All rights reserved.
        </p>
        <p className="text-xs" style={{ color: 'rgba(249, 250, 251, 0.35)' }}>
          Bengaluru, India
        </p>
      </div>
    </footer>
  )
}
