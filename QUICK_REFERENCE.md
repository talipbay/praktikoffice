# Quick Reference - Zone Management

## 🚀 Start Everything

```bash
# Terminal 1: Start Strapi
cd strapi
npm run develop

# Terminal 2: Start Next.js
pnpm dev

# Open map
http://localhost:3000/en/map
```

## 📍 Important URLs

- **Map Interface**: http://localhost:3000/en/map
- **Strapi Admin**: http://localhost:1337/admin
- **Strapi API**: http://localhost:1337/api/zones

## ⚙️ Environment Variables

```bash
# .env.local
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_API_TOKEN=your_token_here
NEXT_PUBLIC_ENABLE_VERTEX_EDITING=true
NEXT_PUBLIC_ENABLE_ZONE_DELETION=true
NEXT_PUBLIC_ENABLE_ZONE_CREATION=true
```

## 🎯 Key Features

| Feature | Status | Description |
|---------|--------|-------------|
| Server Storage | ✅ | Zones saved to Strapi |
| Multi-User | ✅ | Everyone sees same data |
| Clean Interface | ✅ | No navbar/footer |
| Text Visibility | ✅ | Dark text, readable everywhere |
| Auto-Save | ✅ | Changes saved immediately |
| Responsive | ✅ | Works on mobile/tablet/desktop |

## 🎨 What Changed

### 1. Layout
- ✅ Removed navbar and footer from map page
- ✅ Full-screen admin interface

### 2. Text Colors
- ✅ Company names now dark gray with white stroke
- ✅ Readable on all backgrounds

### 3. Storage
- ✅ Data stored in Strapi (server)
- ✅ Visible to all users
- ✅ Persistent across sessions

## 📦 File Structure

```
src/
├── app/(admin)/[locale]/map/
│   ├── page.tsx (uses Strapi hook)
│   └── layout.tsx (standalone layout)
├── components/map/
│   └── ZoneCanvas.tsx (fixed text colors)
├── hooks/map/
│   ├── useZoneState.ts (localStorage - old)
│   └── useZoneStateStrapi.ts (Strapi - new)
└── lib/map/
    └── strapiZoneStorage.ts (API integration)
```

## 🔧 Strapi Setup

### 1. Create Content Type

Content-Type Builder → Create "zone":
- `zoneId` (Text, required, unique)
- `vertices` (JSON, required)
- `status` (Enum: free/occupied, required)
- `companyName` (Text, optional)

### 2. Set Permissions

Settings → Roles → Public → Enable all for "zone"

### 3. Get API Token

Settings → API Tokens → Create/Copy token

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Escape` | Cancel operation |
| `Delete` | Delete selected zone |
| `Arrow Keys` | Navigate zones |
| `Space` | Toggle zone status |
| `e` | Edit zone |

## 🎮 Basic Operations

### Create Zone
1. Click on floor plan (3-6 times)
2. Click near first point to complete

### Mark as Occupied
1. Click zone
2. "Mark as Occupied"
3. Enter company name

### Edit Zone
1. Select zone
2. "Enable Edit Mode"
3. Drag vertices
4. "Exit Edit Mode"

### Delete Zone
1. Select zone
2. "Delete Zone"
3. Confirm

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Zones not saving | Check Strapi is running |
| Can't see zones | Refresh page, check Strapi |
| 401 errors | Check API token |
| 403 errors | Check permissions |
| Text hard to read | Hard refresh browser |
| Navbar showing | Clear .next cache |

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| **UPDATES_SUMMARY.md** | What changed |
| **STRAPI_ZONE_SETUP.md** | Strapi setup guide |
| **MAP_QUICK_START.md** | Quick start |
| **MAP_SETUP.md** | Full documentation |
| **START_HERE.md** | Overview |

## 🧪 Test Checklist

- [ ] Strapi running
- [ ] Next.js running
- [ ] Can access map page
- [ ] No navbar/footer visible
- [ ] Can create zones
- [ ] Zones save to Strapi
- [ ] Company names readable
- [ ] Multi-user works (test in 2 browsers)
- [ ] Data persists after refresh

## 🚀 Production Checklist

- [ ] Strapi deployed
- [ ] Production database configured
- [ ] API token set in production env
- [ ] HTTPS enabled
- [ ] CORS configured
- [ ] Authentication added to map route
- [ ] Permissions reviewed
- [ ] Backups configured

## 💡 Pro Tips

1. **Always start Strapi first** before Next.js
2. **Refresh to see other users' changes**
3. **Export zones regularly** as backup
4. **Use keyboard shortcuts** for speed
5. **Test in multiple browsers** for multi-user

## 🎯 Common Commands

```bash
# Start development
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Start Strapi
cd strapi && npm run develop

# Clear Next.js cache
rm -rf .next

# Check Strapi logs
cd strapi && npm run develop
```

## 📞 Need Help?

1. Check **UPDATES_SUMMARY.md** for recent changes
2. See **STRAPI_ZONE_SETUP.md** for Strapi issues
3. Review **MAP_SETUP.md** for full docs
4. Check browser console for errors
5. Verify Strapi is running and accessible

---

**Quick Start**: `pnpm dev` → Open `/en/map` → Create zones!

**Multi-User Test**: Open in 2 browsers → Create zone in one → Refresh other → See same zone!

**Everything Working?** ✅ You're ready to go!
