#!/bin/bash

# Debug script to check why zones aren't loading on /map page

echo "🔍 Debugging Zone Loading Issue"
echo "================================"
echo ""

# Load environment variables
if [ -f .env.local ]; then
    source .env.local
fi

echo "1️⃣ Checking Environment Variables"
echo "-----------------------------------"
echo "NEXT_PUBLIC_STRAPI_URL: $NEXT_PUBLIC_STRAPI_URL"
echo "NEXT_PUBLIC_STRAPI_API_TOKEN: ${NEXT_PUBLIC_STRAPI_API_TOKEN:0:20}..."
echo ""

echo "2️⃣ Testing Strapi Connection"
echo "-----------------------------------"

# Test localhost connection
echo "Testing localhost:1337..."
if curl -s http://localhost:1337/api/zones > /dev/null 2>&1; then
    echo "✅ Localhost connection works"
else
    echo "❌ Localhost connection failed"
fi

# Test public URL
echo "Testing $NEXT_PUBLIC_STRAPI_URL..."
if curl -s $NEXT_PUBLIC_STRAPI_URL/api/zones > /dev/null 2>&1; then
    echo "✅ Public URL connection works"
else
    echo "❌ Public URL connection failed"
fi
echo ""

echo "3️⃣ Checking Zones in Strapi"
echo "-----------------------------------"
ZONE_COUNT=$(curl -s -H "Authorization: Bearer $NEXT_PUBLIC_STRAPI_API_TOKEN" \
    http://localhost:1337/api/zones | jq '.data | length' 2>/dev/null)

if [ -n "$ZONE_COUNT" ]; then
    echo "✅ Found $ZONE_COUNT zones in Strapi"
else
    echo "❌ Could not fetch zones (check API token)"
fi
echo ""

echo "4️⃣ Testing API with Token"
echo "-----------------------------------"
echo "Testing GET /api/zones..."
RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" \
    -H "Authorization: Bearer $NEXT_PUBLIC_STRAPI_API_TOKEN" \
    http://localhost:1337/api/zones)

HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE:" | cut -d: -f2)
echo "HTTP Status: $HTTP_CODE"

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ API is accessible with token"
elif [ "$HTTP_CODE" = "403" ]; then
    echo "❌ Permission denied - Check Strapi permissions"
    echo "   Go to: Settings → Roles → Public → Zone"
    echo "   Enable: find, findOne, create, update"
elif [ "$HTTP_CODE" = "401" ]; then
    echo "❌ Authentication failed - Invalid token"
else
    echo "❌ Unexpected status code: $HTTP_CODE"
fi
echo ""

echo "5️⃣ Testing CORS from Browser Perspective"
echo "-----------------------------------"
echo "Testing if CORS headers are present..."
CORS_HEADERS=$(curl -s -I -H "Origin: https://praktikoffice.kz" \
    $NEXT_PUBLIC_STRAPI_URL/api/zones | grep -i "access-control")

if [ -n "$CORS_HEADERS" ]; then
    echo "✅ CORS headers found:"
    echo "$CORS_HEADERS"
else
    echo "⚠️  No CORS headers found"
    echo "   This might cause issues in browser"
fi
echo ""

echo "6️⃣ Checking Strapi Permissions"
echo "-----------------------------------"
echo "To verify permissions manually:"
echo "1. Open: https://cms.praktikoffice.kz/admin"
echo "2. Go to: Settings → Roles → Public"
echo "3. Find 'Zone' section"
echo "4. Ensure these are checked:"
echo "   ✓ find"
echo "   ✓ findOne"
echo "   ✓ create"
echo "   ✓ update"
echo "   ✓ delete (optional)"
echo ""

echo "7️⃣ Browser Console Test"
echo "-----------------------------------"
echo "Open browser console on /map page and run:"
echo ""
echo "fetch('$NEXT_PUBLIC_STRAPI_URL/api/zones', {"
echo "  headers: {"
echo "    'Authorization': 'Bearer $NEXT_PUBLIC_STRAPI_API_TOKEN'"
echo "  }"
echo "}).then(r => r.json()).then(d => console.log('Zones:', d.data.length))"
echo ""

echo "8️⃣ Quick Fixes"
echo "-----------------------------------"
echo "If zones still don't load, try:"
echo ""
echo "A. Restart Strapi:"
echo "   pm2 restart strapi"
echo ""
echo "B. Rebuild Next.js:"
echo "   npm run build"
echo "   pm2 restart nextjs"
echo ""
echo "C. Check browser console for errors:"
echo "   Open /map page → F12 → Console tab"
echo ""
echo "D. Verify Strapi is running:"
echo "   pm2 logs strapi"
echo ""

echo "================================"
echo "Debug complete!"
