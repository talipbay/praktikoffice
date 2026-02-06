#!/bin/bash

# Script to create Zone content type in Strapi

echo "🔧 Setting up Zone Content Type in Strapi"
echo "=========================================="
echo ""

# Check if Strapi directory exists
if [ ! -d "strapi" ]; then
    echo "❌ Error: strapi directory not found"
    exit 1
fi

# Create the API directory structure
echo "📁 Creating directory structure..."
mkdir -p strapi/src/api/zone/content-types/zone
mkdir -p strapi/src/api/zone/controllers
mkdir -p strapi/src/api/zone/routes
mkdir -p strapi/src/api/zone/services

# Copy schema
echo "📄 Creating schema.json..."
cp strapi-schemas/zone.json strapi/src/api/zone/content-types/zone/schema.json

# Create controller
echo "📄 Creating controller..."
cat > strapi/src/api/zone/controllers/zone.ts << 'EOF'
/**
 * zone controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::zone.zone');
EOF

# Create service
echo "📄 Creating service..."
cat > strapi/src/api/zone/services/zone.ts << 'EOF'
/**
 * zone service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::zone.zone');
EOF

# Create routes
echo "📄 Creating routes..."
cat > strapi/src/api/zone/routes/zone.ts << 'EOF'
/**
 * zone router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::zone.zone');
EOF

echo ""
echo "✅ Zone content type files created!"
echo ""
echo "📋 Next steps:"
echo "   1. Restart Strapi:"
echo "      cd strapi"
echo "      npm run develop"
echo ""
echo "   2. Open Strapi Admin: http://89.35.125.175:1337/admin"
echo ""
echo "   3. Go to: Settings → Roles → Public"
echo "      Enable for 'Zone':"
echo "      ✓ find"
echo "      ✓ findOne"
echo "      ✓ create"
echo "      ✓ update"
echo ""
echo "   4. Run migration:"
echo "      NEXT_PUBLIC_STRAPI_URL=http://89.35.125.175:1337 \\"
echo "      NEXT_PUBLIC_STRAPI_API_TOKEN=your_token \\"
echo "      node scripts/migrate-zones-final.js"
echo ""
