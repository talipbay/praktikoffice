#!/usr/bin/env node

/**
 * Final Migration Script - Foolproof version
 * This script forces localhost connection and provides detailed debugging
 */

const fs = require('fs');
const path = require('path');

// FORCE localhost - ignore any environment variables
const STRAPI_URL = 'http://localhost:1337';

// Try to load token from .env.local
let STRAPI_TOKEN = '';
try {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const tokenMatch = envContent.match(/NEXT_PUBLIC_STRAPI_API_TOKEN=(.+)/);
  if (tokenMatch) {
    STRAPI_TOKEN = tokenMatch[1].trim();
  }
} catch (e) {
  console.error('❌ Could not read .env.local');
  process.exit(1);
}

console.log('🚀 Zone Migration Script (Localhost Version)\n');
console.log('='.repeat(50));
console.log(`📍 Strapi URL: ${STRAPI_URL} (FORCED)`);
console.log(`🔑 Token: ${STRAPI_TOKEN ? '✓ Found' : '✗ Missing'}`);
console.log('='.repeat(50) + '\n');

if (!STRAPI_TOKEN || STRAPI_TOKEN === 'your_token_here') {
  console.error('❌ Error: Valid STRAPI_API_TOKEN not found in .env.local');
  console.error('\n📝 To fix:');
  console.error('   1. Open Strapi admin: http://localhost:1337/admin');
  console.error('   2. Go to Settings → API Tokens → Create new token');
  console.error('   3. Copy token to .env.local');
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
      console.error('\n❌ Authentication failed - Invalid API token');
      console.error('   Update NEXT_PUBLIC_STRAPI_API_TOKEN in .env.local');
      process.exit(1);
    }
    
    if (response.status === 403) {
      console.error('\n❌ Permission denied');
      console.error('   Fix: Open Strapi Admin → Settings → Roles → Public');
      console.error('   Enable: find, findOne, create, update for "zone"');
      process.exit(1);
    }
    
    if (response.status === 404) {
      console.error('\n❌ Zone content type not found');
      console.error('   Create "zone" content type in Strapi first');
      console.error('   See: strapi-schemas/zone.json');
      process.exit(1);
    }
    
    const data = await response.json();
    const currentCount = data.data ? data.data.length : 0;
    console.log(`📦 Current zones in Strapi: ${currentCount}\n`);
    
    return currentCount;
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('\n🔍 Troubleshooting:');
    console.error('   1. Is Strapi running?');
    console.error('      → cd strapi && npm run develop');
    console.error('   2. Check if port 1337 is accessible:');
    console.error('      → curl http://localhost:1337');
    console.error('   3. Check Strapi logs for errors');
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

if (zones.length === 0) {
  console.error('❌ No zones found in file');
  process.exit(1);
}

// Show sample zone
console.log('📋 Sample zone:');
const sample = zones[0];
console.log(`   ID: ${sample.id}`);
console.log(`   Status: ${sample.status}`);
console.log(`   Company: ${sample.companyName || 'N/A'}`);
console.log(`   Vertices: ${sample.vertices.length}\n`);

// Main migration function
async function migrateZones() {
  const currentCount = await testConnection();
  
  console.log('🎯 Ready to migrate zones');
  console.log('⏳ Starting in 3 seconds...\n');
  
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  console.log('🚀 Starting migration...\n');
  
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
            companyName: zone.companyName || null,
          },
        }),
      });

      if (response.ok) {
        const statusEmoji = zone.status === 'occupied' ? '🔴' : '🟢';
        const companyInfo = zone.companyName ? ` (${zone.companyName})` : '';
        console.log(`✅ ${progress} ${statusEmoji} ${zone.id}${companyInfo}`);
        successCount++;
      } else if (response.status === 400) {
        const errorData = await response.json();
        // Check if it's a duplicate
        if (errorData.error && errorData.error.message && 
            errorData.error.message.includes('unique')) {
          console.log(`⏭️  ${progress} Already exists - ${zone.id}`);
          skipCount++;
        } else {
          console.error(`❌ ${progress} Bad request: ${errorData.error?.message || 'Unknown'}`);
          errors.push({ zone: zone.id, error: errorData.error?.message || 'Bad request' });
          errorCount++;
        }
      } else {
        const errorText = await response.text();
        console.error(`❌ ${progress} HTTP ${response.status}: ${errorText.substring(0, 100)}`);
        errors.push({ zone: zone.id, error: `HTTP ${response.status}` });
        errorCount++;
      }
      
      // Small delay to avoid overwhelming Strapi
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
  
  if (errors.length > 0 && errors.length <= 10) {
    console.log('\n❌ Errors:');
    errors.forEach(e => {
      console.log(`   - ${e.zone}: ${e.error}`);
    });
  }
  
  if (errorCount === 0) {
    console.log('\n🎉 Migration completed successfully!');
    console.log('\n📍 Next steps:');
    console.log('   1. Open map: http://localhost:3000/en/map');
    console.log('   2. Verify zones are visible');
    console.log('   3. Test editing zones');
    process.exit(0);
  } else if (successCount > 0) {
    console.log('\n⚠️  Migration partially completed');
    console.log(`   ${successCount} zones migrated, ${errorCount} failed`);
    process.exit(0);
  } else {
    console.log('\n❌ Migration failed - no zones were migrated');
    console.log('\n🔍 Check:');
    console.log('   1. Strapi permissions (Settings → Roles → Public)');
    console.log('   2. Zone content type exists');
    console.log('   3. API token is valid');
    process.exit(1);
  }
}

// Run migration
migrateZones().catch(error => {
  console.error('\n💥 Unexpected error:', error);
  process.exit(1);
});
