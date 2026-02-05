/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Corporate Palette - Navy / Teal / Gold (matching brochure)
        background: {
          page: '#f9fafb',        // Neutral white-gray
          card: '#ffffff',        // Pure white cards
          dark: '#06101e',        // Deep navy for dark sections
        },
        text: {
          body: '#111827',        // Charcoal body text
          heading: '#1a365d',     // Navy headings
          muted: '#4b5563',       // Gray-600 muted
          light: '#f9fafb',       // Light text for dark backgrounds
        },
        // Primary - Navy Blue
        sage: {
          50: '#f0f4fa',
          100: '#d9e3f0',
          200: '#b3c7e0',
          300: '#8dabc9',
          400: '#5c84ad',
          500: '#2c5282',         // Main navy
          600: '#1a365d',         // Brochure primary navy
          700: '#0f2442',
          800: '#0a1930',
          900: '#06101e',
        },
        // Secondary - Teal
        eucalyptus: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',         // Main teal bright
          500: '#14b8a6',
          600: '#0d9488',         // Brochure teal
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        // Neutral Cool - Slate
        mint: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        // Accent - Burnished Gold
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',         // Main gold bright
          500: '#f59e0b',
          600: '#d97706',         // Brochure gold
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Blue accent (sky elements)
        sky: {
          'mist': '#dbeafe',
          'haze': '#eff6ff',
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Legacy compatibility
        accent: {
          50: '#f0f4fa',
          100: '#d9e3f0',
          200: '#b3c7e0',
          300: '#8dabc9',
          400: '#5c84ad',
          500: '#2c5282',
          600: '#1a365d',
          700: '#0f2442',
          800: '#0a1930',
          900: '#06101e',
        },
        organic: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
      },
      borderRadius: {
        'card': '16px',
        'panel': '20px',
        'button': '12px',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(26, 54, 93, 0.06), 0 1px 3px rgba(26, 54, 93, 0.08)',
        'card': '0 4px 20px rgba(26, 54, 93, 0.08), 0 2px 8px rgba(26, 54, 93, 0.04)',
        'elevated': '0 8px 30px rgba(26, 54, 93, 0.12), 0 4px 12px rgba(26, 54, 93, 0.06)',
        'glow': '0 0 40px rgba(20, 184, 166, 0.3)',
        'glow-sage': '0 0 40px rgba(44, 82, 130, 0.25)',
      },
      lineHeight: {
        'relaxed': '1.75',
        'generous': '1.85',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero': ['clamp(2rem, 10vw, 10rem)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
        'display': ['clamp(1.75rem, 7vw, 6rem)', { lineHeight: '1.0', letterSpacing: '-0.02em' }],
        'title': ['clamp(2rem, 4vw, 3.5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'subtitle': ['clamp(1.25rem, 2vw, 1.75rem)', { lineHeight: '1.4' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
        'slide-down': 'slideDown 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'marquee': 'marquee 50s linear infinite',
        'marquee-reverse': 'marqueeReverse 50s linear infinite',
        'spin-slow': 'spin 20s linear infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(40px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-40px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        marqueeReverse: {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-nature': 'linear-gradient(135deg, #1a365d 0%, #0d9488 50%, #60a5fa 100%)',
        'gradient-earth': 'linear-gradient(135deg, #0f2442 0%, #1a365d 50%, #d97706 100%)',
        'gradient-hero': 'linear-gradient(180deg, #f9fafb 0%, #eff6ff 50%, #f9fafb 100%)',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'in-out-expo': 'cubic-bezier(0.87, 0, 0.13, 1)',
      },
      zIndex: {
        'content': '0',
        'section': '10',
        'sticky': '20',
        'nav': '50',
        'overlay': '60',
        'cursor': '70',
        'loading': '90',
        'modal': '100',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}
