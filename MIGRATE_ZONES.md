# Migrate Zones to Strapi - Quick Guide

## 🚀 Fastest Method (Browser Console)

1. **Open map**: http://localhost:3000/en/map
2. **Open console**: Press `F12`
3. **Run this command**:

```javascript
fetch('http://localhost:3000/scripts/migrate-zones-browser.js').then(r=>r.text()).then(eval)
```

4. **Enter API token** when prompted
5. **Done!** Refresh to see zones from Strapi

---

## 📝 Alternative: Copy/Paste Method

1. **Open map**: http://localhost:3000/en/map
2. **Open console**: Press `F12`
3. **Copy this entire script**:

```javascript
(async function() {
  const STRAPI_URL = 'http://localhost:1337';
  const STRAPI_TOKEN = prompt('Enter Strapi API token:');
  if (!STRAPI_TOKEN) return console.error('❌ No token');
  
  const data = localStorage.getItem('interactive-zone-manager-zones');
  if (!data) return console.error('❌ No zones found');
  
  const zones = JSON.parse(data).zones || [];
  console.log(`📦 Migrating ${zones.length} zones...`);
  
  let success = 0;
  for (const zone of zones) {
    try {
      const res = await fetch(`${STRAPI_URL}/api/zones`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${STRAPI_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            zoneId: zone.id,
            vertices: zone.vertices,
            status: zone.status,
            companyName: zone.companyName,
          },
        }),
      });
      if (res.ok) {
        success++;
        console.log(`✅ ${success}/${zones.length}`);
      }
      await new Promise(r => setTimeout(r, 100));
    } catch (e) {
      console.error('❌', e.message);
    }
  }
  console.log(`🎉 Done! ${success}/${zones.length} migrated`);
})();
```

4. **Paste in console** and press Enter
5. **Enter your API token**
6. **Wait for completion**
7. **Refresh page**

---

## 🔑 Get API Token

1. Open: http://localhost:1337/admin
2. Settings → API Tokens
3. Copy token

---

## ✅ Verify

After migration:
- Refresh map page
- Zones should load from Strapi
- Open in another browser - same zones!

---

## 📚 Full Guide

See **[ZONE_MIGRATION_GUIDE.md](ZONE_MIGRATION_GUIDE.md)** for detailed instructions.
