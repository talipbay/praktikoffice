#!/bin/bash

# Simple migration script wrapper
# This ensures we use localhost and have all dependencies

echo "🚀 Zone Migration Helper"
echo "========================"
echo ""

# Check if we're in the right directory
if [ ! -f "public/zones-cleaned.json" ]; then
    echo "❌ Error: public/zones-cleaned.json not found"
    echo "   Run this script from the project root directory"
    exit 1
fi

# Check if Strapi is running
echo "🔍 Checking if Strapi is running..."
if curl -s http://localhost:1337 > /dev/null 2>&1; then
    echo "✅ Strapi is running"
else
    echo "❌ Strapi is not running on localhost:1337"
    echo ""
    echo "Start Strapi first:"
    echo "   cd strapi"
    echo "   npm run develop"
    echo ""
    echo "Or if using PM2:"
    echo "   pm2 start ecosystem.config.js"
    echo "   pm2 logs strapi"
    exit 1
fi

echo ""
echo "🚀 Running migration..."
echo ""

# Run the migration script
node scripts/migrate-zones-final.js

exit $?
