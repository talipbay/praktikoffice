#!/bin/bash

# Complete rebuild script to apply all fixes

echo "🔧 Rebuilding Application with Fixes"
echo "====================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this from project root"
    exit 1
fi

echo "📦 Step 1: Rebuild Strapi"
echo "-------------------------"
cd strapi
echo "Building Strapi admin panel..."
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Strapi build successful"
else
    echo "❌ Strapi build failed"
    exit 1
fi
cd ..
echo ""

echo "📦 Step 2: Rebuild Next.js"
echo "-------------------------"
echo "Building Next.js application..."
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Next.js build successful"
else
    echo "❌ Next.js build failed"
    exit 1
fi
echo ""

echo "🔄 Step 3: Restart Services"
echo "-------------------------"
echo "Restarting Strapi..."
pm2 restart strapi
sleep 2

echo "Restarting Next.js..."
pm2 restart nextjs
sleep 2

echo "✅ Services restarted"
echo ""

echo "🔍 Step 4: Verify Services"
echo "-------------------------"
pm2 status
echo ""

echo "✅ Step 5: Test CORS Headers"
echo "-------------------------"
echo "Testing CORS from praktikoffice.kz..."
CORS_HEADER=$(curl -s -I -H "Origin: https://praktikoffice.kz" \
    http://localhost:1337/api/zones | grep -i "access-control-allow-origin")

if [ -n "$CORS_HEADER" ]; then
    echo "✅ CORS headers present:"
    echo "$CORS_HEADER"
else
    echo "⚠️  CORS headers not found"
    echo "   This might cause issues loading zones"
fi
echo ""

echo "✅ Step 6: Test API"
echo "-------------------------"
# Load token from .env.local
if [ -f .env.local ]; then
    TOKEN=$(grep NEXT_PUBLIC_STRAPI_API_TOKEN .env.local | cut -d= -f2)
    
    ZONE_COUNT=$(curl -s -H "Authorization: Bearer $TOKEN" \
        http://localhost:1337/api/zones | jq '.data | length' 2>/dev/null)
    
    if [ -n "$ZONE_COUNT" ]; then
        echo "✅ API working - Found $ZONE_COUNT zones"
    else
        echo "⚠️  Could not fetch zones"
    fi
fi
echo ""

echo "====================================="
echo "✅ Rebuild Complete!"
echo "====================================="
echo ""
echo "📋 Next Steps:"
echo "1. Open: https://praktikoffice.kz/en/map"
echo "2. Press: Ctrl + Shift + R (hard refresh)"
echo "3. Zones should now be visible"
echo ""
echo "🔍 If zones still don't appear:"
echo "1. Check Strapi permissions:"
echo "   https://cms.praktikoffice.kz/admin"
echo "   Settings → Roles → Public → Zone"
echo "   Enable: find, findOne, create, update"
echo ""
echo "2. Check browser console (F12) for errors"
echo ""
echo "3. Run debug script:"
echo "   bash scripts/debug-zone-loading.sh"
echo ""
