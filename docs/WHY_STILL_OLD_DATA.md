# Why You're Still Seeing Old Data

## The Problem

You added content to Strapi, but your website still shows the old hardcoded data. This is happening because of **Next.js caching**.

## What's Happening

1. **During Build**: When you first built the site, Strapi was empty or not running
2. **Next.js Cached**: Next.js generated static pages with empty/fallback data
3. **Cache Persists**: Even though Strapi now has data, Next.js serves the cached pages
4. **Browser Cache**: Your browser also cached the old pages

## The Solution

### Quick Fix (3 Steps)

1. **Run the fix script**:
   ```bash
   ./scripts/fix-cache-issue.sh
   ```

2. **Clear browser cache**:
   - Chrome/Firefox: `Ctrl+Shift+R` or `Cmd+Shift+R`
   - Safari: `Cmd+Option+R`
   - Or use incognito/private mode

3. **Verify it works**:
   - Visit your site
   - Check PM2 logs: `pm2 logs nextjs --lines 20`
   - Look for "Using Strapi data" message

### What the Fix Script Does

1. ✅ Verifies Strapi is running and has data
2. ✅ Stops Next.js process
3. ✅ Deletes ALL cache files (.next, node_modules/.cache, etc.)
4. ✅ Rebuilds the application from scratch
5. ✅ Restarts Next.js
6. ✅ Shows you the logs

## How to Prevent This

### Make Sure Content is Published

In Strapi admin panel:
1. Open your content (Office, Meeting Room, etc.)
2. Click **"Publish"** button (not just "Save")
3. Draft content is NOT visible to the API

### Verify Before Deploying

```bash
# Check Strapi has data
./scripts/verify-strapi-data.sh

# Should show:
# ✅ Found X office(s)
# ✅ Found X meeting room(s)
# ✅ Found X coworking tariff(s)
```

## Technical Details

### Why Next.js Caches

Next.js uses **Static Site Generation (SSG)** and **Incremental Static Regeneration (ISR)** to make sites fast. It generates pages at build time and caches them.

### Current Configuration

I've configured the app to use `cache: 'no-store'` which means:
- ✅ Always fetch fresh data from Strapi
- ✅ No caching (good for development)
- ❌ Slower (but ensures you see latest data)

### For Production

Later, you can enable caching for better performance:
```typescript
cache: 'force-cache',
next: { revalidate: 300 }  // Refresh every 5 minutes
```

## Troubleshooting

### Still seeing old data?

1. **Did you clear browser cache?** This is the #1 issue
2. **Check PM2 logs**: `pm2 logs nextjs --lines 50`
3. **Look for**: "Using Strapi data" (good) or "Using fallback" (bad)
4. **Verify Strapi**: `curl http://localhost:1337/api/offices?populate=*`

### "Using fallback office data" in logs?

This means Strapi data is not being fetched:
- Check Strapi is running: `pm2 list`
- Check content is Published in Strapi admin
- Check API works: `./scripts/verify-strapi-data.sh`

### Build fails?

```bash
# See detailed errors
pnpm run build

# Check TypeScript errors
pnpm run type-check
```

## Summary

**The issue**: Next.js cached empty pages during build
**The fix**: Clear cache, rebuild, restart, clear browser cache
**The command**: `./scripts/fix-cache-issue.sh`
**Don't forget**: Clear browser cache too!

---

**Read the complete guide**: [FINAL_DEPLOYMENT_STEPS.md](./FINAL_DEPLOYMENT_STEPS.md)
