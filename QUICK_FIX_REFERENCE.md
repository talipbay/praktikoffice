# Quick Fix Reference Card

## 🚀 Deploy on VPS (One Command)

```bash
git pull && ./FIX_ISSUES.sh
```

---

## 🔍 What Was Fixed

| Issue | Fix | File |
|-------|-----|------|
| cms.praktikoffice.kz redirects to localhost | Commented out `url` config | `strapi/config/server.ts` |
| Cursor not visible on /map | Excluded canvas from cursor:none | `src/app/globals.css` |
| Zone updates failing | Enhanced CORS + updated URL | `strapi/config/middlewares.ts` + `.env.local` |

---

## ✅ Quick Tests

```bash
# 1. Check Strapi (should NOT redirect)
curl -I https://cms.praktikoffice.kz/admin

# 2. Check API (replace YOUR_TOKEN)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://cms.praktikoffice.kz/api/zones

# 3. Browser test
# Visit: https://praktikoffice.kz/ru/map
# - Cursor visible? ✅
# - Can mark zones? ✅
```

---

## 🔧 Manual Fix (if script fails)

```bash
# 1. Restart Strapi
cd strapi && pm2 restart strapi

# 2. Rebuild Next.js
cd .. && npm run build && pm2 restart nextjs

# 3. Restart Caddy
sudo systemctl restart caddy
```

---

## 📝 Don't Forget

Update `.env.local` with your actual Strapi API token:

```env
NEXT_PUBLIC_STRAPI_URL=https://cms.praktikoffice.kz
NEXT_PUBLIC_STRAPI_API_TOKEN=your_actual_token_here
```

Get token from: https://cms.praktikoffice.kz/admin/settings/api-tokens

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| Still redirecting | Check `strapi/config/server.ts` - url should be commented |
| Cursor still hidden | Clear cache: `rm -rf .next && npm run build` |
| Zone updates fail | Check token in `.env.local` and CORS in `strapi/config/middlewares.ts` |
| 401 errors | Token expired or wrong - regenerate in Strapi admin |

---

## 📊 Monitor (PM2)

```bash
pm2 list          # View all processes
pm2 logs          # View all logs
pm2 logs strapi   # Strapi logs only
pm2 logs nextjs   # Next.js logs only
pm2 monit         # Real-time monitoring
```

---

## 📚 Full Documentation

- `FIXES_APPLIED.md` - Detailed explanation of all fixes
- `DEPLOY_FIXES_VPS.md` - Complete VPS deployment guide
- `CHECK_CONFIG.sh` - Configuration verification script
- `FIX_ISSUES.sh` - Automated fix application script
