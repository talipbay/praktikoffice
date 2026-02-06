# Setup Zone Content Type in Strapi

## Problem
Migration fails with: `❌ Zone content type not found`

## Solution

### Option 1: Automated Setup (Recommended)

Run this script to create all necessary files:

```bash
bash scripts/setup-zone-content-type.sh
```

Then restart Strapi:
```bash
cd strapi
npm run develop
```

### Option 2: Manual Setup via Strapi Admin

1. **Open Strapi Admin:**
   ```
   http://89.35.125.175:1337/admin
   ```

2. **Go to Content-Type Builder** (in left sidebar)

3. **Click "Create new collection type"**

4. **Enter details:**
   - Display name: `Zone`
   - API ID (singular): `zone`
   - API ID (plural): `zones`

5. **Add fields:**

   **Field 1: zoneId**
   - Type: Text
   - Name: `zoneId`
   - Advanced settings:
     - ✓ Required field
     - ✓ Unique field

   **Field 2: vertices**
   - Type: JSON
   - Name: `vertices`
   - Advanced settings:
     - ✓ Required field

   **Field 3: status**
   - Type: Enumeration
   - Name: `status`
   - Values: `free`, `occupied`
   - Default value: `free`
   - Advanced settings:
     - ✓ Required field

   **Field 4: companyName**
   - Type: Text
   - Name: `companyName`
   - Advanced settings:
     - ☐ Required field (leave unchecked)

6. **Click "Save"** - Strapi will restart automatically

7. **Set Permissions:**
   - Go to: **Settings → Roles → Public**
   - Find **Zone** section
   - Enable:
     - ✓ find
     - ✓ findOne
     - ✓ create
     - ✓ update
   - Click **Save**

8. **Verify it works:**
   ```bash
   curl http://localhost:1337/api/zones
   ```
   Should return: `{"data":[],"meta":{"pagination":{...}}}`

## After Setup

Run the migration:

```bash
NEXT_PUBLIC_STRAPI_URL=http://89.35.125.175:1337 \
NEXT_PUBLIC_STRAPI_API_TOKEN=your_token_here \
node scripts/migrate-zones-final.js
```

## Troubleshooting

### "Content type not found" after creating it

**Solution:** Restart Strapi
```bash
# If running in terminal, press Ctrl+C then:
cd strapi
npm run develop

# If using PM2:
pm2 restart strapi
```

### "Permission denied" (403 error)

**Solution:** Check permissions in Strapi Admin
- Settings → Roles → Public → Zone
- Enable: find, findOne, create, update

### "Authentication failed" (401 error)

**Solution:** Regenerate API token
- Settings → API Tokens → Create new token
- Copy new token and use in migration command

## Verify Migration Success

After migration completes:

1. **Check in Strapi Admin:**
   ```
   http://89.35.125.175:1337/admin
   Content Manager → Zones
   ```
   Should see 44 zones

2. **Check via API:**
   ```bash
   curl http://localhost:1337/api/zones | jq '.data | length'
   ```
   Should output: `44`

3. **Check in Map UI:**
   ```
   https://praktikoffice.kz/en/map
   ```
   Should see all zones on the floor plan
