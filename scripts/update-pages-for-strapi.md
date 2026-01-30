# Update Pages to Use Strapi Data

## What needs to be done:

The pages are currently showing hardcoded data. To use Strapi data, we need to:

1. **Update `.env.local`** - Add Strapi URL
2. **Check Strapi API permissions** - Make sure public can read data
3. **Rebuild Next.js** - Clear cache and rebuild
4. **Test API connection** - Verify Strapi is returning data

## Step 1: Update Environment Variables

Add to `.env.local`:

```bash
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

## Step 2: Check Strapi API Permissions

1. Go to Strapi Admin: http://localhost:1337/admin
2. Navigate to: Settings → Users & Permissions → Roles → Public
3. Enable these permissions:
   - **Office**: `find` and `findOne`
   - **Meeting-room**: `find` and `findOne`
   - **Coworking-tariff**: `find` and `findOne`
4. Click **Save**

## Step 3: Test Strapi API

```bash
# Test if Strapi is returning data
curl "http://localhost:1337/api/offices?populate=*"

# Test with locale
curl "http://localhost:1337/api/offices?populate=*&locale=ru"

# Test meeting rooms
curl "http://localhost:1337/api/meeting-rooms?populate=*&locale=ru"

# Test coworking tariffs
curl "http://localhost:1337/api/coworking-tariffs?populate=*&locale=ru"
```

You should see JSON data with your content.

## Step 4: Rebuild Next.js

```bash
# Stop Next.js if running
pm2 stop nextjs
# or Ctrl+C if running in terminal

# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build

# Start
npm run dev
# or
pm2 restart nextjs
```

## Step 5: Verify Data is Loading

1. Open browser: http://localhost:3000/ru/offices
2. Open browser console (F12)
3. Look for console.log messages:
   - If you see "Using fallback office data" - Strapi data is not loading
   - If you don't see this message - Strapi data is loading successfully

## Troubleshooting

### Issue: Still seeing old data

**Solution 1: Clear browser cache**
```
- Press Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
- Or open in incognito/private window
```

**Solution 2: Check Strapi is running**
```bash
pm2 list
# Should show strapi as "online"

# If not running:
pm2 restart strapi
```

**Solution 3: Check API returns data**
```bash
curl "http://localhost:1337/api/offices?populate=*&locale=ru"
```

If this returns empty or error:
- Check content is published in Strapi
- Check API permissions are set
- Check Strapi logs: `pm2 logs strapi`

**Solution 4: Check environment variable**
```bash
# Make sure .env.local has:
cat .env.local | grep STRAPI

# Should show:
# NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

**Solution 5: Force rebuild**
```bash
rm -rf .next
rm -rf node_modules/.next
npm run build
npm run dev
```

### Issue: Images not loading from Strapi

**Check image URLs in Strapi response:**
```bash
curl "http://localhost:1337/api/offices?populate=*&locale=ru" | grep "url"
```

Images should have full URLs like:
- `http://localhost:1337/uploads/office_image_123.webp`

If images show as `/uploads/...` (relative), check `strapi/config/server.js`:
```javascript
url: env('PUBLIC_URL', 'http://localhost:1337'),
```

### Issue: "Cannot read properties of undefined"

This means Strapi data structure doesn't match expected format.

**Check data structure:**
```bash
curl "http://localhost:1337/api/offices?populate=*&locale=ru" | jq '.'
```

Expected structure:
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "name": "Офис К10",
        "slug": "office-k10",
        "price": "4,000 $/месяц",
        "features": ["workplaces_8", "meetingZone"],
        "images": {
          "data": [
            {
              "id": 1,
              "attributes": {
                "url": "/uploads/image.webp"
              }
            }
          ]
        }
      }
    }
  ]
}
```

## Quick Test Script

Save as `test-strapi-connection.sh`:

```bash
#!/bin/bash

echo "Testing Strapi Connection..."
echo ""

# Test Strapi health
echo "1. Testing Strapi health..."
curl -s http://localhost:1337/_health && echo "✅ Strapi is running" || echo "❌ Strapi is not running"
echo ""

# Test offices API
echo "2. Testing Offices API..."
OFFICES=$(curl -s "http://localhost:1337/api/offices?populate=*&locale=ru")
if echo "$OFFICES" | grep -q '"data"'; then
    COUNT=$(echo "$OFFICES" | grep -o '"id":' | wc -l)
    echo "✅ Offices API working - Found $COUNT offices"
else
    echo "❌ Offices API not working"
    echo "Response: $OFFICES"
fi
echo ""

# Test meeting rooms API
echo "3. Testing Meeting Rooms API..."
ROOMS=$(curl -s "http://localhost:1337/api/meeting-rooms?populate=*&locale=ru")
if echo "$ROOMS" | grep -q '"data"'; then
    COUNT=$(echo "$ROOMS" | grep -o '"id":' | wc -l)
    echo "✅ Meeting Rooms API working - Found $COUNT rooms"
else
    echo "❌ Meeting Rooms API not working"
fi
echo ""

# Test coworking API
echo "4. Testing Coworking Tariffs API..."
TARIFFS=$(curl -s "http://localhost:1337/api/coworking-tariffs?populate=*&locale=ru")
if echo "$TARIFFS" | grep -q '"data"'; then
    COUNT=$(echo "$TARIFFS" | grep -o '"id":' | wc -l)
    echo "✅ Coworking Tariffs API working - Found $COUNT tariffs"
else
    echo "❌ Coworking Tariffs API not working"
fi
echo ""

echo "Test complete!"
```

Run with:
```bash
chmod +x test-strapi-connection.sh
./test-strapi-connection.sh
```

## Expected Behavior

When everything is working:

1. **Offices page** (`/ru/offices`):
   - Shows offices from Strapi
   - Images load from Strapi
   - Prices show from Strapi
   - Features translate correctly

2. **Meeting Rooms page** (`/ru/meeting-room`):
   - Shows meeting rooms from Strapi
   - Images load from Strapi
   - Prices and details from Strapi

3. **Open Space page** (`/ru/open-space`):
   - Shows coworking tariff from Strapi
   - Images load from Strapi (if added to gallery)
   - Prices from Strapi

## Next Steps After Data Loads

Once Strapi data is loading:

1. **Add all content** in Strapi (offices, meeting rooms, coworking)
2. **Upload images** for each entry
3. **Translate content** to all 3 languages (ru, en, kz)
4. **Publish** all entries
5. **Test** each language version
6. **Deploy** to production with PM2
