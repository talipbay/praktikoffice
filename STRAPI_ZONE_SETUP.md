# Strapi Zone Storage Setup

## Overview

The zone management system now uses Strapi as the backend, so all zones are stored on the server and visible to everyone.

## Setup Steps

### 1. Create the Zone Content Type in Strapi

1. **Start Strapi** (if not already running):
   ```bash
   cd strapi
   npm run develop
   ```

2. **Access Strapi Admin**:
   - Open http://localhost:1337/admin
   - Login with your admin credentials

3. **Create Content Type**:
   - Go to Content-Type Builder
   - Click "Create new collection type"
   - Name: `zone`
   - Click "Continue"

4. **Add Fields**:

   **Field 1: zoneId**
   - Type: Text
   - Name: `zoneId`
   - Advanced Settings:
     - Required: ✓
     - Unique: ✓

   **Field 2: vertices**
   - Type: JSON
   - Name: `vertices`
   - Required: ✓

   **Field 3: status**
   - Type: Enumeration
   - Name: `status`
   - Values: `free`, `occupied`
   - Default: `free`
   - Required: ✓

   **Field 4: companyName**
   - Type: Text
   - Name: `companyName`
   - Required: ✗ (optional)

5. **Save** the content type

### 2. Configure Permissions

1. **Go to Settings → Roles → Public**

2. **Enable these permissions for `zone`**:
   - find (to list zones)
   - findOne (to get single zone)
   - create (to create zones)
   - update (to update zones)
   - delete (to delete zones)

3. **Save**

### 3. Verify API Token

Make sure your `.env.local` has the Strapi configuration:

```bash
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_API_TOKEN=your_api_token_here
```

To get your API token:
1. Go to Settings → API Tokens
2. Create a new token or use existing one
3. Copy the token to `.env.local`

### 4. Test the Integration

1. **Restart your Next.js app**:
   ```bash
   pnpm dev
   ```

2. **Open the map**:
   ```
   http://localhost:3000/en/map
   ```

3. **Create a test zone**:
   - Click on the floor plan to create a zone
   - The zone should be saved to Strapi

4. **Verify in Strapi**:
   - Go to Content Manager → Zones
   - You should see your created zone

5. **Test multi-user**:
   - Open the map in another browser/tab
   - Refresh the page
   - You should see the same zones

## How It Works

### Data Flow

```
User Action (Create/Update/Delete)
         ↓
useZoneStateStrapi Hook
         ↓
strapiZoneStorage.ts
         ↓
Strapi API
         ↓
PostgreSQL Database
```

### Automatic Sync

- **Create**: Immediately saved to Strapi
- **Update**: Changes saved to server
- **Delete**: Removed from server
- **Load**: Fetched from server on page load

### Multi-User Support

- All users see the same data
- Changes are persisted across sessions
- No localStorage dependency
- Real-time updates (refresh to see changes)

## API Endpoints

The system uses these Strapi endpoints:

```
GET    /api/zones              - List all zones
GET    /api/zones/:id          - Get single zone
POST   /api/zones              - Create zone
PUT    /api/zones/:id          - Update zone
DELETE /api/zones/:id          - Delete zone
```

## Troubleshooting

### Zones not saving?

1. **Check Strapi is running**:
   ```bash
   cd strapi
   npm run develop
   ```

2. **Check API token**:
   - Verify `NEXT_PUBLIC_STRAPI_API_TOKEN` in `.env.local`
   - Make sure token has correct permissions

3. **Check permissions**:
   - Go to Settings → Roles → Public
   - Verify all zone permissions are enabled

4. **Check browser console**:
   - Look for API errors
   - Check network tab for failed requests

### Can't see zones from other users?

1. **Refresh the page** - Zones load on page mount
2. **Check Strapi Content Manager** - Verify zones exist in database
3. **Check API URL** - Verify `NEXT_PUBLIC_STRAPI_URL` is correct

### Getting 401 errors?

- Your API token is invalid or missing
- Check `.env.local` has correct token
- Restart Next.js dev server after changing env vars

### Getting 403 errors?

- Permissions not set correctly
- Go to Settings → Roles → Public
- Enable all zone permissions

## Migration from localStorage

If you have existing zones in localStorage, they won't automatically migrate. You have two options:

### Option 1: Manual Recreation
- Open the old map
- Export zones to JSON
- Open new map
- Import zones from JSON

### Option 2: Keep localStorage Version
- The old `useZoneState` hook still works
- Change import back to use localStorage:
  ```typescript
  import { useZoneState } from '@/hooks/map/useZoneState';
  ```

## Production Deployment

### Environment Variables

Set these in your production environment:

```bash
NEXT_PUBLIC_STRAPI_URL=https://your-strapi-domain.com
NEXT_PUBLIC_STRAPI_API_TOKEN=your_production_token
```

### Security Considerations

1. **Use HTTPS** in production
2. **Restrict API permissions** - Consider authenticated-only access
3. **Add rate limiting** to prevent abuse
4. **Validate all inputs** on the server side
5. **Add authentication** to the map route

### Strapi Production Setup

1. Deploy Strapi to production server
2. Configure production database (PostgreSQL recommended)
3. Set up proper API tokens
4. Configure CORS for your domain
5. Enable SSL/HTTPS

## Benefits of Server Storage

✅ **Multi-user support** - Everyone sees the same data
✅ **Persistent storage** - Data survives browser clears
✅ **Centralized management** - Single source of truth
✅ **Backup friendly** - Database backups include zones
✅ **Scalable** - Can handle many zones efficiently
✅ **Audit trail** - Strapi tracks created/updated timestamps

## Next Steps

1. ✅ Set up Strapi content type
2. ✅ Configure permissions
3. ✅ Test zone creation
4. ✅ Verify multi-user access
5. 🔲 Add authentication to map route
6. 🔲 Deploy to production
7. 🔲 Set up automated backups

## Support

If you encounter issues:
1. Check Strapi logs: `cd strapi && npm run develop`
2. Check browser console for errors
3. Verify API token and permissions
4. Test API endpoints directly with Postman/curl

Happy mapping with server-side storage! 🗺️✨
