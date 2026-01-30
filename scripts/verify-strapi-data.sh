#!/bin/bash

echo "🔍 Verifying Strapi Data Structure..."
echo "======================================"
echo ""

STRAPI_URL="http://localhost:1337"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if Strapi is running
echo "1. Checking if Strapi is running..."
if curl -s "${STRAPI_URL}/api" > /dev/null; then
    echo -e "${GREEN}✅ Strapi is running${NC}"
else
    echo -e "${RED}❌ Strapi is not running or not accessible${NC}"
    echo "Start Strapi with: pm2 start strapi"
    exit 1
fi
echo ""

# Check offices endpoint
echo "2. Checking offices data..."
OFFICES_RESPONSE=$(curl -s "${STRAPI_URL}/api/offices?populate=*")
OFFICES_COUNT=$(echo $OFFICES_RESPONSE | jq '.data | length' 2>/dev/null || echo "0")

if [ "$OFFICES_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅ Found $OFFICES_COUNT office(s)${NC}"
    echo ""
    echo "First office structure:"
    echo $OFFICES_RESPONSE | jq '.data[0]' 2>/dev/null || echo $OFFICES_RESPONSE
else
    echo -e "${RED}❌ No offices found${NC}"
    echo "Response:"
    echo $OFFICES_RESPONSE | jq '.' 2>/dev/null || echo $OFFICES_RESPONSE
fi
echo ""

# Check meeting rooms endpoint
echo "3. Checking meeting rooms data..."
ROOMS_RESPONSE=$(curl -s "${STRAPI_URL}/api/meeting-rooms?populate=*")
ROOMS_COUNT=$(echo $ROOMS_RESPONSE | jq '.data | length' 2>/dev/null || echo "0")

if [ "$ROOMS_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅ Found $ROOMS_COUNT meeting room(s)${NC}"
else
    echo -e "${YELLOW}⚠️  No meeting rooms found${NC}"
fi
echo ""

# Check coworking tariffs endpoint
echo "4. Checking coworking tariffs data..."
TARIFFS_RESPONSE=$(curl -s "${STRAPI_URL}/api/coworking-tariffs?populate=*")
TARIFFS_COUNT=$(echo $TARIFFS_RESPONSE | jq '.data | length' 2>/dev/null || echo "0")

if [ "$TARIFFS_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅ Found $TARIFFS_COUNT coworking tariff(s)${NC}"
else
    echo -e "${YELLOW}⚠️  No coworking tariffs found${NC}"
fi
echo ""

echo "======================================"
echo ""
echo "Summary:"
echo "  Offices: $OFFICES_COUNT"
echo "  Meeting Rooms: $ROOMS_COUNT"
echo "  Coworking Tariffs: $TARIFFS_COUNT"
echo ""

if [ "$OFFICES_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅ Strapi has data!${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Run: ./scripts/rebuild-and-restart.sh"
    echo "  2. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)"
    echo "  3. Visit: http://localhost:3000/ru/offices"
else
    echo -e "${YELLOW}⚠️  Add content in Strapi admin panel first${NC}"
    echo "  Visit: http://localhost:1337/admin"
fi
