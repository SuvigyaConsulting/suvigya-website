# 🌱 How to Run the Plant Growth Animation

## Quick Start

### Option 1: Development Mode (Recommended for Testing)

This gives you hot-reloading and the best development experience:

```bash
npm run dev
```

Then open: **http://localhost:3000**

The plant growth animation will appear on the left side of the page as you scroll!

---

### Option 2: Production Build

Build and run the production version:

```bash
# Build the project
npm run build

# Start the production server
npm start
```

Then open: **http://localhost:3000**

---

### Option 3: Using Batch Files (Windows)

If you're on Windows, you can use the existing batch files:

**For Development:**
- Just run: `npm run dev`

**For Production:**
- Double-click: `START.bat` (if you've already built)
- Or: `BUILD_AND_START.bat` (builds then starts)

---

## What to Expect

1. **Open the website** in your browser (http://localhost:3000)

2. **Scroll down the page** - you'll see:
   - A green plant stem growing from top to bottom on the left side
   - Organic curved path (not straight!)
   - Branches appearing at section milestones
   - Leaves fading in and scaling up as you scroll
   - Smooth, organic growth animation

3. **Scroll back up** - the plant will reverse smoothly

4. **On mobile/small screens** - the plant is hidden (desktop-only feature)

---

## Troubleshooting

### Plant Not Appearing?

1. **Check browser console** for errors (F12 → Console tab)
2. **Verify GSAP is installed**: `npm list gsap`
3. **Check if you're on desktop** - plant is hidden on screens < 1024px
4. **Try hard refresh**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### Animation Not Smooth?

1. **Check browser performance** - try a different browser
2. **Disable browser extensions** that might interfere
3. **Check reduced motion settings** - the plant respects `prefers-reduced-motion`

### Build Errors?

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## Customizing the Animation

The plant growth is fully configurable! See `PLANT_GROWTH_IMPLEMENTATION.md` for details.

Quick example - edit `app/layout.tsx`:

```tsx
<OrganicPlantGrowth 
  config={{
    stemColor: 'rgba(139, 195, 74, 0.8)', // Change color
    growthEase: 'sine.inOut', // Change easing
    enableBranches: true, // Toggle branches
  }} 
/>
```

---

## Development Tips

- **Hot Reload**: Changes to the component will auto-reload
- **Browser DevTools**: Use to inspect SVG paths and animations
- **ScrollTrigger**: Check GSAP ScrollTrigger panel (if installed) for debugging
- **Performance**: Check browser Performance tab to monitor FPS

---

## Requirements

- ✅ Node.js (v18+ recommended)
- ✅ npm or yarn
- ✅ Modern browser (Chrome, Firefox, Safari, Edge)

---

**Ready to see it grow?** Run `npm run dev` and start scrolling! 🌿
