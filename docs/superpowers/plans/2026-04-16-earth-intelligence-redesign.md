# Earth Intelligence Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild suvigya.com as a cinematic, premium website with hybrid light/dark theme, topographic line art, horizontal scroll services, and butter-smooth 120fps animations.

**Architecture:** Single GSAP ScrollTrigger animation pipeline with Lenis smooth scroll. Hybrid light/dark sections (dark for hero/projects/impact/footer, light for about/services/partners/contact). All scroll animations GPU-composited (transform + opacity only). Framer Motion only for hover/tap micro-interactions.

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS 3.4, GSAP 3.14 + ScrollTrigger, Lenis (smooth scroll), custom text splitting.

**Spec:** `docs/superpowers/specs/2026-04-16-earth-intelligence-redesign.md`

---

## Phase 1: Foundation (Tasks 1-4)

### Task 1: Install dependencies & clean up old components

**Files:**
- Modify: `package.json`
- Delete: `components/hero/ParallaxMountains.tsx`, `components/hero/FloatingElements.tsx`, `components/hero/index.ts`, `features/plant-growth/OrganicPlantGrowth.tsx`, `features/plant-growth/plantGrowthConfig.ts`, `components/LoadingScreen.tsx`, `components/CustomCursor.tsx`, `components/MagneticButton.tsx`, `components/BeanStalkAnimation.tsx`, `components/KineticText.tsx`, `components/PinnedSection.tsx`, `components/ParallaxSection.tsx`, `components/ScrollReveal.tsx`, `components/DataVisualization.tsx`, `components/MotionProvider.tsx`
- Modify: `app/layout.tsx` — remove OrganicPlantGrowth + MotionProvider imports

- [ ] **Step 1: Install Lenis smooth scroll**

```bash
npm install lenis
```

- [ ] **Step 2: Delete old components that are being replaced**

Delete all files listed above. These are replaced by the new GSAP-based system.

```bash
rm -f components/hero/ParallaxMountains.tsx components/hero/FloatingElements.tsx components/hero/index.ts
rm -rf features/plant-growth
rm -f components/LoadingScreen.tsx components/CustomCursor.tsx components/MagneticButton.tsx
rm -f components/BeanStalkAnimation.tsx components/KineticText.tsx components/PinnedSection.tsx
rm -f components/ParallaxSection.tsx components/ScrollReveal.tsx components/DataVisualization.tsx
rm -f components/MotionProvider.tsx components/SkeletonLoader.tsx
```

- [ ] **Step 3: Clean layout.tsx — remove deleted component imports**

Modify `app/layout.tsx`:
- Remove `import MotionProvider` and its `<MotionProvider>` wrapper
- Remove `import OrganicPlantGrowth` and its `<ErrorBoundary><OrganicPlantGrowth /></ErrorBoundary>`
- Keep: `AccessibilityProvider`, `Navigation`, `KeyboardNavigation`, `ErrorBoundary`

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "chore: remove old animation components, install lenis"
```

---

### Task 2: New design system — globals.css + tailwind.config.js

**Files:**
- Rewrite: `app/globals.css`
- Rewrite: `tailwind.config.js`

- [ ] **Step 1: Rewrite globals.css with new design tokens**

Replace entire file. New design system with:
- CSS custom properties for all colors (dark palette + light section overrides)
- Typography scale (hero, section, subsection, body, label, stat)
- Dark section class `.section-dark` and light section class `.section-light`
- Glass morphism for dark: `.glass-dark` with `rgba(255,255,255,0.03)` bg + subtle border
- Glass morphism for light: `.glass-light` with `rgba(255,255,255,0.7)` bg
- Gradient text utilities: `.gradient-text-teal`, `.gradient-text-gold`
- Button styles: `.btn-gold` (gold gradient), `.btn-outline` (teal outline on dark)
- Input styles for dark forms: transparent bg, bottom-border, teal focus
- Accessibility: focus-visible (teal), reduced-motion, high-contrast
- Smooth scroll via Lenis (html { scroll-behavior: auto } — Lenis handles it)
- No `background-attachment: fixed`
- Custom scrollbar: dark with teal thumb

Key color tokens:
```css
:root {
  --bg-primary: #080d1a;
  --bg-secondary: #0f1629;
  --bg-elevated: #141c33;
  --bg-light: #f8fafb;
  --bg-light-warm: #faf9f7;
  --text-primary: #f0f2f5;
  --text-secondary: #8892a8;
  --text-muted: #4a5568;
  --text-dark-heading: #0a1628;
  --text-dark-body: #374151;
  --accent-teal: #14b8a6;
  --accent-gold: #c9a84c;
  --topo-line: rgba(20, 184, 166, 0.08);
  --topo-line-active: rgba(20, 184, 166, 0.25);
  --border-subtle: rgba(255, 255, 255, 0.06);
  --border-light: rgba(10, 22, 40, 0.08);
}
```

- [ ] **Step 2: Rewrite tailwind.config.js with new design tokens**

Extend Tailwind with custom colors matching the CSS tokens, typography sizes, spacing, border-radius, box-shadows (glow effects), z-index scale, and keyframe animations (fade-in, slide-up, pulse-line).

- [ ] **Step 3: Verify build compiles**

```bash
npx next build 2>&1 | tail -10
```

- [ ] **Step 4: Commit**

```bash
git add app/globals.css tailwind.config.js && git commit -m "feat: new Earth Intelligence design system"
```

---

### Task 3: ScrollContainer + Lenis smooth scroll wrapper

**Files:**
- Create: `components/layout/ScrollContainer.tsx`
- Modify: `app/layout.tsx` — wrap content with ScrollContainer
- Modify: `app/page.tsx` — add ScrollTrigger-compatible structure

- [ ] **Step 1: Create ScrollContainer.tsx**

Create `components/layout/ScrollContainer.tsx`:
- Initialize Lenis with `smoothWheel: true`, `lerp: 0.08` (subtle smoothing, not sluggish)
- Connect Lenis to GSAP's ScrollTrigger via `ScrollTrigger.scrollerProxy` or the Lenis-GSAP integration pattern
- Register GSAP ScrollTrigger plugin
- Set `gsap.defaults({ force3D: true })`
- Respect `prefers-reduced-motion` — disable Lenis smoothing if reduced motion
- Clean up on unmount
- Wrap children in `<div id="smooth-wrapper"><div id="smooth-content">{children}</div></div>` structure required by ScrollTrigger

Key implementation pattern:
```typescript
'use client'
import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ScrollContainer({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    const lenis = new Lenis({
      smoothWheel: !prefersReduced,
      lerp: 0.08,
    })
    lenisRef.current = lenis

    // Connect Lenis to GSAP ticker
    gsap.ticker.add((time) => { lenis.raf(time * 1000) })
    gsap.ticker.lagSmoothing(0) // Disable GSAP lag smoothing for consistent 120fps

    // Connect Lenis scroll to ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(lenis.raf)
    }
  }, [])

  return <div id="smooth-content">{children}</div>
}
```

- [ ] **Step 2: Update layout.tsx to use ScrollContainer**

Wrap `<main>` content with `<ScrollContainer>`:
```tsx
<ScrollContainer>
  <Navigation />
  <main id="main-content" className="relative">
    {children}
  </main>
</ScrollContainer>
```

Remove `KeyboardNavigation` component import (will be re-added later if needed).

- [ ] **Step 3: Update page.tsx — clean slate**

Rewrite `app/page.tsx` as a clean server component shell (remove `'use client'` directive). Remove all old dynamic imports, loading screen, scroll progress, personalization store. Keep it as a simple container that renders sections:

```tsx
import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
// ... etc
export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      {/* more sections added in later tasks */}
    </>
  )
}
```

- [ ] **Step 4: Verify the app loads with smooth scroll**

```bash
npx next dev -p 3000
```
Visit http://localhost:3000 — should see a blank dark page with smooth scroll behavior.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add Lenis smooth scroll + GSAP ScrollTrigger foundation"
```

---

### Task 4: Shared components — TopographicLines, TextReveal, StatCounter

**Files:**
- Create: `components/shared/TopographicLines.tsx`
- Create: `components/shared/TextReveal.tsx`
- Create: `components/shared/StatCounter.tsx`
- Create: `components/shared/SectionHeader.tsx`

- [ ] **Step 1: Create TopographicLines.tsx**

SVG component that renders 3-5 flowing contour lines. Props:
- `variant`: `'hero' | 'subtle' | 'rings'` — different line patterns
- `color`: CSS color string (defaults to `--topo-line`)
- `animate`: boolean — whether to animate strokeDashoffset on mount
- `className`: for positioning

The SVG paths should be hand-crafted organic curves (not random), using quadratic/cubic bezier paths that flow horizontally across the viewport. Each line has `strokeDasharray` and `strokeDashoffset` for draw-on animation.

For the `'rings'` variant, render concentric circles (used behind impact numbers).

- [ ] **Step 2: Create TextReveal.tsx**

GSAP-powered text reveal component. Splits text into individual characters wrapped in `<span>` elements, then animates each character from `opacity: 0, y: 40, filter: blur(4px)` to `opacity: 1, y: 0, filter: blur(0)` with stagger.

Props:
- `children`: string text
- `as`: HTML element tag (default `'h1'`)
- `className`: string
- `delay`: number (seconds)
- `stagger`: number (default 0.03)
- `trigger`: 'load' | 'scroll' (default 'scroll')

Uses GSAP ScrollTrigger when `trigger='scroll'`, or plain gsap.from when `trigger='load'`.

Implementation: Use `useRef` + `useEffect` + `useLayoutEffect`. Split text by wrapping each character in a `<span style="display: inline-block">`. Then create GSAP `from` tween targeting the spans.

- [ ] **Step 3: Create StatCounter.tsx**

GSAP-powered number counter. Animates from 0 to target value using GSAP's snap and ScrollTrigger.

Props:
- `value`: number
- `suffix`: string ('+', 'M+', 'K+')
- `duration`: number (default 2)
- `className`: string

Uses a `ref` on a `<span>`, GSAP `to` tween with `snap: { innerText: 1 }` pattern for smooth counting. Triggered by ScrollTrigger `onEnter`.

- [ ] **Step 4: Create SectionHeader.tsx**

Reusable section header with overline + headline + optional subtitle. Handles the consistent pattern used across all sections.

Props:
- `overline`: string
- `headline`: ReactNode (allows inline `<span>` for colored words)
- `subtitle?`: string
- `align`: 'center' | 'left' (default 'center')
- `dark`: boolean (switches text colors for dark/light sections)

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add shared components — TopographicLines, TextReveal, StatCounter, SectionHeader"
```

---

## Phase 2: Sections (Tasks 5-12)

> **These tasks can be executed in parallel by subagents** since each section is independent.

### Task 5: Navigation (dark theme)

**Files:**
- Rewrite: `components/Navigation.tsx` → move to `components/layout/Navigation.tsx`

Completely rewrite Navigation:
- Dark transparent on load, `--bg-primary` + `backdrop-filter: blur(12px)` after 50px scroll
- Logo: "SUVIGYA" in white, font-weight 700, letter-spacing 0.08em
- Nav links: `--text-secondary` default, white on hover, teal underline on active (animated width via CSS transition)
- Scroll detection: use a single `IntersectionObserver` for active section (NO scroll listener, NO Framer Motion useScroll)
- Background change: CSS class toggle via `IntersectionObserver` on hero section
- Mobile hamburger: full-screen dark overlay with large centered links, animated open/close
- Focus trap on mobile menu (keep existing logic)
- All nav click handlers: use `lenis.scrollTo('#section-id')` for smooth navigation

- [ ] Steps: Rewrite file, verify nav works, commit.

### Task 6: ScrollProgress (teal, 1px)

**Files:**
- Rewrite: `components/shared/ScrollProgress.tsx`

Minimal scroll progress bar:
- Fixed top, 1px height, teal color
- Width driven by GSAP ScrollTrigger (scaleX from 0 to 1, transformOrigin left)
- Single ScrollTrigger instance on the body
- NO React state, NO Zustand updates, NO Framer Motion

- [ ] Steps: Rewrite file, verify, commit.

### Task 7: HeroSection (dark, cinematic)

**Files:**
- Rewrite: `components/sections/HeroSection.tsx`

Full viewport dark section:
- Background: `--bg-primary` with TopographicLines (variant='hero', animated)
- Faint radial teal glow behind headline (CSS radial-gradient, no animation)
- Overline: "NATURAL RESOURCE MANAGEMENT CONSULTANCY" — TextReveal with trigger='load', delay 0.5
- Headline: "SHAPING TOMORROW'S EARTH" — TextReveal with trigger='load', delay 1.0, large clamp size
- Subtitle text — fades up via GSAP, delay 2.5
- Scroll indicator: thin vertical line (CSS animation, infinite pulse-down)
- ScrollTrigger: content fades out + scales to 0.95 as user scrolls past 50vh

- [ ] Steps: Write component, wire into page.tsx, test in browser, commit.

### Task 8: AboutSection (light, editorial)

**Files:**
- Rewrite: `components/sections/AboutSection.tsx`

Light section with split layout:
- Background: `--bg-light` (warm white)
- Left column: SectionHeader (overline "OUR JOURNEY", headline with "Impact" in teal), body paragraphs, teal horizontal rule
- Right column: 2x2 stat grid with StatCounter components
- Text colors: `--text-dark-heading`, `--text-dark-body`
- ScrollTrigger: elements stagger in from bottom on scroll enter
- Stat cards: subtle border, hover brightness increase

- [ ] Steps: Write component, wire into page.tsx, test, commit.

### Task 9: ServicesSection (horizontal scroll — the signature section)

**Files:**
- Rewrite: `components/sections/ServicesSection.tsx`

This is the most complex section — the horizontal scroll:
- Light/cream background (`--bg-light-warm`)
- GSAP ScrollTrigger `pin: true` on the section container
- Horizontal `x` translation of a flex container holding 9 panels
- Each panel: 100vw wide, with service number (01-09), title (large), description, detail list
- Right side of each panel: unique topographic SVG pattern per service
- Thin progress bar at top of section showing horizontal scroll position
- Mobile: stacks vertically (no horizontal scroll), uses standard card layout
- Detail list items animate in with stagger as each panel becomes active

Keep the same 9 services data from the existing `ServicesSection.tsx`.

- [ ] Steps: Write component with horizontal scroll logic, wire into page.tsx, test desktop + mobile, commit.

### Task 10: ProjectsSection (dark, full-bleed cards)

**Files:**
- Rewrite: `components/sections/ProjectsSection.tsx`

Dark section with scroll-driven project cards:
- Background: `--bg-secondary`
- Each project occupies ~100vh of scroll distance (pinned)
- GSAP ScrollTrigger pins the section, cycles through 8 projects
- Current project: full card with client badge, title, region, description, tags on left; massive impact value on right with concentric topo rings
- Transition: current card fades/shifts up, next fades in from below
- Counter "01 / 08" in top corner updates on card change
- Project data: keep existing 8 projects from current `ProjectsSection.tsx`

- [ ] Steps: Write component, wire into page.tsx, test card transitions, commit.

### Task 11: PartnersSection (light, clean grid)

**Files:**
- Rewrite: `components/sections/PartnersSection.tsx`

Light section, simple:
- Background: `--bg-light`
- SectionHeader with "Clients" in teal
- 4-column logo grid (2 on mobile)
- Logos: `filter: grayscale(100%) brightness(0.4)` on dark sections, or just standard display on light
- Hover: brightness increase
- ScrollTrigger: logos stagger in
- Keep existing partner data

- [ ] Steps: Write component, wire into page.tsx, test, commit.

### Task 12: ImpactSection (dark, full-viewport stats — the climax)

**Files:**
- Rewrite: `components/sections/ImpactSection.tsx`

Dark section, 4 full-viewport metric reveals:
- Background: `--bg-primary`
- Each metric pinned for ~100vh of scroll
- Massive centered number (StatCounter, huge size, gradient text)
- Concentric TopographicLines (variant='rings') pulsing behind each number
- Below number: metric label + description
- Color alternation: teal / gold / teal / gold
- ScrollTrigger: each metric fades in from below, holds, fades up

- [ ] Steps: Write component, wire into page.tsx, test scroll-through, commit.

### Task 13: ContactSection (light, clean form)

**Files:**
- Rewrite: `components/sections/ContactSection.tsx`

Light section with centered form:
- Background: `--bg-light-warm`
- SectionHeader with "What's Next" in gold
- Form card with light glass morphism
- Fields: Name, Email, Organization, Message
- Styling: clean borders, teal focus states
- Submit: gold gradient button
- Keep existing Web3Forms integration (env var)
- Contact info below form
- ScrollTrigger: form card fades in from below

- [ ] Steps: Write component, wire into page.tsx, test form submission, commit.

### Task 14: Footer (dark, minimal)

**Files:**
- Rewrite: `components/Footer.tsx` → move to `components/layout/Footer.tsx`

Dark minimal footer:
- Background: `--bg-primary`
- TopographicLines (callback to hero)
- "SUVIGYA" wordmark centered, large, white
- "INSPIRING SOLUTIONS" subtitle below
- Copyright text
- Wire into page.tsx

- [ ] Steps: Write component, wire into page.tsx, commit.

---

## Phase 3: Assembly & Polish (Tasks 15-17)

### Task 15: Wire all sections into page.tsx + layout.tsx

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1:** Import and render all sections in order in page.tsx
- [ ] **Step 2:** Update layout.tsx with new Navigation + ScrollContainer + Footer
- [ ] **Step 3:** Remove any remaining imports of deleted components
- [ ] **Step 4:** Full build test: `npx next build`
- [ ] **Step 5:** Commit

### Task 16: Responsive + accessibility pass

**Files:**
- Modify: Multiple section files

- [ ] **Step 1:** Test all sections at mobile (375px), tablet (768px), desktop (1440px)
- [ ] **Step 2:** Services section: verify it stacks vertically on mobile (no horizontal scroll)
- [ ] **Step 3:** Impact section: verify numbers scale down gracefully on mobile
- [ ] **Step 4:** Verify `prefers-reduced-motion` — all content visible, no scroll triggers
- [ ] **Step 5:** Test keyboard navigation through all sections
- [ ] **Step 6:** Verify WCAG AA contrast on both dark and light sections
- [ ] **Step 7:** Commit

### Task 17: Performance audit + final polish

**Files:**
- Possibly modify: Multiple files

- [ ] **Step 1:** Run Lighthouse audit, check performance score
- [ ] **Step 2:** Verify no layout shifts (CLS), no scroll jank
- [ ] **Step 3:** Check that only ONE scroll system is active (GSAP + Lenis, nothing else)
- [ ] **Step 4:** Verify all old component files are deleted, no dead imports
- [ ] **Step 5:** Test smooth scroll on rapid up/down (the original complaint)
- [ ] **Step 6:** Final commit

---

## Execution Notes

**Parallel execution:** Tasks 5-14 (all sections) are independent and can be dispatched to subagents simultaneously. Tasks 1-4 must complete first (foundation). Tasks 15-17 must run after all sections are built.

**Key dependencies:**
- `lenis` npm package (Task 1)
- `gsap` + `gsap/ScrollTrigger` (already installed)
- Shared components from Task 4 are used by Tasks 7-14

**Hybrid light/dark section map:**
| Section | Theme | Background |
|---------|-------|-----------|
| Hero | Dark | `--bg-primary` |
| About | Light | `--bg-light` |
| Services | Light | `--bg-light-warm` |
| Projects | Dark | `--bg-secondary` |
| Partners | Light | `--bg-light` |
| Impact | Dark | `--bg-primary` |
| Contact | Light | `--bg-light-warm` |
| Footer | Dark | `--bg-primary` |
