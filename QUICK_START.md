# Quick Start - Strapi Integration

## 🚀 I Just Want It To Work!

```bash
# Run this ONE command
./scripts/fix-cache-issue.sh
```

Then **clear your browser cache** (Ctrl+Shift+R or Cmd+Shift+R)

Done! 🎉

---

## 📋 Common Commands

```bash
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
- [ ] Run `./scripts/verify-strapi-data.sh` - all checks pass
- [ ] Run `./scripts/fix-cache-issue.sh`
- [ ] Clear browser cache
- [ ] Test the site

---

## 🎯 Quick Test

```bash
# 1. Check Strapi
curl http://localhost:1337/api/offices?populate=*

# 2. Should return JSON with your offices
# If empty, add content in Strapi admin

# 3. Rebuild
./scripts/fix-cache-issue.sh

# 4. Clear browser cache and visit site
```

---

## 💡 Tips

- Always **Publish** content in Strapi (not just Save)
- Clear browser cache after rebuilding
- Check PM2 logs if something doesn't work
- Use incognito mode to test without cache

---

## 🆘 Need Help?

1. Check logs: `pm2 logs nextjs --lines 50`
2. Look for "Using Strapi data" (good) or "Using fallback" (bad)
3. Read [FINAL_DEPLOYMENT_STEPS.md](./FINAL_DEPLOYMENT_STEPS.md)
