/**
 * Strapi integration for zone storage
 * Stores zones on the server so everyone can see them
 */

import { Zone } from '@/types/map/zone';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

interface StrapiZone {
  id: number;
  attributes: {
    zoneId: string;
    vertices: any;
    status: 'free' | 'occupied';
    companyName: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

interface StrapiResponse<T> {
  data: T;
  meta?: any;
}

/**
 * Fetch all zones from Strapi
 */
export async function fetchZonesFromStrapi(): Promise<Zone[]> {
  try {
    const response = await fetch(`${STRAPI_URL}/api/zones`, {
      headers: {
        'Authorization': `Bearer ${STRAPI_TOKEN}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Always get fresh data
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch zones: ${response.statusText}`);
    }

    const result: any = await response.json();
    
    // Transform Strapi format to our Zone format
    // Handle both old format (with attributes) and new format (direct fields)
    return result.data.map((item: any) => {
      const data = item.attributes || item;
      return {
        id: data.zoneId,
        vertices: data.vertices,
        status: data.status,
        companyName: data.companyName,
        createdAt: data.createdAt ? new Date(data.createdAt).getTime() : Date.now(),
        updatedAt: data.updatedAt ? new Date(data.updatedAt).getTime() : Date.now(),
      };
    });
  } catch (error) {
    console.error('Error fetching zones from Strapi:', error);
    return [];
  }
}

/**
 * Create a new zone in Strapi
 */
export async function createZoneInStrapi(zone: Zone): Promise<boolean> {
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

    if (!response.ok) {
      throw new Error(`Failed to create zone: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Error creating zone in Strapi:', error);
    return false;
  }
}

/**
 * Update a zone in Strapi
 */
export async function updateZoneInStrapi(zone: Zone): Promise<boolean> {
  try {
    // First, find the Strapi ID for this zone
    const response = await fetch(
      `${STRAPI_URL}/api/zones?filters[zoneId][$eq]=${zone.id}`,
      {
        headers: {
          'Authorization': `Bearer ${STRAPI_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to find zone: ${response.statusText}`);
    }

    const result: StrapiResponse<StrapiZone[]> = await response.json();
    
    if (result.data.length === 0) {
      // Zone doesn't exist, create it
      return createZoneInStrapi(zone);
    }

    const strapiId = result.data[0].id;

    // Update the zone
    const updateResponse = await fetch(`${STRAPI_URL}/api/zones/${strapiId}`, {
      method: 'PUT',
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

    if (!updateResponse.ok) {
      throw new Error(`Failed to update zone: ${updateResponse.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Error updating zone in Strapi:', error);
    return false;
  }
}

/**
 * Delete a zone from Strapi
 */
export async function deleteZoneFromStrapi(zoneId: string): Promise<boolean> {
  try {
    // First, find the Strapi ID for this zone
    const response = await fetch(
      `${STRAPI_URL}/api/zones?filters[zoneId][$eq]=${zoneId}`,
      {
        headers: {
          'Authorization': `Bearer ${STRAPI_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to find zone: ${response.statusText}`);
    }

    const result: StrapiResponse<StrapiZone[]> = await response.json();
    
    if (result.data.length === 0) {
      // Zone doesn't exist
      return true;
    }

    const strapiId = result.data[0].id;

    // Delete the zone
    const deleteResponse = await fetch(`${STRAPI_URL}/api/zones/${strapiId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${STRAPI_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!deleteResponse.ok) {
      throw new Error(`Failed to delete zone: ${deleteResponse.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Error deleting zone from Strapi:', error);
    return false;
  }
}

/**
 * Clear all zones from Strapi
 */
export async function clearAllZonesInStrapi(): Promise<boolean> {
  try {
    // Fetch all zones
    const zones = await fetchZonesFromStrapi();
    
    // Delete each zone
    const deletePromises = zones.map(zone => deleteZoneFromStrapi(zone.id));
    await Promise.all(deletePromises);
    
    return true;
  } catch (error) {
    console.error('Error clearing zones from Strapi:', error);
    return false;
  }
}

/**
 * Sync zones from localStorage to Strapi (migration helper)
 */
export async function syncLocalStorageToStrapi(zones: Zone[]): Promise<boolean> {
  try {
    // Clear existing zones in Strapi
    await clearAllZonesInStrapi();
    
    // Create all zones in Strapi
    const createPromises = zones.map(zone => createZoneInStrapi(zone));
    await Promise.all(createPromises);
    
    return true;
  } catch (error) {
    console.error('Error syncing zones to Strapi:', error);
    return false;
  }
}
