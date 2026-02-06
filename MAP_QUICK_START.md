# Zone Management - Quick Start

## 🚀 Getting Started in 3 Steps

### 1. Start the Development Server

```bash
pnpm dev
```

### 2. Access the Map Interface

Open your browser and navigate to:
```
http://localhost:3000/en/map
```

Or use any locale:
- Russian: `http://localhost:3000/ru/map`
- Kazakh: `http://localhost:3000/kz/map`

### 3. Create Your First Zone

1. **Click** on the floor plan to add vertices (corners of your zone)
2. Add at least 3 points (up to 6 maximum)
3. **Click near the first point** (green circle) to complete the zone
4. Your zone is created! 🎉

## 📋 Basic Operations

### Mark a Zone as Occupied
1. Click on a zone to select it
2. Click "Mark as Occupied" in the right panel
3. Enter the company name
4. Click "Save"

### Mark a Zone as Free
1. Click on an occupied zone
2. Click "Mark as Free"
3. Done!

### Edit a Zone Shape
1. Select a zone
2. Click "Enable Edit Mode" button
3. Long-press and drag the vertex handles (circles)
4. Release to save automatically
5. Click "Exit Edit Mode" when done

### Delete a Zone
1. Select a zone
2. Click "Delete Zone"
3. Confirm the deletion

## ⚙️ Configuration

Edit `.env.local` to control features:

```bash
# Allow creating new zones
NEXT_PUBLIC_ENABLE_ZONE_CREATION=true

# Allow editing zone shapes
NEXT_PUBLIC_ENABLE_VERTEX_EDITING=true

# Allow deleting zones
NEXT_PUBLIC_ENABLE_ZONE_DELETION=true
```

**Note**: Restart the dev server after changing environment variables.

## 💾 Backup Your Data

### Export Zones
1. Click "Export Zones" button
2. Save the JSON file

### Import Zones
1. Click "Import Zones" button
2. Select your saved JSON file

## 🎨 Replace the Floor Plan

1. Prepare your image (recommended: 1920x1080 pixels)
2. Replace the file:
   ```bash
   cp your-floor-plan.png public/floor-plan.png
   ```
3. Refresh the page

## ⌨️ Keyboard Shortcuts

- `Escape` - Cancel current operation
- `Delete` - Delete selected zone
- `Arrow Keys` - Navigate between zones
- `Space` - Toggle zone status
- `e` - Edit selected zone (when edit mode is on)

## 🐛 Common Issues

### Floor plan not showing?
- Check that `public/floor-plan.png` exists
- Try hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

### Changes not saving?
- Check browser console for errors
- Ensure localStorage is enabled
- Try exporting your data as backup

### Can't create zones?
- Verify `NEXT_PUBLIC_ENABLE_ZONE_CREATION=true` in `.env.local`
- Restart the dev server

## 📱 Mobile Usage

The interface works on mobile devices:
- **Tap** to add vertices
- **Long press** on a zone for options
- **Pinch to zoom** (if needed)

## 🎯 Tips

1. **Start with simple shapes** - Use 4 vertices for rectangular zones
2. **Complete zones carefully** - Click near the first (green) vertex to close
3. **Save backups regularly** - Export your zones before major changes
4. **Use descriptive names** - Make company names clear and consistent
5. **Test on different screens** - Check how zones look on mobile/tablet

## 📚 Need More Help?

See the full documentation in `MAP_SETUP.md` for:
- Detailed feature explanations
- Technical architecture
- Troubleshooting guide
- Development information

## 🎉 You're Ready!

Start creating and managing your office zones. The system automatically saves all changes to your browser's localStorage.

Happy zone mapping! 🗺️
