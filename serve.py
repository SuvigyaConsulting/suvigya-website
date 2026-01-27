#!/usr/bin/env python3
"""
Simple HTTP server for serving the static website
Works with Python 3 (comes pre-installed on Mac/Linux)
"""

import http.server
import socketserver
import webbrowser
import os
import sys
from pathlib import Path

PORT = 3000
OUT_DIR = Path(__file__).parent / 'out'

if not OUT_DIR.exists():
    print("❌ Error: 'out' directory not found!")
    print("   Please run: npm run build")
    sys.exit(1)

os.chdir(OUT_DIR)

Handler = http.server.SimpleHTTPRequestHandler

try:
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        url = f"http://localhost:{PORT}"
        print(f"\n🚀 Server running at {url}")
        print(f"📁 Serving files from: {OUT_DIR}")
        print(f"\n✨ Opening {url} in your browser...")
        print(f"\nPress Ctrl+C to stop the server\n")
        
        # Open browser automatically
        webbrowser.open(url)
        
        # Start serving
        httpd.serve_forever()
except KeyboardInterrupt:
    print("\n\n👋 Server stopped. Goodbye!")
    sys.exit(0)
except OSError as e:
    if e.errno == 48:  # Address already in use
        print(f"\n❌ Error: Port {PORT} is already in use!")
        print(f"   Please close the program using port {PORT} or change PORT in serve.py")
    else:
        print(f"\n❌ Error: {e}")
    sys.exit(1)
