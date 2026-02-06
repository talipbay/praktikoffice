#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

if (!STRAPI_TOKEN) {
  console.error('❌ Error: NEXT_PUBLIC_STRAPI_API_TOKEN not found');
  process.exit(1);
}

const zonesFile = path.join(process.cwd(), 'zones-backup.json');
if (!fs.existsSync(zonesFile)) {
  console.error('❌ Error: zones-backup.json not found');
  console.error('Export zones from map and save as zones-backup.json');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(zonesFile, 'utf8'));
const zones = Array.isArray(data) ? data : (data.zones || data.data || []);

console.log(`📦 Found ${zones.length} zones to migrate`);

async function migrate() {
  let success = 0, skip = 0, fail = 0;
  
  for (let i = 0; i < zones.length; i++) {
    const zone = zones[i];
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
        console.log(`✅ [${i+1}/${zones.length}] Created`);
        success++;
      } else {
        console.log(`⏭️  [${i+1}/${zones.length}] Skipped (exists)`);
        skip++;
      }
      
      await new Promise(r => setTimeout(r, 100));
    } catch (e) {
      console.error(`❌ [${i+1}/${zones.length}] Failed:`, e.message);
      fail++;
    }
  }
  
  console.log(`\n📊 Summary: ✅${success} ⏭️${skip} ❌${fail}`);
}

migrate();
