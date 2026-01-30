# Deploy with Strapi - Quick Guide

## ✅ Build Successful!

Your Next.js app now builds successfully with Strapi integration.

## 🚀 Deployment Steps

### 1. Make Sure Strapi is Running

```bash
pm2 list
# Should show "strapi" as online

# If not:
pm2 restart strapi
```

### 2. Set Environment Variables

Make sure `.env.local` has:

```bash
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

For production, use your domain:
```bash
NEXT_PUBLIC_STRAPI_URL=https://cms.praktikoffice.kz
```

### 3. Set Strapi API Permissions

1. Go to: http://localhost:1337/admin
2. **Settings → Users & Permissions → Roles → Public**
3. Enable `find` and `findOne` for:
   - ✅ Office
   - ✅ Meeting-room  
   - ✅ Coworking-tariff
4. Click **Save**

### 4. Add Content in Strapi

#### Add an Office:

1. **Content Manager → Office → Create new entry**
2. Fill in:
   ```
   Name: Офис К10
   Slug: office-k10
   Size: 24 м²
   Capacity: до 8 человек
   Price: 4,000 $/месяц
   Features: ["workplaces_8", "meetingZone", "spaciousLayout", "loungeArea"]
   Images: Upload 3-6 images
   isAvailable: ON
   ```
3. **Save** and **Publish**
4. Add translations (English, Kazakh)

Repeat for all offices: K10, K11, K14, K17, K18, K19, K31, K38, K41

### 5. Test API Connection

```bash
# Test if Strapi returns data
curl "http://localhost:1337/api/offices?populate=*&locale=ru"

# Should return JSON with your offices
```

### 6. Start with PM2

```bash
# Start both apps
pm2 start ecosystem.config.js

# Check status
pm2 list

# View logs
pm2 logs

# Save configuration
pm2 save

# Setup startup
pm2 startup
# Follow the instructions it gives you
```

### 7. Test the Website

Open: http://localhost:3000/ru/offices

You should see:
- ✅ Offices from Strapi (if you added content)
- ✅ Or fallback data (if no Strapi content yet)

## 📊 How to Know if Strapi Data is Loading

### Method 1: Check Browser Console

1. Open http://localhost:3000/ru/offices
2. Press F12 (DevTools)
3. Look at Console:
   - If you see "Using fallback office data" → Using hardcoded data
   - If you don't see this → Using Strapi data ✅

### Method 2: Check Image URLs

Right-click on an office image → "Open image in new tab"

- **Strapi images**: `http://localhost:1337/uploads/...`
- **Fallback images**: `/gallery/offices/...`

### Method 3: Run Test Script

```bash
./scripts/test-strapi-connection.sh
```

This will tell you:
- ✅ If Strapi is running
- ✅ If APIs are working
- ✅ How many entries you have

## 🔧 PM2 Commands

```bash
# List all processes
pm2 list

# View logs
pm2 logs
pm2 logs strapi
pm2 logs nextjs

# Restart
pm2 restart all
pm2 restart strapi
pm2 restart nextjs

# Stop
pm2 stop all

# Delete
pm2 delete all

# Monitor
pm2 monit
```

## 🌐 Production Setup

### Update Strapi .env

Edit `strapi/.env`:

```bash
NODE_ENV=production
HOST=0.0.0.0
PORT=1337
PUBLIC_URL=https://cms.praktikoffice.kz

# Keep your database credentials
DATABASE_HOST=127.0.0.1
DATABASE_PORT=5432
DATABASE_NAME=praktikoffice_strapi
DATABASE_USERNAME=strapi_user
DATABASE_PASSWORD=your_password
```

### Update Next.js .env.local

```bash
NEXT_PUBLIC_STRAPI_URL=https://cms.praktikoffice.kz
```

### Build Both Apps

```bash
# Build Strapi
cd strapi
NODE_ENV=production npm run build
cd ..

# Build Next.js
npm run build
```

### Start with PM2

```bash
pm2 start ecosystem.config.js
pm2 save
```

### Configure Caddy

Update `Caddyfile` with your domains and start:

```bash
sudo caddy start --config Caddyfile
```

## 📝 Content Checklist

Add in Strapi:

### Offices (9 entries × 3 languages):
- [ ] Office K10
- [ ] Office K11
- [ ] Office K14
- [ ] Office K17
- [ ] Office K18
- [ ] Office K19
- [ ] Office K31
- [ ] Office K38
- [ ] Office K41

### Meeting Rooms (5 entries × 3 languages):
- [ ] Meeting Room P6
- [ ] Meeting Room P8
- [ ] Meeting Room P10
- [ ] Meeting Room P12
- [ ] Meeting Room P16

### Coworking (1 entry × 3 languages):
- [ ] Nomad Tariff

## 🐛 Troubleshooting

### Still seeing old data?

1. **Hard refresh browser**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. **Check Strapi is running**: `pm2 list`
3. **Check API permissions**: Settings → Roles → Public
4. **Check content is published**: Not just saved
5. **Restart Next.js**: `pm2 restart nextjs`

### Images not loading?

1. **Check images uploaded in Strapi**
2. **Check image URLs**: `curl "http://localhost:1337/api/offices?populate=*" | grep url`
3. **Check Strapi PUBLIC_URL**: In `strapi/.env`

### API not working?

1. **Test API**: `curl "http://localhost:1337/api/offices?populate=*"`
2. **Check permissions**: Settings → Roles → Public
3. **Check Strapi logs**: `pm2 logs strapi`

## 🎯 Quick Start Commands

```bash
# 1. Start everything
pm2 start ecosystem.config.js

# 2. Check status
pm2 list

# 3. View logs
pm2 logs

# 4. Test API
./scripts/test-strapi-connection.sh

# 5. Open website
open http://localhost:3000/ru/offices

# 6. Open Strapi admin
open http://localhost:1337/admin
```

## 📚 Documentation

- `HOW_TO_USE_STRAPI_DATA.md` - Complete guide
- `STRAPI_INTEGRATION.md` - Technical details
- `SETUP_CHECKLIST.md` - Full checklist
- `STRAPI_TROUBLESHOOTING.md` - Common issues

## ✅ Success Indicators

You'll know everything is working when:

1. ✅ `pm2 list` shows both apps as "online"
2. ✅ `./scripts/test-strapi-connection.sh` shows all green checkmarks
3. ✅ http://localhost:3000/ru/offices loads without errors
4. ✅ Browser console doesn't show "Using fallback office data"
5. ✅ Images load from `http://localhost:1337/uploads/...`

Good luck with your deployment! 🚀
