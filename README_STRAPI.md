# Strapi Integration - Quick Start

## Current Status

✅ Strapi is set up and running
✅ Content types are created (Offices, Meeting Rooms, Coworking Tariffs)
✅ Next.js pages are configured to fetch from Strapi
✅ Fallback data is available if Strapi is down

## Problem: Still Seeing Old Data?

**Read this**: [FINAL_DEPLOYMENT_STEPS.md](./FINAL_DEPLOYMENT_STEPS.md)

**Quick fix**:
```bash
./scripts/fix-cache-issue.sh
```
Then clear your browser cache (Ctrl+Shift+R or Cmd+Shift+R)

## How It Works

### Pages That Use Strapi

1. **Offices Page** (`/offices`)
   - Fetches office data from Strapi
   - Shows office name, size, capacity, price, features, images
   - Falls back to hardcoded data if Strapi is unavailable

2. **Meeting Rooms Page** (`/meeting-room`)
   - Ready to fetch from Strapi (needs implementation)
   - Currently uses hardcoded data

3. **Open Space Page** (`/open-space`)
   - Ready to fetch from Strapi (needs implementation)
   - Currently uses hardcoded data

### What's in Strapi vs Translation Files

**Strapi** (changes per entry):
- Office/room names
- Prices
- Sizes and capacities
- Feature lists
- Images

**Translation Files** (same for all entries):
- Section titles ("What's Included", "Services", etc.)
- Feature descriptions
- UI labels and buttons

## Useful Scripts

```bash
# Verify Strapi has data
./scripts/verify-strapi-data.sh

# Fix cache issues (complete rebuild)
./scripts/fix-cache-issue.sh

# Rebuild and restart (quick)
./scripts/rebuild-and-restart.sh

# Test Strapi connection
./scripts/test-strapi-connection.sh

# Test API response structure
./scripts/test-api-response.sh
```

## Adding Content to Strapi

1. Go to Strapi admin: `http://localhost:1337/admin`
2. Click "Content Manager" in sidebar
3. Select content type (Offices, Meeting Rooms, etc.)
4. Click "Create new entry"
5. Fill in the fields:
   - **Name**: Office name (e.g., "Офис К10")
   - **Slug**: URL-friendly ID (e.g., "office-k10")
   - **Size**: Size in m² (e.g., "24 м²")
   - **Capacity**: Number of people (e.g., "до 8 человек")
   - **Price**: Price with currency (e.g., "4,000 $/месяц")
   - **Features**: Array of feature keys (e.g., ["workplaces_8", "meetingZone"])
   - **Images**: Upload images from Media Library
6. Click **"Publish"** (not just Save!)
7. Rebuild Next.js: `./scripts/fix-cache-issue.sh`

## Environment Variables

In `.env.local`:
```bash
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_API_TOKEN=your_token_here
```

## PM2 Processes

```bash
# Check status
pm2 list

# View logs
pm2 logs nextjs
pm2 logs strapi

# Restart
pm2 restart nextjs
pm2 restart strapi
pm2 restart all

# Stop
pm2 stop nextjs
pm2 stop strapi
```

## Troubleshooting

### Issue: Still seeing hardcoded data

**Solution**: [FINAL_DEPLOYMENT_STEPS.md](./FINAL_DEPLOYMENT_STEPS.md)

### Issue: Strapi not running

```bash
pm2 start strapi
```

### Issue: Build fails

```bash
pnpm run build
# Check error messages
```

### Issue: Images not loading

1. Check images are uploaded in Strapi Media Library
2. Verify `NEXT_PUBLIC_STRAPI_URL` is correct
3. Check image URLs in API response

## Documentation

- [FINAL_DEPLOYMENT_STEPS.md](./FINAL_DEPLOYMENT_STEPS.md) - Fix cache issues
- [DEPLOY_WITH_STRAPI.md](./DEPLOY_WITH_STRAPI.md) - Complete deployment guide
- [STRAPI_SETUP.md](./STRAPI_SETUP.md) - Initial setup instructions
- [STRAPI_INTEGRATION.md](./STRAPI_INTEGRATION.md) - Technical integration details
- [DEBUG_STRAPI_DATA.md](./DEBUG_STRAPI_DATA.md) - Debugging guide
- [WHY_STILL_OLD_DATA.md](./WHY_STILL_OLD_DATA.md) - Explanation of cache issue

## Next Steps

1. ✅ Offices page is integrated with Strapi
2. ⏳ Meeting Rooms page needs Strapi integration
3. ⏳ Open Space page needs Strapi integration
4. ⏳ Gallery categories need Strapi integration

## Quick Commands

```bash
# Everything in one command
./scripts/fix-cache-issue.sh && echo "Now clear your browser cache!"

# Check if everything is working
pm2 list && curl http://localhost:1337/api/offices?populate=*

# Full restart
pm2 restart all && pm2 logs
```
