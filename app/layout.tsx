import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'
import Navigation from '@/components/Navigation'
import JsonLd from '@/components/JsonLd'
import MotionProvider from '@/components/MotionProvider'
import AccessibilityProvider from '@/components/AccessibilityProvider'
import KeyboardNavigation from '@/components/KeyboardNavigation'
import OrganicPlantGrowth from '@/features/plant-growth/OrganicPlantGrowth'
import ErrorBoundary from '@/components/ErrorBoundary'
import SmoothScroll from '@/components/layout/SmoothScroll'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})


export const metadata: Metadata = {
  metadataBase: new URL('https://suvigya.org'),
  title: {
    default: 'SUVIGYA',
    template: '%s | SUVIGYA',
  },
  description:
    'Natural resource management consultancy delivering GIS, climate, policy, and grassroots solutions across India and Asia. Based in Bengaluru.',
  keywords: [
    'natural resource management',
    'environmental consulting',
    'GIS consulting',
    'remote sensing',
    'climate adaptation',
    'watershed management',
    'biodiversity conservation',
    'environmental policy',
    'sustainable development',
    'consulting India',
    'Bengaluru',
  ],
  authors: [{ name: 'Suvigya Consulting' }],
  creator: 'Suvigya Consulting',
  publisher: 'Suvigya Management Consultants Private Limited',
  category: 'Environmental Consulting',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://suvigya.org',
    siteName: 'Suvigya Consulting',
    title: 'SUVIGYA',
    description:
      "Shaping tomorrow's earth — GIS, climate, and natural resource management consulting across India and Asia.",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Suvigya Consulting',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SUVIGYA',
    description:
      "Shaping tomorrow's earth — GIS, climate, and natural resource management consulting across India and Asia.",
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  themeColor: '#1a365d',
  width: 'device-width',
  initialScale: 1,
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': 'https://suvigya.org/#organization',
  name: 'Suvigya Management Consultants Private Limited',
  alternateName: 'Suvigya Consulting',
  url: 'https://suvigya.org',
  logo: 'https://suvigya.org/icon-512.png',
  image: 'https://suvigya.org/og-image.png',
  description:
    'Natural resource management consultancy delivering GIS, climate, policy, and grassroots solutions across India and Asia.',
  email: 'contact@suvigya.org',
  foundingLocation: 'Bengaluru, India',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Bengaluru',
    addressRegion: 'Karnataka',
    addressCountry: 'IN',
  },
  areaServed: ['India', 'Afghanistan', 'Laos', 'South Asia', 'Hindu Kush Himalaya'],
  knowsAbout: [
    'Natural Resource Management',
    'Geographic Information Systems (GIS)',
    'Remote Sensing',
    'Climate Change Adaptation',
    'Watershed Management',
    'Biodiversity Conservation',
    'Environmental Policy',
    'Sustainable Development',
  ],
  slogan: 'Inspiring Solutions',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <JsonLd data={jsonLd} />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-sage-600 focus:text-white focus:rounded-md focus:outline-none"
        >
          Skip to main content
        </a>
        <AccessibilityProvider>
          <SmoothScroll />
          <MotionProvider>
            <ErrorBoundary componentName="OrganicPlantGrowth" fallback={null}>
              <OrganicPlantGrowth />
            </ErrorBoundary>
            <Navigation />
            <KeyboardNavigation />
            <main id="main-content" className="relative">
              {children}
            </main>
          </MotionProvider>
        </AccessibilityProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
