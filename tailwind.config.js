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
        // Fresh Nature Palette - Light greens with warmth
        background: {
          page: '#F4F7F5',      // Morning Mist - soft green-white
          card: '#FAFBF8',      // Warm Cream - slightly warmer cards
          dark: '#1a2f1e',      // Deep forest for dark sections
        },
        text: {
          body: '#2D3B31',      // Forest-tinted body text
          heading: '#1a2f1e',   // Deep forest for headings
          muted: '#5A6B5E',     // Muted sage
          light: '#F4F7F5',     // Light text for dark backgrounds
        },
        // Primary accent - Sage Green
        sage: {
          50: '#F0F5F2',
          100: '#DCE8E0',
          200: '#B8D4C4',
          300: '#8FC4A3',
          400: '#6BAF82',
          500: '#4A7C59',       // Main sage green
          600: '#3D6651',
          700: '#2D5A3D',       // Forest deep
          800: '#234830',
          900: '#1a2f1e',
        },
        // Secondary accent - Eucalyptus (bright, fresh)
        eucalyptus: {
          50: '#F2F9F0',
          100: '#E0F2D8',
          200: '#C5E6B8',
          300: '#A8D892',
          400: '#8CB369',       // Main eucalyptus
          500: '#72994F',
          600: '#5A7A3F',
          700: '#455E31',
          800: '#324524',
          900: '#1F2B17',
        },
        // Soft Mint for light accents
        mint: {
          50: '#F5FAF7',
          100: '#E8F5ED',
          200: '#D0EBDB',
          300: '#A8D5BA',       // Main soft mint
          400: '#7CC29A',
          500: '#5AAD7E',
          600: '#458C64',
          700: '#366D4F',
          800: '#2A543D',
          900: '#1E3A2B',
        },
        // Earth Amber for warm accents
        amber: {
          50: '#FBF8F3',
          100: '#F5EDE0',
          200: '#EBDBC2',
          300: '#DCC49A',
          400: '#C4A77D',       // Main earth amber
          500: '#A88B5C',
          600: '#8A7049',
          700: '#6B5738',
          800: '#4F402A',
          900: '#352B1D',
        },
        // Sky Blue for secondary accent
        sky: {
          50: '#F3F9FB',
          100: '#E3F1F5',
          200: '#C7E3EB',
          300: '#9DCFDC',
          400: '#7EB8C9',       // Main sky blue
          500: '#5A9AAE',
          600: '#477D8E',
          700: '#38626F',
          800: '#2A4A53',
          900: '#1D3238',
        },
        // Legacy compatibility
        accent: {
          50: '#F0F5F2',
          100: '#DCE8E0',
          200: '#B8D4C4',
          300: '#8FC4A3',
          400: '#6BAF82',
          500: '#4A7C59',
          600: '#3D6651',
          700: '#2D5A3D',
          800: '#234830',
          900: '#1a2f1e',
        },
        organic: {
          50: '#F2F9F0',
          100: '#E0F2D8',
          200: '#C5E6B8',
          300: '#A8D892',
          400: '#8CB369',
          500: '#72994F',
          600: '#5A7A3F',
          700: '#455E31',
          800: '#324524',
          900: '#1F2B17',
        },
      },
      borderRadius: {
        'card': '16px',        // Larger, more modern
        'panel': '20px',
        'button': '12px',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(45, 90, 61, 0.06), 0 1px 3px rgba(45, 90, 61, 0.08)',
        'card': '0 4px 20px rgba(45, 90, 61, 0.08), 0 2px 8px rgba(45, 90, 61, 0.04)',
        'elevated': '0 8px 30px rgba(45, 90, 61, 0.12), 0 4px 12px rgba(45, 90, 61, 0.06)',
        'glow': '0 0 40px rgba(140, 179, 105, 0.3)',
        'glow-sage': '0 0 40px rgba(74, 124, 89, 0.25)',
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
        'hero': ['clamp(2.75rem, 10vw, 10rem)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
        'display': ['clamp(2rem, 7vw, 6rem)', { lineHeight: '1.0', letterSpacing: '-0.02em' }],
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
        'gradient-nature': 'linear-gradient(135deg, #4A7C59 0%, #8CB369 50%, #7EB8C9 100%)',
        'gradient-earth': 'linear-gradient(135deg, #2D5A3D 0%, #4A7C59 50%, #C4A77D 100%)',
        'gradient-hero': 'linear-gradient(180deg, #F4F7F5 0%, #E8F5ED 50%, #F4F7F5 100%)',
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
