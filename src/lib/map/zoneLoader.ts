import { Zone } from '@/types/map/zone';
import { getAssetPath } from './assets';

/**
 * Load predefined zones from the cleaned JSON file
 * This file contains pre-created room zones with rounded coordinates for exact 90-degree angles
 */
export async function loadPredefinedZones(): Promise<Zone[]> {
  try {
    const zonesUrl = getAssetPath('/zones-cleaned.json');
    console.log('Loading predefined zones from:', zonesUrl);
    
    const response = await fetch(zonesUrl);
    if (!response.ok) {
      throw new Error(`Failed to load zones: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Loaded predefined zones:', data.zones?.length || 0, 'zones');
    return data.zones || [];
  } catch (error) {
    console.error('Error loading predefined zones:', error);
    return [];
  }
}

/**
 * Check if predefined zones should be loaded (when no zones exist in localStorage)
 */
export function shouldLoadPredefinedZones(): boolean {
  try {
    const existingZones = localStorage.getItem('zones');
    return !existingZones || JSON.parse(existingZones).length === 0;
  } catch {
    return true;
  }
}