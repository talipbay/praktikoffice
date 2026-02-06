# Deploying with Strapi - Complete Guide

## The Problem: Cached Data

When you see hardcoded data even though Strapi has content, it's because Next.js cached the page during build time when Strapi was empty or not running.

## Solution: Complete Rebuild Process

### Step 1: Verify Strapi Has Data

```bash
# Run verification script
./scripts/verify-strapi-data.sh
```

This will check:
- ✅ Strapi is running
- ✅ Offices endpoint has data
- ✅ Meeting rooms endpoint has data
- ✅ Coworking tariffs endpoint has data

**Important**: Make sure your content is **Published** (not Draft) in Strapi admin!

### Step 2: Rebuild and Restart

```bash
# Run the rebuild script
./scripts/rebuild-and-restart.sh
```

This script will:
1. Stop PM2 process
2. Clear all Next.js cache (.next directory)
3. Rebuild the application
4. Restart PM2 process

### Step 3: Clear Browser Cache

After rebuild, you MUST clear your browser cache:

- **Chrome/Firefox**: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- **Safari**: `Cmd+Option+R`

Or open in incognito/private mode.

### Step 4: Verify It's Working

```bash
# Check PM2 logs
pm2 logs nextjs --lines 50
```

Look for these log messages:
```
Fetching from Strapi: http://localhost:1337/api/offices?populate=*&locale=ru
Strapi response received: {...}
Using Strapi data - found X offices
```

If you see "Using fallback office data", something is wrong.

## Common Issues

### Issue 1: Still Seeing Old Data

**Cause**: Browser cache or Next.js cache not cleared

**Solution**:
```bash
# On server
pm2 stop nextjs
rm -rf .next
pnpm run build
pm2 restart nextjs

# In browser
Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
```

### Issue 2: "Using fallback office data" in logs

**Cause**: Strapi not running or no data

**Solution**:
```bash
# Check if Strapi is running
pm2 list

# If not running, start it
pm2 start strapi

# Verify data exists
./scripts/verify-strapi-data.sh
```

### Issue 3: Content Not Showing

**Cause**: Content is in Draft state

**Solution**:
1. Go to Strapi admin: `http://localhost:1337/admin`
2. Open your content (Offices, Meeting Rooms, etc.)
3. Click "Publish" button (not just Save)

### Issue 4: Images Not Loading

**Cause**: Images not uploaded or wrong URL

**Solution**:
1. Check image URLs in Strapi response
2. Make sure images are uploaded in Strapi Media Library
3. Verify `NEXT_PUBLIC_STRAPI_URL` in `.env.local`

## Environment Variables

Make sure these are set in `.env.local`:

```bash
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_API_TOKEN=your_token_here
```

After changing environment variables:
```bash
./scripts/rebuild-and-restart.sh
```

## Production Deployment Checklist

- [ ] Strapi is running and accessible
- [ ] All content is Published (not Draft)
- [ ] Images are uploaded to Strapi
- [ ] Environment variables are set correctly
- [ ] Run `./scripts/verify-strapi-data.sh` - all checks pass
- [ ] Run `./scripts/rebuild-and-restart.sh`
- [ ] Clear browser cache and test
- [ ] Check PM2 logs for errors

## Quick Commands Reference

```bash
# Verify Strapi data
./scripts/verify-strapi-data.sh

# Rebuild and restart
./scripts/rebuild-and-restart.sh

# Check logs
pm2 logs nextjs --lines 50
pm2 logs strapi --lines 50

# Restart services
pm2 restart all

# Check status
pm2 list

# Test Strapi API directly
curl http://localhost:1337/api/offices?populate=*
```

## How It Works

1. **Build Time**: Next.js fetches data from Strapi and generates static pages
2. **Runtime**: Pages are served from cache
3. **Revalidation**: With `cache: 'no-store'`, data is fetched on every request (good for development)
4. **Production**: Change to `cache: 'force-cache'` with revalidation for better performance

## Current Configuration

The app is configured to:
- ✅ Fetch fresh data on every request (no caching)
- ✅ Fall back to hardcoded data if Strapi is unavailable
- ✅ Log all fetch operations for debugging
- ✅ Support multiple locales (ru, kz, en)

## Need Help?

Check the logs:
```bash
pm2 logs nextjs --lines 100
```

Look for:
- "Fetching from Strapi" - confirms fetch is happening
- "Strapi response received" - confirms data is coming back
- "Using Strapi data" - confirms data is being used
- "Using fallback" - means Strapi data is not available
