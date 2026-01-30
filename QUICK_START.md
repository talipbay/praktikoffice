# Quick Start - Strapi Integration

## 🚨 Getting 401 Error?

**You need to make Strapi API public first!**

1. Go to: `http://localhost:1337/admin`
2. Settings → Users & Permissions Plugin → Roles → Public
3. Check `find` and `findOne` for: Office, Meeting-room, Coworking-tariff
4. Click Save

**Then run:**
```bash
./scripts/fix-cache-issue.sh
```

**Detailed guide**: [HOW_TO_USE_STRAPI_DATA.md](./HOW_TO_USE_STRAPI_DATA.md)

---

## 🚀 I Just Want It To Work!

```bash
# Check if API is accessible
./scripts/fix-401-error.sh

# If API is public, rebuild
./scripts/fix-cache-issue.sh
```

Then **clear your browser cache** (Ctrl+Shift+R or Cmd+Shift+R)

Done! 🎉

---

## 📋 Common Commands

```bash
# Fix 401 error (check API permissions)
./scripts/fix-401-error.sh

# Fix "still seeing old data" issue
./scripts/fix-cache-issue.sh

# Verify Strapi has data
./scripts/verify-strapi-data.sh

# Rebuild and restart (quick)
./scripts/rebuild-and-restart.sh

# Check logs
pm2 logs nextjs
pm2 logs strapi

# Restart everything
pm2 restart all

# Check status
pm2 list
```

---

## 🔍 Troubleshooting

### Getting 401 error?

**Read**: [HOW_TO_USE_STRAPI_DATA.md](./HOW_TO_USE_STRAPI_DATA.md)

**Quick fix**: Make API public in Strapi admin (Settings → Roles → Public)

### Still seeing old data?

1. Did you run `./scripts/fix-cache-issue.sh`?
2. Did you clear browser cache? (Ctrl+Shift+R)
3. Check logs: `pm2 logs nextjs --lines 20`

### Strapi not working?

```bash
# Check if running
pm2 list

# Start if not running
pm2 start strapi

# Check data exists
./scripts/verify-strapi-data.sh
```

### Build fails?

```bash
# See errors
pnpm run build

# Check PM2 logs
pm2 logs nextjs --lines 100
```

---

## 📚 Documentation

- **[HOW_TO_USE_STRAPI_DATA.md](./HOW_TO_USE_STRAPI_DATA.md)** - Fix 401 error
- **[FINAL_DEPLOYMENT_STEPS.md](./FINAL_DEPLOYMENT_STEPS.md)** - Complete fix guide
- **[README_STRAPI.md](./README_STRAPI.md)** - Overview and how it works
- **[DEPLOY_WITH_STRAPI.md](./DEPLOY_WITH_STRAPI.md)** - Deployment guide
- **[WHY_STILL_OLD_DATA.md](./WHY_STILL_OLD_DATA.md)** - Why caching happens

---

## ✅ Checklist

Before deploying:
- [ ] Strapi is running (`pm2 list`)
- [ ] Content is added in Strapi admin
- [ ] Content is **Published** (not Draft)
- [ ] **API is public** (Settings → Roles → Public → check find/findOne)
- [ ] Run `./scripts/fix-401-error.sh` - should return 200
- [ ] Run `./scripts/fix-cache-issue.sh`
- [ ] Clear browser cache
- [ ] Test the site

---

## 🎯 Quick Test

```bash
# 1. Check API permissions
./scripts/fix-401-error.sh

# 2. Should return 200 (not 401)
# If 401, make API public in Strapi admin

# 3. Rebuild
./scripts/fix-cache-issue.sh

# 4. Clear browser cache and visit site
```

---

## 💡 Tips

- Always **Publish** content in Strapi (not just Save)
- Make API **public** for read-only access (Settings → Roles → Public)
- Clear browser cache after rebuilding
- Check PM2 logs if something doesn't work
- Use incognito mode to test without cache

---

## 🆘 Need Help?

1. Check logs: `pm2 logs nextjs --lines 50`
2. Look for "401" → Read [HOW_TO_USE_STRAPI_DATA.md](./HOW_TO_USE_STRAPI_DATA.md)
3. Look for "Using fallback" → API not accessible
4. Look for "Using Strapi data" → Everything working! ✅
