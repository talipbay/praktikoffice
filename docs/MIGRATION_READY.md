# ✅ Migration Ready!

## 📦 Your Zones File

✅ **File found**: `public/zones-cleaned.json`
✅ **Scripts updated**: Ready to use this file
✅ **44 zones** ready to migrate

## 🚀 Run Migration (Choose One)

### Option 1: Simple Script (Recommended)
```bash
node scripts/migrate-zones-simple.js
```
**Features:**
- Shows progress with emojis
- 3-second countdown before starting
- Detailed summary
- Better error messages

### Option 2: Quick Script
```bash
node scripts/migrate-zones-to-strapi.js
```
**Features:**
- Faster execution
- Minimal output
- Good for automation

## 📋 Prerequisites

Before running migration:

1. **Strapi is running**:
   ```bash
   cd strapi
   npm run develop
   ```

2. **Zone content type created** in Strapi:
   - Open http://localhost:1337/admin
   - Content-Type Builder → "zone" should exist
   - If not, see STRAPI_ZONE_SETUP.md

3. **Permissions set**:
   - Settings → Roles → Public
   - All permissions enabled for "zone"

4. **API token in .env.local**:
   ```bash
   NEXT_PUBLIC_STRAPI_API_TOKEN=your_token_here
   ```

## 🎯 On Your Server

```bash
# Navigate to project
cd ~/praktikoffice

# Run migration
node scripts/migrate-zones-simple.js
```

## 📊 Expected Result

```
🚀 Zone Migration Script

📍 Strapi URL: http://localhost:1337
🔑 Token: ✓ Found

📂 Reading: /root/praktikoffice/public/zones-cleaned.json
✓ File parsed successfully

📦 Found 44 zones to migrate

🚀 Starting migration...

✅ [1/44] Created 🔴 (MDQ)
✅ [2/44] Created 🟢
...
✅ [44/44] Created 🟢

==================================================
📊 Migration Summary
==================================================
✅ Successfully created: 44
⏭️  Skipped (already exist): 0
❌ Failed: 0
📦 Total zones: 44
==================================================

🎉 Migration completed successfully!
```

## ✅ Verify

After migration:

1. **Strapi Admin**:
   ```
   http://localhost:1337/admin
   ```
   - Content Manager → Zones
   - Should see 44 zones

2. **Map Interface**:
   ```
   http://your-domain.com/en/map
   ```
   - Refresh page
   - All zones visible

3. **API Check**:
   ```bash
   curl http://localhost:1337/api/zones | jq '.data | length'
   # Should output: 44
   ```

## 🐛 Troubleshooting

### "Token not found"
```bash
# Check .env.local
cat .env.local | grep STRAPI_API_TOKEN

# Add if missing
echo "NEXT_PUBLIC_STRAPI_API_TOKEN=your_token" >> .env.local
```

### "Connection refused"
```bash
# Start Strapi
cd strapi && npm run develop
```

### "403 Forbidden"
- Strapi Admin → Settings → Roles → Public
- Enable all permissions for "zone"

### "File not found"
```bash
# Check file exists
ls -la public/zones-cleaned.json

# Should show the file
```

## 🔄 Re-run Safe

Both scripts are safe to run multiple times:
- Existing zones are skipped
- Only new zones are created
- No duplicates

## 📝 Files Created

- ✅ `scripts/migrate-zones-simple.js` - Detailed migration
- ✅ `scripts/migrate-zones-to-strapi.js` - Quick migration
- ✅ `RUN_MIGRATION.md` - This guide
- ✅ `MIGRATE_COMMAND.txt` - One-liner command

## 🎉 Ready!

Everything is set up. Just run:

```bash
node scripts/migrate-zones-simple.js
```

Your 44 zones will be migrated to Strapi! 🚀
