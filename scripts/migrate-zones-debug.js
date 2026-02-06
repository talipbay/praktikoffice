#!/usr/bin/env node

/**
 * Debug migration script with better error messages
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Load environment variables
try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {
  console.log('⚠️  dotenv not available, using process.env');
}

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

console.log('🔍 Debug Information\n');
console.log(`📍 Strapi URL: ${STRAPI_URL}`);
console.log(`🔑 Token: ${STRAPI_TOKEN ? '✓ Found (' + STRAPI_TOKEN.substring(0, 10) + '...)' : '✗ Missing'}\n`);

if (!STRAPI_TOKEN) {
  console.error('❌ Error: NEXT_PUBLIC_STRAPI_API_TOKEN not found');
  process.exit(1);
}

// Test connection first
async function testConnection() {
  console.log('🔌 Testing connection to Strapi...\n');
  
  try {
    const response = await fetch(`${STRAPI_URL}/api/zones`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${STRAPI_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log(`✅ Connection successful! Status: ${response.status}`);
    
    if (response.status === 401) {
      console.error('❌ Authentication failed - Invalid API token');
      process.exit(1);
    }
    
    if (response.status === 403) {
      console.error('❌ Permission denied - Check Strapi permissions');
      console.error('   Go to Settings → Roles → Public → Enable all for "zone"');
      process.exit(1);
    }
    
    if (response.status === 404) {
      console.error('❌ Zone content type not found');
      console.error('   Create "zone" content type in Strapi first');
      process.exit(1);
    }
    
    const data = await response.json();
    console.log(`📦 Current zones in Strapi: ${data.data ? data.data.length : 0}\n`);
    
    return true;
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('\n🔍 Possible issues:');
    console.error('   1. Strapi is not running');
    console.error('   2. URL is incorrect');
    console.error('   3. Firewall blocking connection');
    console.error('   4. SSL certificate issues (if using HTTPS)');
    console.error('\n💡 Try:');
    console.error('   - Check if Strapi is running: curl ' + STRAPI_URL);
    console.error('   - Start Strapi: cd strapi && npm run develop');
    console.error('   - Check .env.local has correct URL');
    process.exit(1);
  }
}

// Read zones file
const zonesFile = path.join(process.cwd(), 'public/zones-cleaned.json');
console.log(`📂 Reading: ${zonesFile}`);

if (!fs.existsSync(zonesFile)) {
  console.error('❌ Error: public/zones-cleaned.json not found');
  process.exit(1);
}

let zonesData;
try {
  const fileContent = fs.readFileSync(zonesFile, 'utf8');
  zonesData = JSON.parse(fileContent);
  console.log('✓ File parsed successfully\n');
} catch (error) {
  console.error('❌ Error reading file:', error.message);
  process.exit(1);
}

const zones = zonesData.zones || [];
console.log(`📦 Found ${zones.length} zones to migrate\n`);

// Test connection before migrating
testConnection().then(async () => {
  console.log('🚀 Starting migration in 3 seconds...\n');
  
  setTimeout(async () => {
    await migrateZones();
  }, 3000);
});

async function migrateZones() {
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;
  const errors = [];

  for (let i = 0; i < zones.length; i++) {
    const zone = zones[i];
    const progress = `[${i + 1}/${zones.length}]`;
    
    try {
      const response = await fetch(`${STRAPI_URL}/api/zones`, {
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

      if (response.ok) {
        const statusEmoji = zone.status === 'occupied' ? '🔴' : '🟢';
        const companyInfo = zone.companyName ? ` (${zone.companyName})` : '';
        console.log(`✅ ${progress} Created ${statusEmoji}${companyInfo}`);
        successCount++;
      } else if (response.status === 400) {
        console.log(`⏭️  ${progress} Already exists - skipping`);
        skipCount++;
      } else {
        const errorText = await response.text();
        console.error(`❌ ${progress} HTTP ${response.status}: ${errorText.substring(0, 100)}`);
        errors.push({ zone: zone.id, error: `HTTP ${response.status}` });
        errorCount++;
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`❌ ${progress} Failed: ${error.message}`);
      errors.push({ zone: zone.id, error: error.message });
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 Migration Summary');
  console.log('='.repeat(50));
  console.log(`✅ Successfully created: ${successCount}`);
  console.log(`⏭️  Skipped (already exist): ${skipCount}`);
  console.log(`❌ Failed: ${errorCount}`);
  console.log(`📦 Total zones: ${zones.length}`);
  console.log('='.repeat(50));
  
  if (errorCount === 0) {
    console.log('\n🎉 Migration completed successfully!');
    process.exit(0);
  } else {
    console.log('\n⚠️  Migration completed with errors');
    process.exit(1);
  }
}
