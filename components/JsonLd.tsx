'use client'

import { useEffect } from 'react'

// Injects schema.org structured data as <script type="application/ld+json">.
// Uses textContent (not innerHTML) so the JSON is written as raw, unparsed
// text — XSS-safe and avoids React's text-escaping mangling the JSON.
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  useEffect(() => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(data)
    document.head.appendChild(script)
    return () => {
      document.head.removeChild(script)
    }
  }, [data])

  return null
}
