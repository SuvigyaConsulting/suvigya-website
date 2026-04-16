#!/bin/bash
# Clean start script — kills old server, clears cache, starts fresh
pkill -9 -f "next dev" 2>/dev/null
sleep 1
rm -rf .next
echo "Starting dev server..."
npx next dev -p 3000
