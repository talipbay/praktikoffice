/**
 * Browser-based migration script
 * Run this in the browser console on the map page to migrate localStorage zones to Strapi
 * 
 * Usage:
 * 1. Open http://localhost:3000/en/map in your browser
 * 2. Open browser console (F12)
 * 3. Copy and paste this entire script
 * 4. Press Enter
 */

(async function migrateZonesToStrapi() {
  console.log('🚀 Starting zone migration from localStorage to Strapi...\n');

  // Configuration
  const STRAPI_URL = 'http://localhost:1337';
  const STRAPI_TOKEN = localStorage.getItem('strapi-token') || prompt('Enter your Strapi API token:');
  
  if (!STRAPI_TOKEN) {
    console.error('❌ No API token provided. Migration cancelled.');
    return;
  }

  // Get zones from localStorage
  const STORAGE_KEY = 'interactive-zone-manager-zones';
  const storageData = localStorage.getItem(STORAGE_KEY);
  
  if (!storageData) {
    console.error('❌ No zones found in localStorage');
    return;
  }

  let zonesData;
  try {
    zonesData = JSON.parse(storageData);
  } catch (error) {
    console.error('❌ Failed to parse zones data:', error);
    return;
  }

  const zones = zonesData.zones || [];
  
  if (zones.length === 0) {
    console.log('ℹ️  No zones to migrate');
    return;
  }

  console.log(`📦 Found ${zones.length} zones in localStorage\n`);

  // Function to create zone in Strapi
  async function createZone(zone) {
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

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP ${response.status}: ${error}`);
    }

    return response.json();
  }

  // Function to check if zone exists
  async function zoneExists(zoneId) {
    const response = await fetch(
      `${STRAPI_URL}/api/zones?filters[zoneId][$eq]=${zoneId}`,
      {
        headers: {
          'Authorization': `Bearer ${STRAPI_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) return false;
    
    const result = await response.json();
    return result.data && result.data.length > 0;
  }

  // Migrate zones
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (let i = 0; i < zones.length; i++) {
    const zone = zones[i];
    const progress = `[${i + 1}/${zones.length}]`;
    
    try {
      // Check if already exists
      const exists = await zoneExists(zone.id);
      
      if (exists) {
        console.log(`⏭️  ${progress} Zone already exists - skipping`);
        skipCount++;
        continue;
      }

      // Create zone
      await createZone(zone);
      
      const statusEmoji = zone.status === 'occupied' ? '🔴' : '🟢';
      const companyInfo = zone.companyName ? ` (${zone.companyName})` : '';
      console.log(`✅ ${progress} Created ${statusEmoji}${companyInfo}`);
      
      successCount++;
      
      // Small delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`❌ ${progress} Failed:`, error.message);
      errorCount++;
    }
  }

  // Summary
  console.log('\n📊 Migration Summary:');
  console.log(`   ✅ Created: ${successCount}`);
  console.log(`   ⏭️  Skipped: ${skipCount}`);
  console.log(`   ❌ Failed: ${errorCount}`);
  console.log(`   📦 Total: ${zones.length}`);
  
  if (errorCount === 0) {
    console.log('\n🎉 Migration completed successfully!');
    console.log('💡 Refresh the page to see zones loaded from Strapi');
  } else {
    console.log('\n⚠️  Some zones failed to migrate');
  }
})();
