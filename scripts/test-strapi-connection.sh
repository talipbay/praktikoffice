#!/bin/bash

echo "🔍 Testing Strapi Connection..."
echo "================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test Strapi health
echo "1. Testing Strapi health..."
if curl -s http://localhost:1337/_health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Strapi is running${NC}"
else
    echo -e "${RED}❌ Strapi is not running${NC}"
    echo "Start Strapi with: pm2 start ecosystem.config.js"
    exit 1
fi
echo ""

# Test offices API
echo "2. Testing Offices API..."
OFFICES=$(curl -s "http://localhost:1337/api/offices?populate=*&locale=ru")
if echo "$OFFICES" | grep -q '"data"'; then
    COUNT=$(echo "$OFFICES" | jq '.data | length' 2>/dev/null || echo "0")
    if [ "$COUNT" -gt 0 ]; then
        echo -e "${GREEN}✅ Offices API working - Found $COUNT offices${NC}"
    else
        echo -e "${YELLOW}⚠️  Offices API working but no data found${NC}"
        echo "Add offices in Strapi admin panel"
    fi
else
    echo -e "${RED}❌ Offices API not working${NC}"
    echo "Check API permissions in Strapi admin"
fi
echo ""

# Test meeting rooms API
echo "3. Testing Meeting Rooms API..."
ROOMS=$(curl -s "http://localhost:1337/api/meeting-rooms?populate=*&locale=ru")
if echo "$ROOMS" | grep -q '"data"'; then
    COUNT=$(echo "$ROOMS" | jq '.data | length' 2>/dev/null || echo "0")
    if [ "$COUNT" -gt 0 ]; then
        echo -e "${GREEN}✅ Meeting Rooms API working - Found $COUNT rooms${NC}"
    else
        echo -e "${YELLOW}⚠️  Meeting Rooms API working but no data found${NC}"
        echo "Add meeting rooms in Strapi admin panel"
    fi
else
    echo -e "${RED}❌ Meeting Rooms API not working${NC}"
    echo "Check API permissions in Strapi admin"
fi
echo ""

# Test coworking API
echo "4. Testing Coworking Tariffs API..."
TARIFFS=$(curl -s "http://localhost:1337/api/coworking-tariffs?populate=*&locale=ru")
if echo "$TARIFFS" | grep -q '"data"'; then
    COUNT=$(echo "$TARIFFS" | jq '.data | length' 2>/dev/null || echo "0")
    if [ "$COUNT" -gt 0 ]; then
        echo -e "${GREEN}✅ Coworking Tariffs API working - Found $COUNT tariffs${NC}"
    else
        echo -e "${YELLOW}⚠️  Coworking Tariffs API working but no data found${NC}"
        echo "Add coworking tariffs in Strapi admin panel"
    fi
else
    echo -e "${RED}❌ Coworking Tariffs API not working${NC}"
    echo "Check API permissions in Strapi admin"
fi
echo ""

# Check environment variable
echo "5. Checking Next.js environment..."
if [ -f ".env.local" ]; then
    if grep -q "NEXT_PUBLIC_STRAPI_URL" .env.local; then
        STRAPI_URL=$(grep "NEXT_PUBLIC_STRAPI_URL" .env.local | cut -d'=' -f2)
        echo -e "${GREEN}✅ NEXT_PUBLIC_STRAPI_URL is set: $STRAPI_URL${NC}"
    else
        echo -e "${RED}❌ NEXT_PUBLIC_STRAPI_URL not found in .env.local${NC}"
        echo "Add: NEXT_PUBLIC_STRAPI_URL=http://localhost:1337"
    fi
else
    echo -e "${RED}❌ .env.local file not found${NC}"
    echo "Create .env.local and add: NEXT_PUBLIC_STRAPI_URL=http://localhost:1337"
fi
echo ""

echo "================================"
echo "Test complete!"
echo ""
echo "Next steps:"
echo "1. If APIs are working but no data: Add content in Strapi admin"
echo "2. If APIs not working: Check permissions in Strapi (Settings → Roles → Public)"
echo "3. Rebuild Next.js: rm -rf .next && npm run build"
echo "4. Test pages: http://localhost:3000/ru/offices"
