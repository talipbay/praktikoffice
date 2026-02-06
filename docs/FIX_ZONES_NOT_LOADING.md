# Fix: Zones Not Loading on /map Page

## Problem
- Zones are visible in Strapi admin panel
- Zones are NOT visible on `/map` page
- Cursor appears to be "under" the map

## Quick Fixes

### Fix 1: Check Strapi Permissions (Most Common)

**The zones won't load if permissions aren't set correctly.**

1. Open Strapi Admin: `https://cms.praktikoffice.kz/admin`

2. Go to: **Settings** (left sidebar) → **Roles** → **Public**

3. Scroll down to find **Zone** section

4. Enable these permissions:
   - ✅ find
   - ✅ findOne
   - ✅ create
   - ✅ update
   - ✅ delete (optional)

5. Click **Save** (top right)

6. Refresh the `/map` page

### Fix 2: Restart Services

After changing permissions or configuration:

```bash
# Restart Strapi
pm2 restart strapi

# Restart Next.js
pm2 restart nextjs

# Or restart all
pm2 restart all
```

### Fix 3: Check Browser Console

1. Open `/map` page: `https://praktikoffice.kz/en/map`

2. Press **F12** to open Developer Tools

3. Go to **Console** tab

4. Look for errors:
   - ❌ `403 Forbidden` = Permissions issue (see Fix 1)
   - ❌ `401 Unauthorized` = Invalid API token
   - ❌ `CORS error` = CORS configuration issue
   - ❌ `Failed to fetch` = Strapi not running

### Fix 4: Test API Manually

Run this in browser console on `/map` page:

```javascript
fetch('https://cms.praktikoffice.kz/api/zones', {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN_HERE'
  }
})
.then(r => r.json())
.then(d => console.log('Zones:', d.data))
.catch(e => console.error('Error:', e))
```

**Expected result:** Should show array of zones

**If you see error:**
- `403` → Fix permissions (Fix 1)
- `401` → Invalid token
- `CORS error` → See Fix 5

### Fix 5: Update CORS Configuration

If you see CORS errors in browser console:

1. **Edit Strapi middleware:**
   ```bash
   nano strapi/config/middlewares.ts
   ```

2. **Ensure CORS is configured:**
   ```typescript
   {
     name: 'strapi::cors',
     config: {
       enabled: true,
       origin: ['https://praktikoffice.kz', 'https://cms.praktikoffice.kz'],
       headers: '*',
     },
   }
   ```

3. **Restart Strapi:**
   ```bash
   pm2 restart strapi
   ```

### Fix 6: Cursor Issue

The cursor fix has been applied. If cursor is still wrong:

1. **Hard refresh the page:**
   - Press `Ctrl + Shift + R` (Windows/Linux)
   - Press `Cmd + Shift + R` (Mac)

2. **Clear browser cache:**
   - Open DevTools (F12)
   - Right-click refresh button
   - Select "Empty Cache and Hard Reload"

## Debugging Script

Run this to diagnose the issue:

```bash
bash scripts/debug-zone-loading.sh
```

This will check:
- Environment variables
- Strapi connection
- API permissions
- CORS headers
- Zone count

## Common Issues & Solutions

### Issue: "403 Forbidden"
**Solution:** Enable permissions in Strapi (Fix 1)

### Issue: "401 Unauthorized"
**Solution:** Check API token in `.env.local`

### Issue: Zones load but don't appear
**Solution:** 
1. Check browser console for JavaScript errors
2. Verify zone data format matches expected structure
3. Try creating a new zone to test

### Issue: Cursor is invisible or wrong
**Solution:**
1. Hard refresh page (Ctrl + Shift + R)
2. Check if custom cursor CSS is interfering
3. The fix has been applied to layout.tsx

## Verify Everything Works

After applying fixes:

1. **Check Strapi Admin:**
   ```
   https://cms.praktikoffice.kz/admin
   Content Manager → Zones
   ```
   Should see 44 zones

2. **Check API Response:**
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://cms.praktikoffice.kz/api/zones | jq '.data | length'
   ```
   Should output: `44`

3. **Check Map Page:**
   ```
   https://praktikoffice.kz/en/map
   ```
   Should see zones on floor plan

4. **Test Interaction:**
   - Click on a zone → Should select it
   - Right-click zone → Should show context menu
   - Cursor should change when hovering over zones

## Still Not Working?

1. **Check Strapi logs:**
   ```bash
   pm2 logs strapi
   ```

2. **Check Next.js logs:**
   ```bash
   pm2 logs nextjs
   ```

3. **Verify Strapi is running:**
   ```bash
   pm2 status
   curl https://cms.praktikoffice.kz/api/zones
   ```

4. **Check if zones exist:**
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:1337/api/zones | jq '.data | length'
   ```

## Emergency: Re-import Zones

If zones are missing from Strapi:

```bash
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337 \
NEXT_PUBLIC_STRAPI_API_TOKEN=your_token \
node scripts/migrate-zones-final.js
```

## Summary

**Most common cause:** Strapi permissions not enabled

**Quick fix:**
1. Open Strapi Admin
2. Settings → Roles → Public → Zone
3. Enable: find, findOne, create, update
4. Save
5. Refresh /map page

**If still broken:** Run `bash scripts/debug-zone-loading.sh`
