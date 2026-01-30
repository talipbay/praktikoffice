# Strapi Integration Guide

## Overview

This guide explains how the Next.js frontend integrates with Strapi CMS to manage:
- Office photos and prices
- Meeting room photos and prices
- Coworking space photos and prices

## Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│                 │         │                  │         │                 │
│   Next.js App   │────────▶│   Strapi CMS     │────────▶│   PostgreSQL    │
│   (Frontend)    │  HTTP   │   (Backend)      │         │   (Database)    │
│   Port 3000     │         │   Port 1337      │         │   Port 5432     │
│                 │         │                  │         │                 │
└─────────────────┘         └──────────────────┘         └─────────────────┘
         │                           │
         │                           │
         └───────────────┬───────────┘
                         │
                    ┌────▼─────┐
                    │  Caddy   │
                    │  Proxy   │
                    └──────────┘
```

## Data Flow

### 1. Static Data (Current - Fallback)
- Hardcoded in page components
- Used when Strapi is not available
- Fast, no API calls needed

### 2. Strapi Data (New - Primary)
- Fetched from Strapi API
- Cached with Next.js ISR (60 seconds)
- Falls back to static data on error

## Implementation

### Pages Updated

#### 1. Offices Page (`src/app/[locale]/offices/page.tsx`)

**Before:**
```typescript
const officeOptions = [
  {
    id: "office-k10",
    name: "Офис К10",
    price: "4,000 $/месяц",
    // ... hardcoded data
  }
];
```

**After:**
```typescript
// Fetch from Strapi
const strapiOffices = await fetchOfficesData(locale);

// Use Strapi data if available, otherwise fallback
const offices = strapiOffices.length > 0 ? strapiOffices : fallbackOffices;
```

#### 2. Meeting Rooms Page (`src/app/[locale]/meeting-room/page.tsx`)

Similar pattern - fetch from Strapi with fallback to static data.

#### 3. Open Space Page (`src/app/[locale]/open-space/page.tsx`)

Fetch coworking tariffs and images from Strapi.

### Helper Functions

#### `src/lib/strapi-data.ts`

Main functions:
- `fetchOfficesData(locale)` - Get all offices
- `fetchMeetingRoomsData(locale)` - Get all meeting rooms
- `fetchCoworkingTariffsData(locale)` - Get coworking tariffs
- `fetchCoworkingImages(locale)` - Get coworking gallery images

#### `src/lib/strapi.ts`

API functions:
- `getOffices(locale)` - Raw API call
- `getMeetingRooms(locale)` - Raw API call
- `getCoworkingTariffs(locale)` - Raw API call

#### `src/lib/strapi-helpers.ts`

Utility functions:
- `getStrapiImageUrl(image)` - Get full image URL
- `getStrapiImageAlt(image)` - Get image alt text
- `transformStrapiImages(images)` - Transform image array
- `useStrapiData()` - Check if Strapi is enabled

## Content Structure in Strapi

### Office Content Type

```json
{
  "name": "Офис К10",
  "slug": "office-k10",
  "size": "24 м²",
  "capacity": "до 8 человек",
  "price": "4,000 $/месяц",
  "features": ["workplaces_8", "meetingZone", "spaciousLayout", "loungeArea"],
  "isAvailable": true,
  "images": [/* Media files */]
}
```

### Meeting Room Content Type

```json
{
  "name": "П6",
  "slug": "p6",
  "size": "15 м²",
  "capacity": "6 мест",
  "price": "12,500 ₸/час",
  "workingHours": "09:00 - 20:00",
  "specialFeature": "Смарт-стекло...",
  "features": ["smartGlass", "coworkingAccess", "kitchenCoffee"],
  "isAvailable": true,
  "images": [/* Media files */]
}
```

### Coworking Tariff Content Type

```json
{
  "name": "Тариф Номад",
  "slug": "nomad",
  "schedule": "День 9:00-20:00",
  "price": "15,000 ₸",
  "description": "Полный дневной доступ...",
  "features": ["openSpace", "meetingRoom", "refreshments"],
  "isActive": true
}
```

## Feature Keys Mapping

Feature keys in Strapi map to translation keys in Next.js:

### Office Features
- `workplaces_4` → `t('offices.officeFeatures.workplaces_4')`
- `meetingZone` → `t('offices.officeFeatures.meetingZone')`
- `spaciousLayout` → `t('offices.officeFeatures.spaciousLayout')`
- etc.

### Meeting Room Features
- `smartGlass` → `t('meetingRooms.roomFeatures.smartGlass')`
- `coworkingAccess` → `t('meetingRooms.roomFeatures.coworkingAccess')`
- etc.

### Coworking Features
- `openSpace` → `t('openSpace.features.openSpace')`
- `meetingRoom` → `t('openSpace.features.meetingRoom')`
- etc.

## Multilingual Support

### In Strapi:
1. Enable i18n plugin
2. Add locales: en, ru, kz
3. Create content in all languages
4. Use locale parameter in API calls

### In Next.js:
```typescript
// Fetch data for specific locale
const offices = await fetchOfficesData('ru');  // Russian
const offices = await fetchOfficesData('en');  // English
const offices = await fetchOfficesData('kz');  // Kazakh
```

## Image Handling

### Upload to Strapi:
1. Go to Content Manager
2. Select Office/Meeting Room
3. Upload images (recommended: 1920x1440px, WebP format)
4. Strapi automatically creates responsive sizes

### In Next.js:
```typescript
// Images are automatically transformed
const imageUrl = getStrapiImageUrl(image);

// Use in Next.js Image component
<Image src={imageUrl} alt={alt} fill />
```

## Caching Strategy

### Next.js ISR (Incremental Static Regeneration):
```typescript
fetch(url, {
  next: { revalidate: 60 } // Revalidate every 60 seconds
})
```

### Benefits:
- Fast page loads (cached)
- Fresh content (revalidated)
- Reduced API calls
- Better performance

## Environment Variables

### Development (`.env.local`):
```bash
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_API_TOKEN=your_token_here
```

### Production:
```bash
NEXT_PUBLIC_STRAPI_URL=https://cms.praktikoffice.kz
NEXT_PUBLIC_STRAPI_API_TOKEN=your_production_token
```

## API Endpoints

### Public Endpoints (No Auth Required):
- `GET /api/offices?populate=*&locale=ru`
- `GET /api/meeting-rooms?populate=*&locale=ru`
- `GET /api/coworking-tariffs?populate=*&locale=ru`
- `GET /api/gallery-categories?populate=*&locale=ru`

### Response Format:
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "name": "Офис К10",
        "slug": "office-k10",
        "price": "4,000 $/месяц",
        "images": {
          "data": [
            {
              "id": 1,
              "attributes": {
                "url": "/uploads/office_k10_1.webp",
                "formats": { /* responsive sizes */ }
              }
            }
          ]
        }
      }
    }
  ],
  "meta": {
    "pagination": { /* pagination info */ }
  }
}
```

## Testing

### 1. Test Strapi API:
```bash
# Get offices
curl http://localhost:1337/api/offices?populate=*

# Get meeting rooms
curl http://localhost:1337/api/meeting-rooms?populate=*

# Get with locale
curl http://localhost:1337/api/offices?populate=*&locale=ru
```

### 2. Test Next.js Integration:
```bash
# Start both services
pm2 start ecosystem.config.js

# Visit pages
open http://localhost:3000/ru/offices
open http://localhost:3000/ru/meeting-room
open http://localhost:3000/ru/open-space
```

### 3. Test Fallback:
```bash
# Stop Strapi
pm2 stop strapi

# Pages should still work with static data
open http://localhost:3000/ru/offices
```

## Deployment Checklist

- [ ] PostgreSQL database created and configured
- [ ] Strapi installed and built
- [ ] Content types created in Strapi
- [ ] i18n configured with all locales
- [ ] Content added in all languages
- [ ] API permissions configured (Public role)
- [ ] Images uploaded and optimized
- [ ] Environment variables set
- [ ] PM2 ecosystem configured
- [ ] Caddy reverse proxy configured
- [ ] SSL certificates configured
- [ ] Services started with PM2
- [ ] PM2 startup configured
- [ ] Backups configured for PostgreSQL
- [ ] Monitoring configured

## Maintenance

### Update Content:
1. Login to Strapi admin
2. Edit content
3. Save and publish
4. Changes appear on website within 60 seconds (ISR)

### Update Prices:
1. Go to Content Manager
2. Select Office/Meeting Room
3. Update price field
4. Save and publish

### Add New Office/Room:
1. Create new entry in Strapi
2. Fill all fields
3. Upload images
4. Translate to all locales
5. Publish
6. Appears automatically on website

### Backup Database:
```bash
# Backup
pg_dump -U strapi_user praktikoffice_strapi > backup.sql

# Restore
psql -U strapi_user praktikoffice_strapi < backup.sql
```

## Performance Optimization

### 1. Image Optimization:
- Upload WebP format
- Max size: 2MB per image
- Strapi creates responsive sizes automatically

### 2. API Caching:
- ISR: 60 seconds revalidation
- CDN caching with Caddy
- Browser caching for images

### 3. Database Optimization:
- PostgreSQL connection pooling
- Indexed fields (slug, name)
- Regular VACUUM operations

## Security

### 1. Strapi:
- Strong admin password
- API token for authenticated requests
- CORS configured for your domain
- Rate limiting enabled

### 2. PostgreSQL:
- Strong database password
- Local connections only
- Regular backups
- SSL connections in production

### 3. Caddy:
- HTTPS enforced
- Security headers configured
- Rate limiting
- Access logs enabled
