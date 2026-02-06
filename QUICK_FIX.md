# Quick Fix - Migration Failed

## Problem
`fetch failed` error = Node.js can't connect to Strapi

## Solution: Use Localhost

If Strapi is running on the same server, use localhost:

```bash
# Run this ONE command:
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337 node scripts/migrate-zones-debug.js
```

## Step by Step

### 1. Check Strapi is Running
```bash
curl http://localhost:1337/api/zones
```

**If this fails**, start Strapi:
```bash
cd strapi
npm run develop
# Or with PM2:
pm2 restart strapi
```

### 2. Run Migration with Localhost
```bash
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337 node scripts/migrate-zones-debug.js
```

### 3. Done!
Zones should migrate successfully.

## Why This Works

- Your `.env.local` has: `https://cms.praktikoffice.kz`
- Node.js on server can't connect to HTTPS (SSL/DNS issues)
- Using `localhost` bypasses these issues
- Strapi is on same server, so localhost works

## Alternative: Edit .env.local Temporarily

```bash
# Backup
cp .env.local .env.local.backup

# Edit
nano .env.local
# Change: NEXT_PUBLIC_STRAPI_URL=http://localhost:1337

# Run migration
node scripts/migrate-zones-debug.js

# Restore
mv .env.local.backup .env.local
```

## Verify After Migration

```bash
# Check zones in Strapi
curl http://localhost:1337/api/zones | grep -o '"data":\[' | wc -l

# Or open Strapi Admin
# https://cms.praktikoffice.kz/admin
# Content Manager → Zones
```

## Still Failing?

See **MIGRATION_TROUBLESHOOTING.md** for detailed solutions.
