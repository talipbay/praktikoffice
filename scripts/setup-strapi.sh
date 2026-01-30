#!/bin/bash

# Strapi Setup Script for Praktik Office
# This script helps set up Strapi with PostgreSQL

set -e

echo "🚀 Praktik Office - Strapi Setup Script"
echo "========================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if PostgreSQL is installed
echo "📦 Checking PostgreSQL installation..."
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ PostgreSQL is not installed${NC}"
    echo "Please install PostgreSQL first:"
    echo "  Ubuntu/Debian: sudo apt install postgresql postgresql-contrib"
    echo "  macOS: brew install postgresql@15"
    exit 1
fi
echo -e "${GREEN}✅ PostgreSQL is installed${NC}"
echo ""

# Check if PM2 is installed
echo "📦 Checking PM2 installation..."
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}⚠️  PM2 is not installed${NC}"
    echo "Installing PM2 globally..."
    npm install -g pm2
fi
echo -e "${GREEN}✅ PM2 is installed${NC}"
echo ""

# Database setup
echo "🗄️  Database Setup"
echo "=================="
read -p "Enter database name (default: praktikoffice_strapi): " DB_NAME
DB_NAME=${DB_NAME:-praktikoffice_strapi}

read -p "Enter database username (default: strapi_user): " DB_USER
DB_USER=${DB_USER:-strapi_user}

read -sp "Enter database password: " DB_PASSWORD
echo ""

if [ -z "$DB_PASSWORD" ]; then
    echo -e "${RED}❌ Password cannot be empty${NC}"
    exit 1
fi

echo ""
echo "Creating PostgreSQL database and user..."
sudo -u postgres psql << EOF
CREATE DATABASE $DB_NAME;
CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
\q
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database created successfully${NC}"
else
    echo -e "${YELLOW}⚠️  Database might already exist or there was an error${NC}"
fi
echo ""

# Create Strapi project
echo "📁 Creating Strapi project..."
if [ -d "strapi" ]; then
    echo -e "${YELLOW}⚠️  Strapi directory already exists${NC}"
    read -p "Do you want to remove it and create a new one? (y/N): " REMOVE
    if [ "$REMOVE" = "y" ] || [ "$REMOVE" = "Y" ]; then
        rm -rf strapi
    else
        echo "Skipping Strapi creation..."
        exit 0
    fi
fi

npx create-strapi-app@latest strapi \
  --dbclient=postgres \
  --dbhost=localhost \
  --dbport=5432 \
  --dbname=$DB_NAME \
  --dbusername=$DB_USER \
  --dbpassword=$DB_PASSWORD \
  --no-run

echo -e "${GREEN}✅ Strapi project created${NC}"
echo ""

# Copy configuration files
echo "📝 Copying configuration files..."
cp strapi-config/database.js strapi/config/database.js
cp strapi-config/server.js strapi/config/server.js
cp strapi-config/middlewares.js strapi/config/middlewares.js
cp strapi-config/plugins.js strapi/config/plugins.js
echo -e "${GREEN}✅ Configuration files copied${NC}"
echo ""

# Generate app keys
echo "🔑 Generating app keys..."
APP_KEY1=$(openssl rand -base64 32)
APP_KEY2=$(openssl rand -base64 32)
APP_KEY3=$(openssl rand -base64 32)
APP_KEY4=$(openssl rand -base64 32)
API_TOKEN_SALT=$(openssl rand -base64 32)
ADMIN_JWT_SECRET=$(openssl rand -base64 32)
TRANSFER_TOKEN_SALT=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)

# Create .env file
cat > strapi/.env << EOF
# Server
HOST=0.0.0.0
PORT=1337
PUBLIC_URL=http://localhost:1337

# App Keys
APP_KEYS=$APP_KEY1,$APP_KEY2,$APP_KEY3,$APP_KEY4
API_TOKEN_SALT=$API_TOKEN_SALT
ADMIN_JWT_SECRET=$ADMIN_JWT_SECRET
TRANSFER_TOKEN_SALT=$TRANSFER_TOKEN_SALT
JWT_SECRET=$JWT_SECRET

# Database
DATABASE_CLIENT=postgres
DATABASE_HOST=127.0.0.1
DATABASE_PORT=5432
DATABASE_NAME=$DB_NAME
DATABASE_USERNAME=$DB_USER
DATABASE_PASSWORD=$DB_PASSWORD
DATABASE_SSL=false

# Node Environment
NODE_ENV=development
EOF

echo -e "${GREEN}✅ Environment file created${NC}"
echo ""

# Install dependencies
echo "📦 Installing Strapi dependencies..."
cd strapi
npm install
cd ..
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Update Next.js .env.local
echo "🔧 Updating Next.js environment variables..."
if [ ! -f ".env.local" ]; then
    cp .env.example .env.local
fi

# Add or update Strapi URL in .env.local
if grep -q "NEXT_PUBLIC_STRAPI_URL" .env.local; then
    sed -i.bak 's|NEXT_PUBLIC_STRAPI_URL=.*|NEXT_PUBLIC_STRAPI_URL=http://localhost:1337|' .env.local
else
    echo "" >> .env.local
    echo "# Strapi CMS" >> .env.local
    echo "NEXT_PUBLIC_STRAPI_URL=http://localhost:1337" >> .env.local
fi

echo -e "${GREEN}✅ Next.js environment updated${NC}"
echo ""

# Create logs directory
mkdir -p logs

echo ""
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Build Strapi: cd strapi && npm run build"
echo "2. Start Strapi: cd strapi && npm run develop"
echo "3. Create admin user at: http://localhost:1337/admin"
echo "4. Configure i18n with locales: en, ru, kz"
echo "5. Create content types using the schemas in strapi-schemas/"
echo "6. Add content and publish"
echo "7. Configure API permissions (Settings → Roles → Public)"
echo ""
echo "To start with PM2:"
echo "  pm2 start ecosystem.config.js"
echo ""
echo "To view logs:"
echo "  pm2 logs"
echo ""
