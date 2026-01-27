# 🌱 Organic Plant Growth System - Implementation Guide

## Overview

The organic plant growth animation system has been fully implemented using GSAP ScrollTrigger and SVG path animation. The plant grows organically as users scroll through the page, with branching nodes, leaves, and smooth organic curves.

## Architecture

### Core Components

1. **`components/OrganicPlantGrowth.tsx`**
   - Main component implementing the scroll-driven plant growth
   - Uses SVG paths with `stroke-dasharray` and `stroke-dashoffset` for smooth animation
   - GSAP ScrollTrigger for scroll synchronization
   - Fully accessible with reduced motion support

2. **`lib/plantGrowthConfig.ts`**
   - TypeScript interfaces for configuration
   - Default configuration values
   - Branch point definitions

### Key Features

✅ **Organic Growth Animation**
- Smooth scroll-driven growth using SVG path animation
- Non-linear easing (`power2.out`) for biological feel
- Reversible when scrolling up

✅ **Branching System**
- Configurable branch points at scroll milestones
- Branches grow after stem reaches their position
- Organic curved branch paths

✅ **Leaf Reveals**
- Leaves appear at section milestones
- Additional leaves on branches
- Scale animation (0.8 → 1.0) with fade-in
- Slight delay after stem reaches position

✅ **Accessibility**
- Respects `prefers-reduced-motion`
- Static fallback option
- Mobile detection (hidden below breakpoint)
- Screen reader friendly (`aria-hidden`)

✅ **Performance**
- GPU-accelerated transforms
- Efficient ScrollTrigger scrubbing
- ResizeObserver for dimension updates
- No layout thrashing

## Configuration API

### Basic Usage

```tsx
import OrganicPlantGrowth from '@/components/OrganicPlantGrowth'

// Use default configuration
<OrganicPlantGrowth />
```

### Custom Configuration

```tsx
import OrganicPlantGrowth from '@/components/OrganicPlantGrowth'
import { PlantGrowthConfig } from '@/lib/plantGrowthConfig'

const customConfig: Partial<PlantGrowthConfig> = {
  stemColor: 'rgba(74, 122, 98, 0.7)',
  strokeWidthRange: [1.5, 2.5],
  leafRevealDelay: 0.02,
  growthEase: 'power2.out',
  position: 'left',
  offsetX: 24,
  zIndex: 10,
  enableBranches: true,
  branchPoints: [
    {
      scrollProgress: 0.14,
      angle: 15,
      length: 30,
      leafCount: 1,
      leafDelay: 0.01,
    },
    // ... more branches
  ],
}

<OrganicPlantGrowth config={customConfig} />
```

### Configuration Options

#### Visual Properties
- `stemColor`: Main stem color (string, CSS color)
- `branchColor`: Branch color (optional, defaults to stemColor)
- `leafColor`: Leaf color (optional, defaults to stemColor)
- `strokeWidthRange`: `[min, max]` for organic stroke variation

#### Animation Properties
- `growthEase`: GSAP easing string (e.g., `"power2.out"`, `"sine.inOut"`)
- `leafRevealDelay`: Delay in scroll progress (0-1) after stem reaches point
- `scrollStart`: Scroll position to start growth (pixels)
- `scrollEnd`: Scroll position to end growth (pixels)

#### Layout Properties
- `position`: `'left' | 'right' | 'free'` - Fixed side or free-flow
- `offsetX`: Horizontal offset for fixed positioning (pixels)
- `zIndex`: CSS z-index value

#### Branching Properties
- `enableBranches`: Boolean to enable/disable branches
- `branchPoints`: Array of branch definitions
  - `scrollProgress`: When branch appears (0-1)
  - `angle`: Branch angle in degrees (0 = right, 90 = down, -90 = up)
  - `length`: Branch length in pixels
  - `leafCount`: Number of leaves on branch
  - `leafDelay`: Delay before leaves appear

#### Performance
- `mobileBreakpoint`: Hide below this width (default: 1024px)
- `reducedMotionFallback`: `'static' | 'none'` - Fallback for reduced motion

## Section Milestones

The component accepts custom section milestones:

```tsx
const milestones = [
  { id: 'home', label: 'Home', progress: 0 },
  { id: 'about', label: 'About', progress: 0.14 },
  { id: 'services', label: 'Services', progress: 0.28 },
  // ... more milestones
]

<OrganicPlantGrowth sectionMilestones={milestones} />
```

## Technical Details

### SVG Path Animation

The plant uses SVG paths with `stroke-dasharray` and `stroke-dashoffset` for smooth growth:

```typescript
// Initial state: path fully drawn but invisible
strokeDasharray: pathLength
strokeDashoffset: pathLength

// As user scrolls, offset decreases revealing the path
strokeDashoffset: pathLength * (1 - progress)
```

### Organic Curves

The main stem uses a cubic Bezier curve with slight random variations:

```typescript
M startX 0 
C midX1 height*0.25, 
  midX2 height*0.75, 
  endX height
```

Branches use quadratic Bezier curves for organic feel.

### ScrollTrigger Setup

```typescript
ScrollTrigger.create({
  trigger: 'body',
  start: 'top top',
  end: 'bottom bottom',
  scrub: true, // Smooth scrubbing
  onUpdate: (self) => {
    // Update path offset based on scroll progress
  },
})
```

## Migration from BeanStalkAnimation

The new `OrganicPlantGrowth` component has replaced `BeanStalkAnimation` in `app/layout.tsx`. The old component is still available in the codebase for reference.

### Key Differences

1. **Animation Library**: GSAP ScrollTrigger instead of Framer Motion
2. **Path Animation**: SVG stroke-dasharray instead of height-based div
3. **Organic Curves**: Curved paths instead of straight lines
4. **Branching**: Configurable branch system
5. **Performance**: More efficient scroll handling

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (hidden below breakpoint)

## Performance Considerations

1. **ScrollTrigger**: Uses `scrub: true` for smooth, performant scrolling
2. **GPU Acceleration**: All transforms use `will-change: transform`
3. **Resize Handling**: ResizeObserver for efficient dimension updates
4. **Memory Management**: Proper cleanup of ScrollTrigger instances

## Troubleshooting

### Plant Not Growing
- Check that GSAP ScrollTrigger is available
- Verify scroll position is changing
- Check browser console for errors

### Leaves Not Appearing
- Verify section milestones are correct
- Check `leafRevealDelay` configuration
- Ensure scroll progress reaches milestone values

### Performance Issues
- Reduce number of branches/leaves
- Increase `mobileBreakpoint` to hide on more devices
- Check for other heavy animations on page

## Next Steps

The system is ready for further customization:

1. **Custom Growth Curves**: Modify `generateStemPath` for different shapes
2. **More Branch Types**: Add different branch styles
3. **Interactive Elements**: Add hover effects or click interactions
4. **Data-Driven**: Connect to content sections dynamically

---

**Status**: ✅ **FULLY IMPLEMENTED AND INTEGRATED**

The organic plant growth system is production-ready and integrated into the application.
