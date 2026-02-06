#!/bin/bash

echo "🔍 Checking Praktik Office Configuration..."
echo ""

# Check if Strapi is running
echo "1️⃣ Checking Strapi status..."
if curl -s http://localhost:1337/_health > /dev/null 2>&1; then
    echo "   ✅ Strapi is running on localhost:1337"
else
    echo "   ❌ Strapi is NOT running"
    echo "      Run: cd strapi && npm run develop"
fi

echo ""

# Check if Next.js is running
echo "2️⃣ Checking Next.js status..."
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "   ✅ Next.js is running on localhost:3000"
else
    echo "   ❌ Next.js is NOT running"
    echo "      Run: npm run dev (or npm run build && npm run start)"
fi

echo ""

# Check .env.local configuration
echo "3️⃣ Checking .env.local configuration..."
if [ -f ".env.local" ]; then
    STRAPI_URL=$(grep "NEXT_PUBLIC_STRAPI_URL" .env.local | cut -d '=' -f2)
    STRAPI_TOKEN=$(grep "NEXT_PUBLIC_STRAPI_API_TOKEN" .env.local | cut -d '=' -f2)
    
    echo "   STRAPI_URL: $STRAPI_URL"
    
    if [ "$STRAPI_TOKEN" = "your_token_here" ]; then
        echo "   ⚠️  STRAPI_API_TOKEN: Not configured (still using placeholder)"
        echo "      Get your token from: https://cms.praktikoffice.kz/admin/settings/api-tokens"
    else
        echo "   ✅ STRAPI_API_TOKEN: Configured"
    fi
else
    echo "   ❌ .env.local not found"
fi

echo ""

# Check Strapi server config
echo "4️⃣ Checking Strapi server config..."
if grep -q "// url:" strapi/config/server.ts; then
    echo "   ✅ Strapi URL redirect is disabled (commented out)"
else
    if grep -q "url:" strapi/config/server.ts; then
        echo "   ⚠️  Strapi URL redirect is ENABLED"
        echo "      This will cause cms.praktikoffice.kz to redirect to localhost"
    else
        echo "   ✅ Strapi URL config not found (good)"
    fi
fi

echo ""

# Check cursor CSS
echo "5️⃣ Checking cursor CSS fix..."
if grep -q ":not(canvas)" src/app/globals.css; then
    echo "   ✅ Cursor CSS excludes canvas (cursor will be visible)"
else
    echo "   ⚠️  Cursor CSS might hide cursor on canvas"
fi

echo ""

# Check CORS config
echo "6️⃣ Checking CORS configuration..."
if grep -q "methods:" strapi/config/middlewares.ts; then
    echo "   ✅ CORS methods configured"
else
    echo "   ⚠️  CORS methods might be missing"
fi

echo ""
echo "✅ Configuration check complete!"
echo ""
echo "📋 Quick commands:"
echo "   Start Strapi:  cd strapi && npm run develop"
echo "   Start Next.js: npm run dev"
echo "   Apply fixes:   ./FIX_ISSUES.sh"
echo ""
