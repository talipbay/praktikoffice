# Debug: Why Strapi Data Not Showing

## 🔍 Step-by-Step Debugging

### Step 1: Check What Strapi is Returning

```bash
./scripts/test-api-response.sh
```

This will show you exactly what data Strapi is returning.

**Expected output:**
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "name": "Офис К10",
        "slug": "office-k10",
        "price": "4,000 $/месяц",
        "size": "24 м²",
        "capacity": "до 8 человек",
        "features": ["workplaces_8", "meetingZone"],
        "images": {
          "data": [...]
        }
      }
    }
  ]
}
```

### Step 2: Rebuild with Logging

```bash
# Clear cache
rm -rf .next

# Build
npm run build

# Restart
pm2 restart nextjs

# Watch logs
pm2 logs nextjs --lines 100
```

### Step 3: Check Logs

When you visit the page, you should see logs like:

```
=== OFFICES PAGE DEBUG ===
Locale: ru
Fetched offices count: 1
First office: { id: 'office-k10', name: 'Офис К10', ... }
========================
Using Strapi data - found 1 offices
```

**If you see "Using fallback office data"**, something is wrong with the fetch.

### Step 4: Check Browser

1. Open: http://your-server-ip:3000/ru/offices
2. Open DevTools (F12)
3. Go to **Network** tab
4. Refresh page
5. Look for requests to `localhost:1337`

**If you DON'T see any requests to Strapi**, the fetch is not happening.

## 🐛 Common Issues

### Issue 1: Environment Variable Not Set

**Check:**
```bash
cat .env.local | grep STRAPI
```

**Should show:**
```
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

**If missing, add it:**
```bash
echo "NEXT_PUBLIC_STRAPI_URL=http://localhost:1337" >> .env.local
```

Then rebuild.

### Issue 2: Content Not Published

In Strapi admin:
1. Go to **Content Manager → Office**
2. Check if entry shows **"Published"** (green badge)
3. If it says **"Draft"**, click the entry and click **"Publish"**

### Issue 3: API Permissions Not Set

1. Go to: http://localhost:1337/admin
2. **Settings → Users & Permissions → Roles → Public**
3. Scroll to **Office**
4. Check ✅ **find** and ✅ **findOne**
5. Click **Save**

### Issue 4: Features Field Format Wrong

In Strapi, the **features** field should be a JSON array:

**Correct:**
```json
["workplaces_8", "meetingZone", "spaciousLayout", "loungeArea"]
```

**Wrong:**
```
workplaces_8, meetingZone
```

To fix:
1. Edit office in Strapi
2. Click on **features** field
3. Make sure it's formatted as JSON array
4. Save and Publish

### Issue 5: Images Not Uploaded

1. Edit office in Strapi
2. Scroll to **images** field
3. Click **"Add new entry"** or drag images
4. Upload 3-6 images
5. Save and Publish

### Issue 6: Strapi URL Wrong in Production

If deploying to production, make sure:

**In `.env.local`:**
```bash
# For local development
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337

# For production
NEXT_PUBLIC_STRAPI_URL=https://cms.praktikoffice.kz
```

**In `strapi/.env`:**
```bash
PUBLIC_URL=https://cms.praktikoffice.kz
```

## 🔧 Force Fresh Start

If nothing works, try a complete fresh start:

```bash
# 1. Stop everything
pm2 stop all

# 2. Clear all caches
rm -rf .next
rm -rf node_modules/.next
rm -rf strapi/.cache
rm -rf strapi/build

# 3. Rebuild Strapi
cd strapi
npm run build
cd ..

# 4. Rebuild Next.js
npm run build

# 5. Start everything
pm2 restart all

# 6. Check logs
pm2 logs
```

## 📊 Manual API Test

Test the API manually to see what it returns:

```bash
# Test with curl
curl "http://localhost:1337/api/offices?populate=*&locale=ru" | jq '.'

# Or with wget
wget -qO- "http://localhost:1337/api/offices?populate=*&locale=ru" | jq '.'
```

**Expected response structure:**
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "name": "Офис К10",
        "slug": "office-k10",
        "size": "24 м²",
        "capacity": "до 8 человек",
        "price": "4,000 $/месяц",
        "features": ["workplaces_8", "meetingZone", "spaciousLayout", "loungeArea"],
        "isAvailable": true,
        "createdAt": "2024-01-30T...",
        "updatedAt": "2024-01-30T...",
        "publishedAt": "2024-01-30T...",
        "locale": "ru",
        "images": {
          "data": [
            {
              "id": 1,
              "attributes": {
                "name": "office-image.jpg",
                "url": "/uploads/office_image_123.jpg",
                "width": 1920,
                "height": 1080
              }
            }
          ]
        }
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 1
    }
  }
}
```

## 🎯 Checklist

Go through this checklist:

- [ ] Strapi is running (`pm2 list` shows "online")
- [ ] API returns data (`curl "http://localhost:1337/api/offices?populate=*"`)
- [ ] Content is **Published** in Strapi (not Draft)
- [ ] API permissions set (Settings → Roles → Public)
- [ ] Environment variable set in `.env.local`
- [ ] Features field is JSON array format
- [ ] Images uploaded in Strapi
- [ ] Next.js cache cleared (`rm -rf .next`)
- [ ] Next.js rebuilt (`npm run build`)
- [ ] Next.js restarted (`pm2 restart nextjs`)
- [ ] Browser cache cleared (Ctrl+Shift+R)

## 📝 Get Help

If still not working, run these commands and share the output:

```bash
# 1. Test API
./scripts/test-api-response.sh > api-test.log 2>&1

# 2. Check environment
cat .env.local | grep STRAPI > env-check.log

# 3. Check PM2 status
pm2 list > pm2-status.log

# 4. Get Next.js logs
pm2 logs nextjs --lines 50 --nostream > nextjs-logs.log

# 5. Get Strapi logs
pm2 logs strapi --lines 50 --nostream > strapi-logs.log
```

Then check these log files for errors.

## 🚀 Quick Fix Commands

```bash
# Complete rebuild
rm -rf .next && npm run build && pm2 restart nextjs

# Test API
./scripts/test-api-response.sh

# Watch logs
pm2 logs nextjs

# Check status
pm2 list

# Test connection
./scripts/test-strapi-connection.sh
```
