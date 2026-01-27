# How to Share and Run the Website

## Option 1: Simple Launcher (Recommended)

### For Windows:
1. Double-click `START.bat` - This will start the server and open your browser automatically

### For Mac/Linux:
1. Open terminal in this folder
2. Run: `node serve.js`
3. Open http://localhost:3000 in your browser

## Option 2: Build and Start
1. Double-click `BUILD_AND_START.bat` (Windows) or run `npm run build && node serve.js` (Mac/Linux)
2. This will build the site and start the server

## Option 3: Share the Entire Folder

To share with others:
1. **Zip the entire folder** (including `node_modules` and `out` folder)
2. Recipient should:
   - Extract the zip file
   - Double-click `START.bat` (Windows) or run `node serve.js` (Mac/Linux)
   - The website will open automatically

## Option 4: Static Files Only (Smaller Share)

If you want to share only the built files (smaller size):
1. Zip only the `out` folder and `serve.js` file
2. Recipient needs Node.js installed
3. Extract and run: `node serve.js`

## Requirements

- **Node.js** must be installed (download from https://nodejs.org/)
- For sharing: Recipients also need Node.js installed

## Port

The server runs on **port 3000** by default. If that port is busy, edit `serve.js` and change `PORT = 3000` to another number.

## Troubleshooting

- **"out folder not found"**: Run `npm run build` first
- **"Node.js not found"**: Install Node.js from nodejs.org
- **Port already in use**: Change the PORT in serve.js or close the program using port 3000
