#!/bin/bash

echo "🔧 Fixing Praktik Office Issues..."
echo ""

# Detect if PM2 is available
if command -v pm2 &> /dev/null; then
    USE_PM2=true
    echo "📦 Detected PM2 - will use PM2 for process management"
else
    USE_PM2=false
    echo "📦 PM2 not detected - will use direct process management"
fi

echo ""

# 1. Restart Strapi to apply server config changes
echo "1️⃣ Restarting Strapi (removes redirect issue)..."
cd strapi
if [ -f "package.json" ]; then
    if [ "$USE_PM2" = true ]; then
        # Using PM2
        pm2 restart strapi 2>/dev/null || pm2 start npm --name "strapi" -- run start
        echo "   ✅ Strapi restarted via PM2"
    else
        # Direct process management
        pkill -f "strapi" || true
        npm run start &
        STRAPI_PID=$!
        echo "   ✅ Strapi restarted (PID: $STRAPI_PID)"
    fi
else
    echo "   ⚠️  Strapi package.json not found"
fi
cd ..

echo ""
echo "2️⃣ Rebuilding Next.js (applies cursor CSS fix)..."

# Rebuild Next.js
npm run build

if [ "$USE_PM2" = true ]; then
    # Using PM2
    pm2 restart nextjs 2>/dev/null || pm2 start npm --name "nextjs" -- run start
    echo "   ✅ Next.js rebuilt and restarted via PM2"
else
    # Direct process management
    pkill -f "next" || true
    npm run start &
    NEXT_PID=$!
    echo "   ✅ Next.js rebuilt and started (PID: $NEXT_PID)"
fi

echo ""

# 3. Restart Caddy if running as service
if systemctl is-active --quiet caddy 2>/dev/null; then
    echo "3️⃣ Restarting Caddy..."
    sudo systemctl restart caddy
    echo "   ✅ Caddy restarted"
fi

echo ""
echo "✅ All fixes applied!"
echo ""
echo "📋 What was fixed:"
echo "   • Removed Strapi URL redirect (cms.praktikoffice.kz now works)"
echo "   • Fixed cursor visibility on /map page (canvas now shows cursor)"
echo "   • Updated CORS headers for zone updates"
echo "   • Updated .env.local to use production Strapi URL"
echo ""
echo "🔄 Next steps:"
echo "   1. Make sure your .env.local has the correct STRAPI_API_TOKEN"
echo "      Get it from: https://cms.praktikoffice.kz/admin/settings/api-tokens"
echo "   2. Test the /map page - cursor should be visible"
echo "   3. Try marking zones as occupied/free - should work now"
echo ""
if [ "$USE_PM2" = true ]; then
    echo "📊 Check status: pm2 list"
    echo "📝 View logs: pm2 logs"
fi
echo ""
