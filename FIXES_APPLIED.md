# Issues Fixed - February 6, 2026

## Problems Identified

1. **cms.praktikoffice.kz redirects to localhost:1337** ❌
2. **Cursor not visible on /map page** ❌
3. **Cannot mark zones as occupied/free** ❌

---

## Solutions Applied

### 1. Fixed Strapi Redirect Issue

**File:** `strapi/config/server.ts`

**Problem:** The `url` config was set to `https://cms.praktikoffice.kz`, causing Strapi to redirect all requests to that URL even when accessed via localhost.

**Fix:** Commented out the `url` config. Caddy handles the domain routing, so Strapi doesn't need to know about it.

```typescript
// Before
url: env('PUBLIC_URL', 'https://cms.praktikoffice.kz'),

// After
// url: env('PUBLIC_URL', 'https://cms.praktikoffice.kz'),
```

### 2. Fixed Cursor Visibility on /map Page

**File:** `src/app/globals.css`

**Problem:** The global CSS rule `* { cursor: none !important; }` was hiding the cursor on ALL elements, including the canvas where you need to see it.

**Fix:** Updated the CSS to exclude interactive elements like canvas, buttons, inputs, etc.

```css
/* Before */
@media (min-width: 769px) and (hover: hover) and (pointer: fine) {
  * {
    cursor: none !important;
  }
}

/* After */
@media (min-width: 769px) and (hover: hover) and (pointer: fine) {
  body *:not(canvas):not(button):not(input):not(select):not(textarea):not(a):not([role="button"]) {
    cursor: none !important;
  }
}
```

### 3. Fixed Zone Update Errors

**Files:** 
- `strapi/config/middlewares.ts`
- `.env.local`

**Problem:** 
- CORS headers were incomplete (missing methods and headers)
- Frontend was pointing to localhost instead of production URL

**Fix:** 
- Added proper CORS configuration with all required headers and methods
- Updated `.env.local` to use `https://cms.praktikoffice.kz`

```typescript
// middlewares.ts - Added
headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
```

```bash
# .env.local - Changed
NEXT_PUBLIC_STRAPI_URL=https://cms.praktikoffice.kz
```

---

## How to Apply These Fixes

### Option 1: Run the Fix Script (Recommended)

```bash
./FIX_ISSUES.sh
```

This will:
- Restart Strapi with new config
- Rebuild and restart Next.js
- Apply all fixes automatically

### Option 2: Manual Steps

1. **Restart Strapi:**
   ```bash
   cd strapi
   npm run develop
   ```

2. **Rebuild Next.js:**
   ```bash
   npm run build
   npm run start
   ```

3. **Update your .env.local:**
   - Make sure `NEXT_PUBLIC_STRAPI_API_TOKEN` has your actual Strapi API token
   - Get it from: https://cms.praktikoffice.kz/admin/settings/api-tokens

---

## Testing

After applying fixes, test:

1. ✅ Visit https://cms.praktikoffice.kz - should NOT redirect to localhost
2. ✅ Visit /map page - cursor should be visible on canvas
3. ✅ Click a free zone → mark as occupied - should work without errors
4. ✅ Click an occupied zone → mark as free - should work without errors

---

## Important Notes

- The custom cursor (white circle) will still appear on non-interactive elements
- The system cursor will show on canvas, buttons, inputs, and links
- Make sure Strapi is running before testing zone updates
- If you still see errors, check browser console for specific error messages
