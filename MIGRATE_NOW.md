# Migrate Your Zones NOW - 2 Minutes ⚡

## 🎯 You Have Zones in localStorage?

Follow these steps to move them to Strapi:

---

## ⚡ Super Quick Method (Browser Console)

### Step 1: Open Map
```
http://localhost:3000/en/map
```

### Step 2: Open Console
Press `F12` (or `Cmd+Option+J` on Mac)

### Step 3: Paste This
```javascript
(async()=>{const t=prompt('Strapi API token:');if(!t)return;const e=localStorage.getItem('interactive-zone-manager-zones');if(!e)return console.error('No zones');const o=JSON.parse(e).zones||[];console.log(`Migrating ${o.length} zones...`);let n=0;for(const e of o)try{const o=await fetch('http://localhost:1337/api/zones',{method:'POST',headers:{Authorization:`Bearer ${t}`,'Content-Type':'application/json'},body:JSON.stringify({data:{zoneId:e.id,vertices:e.vertices,status:e.status,companyName:e.companyName}})});o.ok&&(n++,console.log(`✅ ${n}/${o.length}`)),await new Promise(e=>setTimeout(e,100))}catch(e){console.error('❌',e.message)}console.log(`🎉 Done! ${n}/${o.length}`)})();
```

### Step 4: Enter Token
Get from: http://localhost:1337/admin → Settings → API Tokens

### Step 5: Done!
Refresh page to see zones from Strapi

---

## 📋 Alternative: Export/Import

### Option A: Quick Export/Import
1. Click "Export Zones" button on map
2. Refresh page
3. Click "Import Zones" button
4. Select the exported file
5. Done!

### Option B: Node.js Script
```bash
# 1. Export zones to zones-backup.json
# 2. Run:
node scripts/migrate-zones-to-strapi.js
```

---

## 🔑 Get API Token

1. Open: http://localhost:1337/admin
2. Settings → API Tokens
3. Create or copy existing token
4. Use it in the script

---

## ✅ Verify Migration

After migration:
1. Refresh map page
2. Open Strapi Admin → Content Manager → Zones
3. Open map in another browser
4. All should show same zones!

---

## 🆘 Problems?

### "No zones found"
- Check you're on correct domain
- Look in DevTools → Application → Local Storage

### "401 Error"
- Token is wrong
- Get new token from Strapi Admin

### "403 Error"
- Permissions not set
- Settings → Roles → Public → Enable all for "zone"

---

## 📚 More Help

See **[ZONE_MIGRATION_GUIDE.md](ZONE_MIGRATION_GUIDE.md)** for detailed guide.

---

**That's it! Your zones are now on the server! 🎉**
