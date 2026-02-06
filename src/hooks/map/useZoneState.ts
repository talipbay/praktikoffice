import { useState, useCallback, useMemo, useEffect } from 'react';
import { 
  Zone, 
  ZoneStorage, 
  Point, 
  CreateZoneParams, 
  UpdateZoneParams,
  ZoneStatus 
} from '@/types/map/zone';
import { 
  createZone, 
  validatePolygon, 
  validateCompanyName, 
  updateZone as updateZoneUtil,
  findZoneAtPoint 
} from '@/lib/map/zoneUtils';
import { useLocalStorage } from './useLocalStorage';
import { loadPredefinedZones, shouldLoadPredefinedZones } from '@/lib/map/zoneLoader';
import { githubStorage } from '@/lib/map/githubStorage';

/**
 * Current version for zone storage format
 */
const STORAGE_VERSION = '1.0.0';

/**
 * Local Storage key for zone data
 */
const ZONES_STORAGE_KEY = 'interactive-zone-manager-zones';

/**
 * Return type for the useZoneState hook
 */
export interface UseZoneStateReturn {
  /** Array of all zones */
  zones: Zone[];
  /** Currently selected zone */
  selectedZone: Zone | null;
  /** Loading state from storage */
  isLoading: boolean;
  /** Error message if operations fail */
  error: string | null;
  /** Clear error state */
  clearError: () => void;
  /** Check if storage is available */
  isStorageAvailable: boolean;
  
  // CRUD Operations
  /** Create a new zone */
  createZone: (vertices: Point[], companyName?: string) => Promise<Zone | null>;
  /** Update an existing zone */
  updateZone: (zoneId: string, updates: UpdateZoneParams) => Promise<boolean>;
  /** Delete a zone */
  deleteZone: (zoneId: string) => Promise<boolean>;
  /** Toggle zone status between free and occupied */
  toggleZoneStatus: (zoneId: string, companyName?: string) => Promise<boolean>;
  
  // Selection and Filtering
  /** Set the currently selected zone */
  setSelectedZone: (zone: Zone | null) => void;
  /** Find zone at a specific point */
  findZoneAtPoint: (point: Point) => Zone | null;
  /** Get zones by status */
  getZonesByStatus: (status: ZoneStatus) => Zone[];
  /** Get zone by ID */
  getZoneById: (id: string) => Zone | null;
  
  // Bulk Operations
  /** Clear all zones */
  clearAllZones: () => Promise<boolean>;
  /** Get zone statistics */
  getZoneStats: {
    total: number;
    free: number;
    occupied: number;
  };
  
  // GitHub Storage
  /** Set GitHub token for server storage */
  setGitHubToken: (token: string) => void;
  /** Check if GitHub token is set */
  hasGitHubToken: () => boolean;
  /** Save zones to GitHub (requires token) */
  saveToGitHub: () => Promise<boolean>;
  /** Load zones from GitHub */
  loadFromGitHub: () => Promise<boolean>;
}

/**
 * Validates zone storage data structure
 */
function isValidZoneStorage(data: unknown): data is ZoneStorage {
  if (!data || typeof data !== 'object') return false;
  
  const storage = data as Record<string, unknown>;
  
  return (
    typeof storage.version === 'string' &&
    Array.isArray(storage.zones) &&
    typeof storage.lastModified === 'number' &&
    storage.zones.every(isValidZone)
  );
}

/**
 * Validates individual zone data
 */
function isValidZone(data: unknown): data is Zone {
  if (!data || typeof data !== 'object') return false;
  
  const zone = data as Record<string, unknown>;
  
  return (
    typeof zone.id === 'string' &&
    Array.isArray(zone.vertices) &&
    zone.vertices.every(isValidPoint) &&
    (zone.status === 'free' || zone.status === 'occupied') &&
    (zone.companyName === null || typeof zone.companyName === 'string') &&
    typeof zone.createdAt === 'number' &&
    typeof zone.updatedAt === 'number'
  );
}

/**
 * Validates point data
 */
function isValidPoint(data: unknown): data is Point {
  if (!data || typeof data !== 'object') return false;
  
  const point = data as Record<string, unknown>;
  
  return (
    typeof point.x === 'number' &&
    typeof point.y === 'number' &&
    !isNaN(point.x) &&
    !isNaN(point.y)
  );
}

/**
 * Migrates zone storage data from older versions
 */
function migrateZoneStorage(data: unknown): ZoneStorage {
  // If data is already valid, return as-is
  if (isValidZoneStorage(data)) {
    return data;
  }
  
  // Handle legacy formats or corrupted data
  console.warn('Invalid or legacy zone storage data, resetting to empty state');
  
  return {
    version: STORAGE_VERSION,
    zones: [],
    lastModified: Date.now()
  };
}

/**
 * Custom hook for managing zone state with Local Storage persistence
 * Provides CRUD operations, selection management, and automatic persistence
 */
export function useZoneState(): UseZoneStateReturn {
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  
  // Initialize default storage structure
  const defaultStorage: ZoneStorage = {
    version: STORAGE_VERSION,
    zones: [],
    lastModified: Date.now()
  };
  
  // Use Local Storage hook with validation and migration
  const {
    data: storage,
    setData: setStorage,
    setDataImmediate: setStorageImmediate,
    isLoading,
    error,
    clearError,
    isStorageAvailable
  } = useLocalStorage<ZoneStorage>(ZONES_STORAGE_KEY, {
    defaultValue: defaultStorage,
    validator: isValidZoneStorage,
    migrator: migrateZoneStorage
  });
  
  // Extract zones from storage
  const zones = storage.zones;
  
  /**
   * Update storage with new zones array (debounced)
   */
  const updateStorage = useCallback((newZones: Zone[]) => {
    const newStorage: ZoneStorage = {
      version: STORAGE_VERSION,
      zones: newZones,
      lastModified: Date.now()
    };
    setStorage(newStorage);
  }, [setStorage]);

  /**
   * Update storage with new zones array (immediate for critical operations)
   */
  const updateStorageImmediate = useCallback((newZones: Zone[]) => {
    const newStorage: ZoneStorage = {
      version: STORAGE_VERSION,
      zones: newZones,
      lastModified: Date.now()
    };
    setStorageImmediate(newStorage);
  }, [setStorageImmediate]);
  
  // Load predefined zones if storage is empty
  useEffect(() => {
    const loadPredefinedZonesIfNeeded = async () => {
      if (zones.length === 0 && !isLoading && isStorageAvailable) {
        try {
          const predefinedZones = await loadPredefinedZones();
          if (predefinedZones.length > 0) {
            console.log('Loading predefined zones:', predefinedZones.length);
            updateStorageImmediate(predefinedZones);
          }
        } catch (error) {
          console.error('Failed to load predefined zones:', error);
        }
      }
    };
    
    loadPredefinedZonesIfNeeded();
  }, [zones.length, isLoading, isStorageAvailable, updateStorageImmediate]);
  
  /**
   * Create a new zone with validation
   */
  const createZoneHandler = useCallback(async (
    vertices: Point[], 
    companyName?: string
  ): Promise<Zone | null> => {
    try {
      // Validate polygon
      const polygonValidation = validatePolygon(vertices);
      if (!polygonValidation.isValid) {
        console.error('Invalid polygon:', polygonValidation.error);
        return null;
      }
      
      // Validate company name if provided
      if (companyName) {
        const nameValidation = validateCompanyName(companyName);
        if (!nameValidation.isValid) {
          console.error('Invalid company name:', nameValidation.error);
          return null;
        }
      }
      
      // Create zone parameters
      const params: CreateZoneParams = {
        vertices,
        status: companyName ? 'occupied' : 'free',
        companyName: companyName || null
      };
      
      // Create new zone
      const newZone = createZone(params);
      
      // Update zones array
      const updatedZones = [...zones, newZone];
      updateStorage(updatedZones);
      
      return newZone;
    } catch (err) {
      console.error('Error creating zone:', err);
      return null;
    }
  }, [zones, updateStorage]);
  
  /**
   * Update an existing zone
   */
  const updateZoneHandler = useCallback(async (
    zoneId: string, 
    updates: UpdateZoneParams
  ): Promise<boolean> => {
    try {
      const zoneIndex = zones.findIndex(z => z.id === zoneId);
      if (zoneIndex === -1) {
        console.error('Zone not found:', zoneId);
        return false;
      }
      
      const currentZone = zones[zoneIndex];
      
      // Validate updates
      if (updates.vertices) {
        const polygonValidation = validatePolygon(updates.vertices);
        if (!polygonValidation.isValid) {
          console.error('Invalid polygon update:', polygonValidation.error);
          return false;
        }
      }
      
      if (updates.companyName !== undefined && updates.companyName !== null) {
        const nameValidation = validateCompanyName(updates.companyName);
        if (!nameValidation.isValid) {
          console.error('Invalid company name update:', nameValidation.error);
          return false;
        }
      }
      
      // Apply updates
      const updatedZone = updateZoneUtil(currentZone, updates);
      
      // Update zones array
      const updatedZones = [...zones];
      updatedZones[zoneIndex] = updatedZone;
      updateStorage(updatedZones);
      
      // Update selected zone if it's the one being updated
      if (selectedZone?.id === zoneId) {
        setSelectedZone(updatedZone);
      }
      
      return true;
    } catch (err) {
      console.error('Error updating zone:', err);
      return false;
    }
  }, [zones, updateStorage, selectedZone]);
  
  /**
   * Delete a zone
   */
  const deleteZoneHandler = useCallback(async (zoneId: string): Promise<boolean> => {
    try {
      const zoneIndex = zones.findIndex(z => z.id === zoneId);
      if (zoneIndex === -1) {
        console.error('Zone not found:', zoneId);
        return false;
      }
      
      // Remove zone from array
      const updatedZones = zones.filter(z => z.id !== zoneId);
      updateStorageImmediate(updatedZones); // Use immediate save for deletions
      
      // Clear selection if deleted zone was selected
      if (selectedZone?.id === zoneId) {
        setSelectedZone(null);
      }
      
      return true;
    } catch (err) {
      console.error('Error deleting zone:', err);
      return false;
    }
  }, [zones, updateStorageImmediate, selectedZone]);
  
  /**
   * Toggle zone status between free and occupied
   */
  const toggleZoneStatus = useCallback(async (
    zoneId: string, 
    companyName?: string
  ): Promise<boolean> => {
    try {
      const zone = zones.find(z => z.id === zoneId);
      if (!zone) {
        console.error('Zone not found:', zoneId);
        return false;
      }
      
      const newStatus: ZoneStatus = zone.status === 'free' ? 'occupied' : 'free';
      const updates: UpdateZoneParams = {
        status: newStatus,
        companyName: newStatus === 'occupied' ? (companyName || null) : null
      };
      
      return await updateZoneHandler(zoneId, updates);
    } catch (err) {
      console.error('Error toggling zone status:', err);
      return false;
    }
  }, [zones, updateZoneHandler]);
  
  /**
   * Find zone at a specific point
   */
  const findZoneAtPointHandler = useCallback((point: Point): Zone | null => {
    return findZoneAtPoint(point, zones);
  }, [zones]);
  
  /**
   * Get zones by status
   */
  const getZonesByStatus = useCallback((status: ZoneStatus): Zone[] => {
    return zones.filter(zone => zone.status === status);
  }, [zones]);
  
  /**
   * Get zone by ID
   */
  const getZoneById = useCallback((id: string): Zone | null => {
    return zones.find(zone => zone.id === id) || null;
  }, [zones]);
  
  /**
   * Clear all zones
   */
  const clearAllZones = useCallback(async (): Promise<boolean> => {
    try {
      updateStorageImmediate([]); // Use immediate save for bulk operations
      setSelectedZone(null);
      return true;
    } catch (err) {
      console.error('Error clearing zones:', err);
      return false;
    }
  }, [updateStorageImmediate]);
  
  /**
   * Get zone statistics
   */
  const getZoneStats = useMemo(() => ({
    total: zones.length,
    free: zones.filter(z => z.status === 'free').length,
    occupied: zones.filter(z => z.status === 'occupied').length
  }), [zones]);

  /**
   * GitHub Storage Methods
   */
  const setGitHubToken = useCallback((token: string) => {
    githubStorage.setToken(token);
  }, []);

  const hasGitHubToken = useCallback(() => {
    return githubStorage.hasToken();
  }, []);

  const saveToGitHub = useCallback(async (): Promise<boolean> => {
    try {
      return await githubStorage.saveZones(zones);
    } catch (error) {
      console.error('Failed to save to GitHub:', error);
      return false;
    }
  }, [zones]);

  const loadFromGitHub = useCallback(async (): Promise<boolean> => {
    try {
      const githubZones = await githubStorage.loadZones();
      if (githubZones.length > 0) {
        updateStorageImmediate(githubZones);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to load from GitHub:', error);
      return false;
    }
  }, [updateStorageImmediate]);
  
  return {
    zones,
    selectedZone,
    isLoading,
    error,
    clearError,
    isStorageAvailable,
    
    // CRUD Operations
    createZone: createZoneHandler,
    updateZone: updateZoneHandler,
    deleteZone: deleteZoneHandler,
    toggleZoneStatus,
    
    // Selection and Filtering
    setSelectedZone,
    findZoneAtPoint: findZoneAtPointHandler,
    getZonesByStatus,
    getZoneById,
    
    // Bulk Operations
    clearAllZones,
    getZoneStats,
    
    // GitHub Storage
    setGitHubToken,
    hasGitHubToken,
    saveToGitHub,
    loadFromGitHub
  };
}