# Praktik Office

Сервисные офисы класса А в Астане с форматом «всё включено».

## 🗺️ Interactive Zone Management System

This project includes an interactive floor plan zone management system for managing office spaces.

### Quick Links

- **[📚 Full Documentation](docs/README.md)** - Complete documentation index
- **[🚀 Quick Start](docs/START_HERE.md)** - Get started in 30 seconds
- **[📖 Setup Guide](docs/MAP_SETUP.md)** - Complete setup instructions
- **[🔄 Migration Guide](docs/MIGRATE_NOW.md)** - Migrate existing zones

## Features

- 🗺️ Interactive floor plan with zone management
- 🔄 Server-side storage with Strapi
- 👥 Multi-user support
- 📱 Responsive design (mobile/tablet/desktop)
- ⌨️ Keyboard shortcuts
- 💾 Import/export functionality
- 🎨 Clean admin interface

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Access map interface
open http://localhost:3000/en/map
```

## Documentation

All documentation is in the [`docs/`](docs/) folder:

### Essential Guides
- [START_HERE.md](docs/START_HERE.md) - Quick overview
- [MAP_QUICK_START.md](docs/MAP_QUICK_START.md) - 3-step guide
- [STRAPI_ZONE_SETUP.md](docs/STRAPI_ZONE_SETUP.md) - Strapi setup
- [QUICK_REFERENCE.md](docs/QUICK_REFERENCE.md) - Quick reference

### Migration
- [MIGRATE_NOW.md](docs/MIGRATE_NOW.md) - Quick migration
- [MIGRATION_TROUBLESHOOTING.md](docs/MIGRATION_TROUBLESHOOTING.md) - Fix issues

### Complete Index
See [docs/README.md](docs/README.md) for complete documentation index.

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **UI**: Tailwind CSS, Radix UI
- **Canvas**: Konva, React-Konva
- **Backend**: Strapi CMS
- **i18n**: next-intl (English, Russian, Kazakh)

## Project Structure

```
praktikoffice/
├── docs/                    # Documentation (36 files)
├── src/
│   ├── app/
│   │   ├── (admin)/[locale]/map/  # Zone management
│   │   └── [locale]/              # Public pages
│   ├── components/map/      # Map components
│   ├── hooks/map/          # Custom hooks
│   ├── lib/map/            # Utilities
│   └── types/map/          # TypeScript types
├── public/
│   └── floor-plan.png      # Floor plan image
├── strapi/                 # Strapi CMS
└── scripts/                # Migration scripts
```

## Routes

- `/[locale]` - Home page
- `/[locale]/offices` - Office spaces
- `/[locale]/meeting-room` - Meeting rooms
- `/[locale]/open-space` - Coworking spaces
- `/[locale]/map` - Zone management (admin)

## Development

```bash
# Install dependencies
pnpm install

# Start Next.js
pnpm dev

# Start Strapi (separate terminal)
cd strapi
npm run develop

# Build for production
pnpm build

# Start production server
pnpm start
```

## Environment Variables

```bash
# Strapi
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_API_TOKEN=your_token_here

# Map Features
NEXT_PUBLIC_ENABLE_VERTEX_EDITING=true
NEXT_PUBLIC_ENABLE_ZONE_DELETION=true
NEXT_PUBLIC_ENABLE_ZONE_CREATION=true
```

## License

Private project - Praktik Office

## Support

For documentation and guides, see the [`docs/`](docs/) folder.

For quick help:
- [Quick Start](docs/START_HERE.md)
- [Troubleshooting](docs/MIGRATION_TROUBLESHOOTING.md)
- [Quick Reference](docs/QUICK_REFERENCE.md)
