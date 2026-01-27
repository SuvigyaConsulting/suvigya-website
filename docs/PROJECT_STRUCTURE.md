# Project Structure

## Overview
This document describes the organized structure of the SuvigyaWeb-Light project.

## Directory Structure

```
SuvigyaWeb-Light/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── ...
│
├── components/             # Reusable React components
│   ├── sections/          # Page sections
│   └── ...
│
├── features/              # Feature modules
│   └── plant-growth/      # Plant growth animation feature
│       ├── OrganicPlantGrowth.tsx
│       ├── plantGrowthConfig.ts
│       ├── *.md          # Feature documentation
│       └── verify-plant-growth-sync.js
│
├── docs/                  # Project documentation
│   ├── README.md
│   ├── FEATURES.md
│   ├── SETUP.md
│   └── ...
│
├── demos/                 # Demo files
│   ├── plant-demo.html
│   ├── plant-demo-fullscreen.html
│   └── OPEN_*.bat
│
├── scripts/               # Utility scripts
│   ├── batch/            # Batch files
│   │   ├── BUILD_AND_START.bat
│   │   └── ...
│   └── verify-plant-growth-sync.js
│
├── lib/                   # Shared utilities
├── hooks/                 # React hooks
├── store/                 # State management
└── ...
```

## Feature Organization

### Plant Growth Feature
Located in `features/plant-growth/`:
- **Component**: `OrganicPlantGrowth.tsx` - Main component
- **Config**: `plantGrowthConfig.ts` - Configuration interface
- **Docs**: All plant growth related documentation
- **Scripts**: Verification and testing scripts

## Documentation

All documentation is organized in `docs/`:
- Main README
- Feature documentation
- Setup guides
- Implementation details

## Demos

Standalone demo files are in `demos/`:
- HTML demo files
- Demo launcher scripts

## Scripts

Utility scripts organized in `scripts/`:
- Batch files for Windows
- Verification scripts
- Build scripts
