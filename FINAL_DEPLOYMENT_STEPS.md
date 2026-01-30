# ✅ Final Deployment Steps

## Build is Successful! 🎉

Both Strapi and Next.js are now building successfully.

## 🚀 Deploy Now

### Step 1: Start Services with PM2

```bash
# Make sure you're in the project root
cd /root/praktikoffice

# Start both applications
pm2 start ecosystem.config.js

# Check status
pm2 list
# Should show:
# - strapi: online
# - nextjs: online
```

### Step 2: Save PM2 Configuration

```bash
# Save current PM2 processes
pm2 save

# Setup PM2 to start on system boot
pm2 startup
# Follow the command it gives you (usually starts with 'sudo')
```

### Step 3: Configure Strapi API Permissions

1. Open Strapi admin: http://your-server-ip:1337/admin
2. Login with your admin credentials
3. Go to: **Settings → Users & Permissions → Roles → Public**
4. Enable these permissions:
   - **Office**: ✅ find, ✅ findOne
   - **Meeting-room**: ✅ find, ✅ findOne
   - **Coworking-tariff**: ✅ find, ✅ findOne
5. Click **Save**

### Step 4: Add Content in Strapi

#### Create Office Entry:

1. **Content Manager → Office → Create new entry**
2. Fill in:
   - **Name**: Офис К10
   - **Slug**: office-k10 (auto-generated)
   - **Size**: 24 м²
   - **Capacity**: до 8 человек
   - **Price**: 4,000 $/месяц
   - **Features**: Add array items:
     - workplaces_8
     - meetingZone
     - spaciousLayout
     - loungeArea
   - **Images**: Upload 3-6 images
   - **isAvailable**: Toggle ON
3. Click **Save**
4. Click **Publish**

#### Add Translations:

1. At the top, click language dropdown
2. Select **English** → **Create new locale**
3. Fill in English translations:
   - Name: Office K10
   - Size: 24 m²
   - Capacity: up to 8 people
   - Price: $4,000/month
   - Features: (same keys)
4. Save and Publish
5. Repeat for **Kazakh**

### Step 5: Test the Website

```bash
# Test API connection
curl "http://localhost:1337/api/offices?populate=*&locale=ru"

# Should return JSON with your office data
```

Open in browser:
- http://your-server-ip:3000/ru/offices
- http://your-server-ip:3000/en/offices
- http://your-server-ip:3000/kz/offices

### Step 6: Configure Caddy (Optional - for HTTPS)

If you want to use your domain with HTTPS:

1. Update `Caddyfile` with your domain
2. Make sure DNS points to your server
3. Start Caddy:

```bash
sudo caddy start --config Caddyfile
```

Caddy will automatically get SSL certificates from Let's Encrypt.

## 📊 Verify Everything is Working

### Check PM2 Status:

```bash
pm2 list
# Both should show "online"

pm2 logs
# Should show no errors
```

### Check Strapi:

```bash
# Health check
curl http://localhost:1337/_health

# API check
curl "http://localhost:1337/api/offices?populate=*&locale=ru"
```

### Check Next.js:

```bash
# Should return HTML
curl http://localhost:3000/ru/offices
```

### Check in Browser:

1. Open: http://your-server-ip:3000/ru/offices
2. Press F12 (DevTools)
3. Check Console:
   - If you see "Using fallback office data" → Add content in Strapi
   - If you don't see this → Strapi data is loading! ✅

## 🔧 Useful PM2 Commands

```bash
# View logs
pm2 logs                    # All logs
pm2 logs strapi            # Strapi only
pm2 logs nextjs            # Next.js only

# Restart services
pm2 restart all
pm2 restart strapi
pm2 restart nextjs

# Stop services
pm2 stop all

# Monitor
pm2 monit

# Delete all processes
pm2 delete all
```

## 📝 Content to Add

Add these entries in Strapi (each in 3 languages):

### Offices (9 entries):
1. Офис К10 / Office K10 / Офис К10
2. Офис К11 / Office K11 / Офис К11
3. Офис К14 / Office K14 / Офис К14
4. Офис К17 / Office K17 / Офис К17
5. Офис К18 / Office K18 / Офис К18
6. Офис К19 / Office K19 / Офис К19
7. Офис К31 / Office K31 / Офис К31
8. Офис К38 / Office K38 / Офис К38
9. Офис К41 / Office K41 / Офис К41

### Meeting Rooms (5 entries):
1. П6 / P6 / П6
2. П8 / P8 / П8
3. П10 / P10 / П10
4. П12 / P12 / П12
5. П16 / P16 / П16

### Coworking (1 entry):
1. Тариф Номад / Nomad Plan / Nomad тарифі

## 🐛 Troubleshooting

### PM2 won't start:

```bash
# Check if ports are in use
lsof -i :1337  # Strapi
lsof -i :3000  # Next.js

# Kill if needed
kill -9 <PID>

# Try starting again
pm2 start ecosystem.config.js
```

### Strapi not accessible:

```bash
# Check Strapi logs
pm2 logs strapi

# Check if PostgreSQL is running
sudo systemctl status postgresql

# Restart Strapi
pm2 restart strapi
```

### Next.js not showing Strapi data:

1. Check `.env.local` has `NEXT_PUBLIC_STRAPI_URL=http://localhost:1337`
2. Check API permissions in Strapi
3. Check content is published (not just saved)
4. Restart Next.js: `pm2 restart nextjs`
5. Hard refresh browser: Ctrl+Shift+R

### Images not loading:

1. Check images are uploaded in Strapi
2. Check Strapi `PUBLIC_URL` in `strapi/.env`
3. Check image URLs: `curl "http://localhost:1337/api/offices?populate=*" | grep url`

## 🎯 Success Checklist

- [ ] PM2 shows both apps as "online"
- [ ] Strapi admin accessible at http://your-server-ip:1337/admin
- [ ] API permissions set for Public role
- [ ] At least one office entry created and published
- [ ] Translations added for all languages
- [ ] Images uploaded
- [ ] Website accessible at http://your-server-ip:3000
- [ ] Offices page shows data from Strapi
- [ ] Images load correctly
- [ ] Language switching works
- [ ] PM2 saved and startup configured

## 🌐 Production URLs

After Caddy setup:

- **Website**: https://praktikoffice.kz
- **Strapi Admin**: https://cms.praktikoffice.kz/admin
- **Strapi API**: https://cms.praktikoffice.kz/api

## 📚 Documentation

- `DEPLOY_WITH_STRAPI.md` - Deployment guide
- `HOW_TO_USE_STRAPI_DATA.md` - Usage guide
- `STRAPI_INTEGRATION.md` - Technical details
- `SETUP_CHECKLIST.md` - Full checklist
- `STRAPI_TROUBLESHOOTING.md` - Common issues

## 🎉 You're Done!

Your website is now:
- ✅ Built successfully
- ✅ Ready to deploy with PM2
- ✅ Integrated with Strapi CMS
- ✅ Supports 3 languages
- ✅ Has fallback data for reliability

Start PM2 and add your content in Strapi! 🚀
