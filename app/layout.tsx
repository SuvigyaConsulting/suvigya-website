import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import MotionProvider from '@/components/MotionProvider'
import AccessibilityProvider from '@/components/AccessibilityProvider'
import KeyboardNavigation from '@/components/KeyboardNavigation'
import OrganicPlantGrowth from '@/features/plant-growth/OrganicPlantGrowth'
import ErrorBoundary from '@/components/ErrorBoundary'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://suvigya.com'),
  title: {
    default: 'SUVIGYA CONSULTING - Natural Resources Management & Policy',
    template: '%s | Suvigya Consulting',
  },
  description:
    'Expert consulting in GIS, natural resources management, policy generation, and grassroots actions. Working with KFW, UN, ADB, WB and more.',
  keywords: [
    'consulting',
    'GIS',
    'natural resources',
    'policy',
    'environment',
    'KFW',
    'UN',
    'ADB',
    'World Bank',
    'sustainability',
  ],
  authors: [{ name: 'Suvigya Consulting' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://suvigya.com',
    siteName: 'Suvigya Consulting',
    title: 'SUVIGYA CONSULTING - Natural Resources Management & Policy',
    description:
      'Expert consulting in GIS, natural resources management, policy generation, and grassroots actions.',
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
    title: 'SUVIGYA CONSULTING - Natural Resources Management & Policy',
    description:
      'Expert consulting in GIS, natural resources management, policy generation, and grassroots actions.',
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
  themeColor: '#4A7C59',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-sage-600 focus:text-white focus:rounded-md focus:outline-none"
        >
          Skip to main content
        </a>
        <AccessibilityProvider>
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
      </body>
    </html>
  )
}
