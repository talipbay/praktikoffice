# Zone Migration Guide - localStorage to Strapi

## Overview

If you created zones before the Strapi integration, they're stored in your browser's localStorage. This guide shows you how to migrate them to Strapi so everyone can see them.

## 🎯 Quick Migration (Recommended)

### Method 1: Browser Console (Easiest)

1. **Open the map page**:
   ```
   http://localhost:3000/en/map
   ```

2. **Open browser console**:
   - Chrome/Edge: Press `F12` or `Ctrl+Shift+J` (Windows) / `Cmd+Option+J` (Mac)
   - Firefox: Press `F12` or `Ctrl+Shift+K` (Windows) / `Cmd+Option+K` (Mac)
   - Safari: Enable Developer menu, then `Cmd+Option+C`

3. **Copy the migration script**:
   - Open `scripts/migrate-zones-browser.js`
   - Copy the entire content

4. **Paste and run**:
   - Paste into the console
   - Press `Enter`
   - Enter your Strapi API token when prompted

5. **Wait for completion**:
   ```
   🚀 Starting zone migration...
   📦 Found 10 zones in localStorage
   ✅ [1/10] Created 🟢
   ✅ [2/10] Created 🔴 (Company A)
   ...
   🎉 Migration completed successfully!
   ```

6. **Refresh the page** to see zones loaded from Strapi

### Method 2: Export/Import (Manual)

1. **Export zones from old map**:
   - Open the map with localStorage zones
   - Click "Export Zones" button
   - Save the JSON file

2. **Import to new map**:
   - Refresh the page (now using Strapi)
   - Click "Import Zones" button
   - Select the exported JSON file
   - Zones will be saved to Strapi

### Method 3: Node.js Script (Advanced)

1. **Export zones to file**:
   - Open map page
   - Click "Export Zones"
   - Save as `zones-backup.json` in project root

2. **Run migration script**:
   ```bash
   node scripts/migrate-zones-to-strapi.js
   ```

3. **Check output**:
   ```
   📦 Found 10 zones to migrate
   🎯 Target: http://localhost:1337
   
   🚀 Starting migration...
   ✅ [1/10] Created zone "abc123" 🟢
   ✅ [2/10] Created zone "def456" 🔴 (Company A)
   ...
   🎉 Migration completed successfully!
   ```

## 📋 Prerequisites

### For All Methods
- ✅ Strapi is running (`cd strapi && npm run develop`)
- ✅ Zone content type created in Strapi
- ✅ Permissions configured (see STRAPI_ZONE_SETUP.md)
- ✅ API token available

### For Node.js Script
- ✅ Zones exported to `zones-backup.json`
- ✅ `NEXT_PUBLIC_STRAPI_API_TOKEN` in `.env.local`

## 🔑 Getting Your API Token

1. **Open Strapi Admin**:
   ```
   http://localhost:1337/admin
   ```

2. **Go to Settings → API Tokens**

3. **Create or copy existing token**:
   - Name: "Zone Migration"
   - Token type: Full access
   - Copy the token

4. **Use the token**:
   - Browser method: Paste when prompted
   - Node.js method: Add to `.env.local`

## 📊 Migration Process

### What Happens

1. **Read zones** from localStorage or JSON file
2. **Check each zone** if it already exists in Strapi
3. **Skip existing zones** to avoid duplicates
4. **Create new zones** in Strapi
5. **Report results** with summary

### Data Mapping

localStorage → Strapi:
```javascript
{
  id: "abc123"           → zoneId: "abc123"
  vertices: [...]        → vertices: [...]
  status: "occupied"     → status: "occupied"
  companyName: "Acme"    → companyName: "Acme"
  createdAt: 1234567890  → (Strapi auto-generates)
  updatedAt: 1234567890  → (Strapi auto-generates)
}
```

## 🐛 Troubleshooting

### "No zones found in localStorage"

**Problem**: localStorage is empty or cleared

**Solution**:
1. Check if you're on the correct domain
2. Try opening the old map URL
3. Check browser's localStorage in DevTools:
   - Application tab → Local Storage
   - Look for `interactive-zone-manager-zones`

### "401 Unauthorized"

**Problem**: Invalid or missing API token

**Solution**:
1. Verify token in Strapi Admin
2. Check token in `.env.local` (Node.js method)
3. Re-enter token when prompted (browser method)

### "403 Forbidden"

**Problem**: Insufficient permissions

**Solution**:
1. Go to Strapi Admin → Settings → Roles → Public
2. Enable all permissions for "zone" content type
3. Save and try again

### "Zone already exists"

**Problem**: Zone with same ID already in Strapi

**Solution**:
- This is normal! Script skips existing zones
- If you want to re-import, delete zones in Strapi first

### "Failed to create zone"

**Problem**: Invalid zone data or Strapi error

**Solution**:
1. Check Strapi logs for errors
2. Verify zone data structure
3. Check Strapi content type fields match

## ✅ Verification

After migration, verify everything worked:

1. **Check Strapi Admin**:
   ```
   http://localhost:1337/admin
   ```
   - Go to Content Manager → Zones
   - You should see all migrated zones

2. **Check map interface**:
   ```
   http://localhost:3000/en/map
   ```
   - Refresh the page
   - All zones should be visible
   - Try creating a new zone
   - Open in another browser - zones should be there!

3. **Check zone count**:
   - Compare localStorage count with Strapi count
   - Should match (or Strapi has more if you created new ones)

## 🔄 Re-running Migration

If you need to run migration again:

1. **Delete existing zones in Strapi** (optional):
   - Go to Content Manager → Zones
   - Select all → Delete

2. **Run migration script again**:
   - Script will skip existing zones
   - Only creates missing zones

## 📝 Migration Checklist

Before migration:
- [ ] Strapi is running
- [ ] Zone content type created
- [ ] Permissions configured
- [ ] API token obtained
- [ ] Zones exist in localStorage or JSON file

During migration:
- [ ] Script runs without errors
- [ ] All zones processed
- [ ] Success count matches expected

After migration:
- [ ] Zones visible in Strapi Admin
- [ ] Zones visible on map page
- [ ] Can create new zones
- [ ] Multi-user access works

## 🎯 Best Practices

1. **Backup first**: Export zones to JSON before migration
2. **Test with one zone**: Try migrating one zone first
3. **Check Strapi**: Verify zone appears in Strapi Admin
4. **Verify on map**: Refresh and check zone is visible
5. **Full migration**: Run full migration once tested

## 📚 Related Documentation

- **[STRAPI_ZONE_SETUP.md](STRAPI_ZONE_SETUP.md)** - Strapi setup guide
- **[UPDATES_SUMMARY.md](UPDATES_SUMMARY.md)** - What changed
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Quick reference

## 🆘 Need Help?

1. Check Strapi is running: `cd strapi && npm run develop`
2. Check browser console for errors
3. Check Strapi logs for API errors
4. Verify API token is correct
5. Ensure permissions are set

## 🎉 Success!

Once migration is complete:
- ✅ All zones stored in Strapi
- ✅ Visible to all users
- ✅ Persistent across sessions
- ✅ Backed up in database
- ✅ Ready for production!

You can now safely clear localStorage - zones are on the server! 🚀
