#!/bin/bash

echo "🔧 Fixing 401 Unauthorized Error"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${YELLOW}The 401 error means Strapi API is not accessible.${NC}"
echo "You need to either:"
echo "  1. Make the API public (recommended for now)"
echo "  2. Generate an API token"
echo ""

echo -e "${BLUE}Testing Strapi API...${NC}"

# Test without auth
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:1337/api/offices?populate=*)

if [ "$RESPONSE" = "200" ]; then
    echo -e "${GREEN}✅ API is already public and working!${NC}"
    echo ""
    echo "Now just rebuild:"
    echo "  ./scripts/fix-cache-issue.sh"
    exit 0
elif [ "$RESPONSE" = "401" ]; then
    echo -e "${RED}❌ API returned 401 (Unauthorized)${NC}"
    echo ""
    echo -e "${YELLOW}You need to make the API public in Strapi admin:${NC}"
    echo ""
    echo "1. Go to: http://localhost:1337/admin"
    echo "2. Click 'Settings' → 'Users & Permissions Plugin' → 'Roles'"
    echo "3. Click 'Public' role"
    echo "4. Find 'Office', 'Meeting-room', 'Coworking-tariff'"
    echo "5. Check 'find' and 'findOne' for each"
    echo "6. Click 'Save'"
    echo ""
    echo "Then run: ./scripts/fix-cache-issue.sh"
    echo ""
    echo -e "${BLUE}See detailed instructions:${NC}"
    echo "  cat scripts/setup-strapi-token.md"
    exit 1
elif [ "$RESPONSE" = "403" ]; then
    echo -e "${RED}❌ API returned 403 (Forbidden)${NC}"
    echo "Same fix as 401 - make API public in Strapi admin"
    exit 1
elif [ "$RESPONSE" = "000" ]; then
    echo -e "${RED}❌ Cannot connect to Strapi${NC}"
    echo ""
    echo "Is Strapi running?"
    pm2 list | grep strapi
    echo ""
    echo "Start Strapi with: pm2 start strapi"
    exit 1
else
    echo -e "${YELLOW}⚠️  Unexpected response: $RESPONSE${NC}"
    echo "Check Strapi logs: pm2 logs strapi"
    exit 1
fi
