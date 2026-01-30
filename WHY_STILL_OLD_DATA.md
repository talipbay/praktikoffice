# Why Am I Still Seeing Old Data?

## ✅ Your Strapi is Working!

The test shows:
- ✅ Strapi is running
- ✅ API is working
- ✅ You have 1 office, 1 meeting room, 1 coworking tariff
- ✅ Environment variable is set

## ❌ But Pages Show Old Data

This is because **Next.js needs to be rebuilt** to use the new code that fetches from Strapi.

## 🔧 Fix: Rebuild Next.js

### Quick Fix:

```bash
# Run this script
./scripts/rebuild-and-restart.sh
```

### Manual Fix:

```bash
# 1. Clear cache
rm -rf .next

# 2. Rebuild
npm run build

# 3. Restart with PM2
pm2 restart nextjs

# 4. Check status
pm2 list
```

## 🔍 How to Verify It's Working

### Method 1: Check Browser Console

1. Open: http://localhost:3000/ru/offices
2. Press F12 (open DevTools)
3. Go to Console tab
4. Look for messages:
   - **If you see**: "Using fallback office data" → Still using hardcoded data
   - **If you DON'T see this**: Using Strapi data! ✅

### Method 2: Check Image URLs

1. Right-click on an office image
2. Select "Open image in new tab"
3. Check the URL:
   - **Strapi images**: `http://localhost:1337/uploads/...`
   - **Fallback images**: `/gallery/offices/...`

### Method 3: Check Network Tab

1. Open: http://localhost:3000/ru/offices
2. Press F12 (DevTools)
3. Go to Network tab
4. Refresh page
5. Look for API calls to `localhost:1337`

## 📊 Understanding the Data Flow

### What Comes from Strapi:
- ✅ Office names (Офис К10, К11, etc.)
- ✅ Prices (4,000 $/месяц, etc.)
- ✅ Features (workplaces_8, meetingZone, etc.)
- ✅ Images (photos you upload)

### What Comes from Translations (JSON):
- ✅ Page titles ("offices.", "meeting rooms.")
- ✅ Section headings ("Что включено в стоимость")
- ✅ Service descriptions ("Ресепшн", "Техническая поддержка")
- ✅ Feature translations (workplaces_8 → "8 рабочих мест")
- ✅ All the bottom section text (services, comfort, food, etc.)

This is exactly what you want! The common text stays in translations, but the specific office details come from Strapi.

## 🎯 Current Setup

```
┌─────────────────────────────────────────┐
│         Office Page Display             │
├─────────────────────────────────────────┤
│                                         │
│  Title: "offices." ← Translation       │
│  Subtitle ← Translation                 │
│                                         │
│  ┌───────────────────────────────┐    │
│  │ Office Name ← STRAPI          │    │
│  │ Price ← STRAPI                │    │
│  │ Features ← STRAPI             │    │
│  │ Images ← STRAPI               │    │
│  └───────────────────────────────┘    │
│                                         │
│  "Что включено в стоимость"            │
│  ← Translation                          │
│                                         │
│  Services list ← Translation            │
│  Comfort list ← Translation             │
│  Food list ← Translation                │
│                                         │
└─────────────────────────────────────────┘
```

## 🚀 After Rebuild

Once you rebuild, here's what will happen:

1. **Page loads** → Next.js tries to fetch from Strapi
2. **If Strapi has data** → Shows office from Strapi
3. **If Strapi is down** → Shows fallback hardcoded data
4. **Bottom section** → Always from translations (same for all)

## 📝 Adding More Offices

To add more offices in Strapi:

1. Go to: http://localhost:1337/admin
2. **Content Manager → Office → Create new entry**
3. Fill in:
   ```
   Name: Офис К11
   Slug: office-k11
   Size: 24 м²
   Capacity: до 8 человек
   Price: 4,000 $/месяц
   Features: ["workplaces_8", "meetingZone", "modernFurniture", "excellentLayout"]
   Images: Upload 3-6 images
   isAvailable: ON
   ```
4. **Save** and **Publish**
5. Add translations (English, Kazakh)
6. Refresh website - new office appears!

## 🔄 When to Rebuild

You need to rebuild Next.js when:
- ✅ You change Next.js code
- ✅ You update environment variables
- ✅ First time setting up Strapi integration

You DON'T need to rebuild when:
- ❌ Adding/editing content in Strapi
- ❌ Uploading images in Strapi
- ❌ Changing prices in Strapi
- ❌ Publishing/unpublishing entries

Content changes in Strapi appear automatically (within 60 seconds due to ISR caching).

## 🐛 Still Not Working?

### 1. Check PM2 Status

```bash
pm2 list
# Both should be "online"
```

### 2. Check Logs

```bash
pm2 logs nextjs
# Look for errors
```

### 3. Hard Refresh Browser

Press: **Ctrl+Shift+R** (Windows/Linux) or **Cmd+Shift+R** (Mac)

### 4. Check Environment Variable

```bash
cat .env.local | grep STRAPI
# Should show: NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

### 5. Test API Directly

```bash
curl "http://localhost:1337/api/offices?populate=*&locale=ru"
# Should return your office data
```

### 6. Check Content is Published

In Strapi admin:
- Content Manager → Office
- Make sure entry shows "Published" (not "Draft")

## ✅ Success Checklist

After rebuild, verify:

- [ ] `pm2 list` shows nextjs as "online"
- [ ] Browser console doesn't show "Using fallback office data"
- [ ] Office name matches what you entered in Strapi
- [ ] Price matches what you entered in Strapi
- [ ] Images are from Strapi (URL starts with `/uploads/`)
- [ ] Bottom section still shows (from translations)
- [ ] Language switching works

## 🎯 Quick Commands

```bash
# Rebuild and restart
./scripts/rebuild-and-restart.sh

# Or manually:
rm -rf .next && npm run build && pm2 restart nextjs

# Check status
pm2 list

# View logs
pm2 logs nextjs

# Test API
curl "http://localhost:1337/api/offices?populate=*&locale=ru"

# Test connection
./scripts/test-strapi-connection.sh
```

## 📞 Need Help?

If after rebuilding you still see old data:

1. Check browser console for "Using fallback office data"
2. Check `pm2 logs nextjs` for errors
3. Make sure content is **Published** in Strapi (not just saved)
4. Try opening in incognito/private window
5. Check `.env.local` has correct Strapi URL

The most common issue is forgetting to **Publish** content in Strapi!
