# Interactive Zone Management - Setup Guide

## Overview

The interactive zone management system allows administrators to visually manage office zones on a floor plan. Admins can create zones, mark them as free or occupied, assign company names, and edit zone boundaries.

## Access

The zone management interface is accessible at:
- Development: `http://localhost:3000/[locale]/map` (e.g., `/en/map`, `/ru/map`, `/kz/map`)
- Production: `https://yourdomain.com/[locale]/map`

## Features

### Core Functionality
- **Visual Zone Creation**: Click on the floor plan to create polygonal zones (3-6 vertices)
- **Zone Status Management**: Toggle zones between free (green) and occupied (red)
- **Company Assignment**: Assign company names to occupied zones
- **Zone Editing**: Reshape zones by dragging vertex handles
- **Zone Deletion**: Remove zones with confirmation
- **Data Persistence**: All changes are saved to browser localStorage
- **Import/Export**: Backup and restore zone data as JSON

### Configuration

The system behavior is controlled via environment variables in `.env.local`:

```bash
# Enable/disable vertex editing (reshaping zones)
NEXT_PUBLIC_ENABLE_VERTEX_EDITING=true

# Enable/disable zone deletion
NEXT_PUBLIC_ENABLE_ZONE_DELETION=true

# Enable/disable zone creation
NEXT_PUBLIC_ENABLE_ZONE_CREATION=true
```

### Configuration Modes

1. **Production Safe** (All `false`): Only status management allowed
2. **Creation Only**: Allow creating new zones only
3. **Editing Only**: Allow reshaping existing zones only
4. **Full Admin** (All `true`): Complete zone management capabilities

## Floor Plan Setup

### Current Floor Plan
The system uses `/public/floor-plan.png` (1920x1080 pixels)

### Replacing the Floor Plan

1. Prepare your floor plan image:
   - Recommended size: 1920x1080 pixels (16:9 aspect ratio)
   - Format: PNG, JPG, or WebP
   - Clear, high-contrast image works best

2. Replace the image:
   ```bash
   cp your-floor-plan.png public/floor-plan.png
   ```

3. If using a different aspect ratio, update the dimensions in:
   - `src/components/map/ZoneCanvas.tsx` (ORIGINAL_WIDTH and ORIGINAL_HEIGHT constants)

## Usage Guide

### Creating Zones

1. Click on the floor plan to add vertices (minimum 3, maximum 6)
2. Click near the first vertex (green circle) to complete the zone
3. The zone will be created as "free" (green)

### Managing Zones

1. **Select a Zone**: Click on any zone to select it
2. **Toggle Status**: 
   - Click "Mark as Occupied" to assign a company
   - Click "Mark as Free" to clear the zone
3. **Edit Zone**: 
   - Enable "Edit Mode" button
   - Long-press and drag vertex handles to reshape
   - Changes save automatically
4. **Delete Zone**: Click "Delete Zone" button (requires confirmation)

### Keyboard Shortcuts

- `Escape`: Cancel zone creation or editing
- `Delete/Backspace`: Delete selected zone
- `Arrow Keys`: Navigate between zones
- `Space`: Toggle zone status
- `e`: Start editing selected zone (when edit mode enabled)

### Data Management

#### Export Zones
1. Click "Export Zones" in the management panel
2. JSON file downloads automatically
3. Save this file as backup

#### Import Zones
1. Click "Import Zones"
2. Select a previously exported JSON file
3. Existing zones will be replaced

#### Clear All Zones
1. Click "Clear All Zones"
2. Confirm the action
3. All zones are removed (can be restored from backup)

## Technical Details

### Data Storage
- **Primary**: Browser localStorage (`interactive-zone-manager-zones`)
- **Format**: JSON with version tracking
- **Backup**: Manual export/import via JSON files

### Zone Data Structure
```typescript
interface Zone {
  id: string;                    // Unique identifier
  vertices: Point[];             // Array of {x, y} coordinates
  status: 'free' | 'occupied';   // Current status
  companyName: string | null;    // Company name if occupied
  createdAt: number;             // Creation timestamp
  updatedAt: number;             // Last update timestamp
}
```

### Coordinate System
- Zones are stored in original image coordinates (1920x1080)
- Automatically scaled for display on different screen sizes
- Maintains aspect ratio across devices

## Responsive Design

The interface adapts to different screen sizes:
- **Desktop**: Full side-by-side layout (canvas + management panel)
- **Tablet**: Scaled canvas with vertical panel
- **Mobile**: Stacked layout with touch-optimized controls

## Browser Compatibility

Tested and supported on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Floor Plan Not Loading
- Check that `/public/floor-plan.png` exists
- Verify image format is supported (PNG, JPG, WebP)
- Check browser console for errors

### Zones Not Saving
- Ensure localStorage is enabled in browser
- Check browser storage quota
- Try exporting zones as backup

### Performance Issues
- Limit zones to reasonable number (< 100)
- Use smaller floor plan image if needed
- Close other browser tabs

### Edit Mode Not Working
- Verify `NEXT_PUBLIC_ENABLE_VERTEX_EDITING=true` in `.env.local`
- Restart development server after changing env variables
- Check that a zone is selected before enabling edit mode

## Development

### File Structure
```
src/
├── app/[locale]/map/
│   ├── page.tsx              # Main map page
│   └── layout.tsx            # Map layout (no navbar/footer)
├── components/map/           # Map-specific components
│   ├── ZoneCanvas.tsx        # Interactive canvas
│   ├── ZoneManagementPanel.tsx
│   ├── ZoneContextMenu.tsx
│   ├── CompanyNameDialog.tsx
│   └── ...
├── hooks/map/                # Custom hooks
│   ├── useZoneState.ts       # Zone state management
│   └── useLocalStorage.ts    # localStorage hook
├── lib/map/                  # Utilities
│   ├── zoneUtils.ts          # Zone operations
│   ├── canvasUtils.ts        # Canvas rendering
│   ├── config.ts             # Feature flags
│   └── assets.ts             # Asset paths
└── types/map/                # TypeScript types
    └── zone.ts               # Zone interfaces
```

### Adding Features

1. Update types in `src/types/map/zone.ts`
2. Add utility functions in `src/lib/map/`
3. Update components in `src/components/map/`
4. Add environment variables if needed

## Security Considerations

- The `/map` route should be protected with authentication in production
- Consider adding role-based access control
- Validate all zone data before saving
- Sanitize company names to prevent XSS

## Future Enhancements

Potential features to add:
- [ ] User authentication and authorization
- [ ] Backend API integration for persistent storage
- [ ] Multi-floor support
- [ ] Zone templates and presets
- [ ] Undo/redo functionality
- [ ] Real-time collaboration
- [ ] Zone analytics and reporting
- [ ] Mobile app version

## Support

For issues or questions:
1. Check this documentation
2. Review browser console for errors
3. Check environment variables configuration
4. Verify floor plan image is correct

## License

Part of the Praktik Office project.
