#!/bin/bash

# Quick fix script for Strapi "useContext" error

set -e

echo "🔧 Strapi Quick Fix Script"
echo "=========================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if strapi directory exists
if [ ! -d "strapi" ]; then
    echo -e "${RED}❌ Strapi directory not found${NC}"
    echo "Please run setup-strapi.sh first"
    exit 1
fi

cd strapi

echo "📦 Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version must be 18 or higher${NC}"
    echo "Current version: $(node -v)"
    echo "Please upgrade Node.js"
    exit 1
fi
echo -e "${GREEN}✅ Node.js version OK: $(node -v)${NC}"
echo ""

echo "🧹 Cleaning cache and build directories..."
rm -rf .cache
rm -rf build
rm -rf node_modules/.cache
echo -e "${GREEN}✅ Cleaned${NC}"
echo ""

echo "🔨 Rebuilding Strapi..."
npm run build
echo -e "${GREEN}✅ Build complete${NC}"
echo ""

echo "🚀 Starting Strapi in development mode..."
echo ""
echo -e "${GREEN}Strapi will start at: http://localhost:1337/admin${NC}"
echo ""
echo "If you still see errors:"
echo "1. Press Ctrl+C to stop"
echo "2. Check STRAPI_TROUBLESHOOTING.md for more solutions"
echo ""

npm run develop
