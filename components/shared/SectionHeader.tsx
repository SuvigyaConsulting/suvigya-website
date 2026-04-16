import React from 'react'

interface SectionHeaderProps {
  overline: string
  headline: React.ReactNode
  subtitle?: string
  align?: 'center' | 'left'
  dark?: boolean
}

export default function SectionHeader({
  overline,
  headline,
  subtitle,
  align = 'center',
  dark = true,
}: SectionHeaderProps) {
  const isCenter = align === 'center'

  const overlineColor = dark
    ? 'var(--accent-teal)'
    : '#0d9488' // teal-600

  const headlineColor = dark
    ? 'var(--text-primary)'
    : 'var(--text-dark-heading)'

  const subtitleColor = dark
    ? 'var(--text-secondary)'
    : 'var(--text-dark-body)'

  return (
    <div
      className={isCenter ? 'text-center' : 'text-left'}
      style={{ marginBottom: '3rem' }}
    >
      {/* Overline */}
      <span
        className="overline"
        style={{
          color: overlineColor,
          display: 'block',
          marginBottom: '1rem',
        }}
      >
        {overline}
      </span>

      {/* Headline */}
      <h2
        style={{
          color: headlineColor,
          fontSize: 'clamp(2.5rem, 6vw, 5rem)',
          fontWeight: 700,
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          textWrap: 'balance',
          marginBottom: '1.5rem',
        }}
      >
        {headline}
      </h2>

      {/* Divider rule */}
      <div
        style={{
          width: '60px',
          height: '2px',
          backgroundColor: 'var(--accent-teal)',
          marginBottom: '1.5rem',
          ...(isCenter ? { marginLeft: 'auto', marginRight: 'auto' } : {}),
        }}
      />

      {/* Subtitle */}
      {subtitle && (
        <p
          style={{
            color: subtitleColor,
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            lineHeight: 1.7,
            maxWidth: '42rem',
            ...(isCenter ? { marginLeft: 'auto', marginRight: 'auto' } : {}),
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
