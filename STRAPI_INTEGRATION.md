# Strapi Integration - Complete

## ✅ What's Done

All three pages now fetch data from Strapi:

1. **Offices Page** (`/offices`)
   - Fetches office data from Strapi
   - Shows: name, size, capacity, price, features, images
   - Falls back to hardcoded data if Strapi unavailable

2. **Meeting Rooms Page** (`/meeting-room`)
   - Fetches meeting room data from Strapi
   - Shows: name, size, capacity, price, features, images
   - Falls back to hardcoded data if Strapi unavailable

3. **Open Space Page** (`/open-space`)
   - Fetches coworking tariff data from Strapi
   - Fetches images from Strapi
   - Shows: tariff name, description, schedule, price, features, images
   - Falls back to hardcoded data if Strapi unavailable

## 📋 What to Add in Strapi

### 1. Offices

Content Type: **Office**

Fields to fill:
- **Name**: Office name (e.g., "Офис К10", "P100")
- **Slug**: URL-friendly ID (e.g., "office-k10", "p100")
- **Size**: Size in m² (e.g., "24 м²", "1000")
- **Capacity**: Number of people (e.g., "до 8 человек", "20")
- **Price**: Price with currency (e.g., "4,000 $/месяц", "40000")
- **Features**: Array of feature keys (e.g., `["workplaces_8", "meetingZone"]`)
- **Images**: Upload multiple images

### 2. Meeting Rooms

Content Type: **Meeting-room**

Fields to fill:
- **Name**: Room name (e.g., "П6", "П12")
- **Slug**: URL-friendly ID (e.g., "meeting-p6", "p6")
- **Size**: Size in m² (e.g., "15 м²")
- **Capacity**: Number of people (e.g., "6 мест", "12 мест")
- **Price**: Price per hour (e.g., "12,500 ₸/час")
- **Features**: Array of feature keys (e.g., `["smartGlass", "coworkingAccess"]`)
- **Images**: Upload multiple images

### 3. Coworking Tariff

Content Type: **Coworking-tariff**

Fields to fill:
- **Name**: Tariff name (e.g., "Тариф Номад")
- **Description**: Short description
- **Schedule**: Working hours (e.g., "День 9:00-20:00")
- **Price**: Price (e.g., "15,000 ₸")
- **Features**: Array of feature keys (e.g., `["openSpace", "meetingRoom"]`)
- **Images**: Upload multiple images (for gallery)

## 🚀 Deployment Steps

### On Your Server

1. **Make sure Strapi API is public**:
   - Go to: `http://localhost:1337/admin`
   - Settings → Roles → Public
   - Check `find` and `findOne` for: Office, Meeting-room, Coworking-tariff
   - Click Save

2. **Add content in Strapi**:
   - Add at least one entry for each content type
   - **Important**: Click "Publish" (not just Save)

3. **Rebuild Next.js**:
   ```bash
   ./scripts/fix-cache-issue.sh
   ```

4. **Clear browser cache**:
   - Chrome/Firefox: `Ctrl+Shift+R` or `Cmd+Shift+R`
   - Safari: `Cmd+Option+R`

5. **Test**:
   - Visit `/ru/offices` - should show Strapi offices
   - Visit `/ru/meeting-room` - should show Strapi meeting rooms
   - Visit `/ru/open-space` - should show Strapi tariff and images

## 📝 Feature Keys Reference

### Office Features

Use these keys in the `features` array:
- `workplaces_4`, `workplaces_6`, `workplaces_8`, `workplaces_10`, `workplaces_12`
- `meetingZone`, `meetingArea`, `largeMeetingRoom`
- `spaciousLayout`, `modernFurniture`, `excellentLayout`
- `loungeArea`, `presentationZone`
- `goodLighting`, `naturalLighting`, `comfortableEnvironment`
- `convenientLayout`, `compactLayout`, `functionalLayout`, `flexibleLayout`, `premiumLayout`
- `convenientLocation`, `modernEquipment`
- `separateWorkZones`, `maximumComfort`
- `expandedWorkZone`, `additionalSpace`
- `accessToCommonAreas`

### Meeting Room Features

Use these keys in the `features` array:
- `smartGlass` - Smart glass with privacy mode
- `coworkingAccess` - Access to coworking area
- `kitchenCoffee` - Kitchen and coffee point
- `whiteboardOnRequest` - Whiteboard available
- `tvWithClicker` - TV with presentation clicker
- `whiteboard` - Whiteboard included
- `ownCoffeePoint` - Own coffee point
- `outletsOnTable` - Power outlets on table
- `panoramicView` - Panoramic city view
- `extraChairs` - Extra chairs available
- `theaterSeating` - Theater-style seating
- `flexibleSpace` - Flexible space layout
- `spaciousRoom` - Spacious room

### Coworking Features

Use these keys in the `features` array:
- `openSpace` - Free seating in open space
- `meetingRoom` - Unlimited meeting room access
- `refreshments` - Free coffee, tea, water, snacks, fruits
- `printing` - Free printing
- `amenities` - Access to yoga room and prayer room

## 🔍 How It Works

### Architecture

```
Page (Server Component)
  ↓
Fetch from Strapi API
  ↓
Transform data
  ↓
Pass to Client Component
  ↓
Render UI
```

### Files Structure

```
src/
├── app/[locale]/
│   ├── offices/
│   │   ├── page.tsx (server - fetches data)
│   │   └── offices-client.tsx (client - renders UI)
│   ├── meeting-room/
│   │   ├── page.tsx (server - fetches data)
│   │   └── meeting-room-client.tsx (client - renders UI)
│   └── open-space/
│       ├── page.tsx (server - fetches data)
│       └── open-space-client.tsx (client - renders UI)
└── lib/
    ├── strapi.ts (API calls)
    └── strapi-data.ts (data transformation)
```

### Data Flow

1. **Server Component** (page.tsx):
   - Fetches data from Strapi using `fetchOfficesData()`, `fetchMeetingRoomsData()`, or `fetchCoworkingTariffsData()`
   - If Strapi returns no data, uses fallback hardcoded data
   - Passes data to Client Component

2. **Client Component** (*-client.tsx):
   - Receives data as props
   - Handles user interactions (image gallery, modals, etc.)
   - Renders UI with translations

3. **Strapi Library** (strapi.ts):
   - Makes HTTP requests to Strapi API
   - Handles authentication (if token is set)
   - Returns raw Strapi response

4. **Data Transformation** (strapi-data.ts):
   - Transforms Strapi v5 response format
   - Handles both `attributes` wrapper (v4) and flat structure (v5)
   - Converts image URLs to full URLs
   - Returns clean data for components

## 🎯 Translation Keys

All UI text (section titles, labels, buttons) stays in translation files (`messages/*.json`).

Only dynamic content (names, prices, descriptions) comes from Strapi.

This means:
- ✅ Same UI text for all entries
- ✅ Easy to translate entire site
- ✅ Only entry-specific data in Strapi

## 📊 Monitoring

Check logs to see if Strapi data is being used:

```bash
pm2 logs nextjs --lines 50
```

Look for:
- ✅ "Using Strapi data - found X offices/rooms"
- ❌ "Using fallback data - no data from Strapi"

## 🐛 Troubleshooting

### Still seeing fallback data?

1. Check Strapi has data: `./scripts/verify-strapi-data.sh`
2. Check content is Published in Strapi admin
3. Rebuild: `./scripts/fix-cache-issue.sh`
4. Clear browser cache

### Images not loading?

1. Check images are uploaded in Strapi Media Library
2. Check images are attached to content entries
3. Verify `NEXT_PUBLIC_STRAPI_URL` in `.env.local`

### Getting 401 error?

1. Make API public in Strapi admin (Settings → Roles → Public)
2. Or set `NEXT_PUBLIC_STRAPI_API_TOKEN` in `.env.local`

## ✨ Next Steps

1. Add more offices in Strapi
2. Add all meeting rooms (П6, П8, П10, П12, П16)
3. Add coworking tariff with images
4. Test all pages
5. Enjoy dynamic content management! 🎉
