'use client'

export default function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* Triangle tessellation - matching brochure pattern, fading in from top */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.1) 20%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.6) 75%, rgba(0,0,0,0.9) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.1) 20%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.6) 75%, rgba(0,0,0,0.9) 100%)',
        }}
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="triangles" x="0" y="0" width="60" height="104" patternUnits="userSpaceOnUse">
              {/* Row 1: down-pointing triangle */}
              <line x1="0" y1="0" x2="60" y2="0" stroke="#0d9488" strokeWidth="0.8" />
              <line x1="30" y1="0" x2="0" y2="52" stroke="#0d9488" strokeWidth="0.8" />
              <line x1="30" y1="0" x2="60" y2="52" stroke="#0d9488" strokeWidth="0.8" />
              <line x1="0" y1="52" x2="60" y2="52" stroke="#0d9488" strokeWidth="0.8" />
              {/* Row 2: up-pointing triangle */}
              <line x1="0" y1="52" x2="30" y2="104" stroke="#0d9488" strokeWidth="0.8" />
              <line x1="60" y1="52" x2="30" y2="104" stroke="#0d9488" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#triangles)" />
        </svg>
      </div>

      {/* Copyright at bottom */}
      <div className="relative flex flex-col items-center justify-end min-h-[240px] py-6 px-4">
        <p className="text-sage-500 text-sm bg-background-page/30 px-2 py-0.5 rounded-sm">
          &copy; 2026 Suvigya Management Consultants Private Limited. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
