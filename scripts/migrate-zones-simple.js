#!/usr/bin/env node

/**
 * Simple migration script for zones-cleaned.json
 * Usage: node scripts/migrate-zones-simple.js
 */

const fs = require('fs');
const path = require('path');

// Load environment variables
try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {
  // dotenv not required, will use process.env
}

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

console.log('🚀 Zone Migration Script\n');
console.log(`📍 Strapi URL: ${STRAPI_URL}`);
console.log(`🔑 Token: ${STRAPI_TOKEN ? '✓ Found' : '✗ Missing'}\n`);

if (!STRAPI_TOKEN) {
  console.error('❌ Error: NEXT_PUBLIC_STRAPI_API_TOKEN not found');
  console.error('Set it in .env.local or environment variables');
  process.exit(1);
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

// Extract zones array
const zones = zonesData.zones || [];
console.log(`📦 Found ${zones.length} zones to migrate\n`);

if (zones.length === 0) {
  console.log('ℹ️  No zones to migrate');
  process.exit(0);
}

// Show first zone as example
console.log('📋 Example zone:');
console.log(`   ID: ${zones[0].id}`);
console.log(`   Status: ${zones[0].status}`);
console.log(`   Company: ${zones[0].companyName || 'N/A'}`);
console.log(`   Vertices: ${zones[0].vertices.length}\n`);

// Confirm before proceeding
console.log('🎯 Ready to migrate to Strapi');
console.log('Press Ctrl+C to cancel, or wait 3 seconds to continue...\n');

setTimeout(async () => {
  await migrateZones();
}, 3000);

async function migrateZones() {
  console.log('🚀 Starting migration...\n');
  
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;
  const errors = [];

  for (let i = 0; i < zones.length; i++) {
    const zone = zones[i];
    const progress = `[${i + 1}/${zones.length}]`;
    
    try {
      // Create zone in Strapi
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
        // Likely already exists
        console.log(`⏭️  ${progress} Already exists - skipping`);
        skipCount++;
      } else {
        const errorText = await response.text();
        console.error(`❌ ${progress} HTTP ${response.status}: ${errorText}`);
        errors.push({ zone: zone.id, error: `HTTP ${response.status}` });
        errorCount++;
      }
      
      // Small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`❌ ${progress} Failed: ${error.message}`);
      errors.push({ zone: zone.id, error: error.message });
      errorCount++;
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Migration Summary');
  console.log('='.repeat(50));
  console.log(`✅ Successfully created: ${successCount}`);
  console.log(`⏭️  Skipped (already exist): ${skipCount}`);
  console.log(`❌ Failed: ${errorCount}`);
  console.log(`📦 Total zones: ${zones.length}`);
  console.log('='.repeat(50));
  
  if (errors.length > 0) {
    console.log('\n❌ Errors:');
    errors.forEach(err => {
      console.log(`   - ${err.zone}: ${err.error}`);
    });
  }
  
  if (errorCount === 0) {
    console.log('\n🎉 Migration completed successfully!');
    console.log('💡 Check Strapi Admin to verify: ' + STRAPI_URL + '/admin');
    process.exit(0);
  } else {
    console.log('\n⚠️  Migration completed with errors');
    process.exit(1);
  }
}
