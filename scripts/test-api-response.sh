#!/bin/bash

echo "🔍 Testing Strapi API Response..."
echo "=================================="
echo ""

# Test offices API
echo "Fetching offices from Strapi..."
echo ""

RESPONSE=$(curl -s "http://localhost:1337/api/offices?populate=*&locale=ru")

echo "Raw Response:"
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
echo ""
echo "=================================="
echo ""

# Check if data exists
if echo "$RESPONSE" | grep -q '"data"'; then
    echo "✅ Data field exists"
    
    # Count offices
    COUNT=$(echo "$RESPONSE" | jq '.data | length' 2>/dev/null || echo "0")
    echo "📊 Number of offices: $COUNT"
    echo ""
    
    # Show first office details
    if [ "$COUNT" -gt 0 ]; then
        echo "First office details:"
        echo "$RESPONSE" | jq '.data[0].attributes | {name, slug, price, size, capacity, features}' 2>/dev/null
        echo ""
        
        echo "First office images:"
        echo "$RESPONSE" | jq '.data[0].attributes.images.data | length' 2>/dev/null
        echo "images found"
        echo ""
        
        echo "Image URLs:"
        echo "$RESPONSE" | jq '.data[0].attributes.images.data[].attributes.url' 2>/dev/null
    fi
else
    echo "❌ No data field in response"
    echo "This might be an error or permission issue"
fi

echo ""
echo "=================================="
echo ""
echo "If you see data above, Strapi is working correctly."
echo "If not, check:"
echo "1. Content is published in Strapi"
echo "2. API permissions are set (Settings → Roles → Public)"
echo "3. Strapi is running: pm2 list"
