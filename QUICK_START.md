# Quick Start Guide - Strapi Integration

## 🚀 Quick Setup (Automated)

Run the setup script:

```bash
chmod +x scripts/setup-strapi.sh
./scripts/setup-strapi.sh
```

This script will:
- Check prerequisites (PostgreSQL, PM2)
- Create PostgreSQL database and user
- Create Strapi project
- Configure database connection
- Generate secure keys
- Install dependencies
- Update environment variables

## 📋 Manual Setup Steps

If you prefer manual setup, follow these steps:

### 1. Install Prerequisites

```bash
# Install PM2 globally
npm install -g pm2

# Install PostgreSQL (if not installed)
# macOS:
brew install postgresql@15
brew services start postgresql@15

# Ubuntu/Debian:
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Create Database

```bash
sudo -u postgres psql
```

In PostgreSQL shell:
```sql
CREATE DATABASE praktikoffice_strapi;
CREATE USER strapi_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE praktikoffice_strapi TO strapi_user;
\q
```

### 3. Create Strapi Project

```bash
npx create-strapi-app@latest strapi \
  --dbclient=postgres \
  --dbhost=localhost \
  --dbport=5432 \
  --dbname=praktikoffice_strapi \
  --dbusername=strapi_user \
  --dbpassword=your_password \
  --no-run
```

### 4. Copy Configuration Files

```bash
cp strapi-config/database.js strapi/config/
cp strapi-config/server.js strapi/config/
cp strapi-config/middlewares.js strapi/config/
cp strapi-config/plugins.js strapi/config/
```

### 5. Configure Environment

```bash
cd strapi
cp ../strapi-config/.env.example .env
```

Edit `.env` and update:
- Database credentials
- Generate APP_KEYS (use: `openssl rand -base64 32`)
- Generate secrets

### 6. Install Dependencies

```bash
npm install
```

### 7. Build Strapi

```bash
npm run build
```

## 🎨 Create Content Types in Strapi

### Method 1: Using Strapi Admin (Recommended)

1. Start Strapi in development mode:
```bash
cd strapi
npm run develop
```

2. Open http://localhost:1337/admin
3. Create your first admin user
4. Go to Content-Type Builder

#### Create Office Content Type:
- Collection Type: `office`
- Fields:
  - `name` (Text, required, localized)
  - `slug` (UID, target: name)
  - `size` (Text, required, localized)
  - `capacity` (Text, required, localized)
  - `price` (Text, required, localized)
  - `description` (Rich Text, localized)
  - `features` (JSON, localized) - Array of feature keys
  - `isAvailable` (Boolean, default: true)
  - `images` (Media, multiple, images only)

#### Create Meeting Room Content Type:
- Collection Type: `meeting-room`
- Fields:
  - `name` (Text, required, localized)
  - `slug` (UID, target: name)
  - `size` (Text, required, localized)
  - `capacity` (Text, required, localized)
  - `price` (Text, required, localized)
  - `description` (Rich Text, localized)
  - `workingHours` (Text, localized)
  - `specialFeature` (Text, localized)
  - `features` (JSON, localized) - Array of feature keys
  - `isAvailable` (Boolean, default: true)
  - `images` (Media, multiple, images only)

#### Create Coworking Tariff Content Type:
- Collection Type: `coworking-tariff`
- Fields:
  - `name` (Text, required, localized)
  - `slug` (UID, target: name)
  - `schedule` (Text, required, localized)
  - `price` (Text, required, localized)
  - `description` (Rich Text, localized)
  - `features` (JSON, localized) - Array of feature keys
  - `isActive` (Boolean, default: true)

### Method 2: Import Schemas (Advanced)

The schemas are available in `strapi-schemas/` directory for reference.

## 🌍 Configure i18n

1. Go to Settings → Internationalization
2. Add locales:
   - English (en)
   - Russian (ru) - set as default
   - Kazakh (kz)

## 🔐 Configure API Permissions

1. Go to Settings → Users & Permissions → Roles → Public
2. Enable permissions for:
   - **Office**: find, findOne
   - **Meeting-room**: find, findOne
   - **Coworking-tariff**: find, findOne
   - **Upload**: (for images)

## 📝 Add Content

### Example Office Entry:

**Russian (ru):**
- Name: Офис К10
- Slug: office-k10
- Size: 24 м²
- Capacity: до 8 человек
- Price: 4,000 $/месяц
- Features: `["workplaces_8", "meetingZone", "spaciousLayout", "loungeArea"]`
- Images: Upload 3-6 images
- isAvailable: true

**English (en):**
- Name: Office K10
- Size: 24 m²
- Capacity: up to 8 people
- Price: $4,000/month
- Features: `["workplaces_8", "meetingZone", "spaciousLayout", "loungeArea"]`

**Kazakh (kz):**
- Name: Офис К10
- Size: 24 м²
- Capacity: 8 адамға дейін
- Price: 4,000 $/ай
- Features: `["workplaces_8", "meetingZone", "spaciousLayout", "loungeArea"]`

Repeat for all offices (K10, K11, K14, K17, K18, K19, K31, K38, K41)

### Example Meeting Room Entry:

**Russian (ru):**
- Name: П6
- Slug: p6
- Size: 15 м²
- Capacity: 6 мест
- Price: 12,500 ₸/час
- Working Hours: 09:00 - 20:00
- Special Feature: Смарт-стекло с функцией затемнения...
- Features: `["smartGlass", "coworkingAccess", "kitchenCoffee", "whiteboardOnRequest"]`
- Images: Upload 3-6 images

Repeat for all meeting rooms (П6, П8, П10, П12, П16)

## 🚀 Start Services

### Development:

```bash
# Terminal 1 - Strapi
cd strapi
npm run develop

# Terminal 2 - Next.js
npm run dev
```

### Production with PM2:

```bash
# Build both applications
cd strapi && npm run build && cd ..
npm run build

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

## 🌐 Configure Caddy (Production)

1. Update `Caddyfile` with your domain
2. Start Caddy:

```bash
sudo caddy start --config Caddyfile
```

## 🔄 Update Next.js Environment

Add to `.env.local`:

```bash
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
# For production:
# NEXT_PUBLIC_STRAPI_URL=https://cms.praktikoffice.kz
```

## ✅ Verify Setup

1. Strapi Admin: http://localhost:1337/admin
2. Strapi API: http://localhost:1337/api/offices
3. Next.js: http://localhost:3000

## 📊 Useful Commands

```bash
# PM2
pm2 list                    # List all processes
pm2 logs                    # View all logs
pm2 logs strapi            # View Strapi logs
pm2 restart strapi         # Restart Strapi
pm2 stop all               # Stop all processes
pm2 delete all             # Remove all processes

# Strapi
cd strapi
npm run develop            # Development mode
npm run build              # Build for production
npm run start              # Production mode
npm run strapi             # Strapi CLI

# Database
psql -U strapi_user -d praktikoffice_strapi  # Connect to database
```

## 🐛 Troubleshooting

### Port 1337 already in use:
```bash
lsof -i :1337
kill -9 <PID>
```

### PostgreSQL connection error:
```bash
# Check PostgreSQL status
sudo systemctl status postgresql  # Linux
brew services list                # macOS

# Check PostgreSQL logs
tail -f /var/log/postgresql/postgresql-*.log
```

### Strapi build errors:
```bash
cd strapi
rm -rf .cache build
npm run build
```

### Clear PM2 logs:
```bash
pm2 flush
```
