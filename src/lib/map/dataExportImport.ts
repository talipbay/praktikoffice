import { Zone, ZoneStorage } from '@/types/map/zone';
import { validatePolygon, validateCompanyName } from './zoneUtils';

/**
 * Export/Import functionality for zone data
 */

/**
 * Export format for zone data
 */
export interface ZoneExportData {
  version: string;
  exportDate: string;
  zones: Zone[];
  metadata: {
    totalZones: number;
    freeZones: number;
    occupiedZones: number;
    exportSource: string;
  };
}

/**
 * Import validation result
 */
export interface ImportValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  validZones: Zone[];
  invalidZones: { zone: any; errors: string[] }[];
}

/**
 * Export zones to JSON format
 * @param zones Array of zones to export
 * @returns JSON string containing zone data
 */
export function exportZonesToJSON(zones: Zone[]): string {
  const exportData: ZoneExportData = {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    zones: zones.map(zone => ({
      ...zone,
      // Ensure all required fields are present
      id: zone.id,
      vertices: zone.vertices,
      status: zone.status,
      companyName: zone.companyName,
      createdAt: zone.createdAt,
      updatedAt: zone.updatedAt
    })),
    metadata: {
      totalZones: zones.length,
      freeZones: zones.filter(z => z.status === 'free').length,
      occupiedZones: zones.filter(z => z.status === 'occupied').length,
      exportSource: 'Interactive Zone Manager'
    }
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * Download zones as JSON file
 * @param zones Array of zones to export
 * @param filename Optional filename (defaults to timestamp-based name)
 */
export function downloadZonesAsJSON(zones: Zone[], filename?: string): void {
  const jsonData = exportZonesToJSON(zones);
  const blob = new Blob([jsonData], { type: 'application/json' });
  
  const defaultFilename = `zones-export-${new Date().toISOString().split('T')[0]}.json`;
  const finalFilename = filename || defaultFilename;
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = finalFilename;
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Cleanup
  URL.revokeObjectURL(url);
}

/**
 * Validate imported zone data
 * @param data Raw imported data
 * @returns Validation result with valid/invalid zones
 */
export function validateImportedData(data: unknown): ImportValidationResult {
  const result: ImportValidationResult = {
    isValid: false,
    errors: [],
    warnings: [],
    validZones: [],
    invalidZones: []
  };

  // Check if data is an object
  if (!data || typeof data !== 'object') {
    result.errors.push('Invalid data format: Expected JSON object');
    return result;
  }

  const importData = data as Record<string, unknown>;

  // Check for zones array
  if (!Array.isArray(importData.zones)) {
    result.errors.push('Invalid data format: Missing or invalid zones array');
    return result;
  }

  // Validate version compatibility
  if (importData.version && typeof importData.version === 'string') {
    const version = importData.version;
    if (!version.startsWith('1.')) {
      result.warnings.push(`Imported data version (${version}) may not be fully compatible`);
    }
  } else {
    result.warnings.push('No version information found in imported data');
  }

  // Validate each zone
  const zones = importData.zones as unknown[];
  
  zones.forEach((zoneData, index) => {
    const zoneErrors: string[] = [];
    
    // Validate zone structure
    if (!zoneData || typeof zoneData !== 'object') {
      zoneErrors.push('Invalid zone data structure');
      result.invalidZones.push({ zone: zoneData, errors: zoneErrors });
      return;
    }

    const zone = zoneData as Record<string, unknown>;

    // Validate required fields
    if (!zone.id || typeof zone.id !== 'string') {
      zoneErrors.push('Missing or invalid zone ID');
    }

    if (!Array.isArray(zone.vertices)) {
      zoneErrors.push('Missing or invalid vertices array');
    } else {
      // Validate vertices
      const vertices = zone.vertices as unknown[];
      const validVertices = vertices.every(vertex => 
        vertex && 
        typeof vertex === 'object' && 
        typeof (vertex as any).x === 'number' && 
        typeof (vertex as any).y === 'number' &&
        !isNaN((vertex as any).x) &&
        !isNaN((vertex as any).y)
      );

      if (!validVertices) {
        zoneErrors.push('Invalid vertex data: vertices must have numeric x and y coordinates');
      } else {
        // Validate polygon
        const polygonValidation = validatePolygon(zone.vertices as any);
        if (!polygonValidation.isValid) {
          zoneErrors.push(`Invalid polygon: ${polygonValidation.error}`);
        }
      }
    }

    if (!zone.status || (zone.status !== 'free' && zone.status !== 'occupied')) {
      zoneErrors.push('Missing or invalid zone status (must be "free" or "occupied")');
    }

    if (zone.companyName !== null && zone.companyName !== undefined) {
      if (typeof zone.companyName !== 'string') {
        zoneErrors.push('Invalid company name: must be string or null');
      } else if (zone.companyName.trim()) {
        const nameValidation = validateCompanyName(zone.companyName);
        if (!nameValidation.isValid) {
          zoneErrors.push(`Invalid company name: ${nameValidation.error}`);
        }
      }
    }

    if (zone.createdAt && (typeof zone.createdAt !== 'number' || isNaN(zone.createdAt))) {
      zoneErrors.push('Invalid createdAt timestamp');
    }

    if (zone.updatedAt && (typeof zone.updatedAt !== 'number' || isNaN(zone.updatedAt))) {
      zoneErrors.push('Invalid updatedAt timestamp');
    }

    // Add to appropriate array
    if (zoneErrors.length === 0) {
      // Create a clean zone object with defaults for missing optional fields
      const cleanZone: Zone = {
        id: zone.id as string,
        vertices: zone.vertices as any,
        status: zone.status as any,
        companyName: (zone.companyName as string) || null,
        createdAt: (zone.createdAt as number) || Date.now(),
        updatedAt: (zone.updatedAt as number) || Date.now()
      };
      result.validZones.push(cleanZone);
    } else {
      result.invalidZones.push({ zone: zoneData, errors: zoneErrors });
    }
  });

  // Set overall validation result
  result.isValid = result.errors.length === 0 && result.validZones.length > 0;

  // Add summary information
  if (result.validZones.length === 0 && result.invalidZones.length > 0) {
    result.errors.push('No valid zones found in imported data');
  }

  if (result.invalidZones.length > 0) {
    result.warnings.push(`${result.invalidZones.length} zones were skipped due to validation errors`);
  }

  return result;
}

/**
 * Import zones from JSON string
 * @param jsonString JSON string containing zone data
 * @returns Validation result with imported zones
 */
export function importZonesFromJSON(jsonString: string): ImportValidationResult {
  try {
    const data = JSON.parse(jsonString);
    return validateImportedData(data);
  } catch (error) {
    return {
      isValid: false,
      errors: [`Invalid JSON format: ${error instanceof Error ? error.message : 'Unknown error'}`],
      warnings: [],
      validZones: [],
      invalidZones: []
    };
  }
}

/**
 * Import zones from file
 * @param file File object containing zone data
 * @returns Promise resolving to validation result
 */
export function importZonesFromFile(file: File): Promise<ImportValidationResult> {
  return new Promise((resolve, reject) => {
    if (!file.type.includes('json') && !file.name.endsWith('.json')) {
      resolve({
        isValid: false,
        errors: ['Invalid file type: Please select a JSON file'],
        warnings: [],
        validZones: [],
        invalidZones: []
      });
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        if (!content) {
          resolve({
            isValid: false,
            errors: ['File is empty or could not be read'],
            warnings: [],
            validZones: [],
            invalidZones: []
          });
          return;
        }

        const result = importZonesFromJSON(content);
        resolve(result);
      } catch (error) {
        resolve({
          isValid: false,
          errors: [`Error reading file: ${error instanceof Error ? error.message : 'Unknown error'}`],
          warnings: [],
          validZones: [],
          invalidZones: []
        });
      }
    };

    reader.onerror = () => {
      resolve({
        isValid: false,
        errors: ['Error reading file'],
        warnings: [],
        validZones: [],
        invalidZones: []
      });
    };

    reader.readAsText(file);
  });
}

/**
 * Create a backup of current zone data
 * @param zones Current zones
 * @returns Backup data as JSON string
 */
export function createZoneBackup(zones: Zone[]): string {
  const backup = {
    version: '1.0.0',
    backupDate: new Date().toISOString(),
    zones: zones,
    metadata: {
      totalZones: zones.length,
      backupSource: 'Interactive Zone Manager Auto-Backup'
    }
  };

  return JSON.stringify(backup, null, 2);
}

/**
 * Save backup to localStorage with rotation
 * @param zones Current zones
 * @param maxBackups Maximum number of backups to keep (default: 5)
 */
export function saveBackupToStorage(zones: Zone[], maxBackups: number = 5): void {
  try {
    const backup = createZoneBackup(zones);
    const backupKey = `zone-backup-${Date.now()}`;
    
    // Save new backup
    localStorage.setItem(backupKey, backup);
    
    // Get all backup keys
    const allKeys = Object.keys(localStorage).filter(key => key.startsWith('zone-backup-'));
    
    // Sort by timestamp (newest first)
    allKeys.sort((a, b) => {
      const timestampA = parseInt(a.split('-').pop() || '0');
      const timestampB = parseInt(b.split('-').pop() || '0');
      return timestampB - timestampA;
    });
    
    // Remove old backups if we exceed the limit
    if (allKeys.length > maxBackups) {
      const keysToRemove = allKeys.slice(maxBackups);
      keysToRemove.forEach(key => localStorage.removeItem(key));
    }
  } catch (error) {
    console.warn('Failed to save backup to localStorage:', error);
  }
}

/**
 * Get available backups from localStorage
 * @returns Array of backup metadata
 */
export function getAvailableBackups(): Array<{ key: string; date: Date; zoneCount: number }> {
  try {
    const backupKeys = Object.keys(localStorage).filter(key => key.startsWith('zone-backup-'));
    
    return backupKeys.map(key => {
      try {
        const backup = JSON.parse(localStorage.getItem(key) || '{}');
        const timestamp = parseInt(key.split('-').pop() || '0');
        
        return {
          key,
          date: new Date(timestamp),
          zoneCount: backup.zones?.length || 0
        };
      } catch {
        return null;
      }
    }).filter(Boolean).sort((a, b) => b!.date.getTime() - a!.date.getTime()) as Array<{ key: string; date: Date; zoneCount: number }>;
  } catch {
    return [];
  }
}

/**
 * Restore zones from a backup
 * @param backupKey Backup key from localStorage
 * @returns Validation result with restored zones
 */
export function restoreFromBackup(backupKey: string): ImportValidationResult {
  try {
    const backupData = localStorage.getItem(backupKey);
    if (!backupData) {
      return {
        isValid: false,
        errors: ['Backup not found'],
        warnings: [],
        validZones: [],
        invalidZones: []
      };
    }

    return importZonesFromJSON(backupData);
  } catch (error) {
    return {
      isValid: false,
      errors: [`Error restoring backup: ${error instanceof Error ? error.message : 'Unknown error'}`],
      warnings: [],
      validZones: [],
      invalidZones: []
    };
  }
}