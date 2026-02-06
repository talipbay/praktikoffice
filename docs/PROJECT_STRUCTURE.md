# Project Structure - Zone Management Integration

## 📁 New File Structure

```
praktikoffice/
│
├── 📄 .env.local (updated)
│   └── Map feature flags added
│
├── 📄 tsconfig.json (updated)
│   └── Excluded praktikmap from compilation
│
├── 📂 public/
│   └── 📄 floor-plan.png (NEW)
│       └── 1920x1080 floor plan image
│
├── 📂 src/
│   │
│   ├── 📂 app/
│   │   ├── 📄 globals.css (updated)
│   │   │   └── Map-specific CSS utilities added
│   │   │
│   │   └── 📂 [locale]/
│   │       └── 📂 map/ (NEW)
│   │           ├── 📄 page.tsx
│   │           │   └── Main zone management interface
│   │           └── 📄 layout.tsx
│   │               └── Layout without navbar/footer
│   │
│   ├── 📂 components/
│   │   └── 📂 map/ (NEW - 15+ components)
│   │       ├── 📄 ZoneCanvas.tsx
│   │       │   └── Interactive Konva canvas
│   │       ├── 📄 ZoneManagementPanel.tsx
│   │       │   └── Control panel sidebar
│   │       ├── 📄 ZoneContextMenu.tsx
│   │       │   └── Right-click menu
│   │       ├── 📄 CompanyNameDialog.tsx
│   │       │   └── Company input dialog
│   │       ├── 📄 ZoneList.tsx
│   │       │   └── Zone listing component
│   │       ├── 📄 ZoneActions.tsx
│   │       │   └── Action buttons
│   │       ├── 📄 DataManagement.tsx
│   │       │   └── Import/export functionality
│   │       ├── 📄 LoadingSpinner.tsx
│   │       │   └── Loading states
│   │       ├── 📄 ErrorBoundary.tsx
│   │       │   └── Error handling
│   │       ├── 📄 BrowserCompatibility.tsx
│   │       │   └── Browser checks
│   │       ├── 📄 PerformanceMonitor.tsx
│   │       │   └── Performance tracking
│   │       ├── 📄 GitHubTokenDialog.tsx
│   │       │   └── GitHub integration
│   │       ├── 📄 index.ts
│   │       │   └── Component exports
│   │       └── 📂 ui/
│   │           ├── 📄 button.tsx
│   │           ├── 📄 dialog.tsx
│   │           ├── 📄 card.tsx
│   │           ├── 📄 input.tsx
│   │           ├── 📄 badge.tsx
│   │           ├── 📄 separator.tsx
│   │           ├── 📄 scroll-area.tsx
│   │           └── 📄 progress.tsx
│   │
│   ├── 📂 hooks/
│   │   └── 📂 map/ (NEW)
│   │       ├── 📄 useZoneState.ts
│   │       │   └── Zone state management hook
│   │       ├── 📄 useLocalStorage.ts
│   │       │   └── localStorage persistence hook
│   │       ├── 📄 index.ts
│   │       │   └── Hook exports
│   │       └── 📂 __tests__/
│   │           └── Test files
│   │
│   ├── 📂 lib/
│   │   └── 📂 map/ (NEW - 10+ utilities)
│   │       ├── 📄 zoneUtils.ts
│   │       │   └── Zone CRUD operations
│   │       ├── 📄 canvasUtils.ts
│   │       │   └── Canvas rendering utilities
│   │       ├── 📄 canvasPerformance.ts
│   │       │   └── Performance optimization
│   │       ├── 📄 config.ts
│   │       │   └── Feature flag configuration
│   │       ├── 📄 assets.ts
│   │       │   └── Asset path management
│   │       ├── 📄 dataExportImport.ts
│   │       │   └── Import/export functionality
│   │       ├── 📄 githubStorage.ts
│   │       │   └── GitHub storage integration
│   │       ├── 📄 zoneLoader.ts
│   │       │   └── Predefined zones loader
│   │       ├── 📄 performanceTesting.ts
│   │       │   └── Performance testing utilities
│   │       ├── 📄 utils.ts
│   │       │   └── General utilities
│   │       └── 📂 __tests__/
│   │           └── Test files
│   │
│   └── 📂 types/
│       └── 📂 map/ (NEW)
│           └── 📄 zone.ts
│               └── TypeScript interfaces
│
├── 📂 praktikmap/ (original project - kept for reference)
│   └── Not compiled (excluded in tsconfig.json)
│
└── 📚 Documentation (NEW)
    ├── 📄 README_MAP.md
    │   └── Main documentation hub
    ├── 📄 MAP_QUICK_START.md
    │   └── Quick start guide
    ├── 📄 MAP_SETUP.md
    │   └── Complete setup guide
    ├── 📄 MAP_INTEGRATION_SUMMARY.md
    │   └── Integration details
    ├── 📄 MAP_NAVIGATION.md
    │   └── Navigation options
    ├── 📄 MAP_CHECKLIST.md
    │   └── Testing checklist
    ├── 📄 INTEGRATION_COMPLETE.md
    │   └── Completion summary
    └── 📄 PROJECT_STRUCTURE.md
        └── This file
```

## 🔗 Import Path Structure

All map-related imports use the `/map` namespace:

```typescript
// Components
import { ZoneCanvas } from '@/components/map/ZoneCanvas';
import { Button } from '@/components/map/ui/button';

// Hooks
import { useZoneState } from '@/hooks/map/useZoneState';
import { useLocalStorage } from '@/hooks/map/useLocalStorage';

// Utilities
import { createZone } from '@/lib/map/zoneUtils';
import { config } from '@/lib/map/config';
import { getFloorPlanUrl } from '@/lib/map/assets';

// Types
import { Zone, Point } from '@/types/map/zone';
```

## 📦 Dependencies Added

```json
{
  "dependencies": {
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-scroll-area": "^1.2.10",
    "@radix-ui/react-separator": "^1.1.8",
    "@radix-ui/react-slot": "^1.2.4",
    "konva": "^10.2.0",
    "react-konva": "^19.2.2"
  }
}
```

## 🌐 Routes Added

```
/[locale]/map
├── /en/map     (English)
├── /ru/map     (Russian)
└── /kz/map     (Kazakh)
```

## 🎨 CSS Classes Added

```css
/* Touch-friendly */
.touch-target
.no-select

/* Scrolling */
.smooth-scroll

/* Canvas */
.canvas-container
.canvas-large
.canvas-area
.no-scroll

/* Mobile */
.zone-panel-mobile
.canvas-tablet

/* Instructions */
.zone-instructions
```

## ⚙️ Environment Variables

```bash
# .env.local
NEXT_PUBLIC_ENABLE_VERTEX_EDITING=true
NEXT_PUBLIC_ENABLE_ZONE_DELETION=true
NEXT_PUBLIC_ENABLE_ZONE_CREATION=true
```

## 📊 Component Hierarchy

```
MapPage (page.tsx)
│
├── Header
│   ├── Logo
│   ├── Title
│   └── Status Indicator
│
├── Canvas Area
│   ├── Canvas Header
│   │   ├── Instructions
│   │   └── Zone Count
│   │
│   └── ZoneCanvas
│       ├── Floor Plan Image
│       ├── Zone Polygons
│       ├── Zone Labels
│       ├── Vertex Handles
│       └── Creation Feedback
│
├── Management Panel
│   ├── ZoneList
│   │   └── Zone Items
│   │
│   ├── ZoneActions
│   │   ├── Status Toggle
│   │   ├── Edit Button
│   │   └── Delete Button
│   │
│   └── DataManagement
│       ├── Export Button
│       ├── Import Button
│       └── Clear Button
│
├── Dialogs
│   ├── CompanyNameDialog
│   └── GitHubTokenDialog
│
└── Context Menus
    └── ZoneContextMenu
```

## 🔄 Data Flow

```
User Interaction
      ↓
ZoneCanvas (UI)
      ↓
Event Handlers (page.tsx)
      ↓
useZoneState Hook
      ↓
Zone Utilities (zoneUtils.ts)
      ↓
useLocalStorage Hook
      ↓
Browser localStorage
```

## 🎯 Key Files by Function

### Zone Creation
- `ZoneCanvas.tsx` - Canvas interaction
- `zoneUtils.ts` - Zone validation & creation
- `useZoneState.ts` - State management

### Zone Rendering
- `ZoneCanvas.tsx` - Konva rendering
- `canvasUtils.ts` - Styling & calculations
- `canvasPerformance.ts` - Optimization

### Data Persistence
- `useLocalStorage.ts` - localStorage hook
- `dataExportImport.ts` - Import/export
- `githubStorage.ts` - GitHub integration

### UI Components
- `ZoneManagementPanel.tsx` - Main panel
- `ZoneList.tsx` - Zone listing
- `ZoneActions.tsx` - Action buttons
- `CompanyNameDialog.tsx` - Input dialog

### Configuration
- `config.ts` - Feature flags
- `.env.local` - Environment variables
- `assets.ts` - Asset paths

## 📈 Statistics

- **Total Files Created**: 50+
- **Components**: 15+
- **Utilities**: 10+
- **Hooks**: 2
- **Types**: 1 file with 10+ interfaces
- **Documentation**: 7 files
- **Lines of Code**: ~5,000+

## 🚀 Build Output

```
Route (app)
├ ○ /_not-found
├ ƒ /[locale]
├ ƒ /[locale]/map              ← NEW!
├ ƒ /[locale]/meeting-room
├ ƒ /[locale]/offices
└ ƒ /[locale]/open-space

ƒ  (Dynamic)  server-rendered on demand
```

## ✅ Integration Status

- [x] Dependencies installed
- [x] Components copied and adapted
- [x] Hooks integrated
- [x] Utilities configured
- [x] Types defined
- [x] Routes created
- [x] Styles added
- [x] Documentation written
- [x] Build successful
- [x] Ready to use!

## 🎊 Result

A fully functional, production-ready zone management system integrated seamlessly into your Praktik Office website!

Access it at: **`/[locale]/map`**
