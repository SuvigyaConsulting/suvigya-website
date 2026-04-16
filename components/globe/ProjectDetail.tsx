'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { ProjectLocation } from './ProjectPins'

// ── Props ──────────────────────────────────────────────────────────────────────

interface ProjectDetailProps {
  project: ProjectLocation | null
  onClose: () => void
}

// ── Descriptions keyed by project ID ──────────────────────────────────────────

const projectDescriptions: Record<number, string> = {
  1: 'Economic and financial analysis, PIM development, PAD preparation for irrigation, agribusiness, and food security interventions across conflict-affected regions.',
  2: 'End-to-end project design, costing, and PIM preparation for climate-resilient value chains across rubber, coffee, and cardamom.',
  3: 'Project design, investment planning, and operations manual for NTFP value chains, eco-tourism, and private sector frameworks in biodiversity-rich landscapes.',
  4: 'Blended finance facility concept benefiting 72 million people across the Hindu Kush Himalayan region, structuring climate finance at transboundary scale.',
  5: 'DPR and investment planning for community forestry and livelihood systems, integrating forest conservation with income generation.',
  6: 'ProDoc development, CEO Endorsement, Theory of Change, Results Framework, MEL, and co-financing for multi-state biodiversity implementation.',
  7: 'Appraisal, monitoring, and evaluation of 50+ community-led NRM projects. Mid-term reviews and performance assessments across multiple states.',
  8: 'Concept note and investment framework for plastic waste management and blue economy transformation along the Karnataka coastline.',
}

// ── Region info keyed by project ID ───────────────────────────────────────────

const projectRegions: Record<number, string> = {
  1: 'Afghanistan',
  2: 'Kerala, India',
  3: 'North East India',
  4: '8 Countries',
  5: 'Meghalaya, India',
  6: 'India',
  7: 'India',
  8: 'Coastal Karnataka, India',
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const [animKey, setAnimKey] = useState(0)

  // Trigger staggered animation when project changes
  useEffect(() => {
    if (project) {
      setAnimKey((prev) => prev + 1)
    }
  }, [project])

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
      {/* Staggered entry animation styles */}
      <style jsx>{`
        @keyframes stagger-fade-in {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .stagger-item {
          opacity: 0;
          animation: stagger-fade-in 0.5s ease-out forwards;
        }
      `}</style>

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
        className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0f1629]/95 backdrop-blur-xl border-l border-white/[0.06] z-50 overflow-y-auto"
        style={{
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {/* Teal accent line at top */}
        <div
          className="w-full h-[2px]"
          style={{
            background: 'linear-gradient(90deg, #14b8a6, #0d9488, #14b8a6)',
          }}
        />

        {project && (
          <div className="p-8" key={animKey}>
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
              className="stagger-item inline-block px-3 py-1 rounded-full border text-xs font-medium mb-4"
              style={{
                borderColor: project.color,
                color: project.color,
                animationDelay: '0.05s',
              }}
            >
              {project.client}
            </span>

            {/* Region */}
            {projectRegions[project.id] && (
              <div
                className="stagger-item flex items-center gap-1.5 mb-6"
                style={{ animationDelay: '0.12s' }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#4a5568]"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span className="text-sm text-[#4a5568]">
                  {projectRegions[project.id]}
                </span>
              </div>
            )}

            {/* Title */}
            <h2
              className="stagger-item font-display text-2xl font-bold text-[#f0f2f5] mb-4 leading-tight"
              style={{ animationDelay: '0.18s' }}
            >
              {project.title}
            </h2>

            {/* Value */}
            <p
              className="stagger-item font-display text-5xl font-bold mb-2"
              style={{
                background: getValueGradient(project.color),
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animationDelay: '0.25s',
              }}
            >
              {project.value}
            </p>

            {/* Value label */}
            <p
              className="stagger-item text-sm text-[#4a5568] mb-6"
              style={{ animationDelay: '0.3s' }}
            >
              Project Value
            </p>

            {/* Description */}
            <p
              className="stagger-item text-[#8892a8] leading-[1.75] mb-8"
              style={{ animationDelay: '0.35s' }}
            >
              {projectDescriptions[project.id] ??
                'A strategic consulting engagement delivering measurable impact through evidence-based approaches and deep sector expertise.'}
            </p>

            {/* Divider */}
            <div
              className="stagger-item w-full h-px bg-white/[0.06] mb-8"
              style={{ animationDelay: '0.4s' }}
            />

            {/* CTA button */}
            <button
              className="stagger-item inline-flex items-center gap-2 border border-[#14b8a6] text-[#14b8a6] px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 hover:bg-[#14b8a6]/10 hover:shadow-lg"
              style={{ animationDelay: '0.45s' }}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                el.style.boxShadow = '0 0 20px rgba(20, 184, 166, 0.15)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
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
          </div>
        )}
      </div>
    </>
  )
}
