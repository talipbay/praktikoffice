# Run Zone Migration - Quick Guide

## ✅ Your File is Ready

You have `public/zones-cleaned.json` - perfect!

## 🚀 Run Migration Now

### On Server:

```bash
# Make sure you're in the project directory
cd ~/praktikoffice

# Run the migration
node scripts/migrate-zones-simple.js
```

### Expected Output:

```
🚀 Zone Migration Script

📍 Strapi URL: http://localhost:1337
🔑 Token: ✓ Found

📂 Reading: /root/praktikoffice/public/zones-cleaned.json
✓ File parsed successfully

📦 Found 44 zones to migrate

📋 Example zone:
   ID: zone_1762170399031_j4jhojg8j
   Status: occupied
   Company: MDQ
   Vertices: 6

🎯 Ready to migrate to Strapi
Press Ctrl+C to cancel, or wait 3 seconds to continue...

🚀 Starting migration...

✅ [1/44] Created 🔴 (MDQ)
✅ [2/44] Created 🟢
✅ [3/44] Created 🟢
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
💡 Check Strapi Admin to verify: http://localhost:1337/admin
```

## 🔧 If You Get Errors

### "Token not found"
```bash
# Check .env.local exists
cat .env.local | grep STRAPI_API_TOKEN

# If missing, add it:
echo "NEXT_PUBLIC_STRAPI_API_TOKEN=your_token_here" >> .env.local
```

### "Connection refused"
```bash
# Start Strapi first
cd strapi
npm run develop
```

### "403 Forbidden"
- Go to Strapi Admin: http://localhost:1337/admin
- Settings → Roles → Public
- Enable all permissions for "zone"
- Save and try again

## ✅ Verify Migration

After migration:

1. **Check Strapi Admin**:
   ```
   http://localhost:1337/admin
   ```
   - Go to Content Manager → Zones
   - Should see all 44 zones

2. **Check Map Interface**:
   ```
   http://your-domain.com/en/map
   ```
   - Refresh the page
   - All zones should be visible

## 🔄 Re-run if Needed

The script is safe to run multiple times:
- Already existing zones will be skipped
- Only new zones will be created

## 📝 Alternative: Use Original Script

If you prefer the original script:

```bash
# Copy zones file to expected location
cp public/zones-cleaned.json zones-backup.json

# Run original script
node scripts/migrate-zones-to-strapi.js
```

## 🎯 Quick Commands

```bash
# Run migration
node scripts/migrate-zones-simple.js

# Check Strapi is running
curl http://localhost:1337/api/zones

# View zones in Strapi
# Open: http://localhost:1337/admin
```

## 🎉 Done!

Once migration completes successfully, all your zones are on the server! 🚀
