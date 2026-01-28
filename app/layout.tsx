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
  title: 'SUVIGYA CONSULTING - Natural Resources Management & Policy',
  description: 'Expert consulting in GIS, natural resources management, policy generation, and grassroots actions. Working with KFW, UN, ADB, WB and more.',
  keywords: 'consulting, GIS, natural resources, policy, KFW, UN, ADB, World Bank',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AccessibilityProvider>
          <MotionProvider>
            <ErrorBoundary componentName="OrganicPlantGrowth" fallback={null}>
              <OrganicPlantGrowth />
            </ErrorBoundary>
            <Navigation />
            <KeyboardNavigation />
            <main className="relative">
              {children}
            </main>
          </MotionProvider>
        </AccessibilityProvider>
      </body>
    </html>
  )
}
