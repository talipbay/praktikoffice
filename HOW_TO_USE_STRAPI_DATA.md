# How to Use Strapi Data in Your Pages

## Current Status

✅ **Offices page** - Updated to fetch from Strapi (with fallback)
⏳ **Meeting Rooms page** - Needs update
⏳ **Open Space page** - Needs update

## Quick Steps to See Strapi Data

### 1. Make Sure Strapi is Running

```bash
pm2 list
# Should show "strapi" as "online"

# If not running:
pm2 restart strapi
```

### 2. Add Environment Variable

Add to `.env.local`:

```bash
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

### 3. Set API Permissions in Strapi

1. Go to: http://localhost:1337/admin
2. Navigate to: **Settings → Users & Permissions → Roles → Public**
3. Enable these permissions:
   - **Office**: Check `find` and `findOne`
   - **Meeting-room**: Check `find` and `findOne`
   - **Coworking-tariff**: Check `find` and `findOne`
4. Click **Save**

### 4. Test API Connection

```bash
./scripts/test-strapi-connection.sh
```

This will tell you:
- ✅ If Strapi is running
- ✅ If APIs are accessible
- ✅ How many entries you have
- ✅ If environment is configured

### 5. Add Content in Strapi

#### Add an Office:

1. Go to: http://localhost:1337/admin
2. Click **Content Manager** → **Office**
3. Click **Create new entry**
4. Fill in:
   - **Name**: Офис К10
   - **Slug**: office-k10 (auto-generated)
   - **Size**: 24 м²
   - **Capacity**: до 8 человек
   - **Price**: 4,000 $/месяц
   - **Features**: Click "Add an entry" and add:
     ```json
     ["workplaces_8", "meetingZone", "spaciousLayout", "loungeArea"]
     ```
   - **Images**: Upload 3-6 images
   - **isAvailable**: Toggle ON
5. Click **Save**
6. Click **Publish**

#### Add Translations:

1. After saving, you'll see language selector at top
2. Click **English** → **Create new locale**
3. Fill in English translations
4. Save and Publish
5. Repeat for **Kazakh**

### 6. Rebuild Next.js

```bash
# Clear cache
rm -rf .next

# Rebuild
npm run build

# Start
npm run dev
```

### 7. Test the Page

Open: http://localhost:3000/ru/offices

You should now see:
- ✅ Office data from Strapi
- ✅ Images from Strapi
- ✅ Prices from Strapi

## How It Works

### Data Flow:

```
Strapi (Port 1337)
    ↓
    ↓ API Call with locale
    ↓
fetchOfficesData(locale)
    ↓
    ↓ Transform data
    ↓
OfficesClient Component
    ↓
    ↓ Display
    ↓
User sees page
```

### Fallback System:

```javascript
// Try to fetch from Strapi
let offices = await fetchOfficesData(locale);

// If no data from Strapi, use fallback
if (!offices || offices.length === 0) {
  console.log('Using fallback office data');
  offices = fallbackOffices;
}
```

This means:
- ✅ If Strapi is down → Shows hardcoded data
- ✅ If Strapi has no data → Shows hardcoded data
- ✅ If Strapi has data → Shows Strapi data

## Checking What Data is Being Used

### Method 1: Browser Console

1. Open page: http://localhost:3000/ru/offices
2. Press F12 (open DevTools)
3. Look at Console tab
4. If you see "Using fallback office data" → Using hardcoded data
5. If you don't see this message → Using Strapi data

### Method 2: Check Images

- **Strapi images**: URL starts with `http://localhost:1337/uploads/`
- **Fallback images**: URL starts with `/gallery/offices/`

Right-click on an image → "Open image in new tab" → Check URL

### Method 3: Check API Response

```bash
# See what Strapi returns
curl "http://localhost:1337/api/offices?populate=*&locale=ru" | jq '.'
```

## Common Issues

### Issue: Still seeing old data after adding to Strapi

**Solutions:**
1. Hard refresh browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Clear Next.js cache: `rm -rf .next && npm run build`
3. Check API permissions are set in Strapi
4. Check content is **Published** (not just saved)
5. Run test script: `./scripts/test-strapi-connection.sh`

### Issue: Images not showing

**Solutions:**
1. Check images are uploaded in Strapi
2. Check image URLs in API response:
   ```bash
   curl "http://localhost:1337/api/offices?populate=*&locale=ru" | grep "url"
   ```
3. Images should be accessible at: `http://localhost:1337/uploads/filename.webp`
4. Check Strapi `PUBLIC_URL` in `strapi/.env`

### Issue: Features not translating

**Check feature keys match translation keys:**

In Strapi, features should be an array like:
```json
["workplaces_8", "meetingZone", "spaciousLayout"]
```

These map to translations in `messages/ru.json`:
```json
{
  "offices": {
    "officeFeatures": {
      "workplaces_8": "8 рабочих мест",
      "meetingZone": "Переговорная зона"
    }
  }
}
```

## Adding More Content

### For Each Office:

1. Create entry in Strapi
2. Add Russian content
3. Add English translation
4. Add Kazakh translation
5. Upload images (3-6 per office)
6. Set features array
7. Publish

Repeat for all 9 offices: K10, K11, K14, K17, K18, K19, K31, K38, K41

### For Meeting Rooms:

Same process for: P6, P8, P10, P12, P16

### For Coworking:

Add Nomad tariff with:
- Name, schedule, price
- Features array
- Description

## Production Deployment

Once everything works locally:

```bash
# 1. Update production environment
# In .env.local:
NEXT_PUBLIC_STRAPI_URL=https://cms.praktikoffice.kz

# 2. Build both apps
cd strapi && npm run build && cd ..
npm run build

# 3. Start with PM2
pm2 restart all

# 4. Save PM2 config
pm2 save
```

## Need Help?

Run the test script to diagnose issues:
```bash
./scripts/test-strapi-connection.sh
```

Check the guides:
- `scripts/update-pages-for-strapi.md` - Detailed troubleshooting
- `STRAPI_INTEGRATION.md` - Technical details
- `STRAPI_TROUBLESHOOTING.md` - Common errors

## Quick Reference

```bash
# Test Strapi connection
./scripts/test-strapi-connection.sh

# Check Strapi is running
pm2 list

# View Strapi logs
pm2 logs strapi

# Restart Strapi
pm2 restart strapi

# Clear Next.js cache
rm -rf .next

# Rebuild Next.js
npm run build

# Test API manually
curl "http://localhost:1337/api/offices?populate=*&locale=ru"
```
