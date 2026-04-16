# Suvigya Website Redesign: "Earth Intelligence"

## Overview

Complete UI overhaul of suvigya.com from a playful nature-themed template to a cinematic, dark, premium experience that conveys the authority and sophistication of a consultancy working with World Bank, ADB, GCF, GIZ on $100M+ projects.

**Art Direction:** Cinematic immersion. Dark theme. Topographic contour lines as visual DNA. Typography as architecture. The website IS a piece of art.

**Performance Target:** 120fps butter-smooth scrolling. Single GSAP animation pipeline (ScrollSmoother + ScrollTrigger). No competing animation systems.

---

## Design System

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#080d1a` | Main dark background |
| `--bg-secondary` | `#0f1629` | Section variation, cards |
| `--bg-elevated` | `#141c33` | Elevated surfaces, hover states |
| `--text-primary` | `#f0f2f5` | Headings, primary text |
| `--text-secondary` | `#8892a8` | Body text, descriptions |
| `--text-muted` | `#4a5568` | Tertiary text, labels |
| `--accent-teal` | `#14b8a6` | Impact data, active states, links |
| `--accent-teal-glow` | `rgba(20, 184, 166, 0.15)` | Glow effects behind accent elements |
| `--accent-gold` | `#c9a84c` | Warmth accents, project values, CTAs |
| `--accent-gold-glow` | `rgba(201, 168, 76, 0.12)` | Glow behind gold elements |
| `--topo-line` | `rgba(20, 184, 166, 0.08)` | Topographic contour lines (subtle) |
| `--topo-line-active` | `rgba(20, 184, 166, 0.25)` | Animated/active topo lines |
| `--border-subtle` | `rgba(255, 255, 255, 0.06)` | Card borders, dividers |

### Typography

- **Font:** Inter (already loaded) — variable weight
- **Hero headline:** `clamp(3.5rem, 10vw, 9rem)`, weight 800, letter-spacing -0.03em, line-height 0.95
- **Section headline:** `clamp(2.5rem, 6vw, 5rem)`, weight 700, letter-spacing -0.02em
- **Subsection:** `clamp(1.25rem, 3vw, 2rem)`, weight 600
- **Body:** 1.125rem, weight 400, line-height 1.7, color `--text-secondary`
- **Label/Overline:** 0.75rem, weight 600, letter-spacing 0.15em, uppercase, color `--accent-teal`
- **Stat number:** `clamp(4rem, 12vw, 10rem)`, weight 800, gradient (teal to gold)

### Spacing & Layout

- Container max-width: 1400px
- Section padding: min 100vh per section (full viewport)
- Content max-width within sections: 1100px for text, full-bleed for visuals
- Generous whitespace — let content breathe in the dark

### Animation Principles

- **Single pipeline:** GSAP ScrollSmoother (smoothing: 1.5) + ScrollTrigger only
- **No Framer Motion for scroll effects** — Framer Motion only for micro-interactions (hover, press)
- **GPU-composited only:** transform, opacity. Never animate width, height, top, left, margin, padding
- **Custom easing:** cinematicSmooth `power2.inOut` for most transitions, `expo.out` for text reveals
- **Stagger timing:** 0.03-0.05s per character for text reveals, 0.1s per element for lists

---

## Section Specifications

### 1. Hero Section (100vh)

**Layout:** Full viewport, centered content, fixed position background

**Background:**
- Pure `--bg-primary` base
- Animated SVG topographic contour lines that trace across the screen (3-4 flowing lines, each animating strokeDashoffset on load over 3-4 seconds, staggered)
- Lines use `--topo-line-active` color, very subtle
- A single radial gradient glow (teal, very faint) pulsing slowly behind the headline

**Content (centered):**
- Overline label: "NATURAL RESOURCE MANAGEMENT CONSULTANCY" — fades in first (0.5s delay)
- Main headline: "SHAPING TOMORROW'S EARTH" — each character reveals via SplitText with blur-to-sharp + Y-offset animation, staggered at 0.03s per char (total ~1.5s)
- Subtitle: "Innovative solutions for natural resource management, strategic policy, and sustainable development" — fades up (1s delay after headline)
- Scroll indicator: A thin vertical line (1px, 40px tall) at bottom center that pulses downward with opacity animation, infinite loop

**Scroll behavior:** Content fades out + scales down slightly (0.95) as user scrolls past 50vh

### 2. About Section (100vh)

**Transition:** Dark to slightly lighter dark (`--bg-secondary`)

**Layout:** Split — left side text, right side stat grid

**Left content:**
- Overline: "OUR JOURNEY"
- Headline: "13 Years of Impact" — with "Impact" in `--accent-teal`
- Two paragraphs of body text that fade in staggered
- A thin horizontal rule (teal, 60px wide) between headline and body

**Right content — Stats (2x2 grid):**
- Each stat is a large number with a label below
- Numbers animate from 0 to value using GSAP countTo on scroll enter
- Number styling: `--accent-gold` gradient text, massive size
- Labels in `--text-muted`, small caps
- Stats: 13+ Years | 50+ Projects | 20+ Sectors | 2M+ Lives
- Each stat card has a subtle `--border-subtle` border and hover glow

**Scroll trigger:** Elements enter from bottom with stagger as section scrolls into view

### 3. Services Section (horizontal scroll, ~300vh scroll distance)

**The signature section — this is what makes the site feel hand-crafted.**

**Mechanism:** Vertical scroll maps to horizontal movement. User scrolls down, 9 service panels move left. Uses GSAP ScrollTrigger `pin` + horizontal `x` translation.

**Each service panel (100vw wide):**
- Left half: Large typographic label (service title) in `--text-primary`, massive size (~5rem)
- Below title: Description in `--text-secondary`
- Below description: Detail list items that fade in with stagger
- Right half: Abstract topographic contour pattern unique to each service (SVG, different line densities/patterns)
- Each panel separated by a thin vertical line divider
- Panel number in top-right corner (01, 02, ... 09) in `--text-muted`

**Progress indicator:** A thin horizontal progress bar at the top of the section showing scroll position through the 9 panels

**Background:** Fixed `--bg-primary` with very subtle topographic lines that parallax slower than the content

### 4. Projects Section (~200vh)

**Layout:** Full-bleed stacked cards, one project visible at a time

**Each project card:**
- Full viewport dark card (`--bg-secondary` with subtle gradient)
- Left side: Project narrative
  - Client badge (pill shape, `--accent-teal` border)
  - Project title in white, large
  - Region label
  - Description paragraph
  - Tag pills at bottom
- Right side: Impact value
  - Massive number in `--accent-gold` (`$415M`)
  - Impact label below in `--text-muted`
  - Subtle concentric circle pattern behind the number (like topographic elevation rings)

**Scroll behavior:** Cards cross-fade with a subtle Y-shift as user scrolls. Current card fades/shifts up, next card fades/shifts in from below. Smooth, cinematic timing (~0.6s transition).

**Counter:** "01 / 08" style counter in top corner, updates on card change

### 5. Partners Section (~50vh)

**Simple, authoritative.**

**Layout:**
- Overline: "TRUSTED BY"
- Headline: "Our Clients" — "Clients" in teal
- Logo grid (4 columns on desktop, 2 on mobile)
- Logos displayed in white/light gray (CSS filter to make them monochrome on dark bg), with subtle brightness increase on hover
- Thin `--border-subtle` grid lines between logos

**Background:** `--bg-primary`

### 6. Impact Section (~200vh, full-viewport stats)

**The climax of the scroll journey.**

**Each metric gets its own full viewport:**
- Massive number centered (`clamp(5rem, 15vw, 12rem)`)
- Number animates from 0 as it enters viewport
- Below: metric label in `--text-secondary`
- Below: one-sentence description
- Background: Concentric topographic rings that pulse outward from the number (SVG, animated strokeDashoffset triggered on enter)
- Color coding: Each metric uses a different accent — teal, gold, teal-light, gold-light

**Metrics:**
1. 2M+ People Impacted
2. 500K+ Hectares Protected
3. 50+ Communities Empowered
4. 100+ Frameworks Developed

**Scroll behavior:** Each metric fades in from below, holds for ~100vh of scroll, fades up as next enters

### 7. Contact Section (~80vh)

**Layout:** Centered, clean

**Header:**
- Overline: "START A CONVERSATION"
- Headline: "Let's Build What's Next" — "What's Next" in gold
- Subtitle line

**Form:**
- Dark card (`--bg-elevated`) with `--border-subtle` border
- Fields: Name, Email, Organization (optional), Message
- Input styling: transparent bg, bottom-border only (teal on focus), white text
- Submit button: Gold gradient bg, dark text, slight glow on hover
- No growing lotus — just a clean, confident form

**Below form:** Contact email + phone in `--text-muted`

### 8. Footer (~30vh)

**Minimal:**
- Topographic contour lines return (callback to hero, visual closure)
- "SUVIGYA" wordmark centered, large
- Copyright below
- Optional: Social links row

---

## Navigation

**Fixed top nav:**
- Transparent on load, gains `--bg-primary` + backdrop-blur on scroll
- Logo left: "SUVIGYA" in white, weight 700
- Links right: Home, About, Services, Projects, Impact, Contact
- Active link indicated by teal underline (2px, animated width)
- Mobile: Hamburger that opens full-screen dark overlay with large centered links

**Scroll progress:** 1px teal line at very top of viewport, scaleX driven by scroll position

---

## Components to Remove

- `ParallaxMountains.tsx` — replaced by topographic line SVGs
- `FloatingElements.tsx` — birds, butterflies, particles, mist all removed
- `OrganicPlantGrowth.tsx` — plant growth system removed
- `LoadingScreen.tsx` — 3-second splash screen removed (content should load fast)
- `CustomCursor.tsx` — removed (adds jank)
- `MagneticButton.tsx` — removed (gimmicky)
- `BeanStalkAnimation.tsx` — removed
- `KineticText.tsx` — replaced by GSAP SplitText
- `PinnedSection.tsx` — replaced by GSAP ScrollTrigger pin
- `ParallaxSection.tsx` — replaced by GSAP

## Components to Create

- `TopographicLines.tsx` — SVG contour line background component (reused across sections)
- `ScrollContainer.tsx` — GSAP ScrollSmoother wrapper (the single animation pipeline)
- `TextReveal.tsx` — GSAP SplitText character-reveal animation
- `StatCounter.tsx` — GSAP-powered number countup
- `HorizontalScroll.tsx` — GSAP ScrollTrigger horizontal scroll section wrapper
- `SectionTransition.tsx` — Scroll-triggered enter/exit animations

## Components to Keep (with dark theme restyling)

- `Navigation.tsx` — restyled dark
- `ScrollProgress.tsx` — restyled (teal, 1px)
- `ErrorBoundary.tsx` — keep as-is
- `AccessibilityProvider.tsx` — keep as-is
- `KeyboardNavigation.tsx` — keep as-is

---

## Technical Architecture

### Animation Pipeline

```
GSAP ScrollSmoother (wrapper)
  └── ScrollTrigger instances (one per section)
       ├── Hero: text reveal + fade out
       ├── About: staggered enter
       ├── Services: horizontal pin + translate
       ├── Projects: card cross-fade
       ├── Partners: staggered logo enter
       ├── Impact: full-viewport stat reveals
       ├── Contact: enter animation
       └── Footer: topo line trace
```

### Performance Rules

1. GSAP is the ONLY scroll animation system. No Framer Motion `useScroll`, no raw `window.addEventListener('scroll')`
2. Framer Motion used ONLY for hover/tap micro-interactions (`whileHover`, `whileTap`)
3. All scroll-driven animations use GPU-composited properties only (transform, opacity)
4. No `background-attachment: fixed`
5. No React state updates from scroll events
6. ScrollSmoother smoothing value: 1.5 (subtle, not sluggish)
7. Reduced motion: all animations instant, content visible without scroll triggers

### File Structure

```
components/
  layout/
    ScrollContainer.tsx    # GSAP ScrollSmoother wrapper
    Navigation.tsx         # Dark nav
    Footer.tsx            # Dark footer
  shared/
    TopographicLines.tsx  # Reusable topo SVG background
    TextReveal.tsx        # GSAP SplitText wrapper
    StatCounter.tsx       # Number countup
    ScrollProgress.tsx    # Teal progress bar
  sections/
    HeroSection.tsx
    AboutSection.tsx
    ServicesSection.tsx   # Horizontal scroll
    ProjectsSection.tsx
    PartnersSection.tsx
    ImpactSection.tsx
    ContactSection.tsx
```

---

## Accessibility

- All animations respect `prefers-reduced-motion` — content visible without any scroll triggers
- Dark theme meets WCAG AA contrast ratios (light text on dark bg)
- Focus visible states: teal outline (2px, 3px offset)
- Keyboard navigation preserved
- Skip to content link preserved
- ARIA labels on all sections and interactive elements
- Form inputs properly labeled
- Mobile: fully responsive, no horizontal scroll section (stacks vertically instead)

---

## What This Achieves

1. **Authority:** Dark theme + massive typography + real data = "we are serious"
2. **Sophistication:** Horizontal scroll + cinematic easing + topographic art = "this was designed by world-class people"
3. **Performance:** Single GSAP pipeline = butter-smooth 120fps
4. **Uniqueness:** The topographic line visual language is distinctive — it's not a template, it's art that represents what Suvigya actually does (understanding terrain, mapping resources, shaping landscapes)
5. **Credibility:** When World Bank, ADB, GCF logos appear on a site this beautiful, the message is clear — this is a company that delivers at the highest level
