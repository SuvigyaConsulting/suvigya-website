'use client'

export default function Footer() {
  return (
    <footer className="section-dark border-t border-sage-500/20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 flex flex-col items-center gap-4">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          className="group inline-flex items-center gap-2 rounded-full border border-sage-500/30 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.15em] transition-all duration-300 hover:border-sage-400/60 hover:bg-white/5"
          style={{ color: 'rgba(249, 250, 251, 0.6)' }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-300 group-hover:-translate-y-0.5"
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
          Back to top
        </button>

        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-2">
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
      </div>
    </footer>
  )
}
