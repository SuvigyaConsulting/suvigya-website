'use client'

import { useCallback, useEffect, useRef } from 'react'
import type { ProjectLocation } from './ProjectPins'

// ── Props ──────────────────────────────────────────────────────────────────────

interface ProjectDetailProps {
  project: ProjectLocation | null
  onClose: () => void
}

// ── Descriptions (placeholder text keyed by project ID) ────────────────────────

const projectDescriptions: Record<number, string> = {
  1: 'Supporting emergency food security and agricultural recovery across Afghanistan through direct interventions for vulnerable communities, restoring livelihoods and strengthening resilience against ongoing crises.',
  2: 'Transforming Kerala\'s agricultural value chains through climate-smart practices, enhancing farmer incomes and building long-term resilience against extreme weather events and shifting monsoon patterns.',
  3: 'Enabling livelihood enhancement and ecosystem management across Northeast India, empowering communities in Nagaland and Tripura through integrated natural resource management and institutional capacity building.',
  4: 'Scaling up climate adaptation across the Hindu Kush Himalayan region, protecting glacial ecosystems and building the adaptive capacity of mountain communities facing accelerating climate impacts.',
  5: 'Strengthening community-based forest management in Meghalaya through participatory governance, sustainable harvesting practices, and equitable benefit-sharing mechanisms for forest-dependent communities.',
  6: 'Conserving critical biodiversity across India\'s protected landscapes through community engagement, habitat restoration, and sustainable livelihood alternatives that reduce pressure on fragile ecosystems.',
  7: 'Coordinating over fifty natural resource management projects across India with German development cooperation, driving systemic improvements in watershed management, forestry, and rural livelihoods.',
  8: 'Tackling marine plastic pollution along India\'s western coastline through circular economy interventions, waste management infrastructure, and community-driven behaviour change for a sustainable blue economy.',
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  // Close on Escape key
  useEffect(() => {
    if (!project) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [project, onClose])

  // Trap focus within panel when open
  useEffect(() => {
    if (!project || !panelRef.current) return

    const firstFocusable = panelRef.current.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    firstFocusable?.focus()
  }, [project])

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose()
    },
    [onClose],
  )

  // Determine gradient based on project color
  const getValueGradient = (color: string) => {
    if (color === '#14b8a6') {
      return 'linear-gradient(135deg, #14b8a6, #06b6d4, #22d3ee)'
    }
    return 'linear-gradient(135deg, #c9a84c, #d4a843, #e2c06b)'
  }

  const isOpen = project !== null

  return (
    <>
      {/* Backdrop (click to close) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20"
          onClick={handleBackdropClick}
          aria-hidden="true"
        />
      )}

      {/* Slide-in panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={project ? project.title : undefined}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0f1629]/95 backdrop-blur-xl border-l border-white/[0.06] p-8 z-50 overflow-y-auto"
        style={{
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {project && (
          <>
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-[#8892a8] hover:text-white transition-colors duration-200 p-1"
              aria-label="Close project details"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Client badge */}
            <span
              className="inline-block px-3 py-1 rounded-full border text-xs font-medium mb-4"
              style={{
                borderColor: project.color,
                color: project.color,
              }}
            >
              {project.client}
            </span>

            {/* Title */}
            <h2 className="font-display text-2xl font-bold text-[#f0f2f5] mb-4 leading-tight">
              {project.title}
            </h2>

            {/* Value */}
            <p
              className="font-display text-5xl font-bold mb-2"
              style={{
                background: getValueGradient(project.color),
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {project.value}
            </p>

            {/* Value label */}
            <p className="text-sm text-[#4a5568] mb-6">Project Value</p>

            {/* Description */}
            <p className="text-[#8892a8] leading-relaxed mb-8">
              {projectDescriptions[project.id] ??
                'A strategic consulting engagement delivering measurable impact through evidence-based approaches and deep sector expertise.'}
            </p>

            {/* CTA button */}
            <button
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border text-sm font-medium transition-all duration-300 hover:shadow-lg"
              style={{
                borderColor: '#14b8a6',
                color: '#14b8a6',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                el.style.backgroundColor = 'rgba(20, 184, 166, 0.1)'
                el.style.boxShadow = '0 0 20px rgba(20, 184, 166, 0.15)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                el.style.backgroundColor = 'transparent'
                el.style.boxShadow = 'none'
              }}
            >
              View Full Case Study
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </>
        )}
      </div>
    </>
  )
}
