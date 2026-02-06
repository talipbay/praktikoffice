# Final Deployment Steps - Fix "Still Seeing Old Data"

## The Problem

You're seeing hardcoded data because Next.js cached the pages when Strapi was empty. Even though Strapi now has data, Next.js is serving the old cached version.

## The Solution (3 Simple Steps)

### Step 1: Run the Fix Script

```bash
cd /root/praktikoffice
./scripts/fix-cache-issue.sh
```

This script will:
- ✅ Verify Strapi is running and has data
- ✅ Stop Next.js
- ✅ Clear ALL caches (.next, node_modules/.cache, etc.)
- ✅ Rebuild the application
- ✅ Restart Next.js
- ✅ Show you the logs

### Step 2: Clear Browser Cache

**This is critical!** Your browser also cached the old pages.

**Option A: Hard Refresh**
- Chrome/Firefox: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Safari: `Cmd+Option+R`

**Option B: Incognito/Private Mode**
- Open your site in incognito/private browsing mode

### Step 3: Verify It's Working

Visit: `http://your-domain.com/ru/offices`

You should now see:
- ✅ Data from Strapi (not hardcoded)
- ✅ Images from Strapi
- ✅ Correct prices and descriptions

## How to Verify Strapi Data First

Before running the fix script, you can verify Strapi has data:

```bash
./scripts/verify-strapi-data.sh
```

This will show you:
- How many offices are in Strapi
- How many meeting rooms are in Strapi
- How many coworking tariffs are in Strapi

## Important Notes

### Content Must Be Published

In Strapi admin panel, make sure your content is **Published** (not Draft):

1. Go to `http://localhost:1337/admin`
2. Click on "Content Manager"
3. Open each office/meeting room
4. Click the "Publish" button (not just Save)

### Check PM2 Logs

After running the fix script, check the logs:

```bash
pm2 logs nextjs --lines 50
```

Look for these messages:
```
✅ Good: "Fetching from Strapi: http://localhost:1337/api/offices..."
✅ Good: "Using Strapi data - found X offices"
❌ Bad: "Using fallback office data"
```

## Troubleshooting

### Still seeing old data after fix?

1. **Clear browser cache again** - This is the most common issue
2. **Check PM2 logs** - Look for "Using Strapi data" message
3. **Verify Strapi is running**: `pm2 list`
4. **Check content is Published** in Strapi admin

### "Using fallback office data" in logs?

This means Strapi data is not being fetched. Check:

```bash
# Is Strapi running?
pm2 list

# Does Strapi have data?
curl http://localhost:1337/api/offices?populate=*

# Is content Published?
# Check in Strapi admin panel
```

### Build fails?

```bash
# Check for TypeScript errors
pnpm run build

# Check PM2 logs
pm2 logs nextjs --lines 100
```

## Quick Reference

```bash
# Fix everything
./scripts/fix-cache-issue.sh

# Verify Strapi data
./scripts/verify-strapi-data.sh

# Rebuild and restart
./scripts/rebuild-and-restart.sh

# Check logs
pm2 logs nextjs
pm2 logs strapi

# Restart everything
pm2 restart all

# Check status
pm2 list
```

## What Changed in the Code

I made these changes to fix the caching issue:

1. **src/lib/strapi.ts**: Changed from `revalidate: 60` to `cache: 'no-store'` to always fetch fresh data
2. **scripts/fix-cache-issue.sh**: New script that does complete cache clear and rebuild
3. **scripts/verify-strapi-data.sh**: New script to verify Strapi has data before deploying

## Production Optimization (Later)

For production, you may want to enable caching again for better performance:

In `src/lib/strapi.ts`, change:
```typescript
cache: 'no-store'  // Current: always fetch fresh
```

To:
```typescript
cache: 'force-cache',
next: { revalidate: 300 }  // Cache for 5 minutes
```

But for now, keep it as `no-store` to avoid caching issues during development.

---

## Summary

1. Run: `./scripts/fix-cache-issue.sh`
2. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
3. Visit your site and verify data is from Strapi

That's it! 🎉
