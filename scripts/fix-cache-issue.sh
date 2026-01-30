#!/bin/bash

echo "🔧 Fixing Cache Issue - Complete Reset"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Step 1: Verify Strapi
echo -e "${BLUE}Step 1: Verifying Strapi...${NC}"
if curl -s "http://localhost:1337/api" > /dev/null; then
    echo -e "${GREEN}✅ Strapi is running${NC}"
    
    # Check for data
    OFFICES_COUNT=$(curl -s "http://localhost:1337/api/offices?populate=*" | jq '.data | length' 2>/dev/null || echo "0")
    if [ "$OFFICES_COUNT" -gt 0 ]; then
        echo -e "${GREEN}✅ Found $OFFICES_COUNT office(s) in Strapi${NC}"
    else
        echo -e "${RED}❌ No offices found in Strapi!${NC}"
        echo "Please add content in Strapi admin first: http://localhost:1337/admin"
        exit 1
    fi
else
    echo -e "${RED}❌ Strapi is not running!${NC}"
    echo "Start Strapi with: pm2 start strapi"
    exit 1
fi
echo ""

# Step 2: Stop Next.js
echo -e "${BLUE}Step 2: Stopping Next.js...${NC}"
pm2 stop nextjs
echo -e "${GREEN}✅ Stopped${NC}"
echo ""

# Step 3: Clear all caches
echo -e "${BLUE}Step 3: Clearing all caches...${NC}"
rm -rf .next
rm -rf .next/cache
rm -rf tsconfig.tsbuildinfo
rm -rf node_modules/.cache
echo -e "${GREEN}✅ All caches cleared${NC}"
echo ""

# Step 4: Rebuild
echo -e "${BLUE}Step 4: Building Next.js...${NC}"
pnpm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${RED}❌ Build failed!${NC}"
    pm2 start nextjs
    exit 1
fi
echo ""

# Step 5: Restart
echo -e "${BLUE}Step 5: Starting Next.js...${NC}"
pm2 restart nextjs
echo -e "${GREEN}✅ Started${NC}"
echo ""

# Step 6: Wait and verify
echo -e "${BLUE}Step 6: Waiting for server...${NC}"
sleep 5
echo ""

# Step 7: Check logs
echo -e "${BLUE}Step 7: Checking logs...${NC}"
pm2 logs nextjs --lines 20 --nostream
echo ""

# Final status
echo "========================================"
echo -e "${GREEN}✅ Complete!${NC}"
echo ""
echo -e "${YELLOW}IMPORTANT: Clear your browser cache!${NC}"
echo "  Chrome/Firefox: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)"
echo "  Safari: Cmd+Option+R"
echo ""
echo "Or open in incognito/private mode"
echo ""
echo "Test your site:"
echo "  http://localhost:3000/ru/offices"
echo ""
echo "Monitor logs:"
echo "  pm2 logs nextjs"
