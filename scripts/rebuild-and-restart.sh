#!/bin/bash

echo "🔄 Rebuilding and Restarting Next.js..."
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Stop PM2 first
echo "0. Stopping PM2 process..."
pm2 stop nextjs
echo -e "${GREEN}✅ Stopped${NC}"
echo ""

# Clear Next.js cache and build artifacts
echo "1. Clearing Next.js cache and build artifacts..."
rm -rf .next
rm -rf .next/cache
rm -rf tsconfig.tsbuildinfo
echo -e "${GREEN}✅ Cache cleared${NC}"
echo ""

# Rebuild Next.js
echo "2. Building Next.js..."
pnpm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    pm2 start nextjs
    exit 1
fi
echo ""

# Restart with PM2
echo "3. Starting Next.js with PM2..."
pm2 restart nextjs
echo -e "${GREEN}✅ Next.js restarted${NC}"
echo ""

# Wait for server to start
echo "⏳ Waiting for server to start..."
sleep 3
echo ""

# Show status
echo "4. Checking status..."
pm2 list
echo ""

echo "================================"
echo -e "${GREEN}✅ Done!${NC}"
echo ""
echo "IMPORTANT: Clear your browser cache or do a hard refresh!"
echo "  - Chrome/Firefox: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)"
echo "  - Safari: Cmd+Option+R"
echo ""
echo "Test your website:"
echo "  http://localhost:3000/ru/offices"
echo ""
echo "Check logs:"
echo "  pm2 logs nextjs --lines 50"
