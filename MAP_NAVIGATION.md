# Adding Map Navigation to Your Site

## Option 1: Add to Navbar (Admin Only)

If you want to add a link to the map in your navbar for admin users:

### Edit `src/components/navbar.tsx`

Add a conditional link for authenticated admin users:

```tsx
// Add this import at the top
import { usePathname } from 'next/navigation';

// Inside your Navbar component, add this link (example):
{isAdmin && (
  <Link 
    href={`/${locale}/map`}
    className="text-sm font-medium hover:text-primary transition-colors"
  >
    Zone Management
  </Link>
)}
```

## Option 2: Direct URL Access

Simply navigate to:
- `http://localhost:3000/en/map`
- `http://localhost:3000/ru/map`
- `http://localhost:3000/kz/map`

Bookmark this URL for quick access.

## Option 3: Create Admin Dashboard

Create a dedicated admin dashboard page:

### Create `src/app/[locale]/admin/page.tsx`:

```tsx
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link 
          href="/en/map"
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Zone Management</h2>
              <p className="text-gray-600 text-sm">Manage office floor plan zones</p>
            </div>
          </div>
        </Link>
        
        {/* Add more admin tools here */}
      </div>
    </div>
  );
}
```

Then access via: `http://localhost:3000/en/admin`

## Option 4: Hidden Route (Current Setup)

The map is currently accessible but not linked anywhere in the UI. This is good for:
- Testing before going live
- Admin-only access via direct URL
- Keeping it separate from public site

## Recommended: Add Authentication

Before adding navigation, protect the route with authentication:

### Create `src/middleware.ts` (if not exists):

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if accessing map route
  if (pathname.includes('/map')) {
    // Add your authentication check here
    const isAuthenticated = checkAuth(request); // Implement this
    
    if (!isAuthenticated) {
      // Redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/:locale/map/:path*',
};
```

## Quick Access Bookmarklet

Create a browser bookmark with this URL for instant access:
```
http://localhost:3000/en/map
```

Or for production:
```
https://praktikoffice.kz/en/map
```

## Security Note

⚠️ **Important**: The map route is currently unprotected. Anyone with the URL can access it.

Before adding navigation or going to production:
1. Implement authentication
2. Add role-based access control
3. Protect the route with middleware
4. Consider IP whitelisting for extra security

## Testing Access

To test if the route works:

```bash
# Start dev server
pnpm dev

# Open in browser
open http://localhost:3000/en/map
```

You should see the zone management interface with the floor plan.
