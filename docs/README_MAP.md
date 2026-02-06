# 🗺️ Interactive Zone Management System

A powerful, visual zone management system for managing office floor plans. Create, edit, and manage zones with an intuitive drag-and-drop interface.

## 🎯 Quick Links

- **[Quick Start Guide](MAP_QUICK_START.md)** - Get started in 3 steps
- **[Complete Setup Guide](MAP_SETUP.md)** - Detailed documentation
- **[Integration Summary](MAP_INTEGRATION_SUMMARY.md)** - What was installed
- **[Navigation Options](MAP_NAVIGATION.md)** - How to access the map
- **[Testing Checklist](MAP_CHECKLIST.md)** - Verify everything works

## 🚀 Quick Start

```bash
# 1. Start the server
pnpm dev

# 2. Open in browser
open http://localhost:3000/en/map

# 3. Start creating zones!
```

## ✨ Features

- 🎨 **Visual Zone Creation** - Click to create polygonal zones
- 🟢 **Status Management** - Toggle between free/occupied
- 🏢 **Company Assignment** - Assign companies to zones
- ✏️ **Zone Editing** - Reshape zones by dragging vertices
- 💾 **Auto-Save** - Changes saved to localStorage
- 📤 **Import/Export** - Backup and restore data
- 📱 **Responsive** - Works on desktop, tablet, mobile
- ⌨️ **Keyboard Shortcuts** - Efficient navigation

## 📸 Screenshots

### Desktop View
```
┌─────────────────────────────────────────────────────────┐
│  Praktik Coworking - Zone Management                    │
├─────────────────────────────────────┬───────────────────┤
│                                     │  Zone Management  │
│                                     │                   │
│         Floor Plan Canvas           │  • Zone List      │
│         (Interactive)               │  • Actions        │
│                                     │  • Import/Export  │
│                                     │                   │
└─────────────────────────────────────┴───────────────────┘
```

### Mobile View
```
┌─────────────────────┐
│  Floor Plan         │
│  (Touch-enabled)    │
│                     │
└─────────────────────┘
┌─────────────────────┐
│  Zone Management    │
│  (Scrollable)       │
└─────────────────────┘
```

## 🎮 Usage

### Creating a Zone
1. Click on the floor plan to add vertices (corners)
2. Add 3-6 points
3. Click near the first point (green circle) to complete

### Managing Zones
- **Select**: Click on any zone
- **Occupy**: Click "Mark as Occupied" → Enter company name
- **Free**: Click "Mark as Free"
- **Edit**: Enable edit mode → Drag vertex handles
- **Delete**: Click "Delete Zone" → Confirm

### Keyboard Shortcuts
- `Escape` - Cancel operation
- `Delete` - Delete selected zone
- `Arrow Keys` - Navigate zones
- `Space` - Toggle status
- `e` - Edit zone

## ⚙️ Configuration

Edit `.env.local`:

```bash
# Enable/disable features
NEXT_PUBLIC_ENABLE_ZONE_CREATION=true
NEXT_PUBLIC_ENABLE_VERTEX_EDITING=true
NEXT_PUBLIC_ENABLE_ZONE_DELETION=true
```

**Restart server after changes!**

## 🎨 Customization

### Replace Floor Plan
```bash
cp your-floor-plan.png public/floor-plan.png
```
Recommended: 1920x1080 pixels (16:9 ratio)

### Change Colors
Edit `src/lib/map/canvasUtils.ts`:
```typescript
export function getZoneStyle(status: ZoneStatus) {
  if (status === 'free') {
    return {
      fillColor: 'rgba(34, 197, 94, 0.3)', // Your color
      strokeColor: '#22c55e',
      strokeWidth: 2
    };
  }
  // ...
}
```

## 📦 What's Included

### Routes
- `/[locale]/map` - Main zone management interface

### Components
- `ZoneCanvas` - Interactive canvas with Konva
- `ZoneManagementPanel` - Control panel
- `ZoneContextMenu` - Right-click menu
- `CompanyNameDialog` - Company input
- Plus 10+ supporting components

### Hooks
- `useZoneState` - Zone state management
- `useLocalStorage` - Persistent storage

### Utilities
- Zone operations (create, update, delete)
- Canvas rendering and performance
- Import/export functionality
- Validation and error handling

## 🔒 Security

⚠️ **Important**: The map route is currently unprotected!

Before production:
1. Add authentication
2. Implement authorization
3. Protect the route
4. Validate all inputs
5. Use HTTPS

See [MAP_SETUP.md](MAP_SETUP.md) for security details.

## 🐛 Troubleshooting

### Floor plan not showing?
- Check `public/floor-plan.png` exists
- Hard refresh: `Ctrl+Shift+R` or `Cmd+Shift+R`

### Zones not saving?
- Check browser console
- Verify localStorage enabled
- Export data as backup

### Can't create zones?
- Check `NEXT_PUBLIC_ENABLE_ZONE_CREATION=true`
- Restart dev server

See [MAP_CHECKLIST.md](MAP_CHECKLIST.md) for full troubleshooting.

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [MAP_QUICK_START.md](MAP_QUICK_START.md) | Get started in 3 steps |
| [MAP_SETUP.md](MAP_SETUP.md) | Complete setup guide |
| [MAP_INTEGRATION_SUMMARY.md](MAP_INTEGRATION_SUMMARY.md) | What was installed |
| [MAP_NAVIGATION.md](MAP_NAVIGATION.md) | Navigation options |
| [MAP_CHECKLIST.md](MAP_CHECKLIST.md) | Testing checklist |

## 🚀 Deployment

```bash
# 1. Build
pnpm build

# 2. Test
pnpm start

# 3. Deploy
# Follow your deployment process
```

## 🎯 Next Steps

1. **Test the interface** - Create some zones
2. **Customize the floor plan** - Use your actual office layout
3. **Add authentication** - Protect the route
4. **Backend integration** - Replace localStorage with API
5. **Go live!** - Deploy to production

## 💡 Tips

- Start with simple rectangular zones (4 vertices)
- Export your data regularly as backup
- Test on mobile devices
- Use descriptive company names
- Enable only needed features in production

## 🤝 Support

Need help?
1. Check the documentation files
2. Review browser console for errors
3. Verify environment variables
4. Test with a fresh browser session

## 📄 License

Part of the Praktik Office project.

---

**Ready to start?** → [Quick Start Guide](MAP_QUICK_START.md)

**Need details?** → [Complete Setup](MAP_SETUP.md)

**Having issues?** → [Troubleshooting](MAP_CHECKLIST.md)
