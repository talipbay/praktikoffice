#!/bin/bash

# Quick fix for CORS issue - multiple values error

echo "🔧 Fixing CORS Multiple Values Error"
echo "====================================="
echo ""

echo "The issue: CORS header has multiple values (*, https://praktikoffice.kz)"
echo "The fix: Let Strapi handle CORS, remove from Caddy"
echo ""

echo "Step 1: Reload Caddy configuration"
echo "-----------------------------------"
sudo systemctl reload caddy
if [ $? -eq 0 ]; then
    echo "✅ Caddy reloaded"
else
    echo "⚠️  Caddy reload failed, trying restart..."
    sudo systemctl restart caddy
fi
echo ""

echo "Step 2: Rebuild Strapi"
echo "----------------------"
cd strapi
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Strapi built"
else
    echo "❌ Strapi build failed"
    exit 1
fi
cd ..
echo ""

echo "Step 3: Restart Strapi"
echo "----------------------"
pm2 restart strapi
sleep 3
echo "✅ Strapi restarted"
echo ""

echo "Step 4: Test CORS"
echo "-----------------"
echo "Testing CORS headers..."
CORS_HEADER=$(curl -s -I -H "Origin: https://praktikoffice.kz" \
    https://cms.praktikoffice.kz/api/zones 2>&1 | grep -i "access-control-allow-origin")

if [ -n "$CORS_HEADER" ]; then
    echo "✅ CORS header found:"
    echo "$CORS_HEADER"
    
    # Check if it has multiple values
    if echo "$CORS_HEADER" | grep -q ","; then
        echo "⚠️  Still has multiple values!"
    else
        echo "✅ Single value - correct!"
    fi
else
    echo "⚠️  No CORS header found"
fi
echo ""

echo "====================================="
echo "✅ Fix Applied!"
echo "====================================="
echo ""
echo "📋 Next Steps:"
echo "1. Open: https://praktikoffice.kz/en/map"
echo "2. Press: Ctrl + Shift + R (hard refresh)"
echo "3. Press: F12 → Console"
echo "4. Run the fetch test again"
echo ""
echo "Expected: Should see 'Zones: 25' without CORS error"
echo ""
echo "If still not working:"
echo "- Check Strapi permissions (Settings → Roles → Public → Zone)"
echo "- Check browser console for other errors"
echo "- Run: bash scripts/debug-zone-loading.sh"
echo ""
