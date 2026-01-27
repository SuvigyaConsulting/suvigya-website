# 🚀 Quick Start Guide - Share & Run

## For You (Developer)

### Build the Website:
```bash
npm run build
```

### Start the Server:
```bash
npm run serve
```
Or simply double-click `START.bat` (Windows)

The website will open at **http://localhost:3000**

---

## For Sharing with Others

### Method 1: Share Everything (Easiest)
1. **Zip the entire folder** including:
   - `out` folder (built website)
   - `node_modules` folder (dependencies)
   - `serve.js` (server script)
   - `START.bat` (Windows launcher)
   - `package.json`

2. **Recipient:**
   - Extract the zip
   - Double-click `START.bat` (Windows) or run `node serve.js` (Mac/Linux)
   - Website opens automatically!

### Method 2: Share Only Built Files (Smaller)
1. **Zip only:**
   - `out` folder
   - `serve.js` file
   - `START.bat` (optional, for Windows)

2. **Recipient needs:**
   - Node.js installed (from nodejs.org)
   - Run: `node serve.js`

---

## Files Included for Sharing

- ✅ `out/` - The built website (static files)
- ✅ `serve.js` - Simple Node.js server
- ✅ `START.bat` - Windows launcher (double-click to start)
- ✅ `BUILD_AND_START.bat` - Builds and starts (if needed)

---

## Requirements

- **Node.js** must be installed
- Download from: https://nodejs.org/
- Any modern web browser

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "out folder not found" | Run `npm run build` first |
| "Node.js not found" | Install Node.js from nodejs.org |
| Port 3000 busy | Edit `serve.js`, change `PORT = 3000` to another number |
| Website won't load | Make sure you built it: `npm run build` |

---

## What Gets Built?

When you run `npm run build`, Next.js creates:
- Static HTML files
- Optimized JavaScript bundles
- CSS files
- All assets

Everything is in the `out/` folder and can be served by any web server!

---

## Alternative: Use Any Web Server

The `out/` folder contains static files. You can also:
- Upload to any web hosting
- Use Python: `python -m http.server 3000` (in `out` folder)
- Use PHP: `php -S localhost:3000` (in `out` folder)
- Use any static file server
