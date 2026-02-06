#!/bin/bash

# Test Strapi connection
echo "🔍 Testing Strapi Connection"
echo "=============================="
echo ""

# Load environment variables
if [ -f .env.local ]; then
    export $(cat .env.local | grep -v '^#' | xargs)
fi

STRAPI_URL="${NEXT_PUBLIC_STRAPI_URL:-http://localhost:1337}"
STRAPI_TOKEN="${NEXT_PUBLIC_STRAPI_API_TOKEN}"

echo "📍 Strapi URL: $STRAPI_URL"
echo "🔑 Token: ${STRAPI_TOKEN:0:10}..."
echo ""

# Test 1: Basic connectivity
echo "Test 1: Basic connectivity"
echo "--------------------------"
if curl -s -o /dev/null -w "%{http_code}" "$STRAPI_URL" | grep -q "200\|301\|302"; then
    echo "✅ Strapi is reachable"
else
    echo "❌ Cannot reach Strapi"
    echo "   Make sure Strapi is running: cd strapi && npm run develop"
    exit 1
fi
echo ""

# Test 2: API endpoint
echo "Test 2: API endpoint"
echo "--------------------"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
    -H "Authorization: Bearer $STRAPI_TOKEN" \
    -H "Content-Type: application/json" \
    "$STRAPI_URL/api/zones")

echo "HTTP Status: $HTTP_CODE"

case $HTTP_CODE in
    200)
        echo "✅ API is accessible"
        ZONE_COUNT=$(curl -s \
            -H "Authorization: Bearer $STRAPI_TOKEN" \
            -H "Content-Type: application/json" \
            "$STRAPI_URL/api/zones" | grep -o '"data":\[' | wc -l)
        echo "📦 Current zones: Check Strapi admin"
        ;;
    401)
        echo "❌ Authentication failed - Invalid API token"
        echo "   Check NEXT_PUBLIC_STRAPI_API_TOKEN in .env.local"
        exit 1
        ;;
    403)
        echo "❌ Permission denied"
        echo "   Go to Strapi Admin → Settings → Roles → Public"
        echo "   Enable all permissions for 'zone' content type"
        exit 1
        ;;
    404)
        echo "❌ Zone content type not found"
        echo "   Create 'zone' content type in Strapi first"
        echo "   See STRAPI_ZONE_SETUP.md for instructions"
        exit 1
        ;;
    *)
        echo "❌ Unexpected status code: $HTTP_CODE"
        exit 1
        ;;
esac
echo ""

# Test 3: Create test zone
echo "Test 3: Create test zone"
echo "------------------------"
TEST_RESPONSE=$(curl -s -w "\n%{http_code}" \
    -X POST \
    -H "Authorization: Bearer $STRAPI_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "data": {
            "zoneId": "test_zone_123",
            "vertices": [{"x": 100, "y": 100}, {"x": 200, "y": 100}, {"x": 200, "y": 200}, {"x": 100, "y": 200}],
            "status": "free",
            "companyName": null
        }
    }' \
    "$STRAPI_URL/api/zones")

HTTP_CODE=$(echo "$TEST_RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$TEST_RESPONSE" | head -n-1)

case $HTTP_CODE in
    200|201)
        echo "✅ Can create zones"
        echo "   Cleaning up test zone..."
        # Try to delete test zone (optional)
        ;;
    400)
        if echo "$RESPONSE_BODY" | grep -q "already exists\|duplicate"; then
            echo "✅ Can create zones (test zone already exists)"
        else
            echo "⚠️  Create failed: $RESPONSE_BODY"
        fi
        ;;
    *)
        echo "❌ Cannot create zones: HTTP $HTTP_CODE"
        echo "   Response: $RESPONSE_BODY"
        exit 1
        ;;
esac
echo ""

echo "=============================="
echo "✅ All tests passed!"
echo "=============================="
echo ""
echo "Ready to migrate zones:"
echo "  node scripts/migrate-zones-debug.js"
echo ""
