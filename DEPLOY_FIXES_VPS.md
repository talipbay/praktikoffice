# VPS Deployment Guide - Apply Fixes

## Quick Deploy Steps

### 1. Upload Changes to VPS

```bash
# From your local machine, push to git
git add .
git commit -m "Fix: Strapi redirect, cursor visibility, and zone updates"
git push origin main

# On VPS, pull changes
cd /path/to/praktikoffice
git pull origin main
```

### 2. Apply Fixes on VPS

```bash
# Run the fix script
chmod +x FIX_ISSUES.sh CHECK_CONFIG.sh
./FIX_ISSUES.sh
```

Or manually:

```bash
# 1. Restart Strapi
cd strapi
pm2 restart strapi
# or if using npm directly:
# pkill -f strapi && npm run start &

# 2. Rebuild Next.js
cd ..
npm run build
pm2 restart nextjs
# or if using npm directly:
# pkill -f next && npm run start &

# 3. Restart Caddy (to ensure config is fresh)
sudo systemctl restart caddy
```

### 3. Verify Configuration

```bash
./CHECK_CONFIG.sh
```

---

## Important: Update Environment Variables

Make sure your VPS `.env.local` has the correct Strapi URL:

```bash
# Edit .env.local on VPS
nano .env.local
```

Should contain:
```env
NEXT_PUBLIC_STRAPI_URL=https://cms.praktikoffice.kz
NEXT_PUBLIC_STRAPI_API_TOKEN=your_actual_token_here
```

**Get your Strapi API token:**
1. Visit: https://cms.praktikoffice.kz/admin
2. Go to Settings → API Tokens
3. Create a new token with "Full access" or copy existing one
4. Update `.env.local` with the token

---

## Testing After Deployment

### Test 1: Strapi Admin Access
```bash
curl -I https://cms.praktikoffice.kz/admin
# Should return 200 OK, NOT redirect to localhost
```

### Test 2: API Connection
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://cms.praktikoffice.kz/api/zones
# Should return zone data
```

### Test 3: Browser Tests
1. Visit https://praktikoffice.kz/ru/map
2. Check cursor is visible on canvas ✅
3. Click a free zone → mark as occupied ✅
4. Click an occupied zone → mark as free ✅

---

## Troubleshooting

### Issue: Still redirecting to localhost

**Check Strapi config:**
```bash
grep "url:" strapi/config/server.ts
# Should be commented out or not present
```

**Restart Strapi:**
```bash
cd strapi
pm2 restart strapi
pm2 logs strapi
```

### Issue: Cursor still not visible

**Check CSS was updated:**
```bash
grep ":not(canvas)" src/app/globals.css
# Should find the line
```

**Clear Next.js cache and rebuild:**
```bash
rm -rf .next
npm run build
pm2 restart nextjs
```

### Issue: Zone updates still failing

**Check CORS config:**
```bash
grep "methods:" strapi/config/middlewares.ts
# Should show methods array
```

**Check Strapi logs:**
```bash
pm2 logs strapi
# Look for CORS or 401/403 errors
```

**Verify API token:**
```bash
# Test API call
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://cms.praktikoffice.kz/api/zones
```

---

## PM2 Commands (if using PM2)

```bash
# View all processes
pm2 list

# Restart services
pm2 restart strapi
pm2 restart nextjs

# View logs
pm2 logs strapi
pm2 logs nextjs

# Monitor
pm2 monit
```

---

## Rollback (if needed)

If something goes wrong:

```bash
# Rollback git changes
git reset --hard HEAD~1

# Rebuild
npm run build
pm2 restart all

# Or restore from backup
# cp -r /backup/praktikoffice/* .
```

---

## Files Changed

- ✅ `strapi/config/server.ts` - Removed URL redirect
- ✅ `src/app/globals.css` - Fixed cursor visibility
- ✅ `strapi/config/middlewares.ts` - Enhanced CORS config
- ✅ `.env.local` - Updated Strapi URL to production

---

## Post-Deployment Checklist

- [ ] Strapi accessible at https://cms.praktikoffice.kz/admin
- [ ] No redirect to localhost
- [ ] Cursor visible on /map page
- [ ] Can mark zones as occupied
- [ ] Can mark zones as free
- [ ] No console errors in browser
- [ ] API token configured in .env.local
- [ ] Caddy serving both domains correctly
