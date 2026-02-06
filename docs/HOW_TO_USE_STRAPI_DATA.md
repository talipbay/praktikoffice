# How to Use Strapi Data - Complete Guide

## Current Issue: 401 Unauthorized Error

Your logs show:
```
Error: Strapi API error: 401
Using fallback office data
```

This means **Strapi is blocking the API requests** because permissions are not set.

---

## Fix: Make Strapi API Public (5 Minutes)

### Step 1: Open Strapi Admin

Go to: `http://localhost:1337/admin` (or your domain with port 1337)

Login with your admin credentials.

### Step 2: Configure Public Permissions

1. Click **"Settings"** in the left sidebar (gear icon)
2. Under "Users & Permissions Plugin", click **"Roles"**
3. Click on the **"Public"** role
4. Scroll down to find your content types:

   **For "Office":**
   - ✅ Check `find`
   - ✅ Check `findOne`

   **For "Meeting-room":**
   - ✅ Check `find`
   - ✅ Check `findOne`

   **For "Coworking-tariff":**
   - ✅ Check `find`
   - ✅ Check `findOne`

   **For "Gallery-category"** (if you have it):
   - ✅ Check `find`
   - ✅ Check `findOne`

5. Click **"Save"** button at the top right

### Step 3: Test the API

```bash
# Test if API is now public
curl http://localhost:1337/api/offices?populate=*
```

Should return JSON with your offices (not 401 error).

### Step 4: Rebuild Next.js

```bash
./scripts/fix-cache-issue.sh
```

### Step 5: Clear Browser Cache

- Chrome/Firefox: `Ctrl+Shift+R` or `Cmd+Shift+R`
- Safari: `Cmd+Option+R`

### Step 6: Verify It Works

Visit: `http://your-domain.com/ru/offices`

Check logs:
```bash
pm2 logs nextjs --lines 20
```

Should see:
```
✅ Fetching from Strapi: http://localhost:1337/api/offices...
✅ Using Strapi data - found X offices
```

---

## Why Make API Public?

**Q: Is it safe to make the API public?**

**A: Yes!** For a public website, this is perfectly fine because:
- ✅ Your website data (offices, prices) is meant to be public anyway
- ✅ Users can only READ data (not create, update, or delete)
- ✅ This is how most public websites work
- ✅ Strapi admin panel is still protected by login

**Q: When should I use API tokens?**

**A:** Use tokens if:
- You have private/sensitive data
- You want to track API usage
- You need different access levels
- You're building a mobile app

For your use case (public website), public API is the right choice.

---

## Alternative: Use API Token (Advanced)

If you prefer to use a token:

### Generate Token

1. Go to Strapi admin: `http://localhost:1337/admin`
2. Click **"Settings"** → **"API Tokens"**
3. Click **"Create new API Token"**
4. Fill in:
   - Name: "Next.js Frontend"
   - Token duration: "Unlimited"
   - Token type: "Read-only"
5. Click **"Save"**
6. **Copy the token** (shown only once!)

### Add to .env.local

```bash
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_API_TOKEN=your_actual_token_here
```

### Rebuild

```bash
./scripts/fix-cache-issue.sh
```

---

## Troubleshooting

### Still getting 401?

1. **Check permissions are saved**
   - Go back to Strapi admin
   - Settings → Roles → Public
   - Verify checkboxes are still checked
   - Click Save again

2. **Restart Strapi**
   ```bash
   pm2 restart strapi
   ```

3. **Test API directly**
   ```bash
   curl http://localhost:1337/api/offices?populate=*
   ```

### Getting 403 instead of 401?

Same fix - configure public permissions in Strapi admin.

### API works but still seeing old data?

Cache issue - run:
```bash
./scripts/fix-cache-issue.sh
```

Then clear browser cache.

---

## Quick Commands

```bash
# Check if API is accessible
./scripts/fix-401-error.sh

# Test API directly
curl http://localhost:1337/api/offices?populate=*

# Rebuild after fixing permissions
./scripts/fix-cache-issue.sh

# Check logs
pm2 logs nextjs --lines 20
pm2 logs strapi --lines 20
```

---

## Summary

1. ✅ Open Strapi admin: `http://localhost:1337/admin`
2. ✅ Settings → Roles → Public
3. ✅ Check `find` and `findOne` for all content types
4. ✅ Save
5. ✅ Run: `./scripts/fix-cache-issue.sh`
6. ✅ Clear browser cache
7. ✅ Done!

The 401 error will be gone and you'll see Strapi data on your site! 🎉
