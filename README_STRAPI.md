# Strapi CMS Integration - Complete Setup

## 📚 Documentation Files

I've created comprehensive documentation for your Strapi setup:

1. **QUICK_START.md** - Step-by-step setup guide
2. **STRAPI_SETUP.md** - Detailed installation instructions
3. **STRAPI_INTEGRATION.md** - Technical integration details
4. **SETUP_CHECKLIST.md** - Complete checklist to track progress
5. **README_STRAPI.md** - This file (overview)

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

```bash
# Make script executable
chmod +x scripts/setup-strapi.sh

# Run setup script
./scripts/setup-strapi.sh
```

This will:
- Check prerequisites
- Create PostgreSQL database
- Install Strapi
- Configure everything
- Generate secure keys

### Option 2: Manual Setup

Follow the detailed steps in `QUICK_START.md`

## 📁 Files Created

### Configuration Files
- `ecosystem.config.js` - PM2 configuration for both Next.js and Strapi
- `Caddyfile` - Reverse proxy configuration
- `strapi-config/database.js` - Database configuration
- `strapi-config/server.js` - Server configuration
- `strapi-config/middlewares.js` - Middleware configuration
- `strapi-config/plugins.js` - Plugin configuration
- `strapi-config/.env.example` - Environment variables template

### Helper Files
- `src/lib/strapi-data.ts` - Data fetching and transformation
- `scripts/setup-strapi.sh` - Automated setup script

### Documentation
- `STRAPI_SETUP.md` - Installation guide
- `QUICK_START.md` - Quick start guide
- `STRAPI_INTEGRATION.md` - Integration details
- `SETUP_CHECKLIST.md` - Setup checklist

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Caddy (Reverse Proxy)                │
│  praktikoffice.kz → :3000                               │
│  cms.praktikoffice.kz → :1337                           │
└─────────────────────────────────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            │                               │
┌───────────▼──────────┐       ┌───────────▼──────────┐
│   Next.js Frontend   │       │    Strapi CMS        │
│   Port 3000          │◄──────│    Port 1337         │
│   (PM2: nextjs)      │ API   │    (PM2: strapi)     │
└──────────────────────┘       └──────────┬───────────┘
                                          │
                               ┌──────────▼───────────┐
                               │   PostgreSQL DB      │
                               │   Port 5432          │
                               └──────────────────────┘
```

## 🎯 What This Setup Provides

### Content Management
- ✅ Manage office photos and prices
- ✅ Manage meeting room photos and prices
- ✅ Manage coworking space photos and prices
- ✅ Multilingual support (Russian, English, Kazakh)
- ✅ Easy content updates through admin panel

### Technical Features
- ✅ PostgreSQL database for reliable data storage
- ✅ PM2 process management for both apps
- ✅ Caddy reverse proxy with automatic HTTPS
- ✅ Image optimization and responsive sizes
- ✅ API caching with Next.js ISR
- ✅ Fallback to static data if Strapi is down

### Developer Experience
- ✅ Automated setup script
- ✅ Comprehensive documentation
- ✅ Easy deployment with PM2
- ✅ Simple content updates
- ✅ Type-safe API integration

## 📋 Setup Steps Overview

1. **Prerequisites** (5 minutes)
   - Install PostgreSQL
   - Install PM2
   - Install Caddy (optional)

2. **Database Setup** (5 minutes)
   - Create database
   - Create user
   - Grant permissions

3. **Strapi Installation** (10 minutes)
   - Run setup script OR manual installation
   - Configure environment
   - Build Strapi

4. **Content Types** (15 minutes)
   - Create Office content type
   - Create Meeting Room content type
   - Create Coworking Tariff content type

5. **Content Creation** (30-60 minutes)
   - Add all offices (9 entries × 3 languages)
   - Add all meeting rooms (5 entries × 3 languages)
   - Add coworking tariff (1 entry × 3 languages)
   - Upload images

6. **Configuration** (10 minutes)
   - Configure API permissions
   - Update Next.js environment
   - Test integration

7. **Deployment** (10 minutes)
   - Build applications
   - Start with PM2
   - Configure Caddy (production)

**Total Time: ~2 hours**

## 🔧 Key Commands

### Development
```bash
# Start Strapi (development)
cd strapi && npm run develop

# Start Next.js (development)
npm run dev
```

### Production
```bash
# Build both apps
cd strapi && npm run build && cd ..
npm run build

# Start with PM2
pm2 start ecosystem.config.js

# View logs
pm2 logs

# Restart
pm2 restart all
```

### Database
```bash
# Connect to database
psql -U strapi_user -d praktikoffice_strapi

# Backup
pg_dump -U strapi_user praktikoffice_strapi > backup.sql

# Restore
psql -U strapi_user praktikoffice_strapi < backup.sql
```

## 🌐 URLs

### Development
- Next.js: http://localhost:3000
- Strapi Admin: http://localhost:1337/admin
- Strapi API: http://localhost:1337/api

### Production
- Website: https://praktikoffice.kz
- Strapi Admin: https://cms.praktikoffice.kz/admin
- Strapi API: https://api.praktikoffice.kz/api

## 📊 Content Structure

### Office Entry Example
```json
{
  "name": "Офис К10",
  "slug": "office-k10",
  "size": "24 м²",
  "capacity": "до 8 человек",
  "price": "4,000 $/месяц",
  "features": [
    "workplaces_8",
    "meetingZone",
    "spaciousLayout",
    "loungeArea"
  ],
  "isAvailable": true,
  "images": [/* 3-6 images */]
}
```

### Meeting Room Entry Example
```json
{
  "name": "П6",
  "slug": "p6",
  "size": "15 м²",
  "capacity": "6 мест",
  "price": "12,500 ₸/час",
  "workingHours": "09:00 - 20:00",
  "specialFeature": "Смарт-стекло с функцией затемнения...",
  "features": [
    "smartGlass",
    "coworkingAccess",
    "kitchenCoffee",
    "whiteboardOnRequest"
  ],
  "isAvailable": true,
  "images": [/* 3-6 images */]
}
```

## 🔐 Security Checklist

- [ ] Strong PostgreSQL password
- [ ] Strong Strapi admin password
- [ ] Secure app keys generated
- [ ] Firewall configured
- [ ] HTTPS enabled (production)
- [ ] CORS configured
- [ ] API permissions set correctly
- [ ] Regular backups configured

## 📞 Support

### Documentation
- Read `QUICK_START.md` for setup instructions
- Read `STRAPI_INTEGRATION.md` for technical details
- Use `SETUP_CHECKLIST.md` to track progress

### Troubleshooting
Common issues and solutions are documented in `QUICK_START.md`

### Useful Links
- Strapi Documentation: https://docs.strapi.io
- PostgreSQL Documentation: https://www.postgresql.org/docs/
- PM2 Documentation: https://pm2.keymetrics.io/docs/
- Caddy Documentation: https://caddyserver.com/docs/

## 🎉 Next Steps

1. Read `QUICK_START.md`
2. Run `./scripts/setup-strapi.sh`
3. Follow `SETUP_CHECKLIST.md`
4. Create content in Strapi
5. Test integration
6. Deploy to production

Good luck with your setup! 🚀
