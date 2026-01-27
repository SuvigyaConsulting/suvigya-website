# Setup Guide - SUVIGYA CONSULTING Website

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
SuvigyaWeb/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page
│   ├── globals.css        # Global styles
│   ├── footer.tsx         # Footer component
│   └── not-found.tsx      # 404 page
├── components/            # React components
│   ├── sections/          # Page sections
│   │   ├── HeroSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── ServicesSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   ├── PartnersSection.tsx
│   │   ├── ImpactSection.tsx
│   │   └── ContactSection.tsx
│   ├── CustomCursor.tsx   # Custom cursor component
│   ├── Navigation.tsx     # Navigation bar
│   ├── ScrollProgress.tsx # Scroll progress indicator
│   ├── MagneticButton.tsx # Magnetic button effect
│   ├── KineticText.tsx    # Kinetic typography
│   ├── AccessibilityControls.tsx
│   └── ...
├── store/                 # State management
│   └── personalization.ts # User personalization store
├── hooks/                 # Custom React hooks
│   └── useKeyboardNavigation.ts
└── lib/                   # Utility functions
    └── utils.ts
```

## Key Features

### 1. Custom Cursor
- Magnetic effect on interactive elements
- Smooth spring animations
- Context-aware scaling

### 2. Three.js Scene
- Interactive 3D sphere in hero section
- Animated materials and lighting
- Scroll-driven opacity

### 3. Scroll Animations
- Parallax effects
- Scroll-driven storytelling
- Intersection observer animations

### 4. Personalization
- Behavior tracking
- Contextual CTAs
- Session memory

### 5. Accessibility
- Reduced motion support
- High contrast mode
- Keyboard navigation
- Screen reader optimized

## Customization

### Colors
Edit `tailwind.config.js` to change the color scheme:
```javascript
colors: {
  primary: { ... },
  earth: { ... },
}
```

### Content
Update section components in `components/sections/` to modify content.

### Animations
Adjust animation timings in component files or `tailwind.config.js`.

## Performance Tips

1. **Images**: Use Next.js Image component for optimized images
2. **Three.js**: Scene is optimized with limited geometry
3. **Animations**: Respects `prefers-reduced-motion`
4. **Code Splitting**: Uses React Suspense for lazy loading

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Three.js not loading
- Ensure WebGL is supported in your browser
- Check browser console for errors

### Animations not working
- Check if reduced motion is enabled
- Verify Framer Motion is installed

### Build errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project in Vercel
3. Deploy automatically

### Other Platforms
```bash
npm run build
# Deploy the .next folder
```

## Environment Variables

Currently no environment variables required. Add to `.env.local` if needed:
```
NEXT_PUBLIC_API_URL=...
```

## License

Private - SUVIGYA CONSULTING
