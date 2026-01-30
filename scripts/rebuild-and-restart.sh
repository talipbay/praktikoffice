#!/bin/bash

echo "🔄 Rebuilding and Restarting Next.js..."
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Clear Next.js cache
echo "1. Clearing Next.js cache..."
rm -rf .next
echo -e "${GREEN}✅ Cache cleared${NC}"
echo ""

# Rebuild Next.js
echo "2. Building Next.js..."
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi
echo ""

# Restart with PM2
echo "3. Restarting Next.js with PM2..."
pm2 restart nextjs
echo -e "${GREEN}✅ Next.js restarted${NC}"
echo ""

# Show status
echo "4. Checking status..."
pm2 list
echo ""

echo "================================"
echo -e "${GREEN}✅ Done!${NC}"
echo ""
echo "Test your website:"
echo "  http://localhost:3000/ru/offices"
echo ""
echo "Check logs:"
echo "  pm2 logs nextjs"
