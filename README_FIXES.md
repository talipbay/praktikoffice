# 🔧 Praktik Office - Critical Fixes Applied

## 🎯 Issues Fixed

### ❌ Before
- cms.praktikoffice.kz → redirects to http://localhost:1337/admin
- Cursor invisible on /map page
- Cannot mark zones as occupied/free (error: "Failed to update zone on server")

### ✅ After
- cms.praktikoffice.kz → works correctly
- Cursor visible on /map page
- Zones can be marked as occupied/free successfully

---

## 🚀 Quick Deploy (VPS)

```bash
# 1. Pull changes
git pull origin main

# 2. Run fix script
chmod +x FIX_ISSUES.sh
./FIX_ISSUES.sh

# 3. Update API token in .env.local
nano .env.local
# Set: NEXT_PUBLIC_STRAPI_API_TOKEN=your_actual_token

# 4. Test
# Visit: https://praktikoffice.kz/ru/map
```

---

## 📁 Files Modified

```
strapi/config/
├── server.ts          ← Removed URL redirect
└── middlewares.ts     ← Enhanced CORS

src/app/
└── globals.css        ← Fixed cursor visibility

.env.local             ← Updated Strapi URL
```

---

## 🧪 Testing Checklist

After deployment, verify:

- [ ] Visit https://cms.praktikoffice.kz/admin (no redirect)
- [ ] Visit https://praktikoffice.kz/ru/map
- [ ] Cursor is visible on canvas
- [ ] Click free zone → mark as occupied → works
- [ ] Click occupied zone → mark as free → works
- [ ] No errors in browser console

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| `QUICK_FIX_REFERENCE.md` | Quick commands and tests |
| `DEPLOY_FIXES_VPS.md` | Complete VPS deployment guide |
| `FIXES_APPLIED.md` | Detailed technical explanation |
| `FIX_ISSUES.sh` | Automated fix script |
| `CHECK_CONFIG.sh` | Configuration checker |

---

## 🆘 Need Help?

### Strapi still redirecting?
```bash
# Check config
grep "url:" strapi/config/server.ts
# Should be commented out

# Restart Strapi
pm2 restart strapi
```

### Cursor still hidden?
```bash
# Check CSS
grep ":not(canvas)" src/app/globals.css
# Should find the exclusion

# Clear cache
rm -rf .next && npm run build && pm2 restart nextjs
```

### Zone updates failing?
```bash
# Check API token
grep "STRAPI_API_TOKEN" .env.local
# Should not be "your_token_here"

# Test API
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://cms.praktikoffice.kz/api/zones
```

---

## 🎉 Ready to Deploy!

All fixes are committed and ready. Just pull and run the script on your VPS.

**Estimated deployment time:** 2-3 minutes
