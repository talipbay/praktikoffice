# Migration Troubleshooting - "fetch failed"

## Problem

Getting "fetch failed" error when running migration scripts. This means Node.js cannot connect to Strapi.

## Quick Diagnosis

Run this command on your server:

```bash
# Test if Strapi is accessible
curl https://cms.praktikoffice.kz/api/zones

# Or test connection script
bash scripts/test-strapi-connection.sh
```

## Common Causes & Solutions

### 1. Strapi Not Running

**Check if Strapi is running:**
```bash
# Check if process is running
ps aux | grep strapi

# Check if port is listening
netstat -tlnp | grep 1337
```

**Solution:**
```bash
cd strapi
npm run develop
# Or if using PM2:
pm2 start ecosystem.config.js
pm2 logs strapi
```

### 2. Node.js Can't Resolve HTTPS

**Problem**: Node.js on server might not be able to connect to HTTPS URLs due to:
- SSL certificate issues
- DNS resolution problems
- Firewall rules

**Solution A: Use localhost instead**

If Strapi is running on the same server, use localhost:

```bash
# Edit .env.local temporarily
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337

# Run migration
node scripts/migrate-zones-debug.js
```

**Solution B: Use internal IP**

```bash
# Find internal IP
hostname -I

# Use internal IP
NEXT_PUBLIC_STRAPI_URL=http://10.0.0.1:1337
```

### 3. Firewall Blocking Connection

**Check firewall:**
```bash
# Check if port 1337 is open
sudo ufw status
sudo iptables -L -n | grep 1337
```

**Solution:**
```bash
# Allow port 1337
sudo ufw allow 1337
```

### 4. SSL Certificate Issues

**If using HTTPS, Node.js might reject self-signed certificates**

**Solution: Disable SSL verification (temporary)**

Create a new migration script:

```bash
# Create bypass script
cat > scripts/migrate-zones-bypass-ssl.js << 'EOF'
#!/usr/bin/env node

// Disable SSL verification (use only for migration)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Run the migration
require('./migrate-zones-debug.js');
EOF

chmod +x scripts/migrate-zones-bypass-ssl.js

# Run it
node scripts/migrate-zones-bypass-ssl.js
```

## Alternative: Direct Database Migration

If fetch continues to fail, migrate directly via Strapi Admin UI:

### Method 1: Manual Import via Strapi Admin

1. **Open Strapi Admin:**
   ```
   https://cms.praktikoffice.kz/admin
   ```

2. **Go to Content Manager → Zones**

3. **Click "Create new entry"**

4. **For each zone in `public/zones-cleaned.json`:**
   - Copy zone data
   - Create entry manually
   - (This is tedious but works)

### Method 2: Use Strapi Import Plugin

1. **Install import plugin in Strapi:**
   ```bash
   cd strapi
   npm install @strapi/plugin-import-export-entries
   ```

2. **Restart Strapi**

3. **Use import feature in admin panel**

### Method 3: Direct Database Insert

If you have database access:

```bash
# Connect to PostgreSQL
psql -U your_user -d your_database

# Insert zones (example)
INSERT INTO zones (zone_id, vertices, status, company_name, created_at, updated_at)
VALUES ('zone_123', '{"vertices": [...]}', 'free', NULL, NOW(), NOW());
```

## Debug Steps

### Step 1: Test Basic Connectivity

```bash
# Can you reach Strapi at all?
curl https://cms.praktikoffice.kz

# Expected: HTML response or redirect
```

### Step 2: Test API Endpoint

```bash
# Load token
source .env.local

# Test API
curl -H "Authorization: Bearer $NEXT_PUBLIC_STRAPI_API_TOKEN" \
     https://cms.praktikoffice.kz/api/zones

# Expected: JSON response with zones array
```

### Step 3: Test from Node.js

```bash
# Create test script
cat > test-fetch.js << 'EOF'
const url = 'https://cms.praktikoffice.kz/api/zones';
fetch(url)
  .then(r => console.log('Success:', r.status))
  .catch(e => console.error('Error:', e.message));
EOF

node test-fetch.js
```

### Step 4: Check DNS Resolution

```bash
# Can server resolve the domain?
nslookup cms.praktikoffice.kz
ping cms.praktikoffice.kz

# If fails, add to /etc/hosts
echo "YOUR_SERVER_IP cms.praktikoffice.kz" | sudo tee -a /etc/hosts
```

## Recommended Solution

**Use localhost if Strapi is on same server:**

```bash
# 1. Verify Strapi is running
curl http://localhost:1337/api/zones

# 2. Update .env.local temporarily
cat > .env.local.migration << EOF
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_API_TOKEN=$(grep STRAPI_API_TOKEN .env.local | cut -d= -f2)
EOF

# 3. Run migration with local config
NODE_ENV=production node -r dotenv/config scripts/migrate-zones-debug.js dotenv_config_path=.env.local.migration

# 4. Restore original .env.local
# (keep your original .env.local unchanged)
```

## Quick Fix Script

Create this helper script:

```bash
cat > migrate-local.sh << 'EOF'
#!/bin/bash
echo "🔧 Using localhost for migration..."

# Backup original
cp .env.local .env.local.backup

# Use localhost
export NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
export NEXT_PUBLIC_STRAPI_API_TOKEN=$(grep STRAPI_API_TOKEN .env.local | cut -d= -f2)

# Run migration
node scripts/migrate-zones-debug.js

# Restore
mv .env.local.backup .env.local

echo "✅ Done!"
EOF

chmod +x migrate-local.sh
./migrate-local.sh
```

## Still Not Working?

### Last Resort: Browser-Based Migration

1. **Open your map page:**
   ```
   https://praktikoffice.kz/en/map
   ```

2. **Open browser console (F12)**

3. **Paste this script:**
   ```javascript
   // Load zones from file
   fetch('/zones-cleaned.json')
     .then(r => r.json())
     .then(data => {
       const zones = data.zones;
       console.log(`Found ${zones.length} zones`);
       
       // Migrate each zone
       let count = 0;
       zones.forEach(async (zone, i) => {
         try {
           const res = await fetch('/api/zones', {
             method: 'POST',
             headers: {'Content-Type': 'application/json'},
             body: JSON.stringify({
               data: {
                 zoneId: zone.id,
                 vertices: zone.vertices,
                 status: zone.status,
                 companyName: zone.companyName
               }
             })
           });
           if (res.ok) {
             count++;
             console.log(`✅ ${count}/${zones.length}`);
           }
         } catch (e) {
           console.error(`❌ ${i+1}`, e);
         }
       });
     });
   ```

## Summary

**Most likely cause**: Node.js can't connect to HTTPS URL from server

**Best solution**: Use `http://localhost:1337` instead of `https://cms.praktikoffice.kz`

**Quick command:**
```bash
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337 node scripts/migrate-zones-debug.js
```
