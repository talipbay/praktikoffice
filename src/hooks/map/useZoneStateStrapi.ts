import { useState, useCallback, useMemo, useEffect } from 'react';
import { 
  Zone, 
  Point, 
  CreateZoneParams, 
  UpdateZoneParams,
  ZoneStatus 
} from '@/types/map/zone';
import { 
  createZone as createZoneUtil, 
  validatePolygon, 
  validateCompanyName, 
  updateZone as updateZoneUtil,
  findZoneAtPoint as findZoneAtPointUtil
} from '@/lib/map/zoneUtils';
import {
  fetchZonesFromStrapi,
  createZoneInStrapi,
  updateZoneInStrapi,
  deleteZoneFromStrapi,
  clearAllZonesInStrapi
} from '@/lib/map/strapiZoneStorage';

/**
 * Return type for the useZoneStateStrapi hook
 */
export interface UseZoneStateReturn {
  zones: Zone[];
  selectedZone: Zone | null;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  
  // CRUD Operations
  createZone: (vertices: Point[], companyName?: string) => Promise<Zone | null>;
  updateZone: (zoneId: string, updates: UpdateZoneParams) => Promise<boolean>;
  deleteZone: (zoneId: string) => Promise<boolean>;
  toggleZoneStatus: (zoneId: string, companyName?: string) => Promise<boolean>;
  
  // Selection and Filtering
  setSelectedZone: (zone: Zone | null) => void;
  findZoneAtPoint: (point: Point) => Zone | null;
  getZonesByStatus: (status: ZoneStatus) => Zone[];
  getZoneById: (id: string) => Zone | null;
  
  // Bulk Operations
  clearAllZones: () => Promise<boolean>;
  getZoneStats: {
    total: number;
    free: number;
    occupied: number;
  };
  
  // Refresh from server
  refreshZones: () => Promise<void>;
}

/**
 * Custom hook for managing zone state with Strapi backend
 * All changes are saved to the server so everyone can see them
 */
export function useZoneStateStrapi(): UseZoneStateReturn {
  const [zones, setZones] = useState<Zone[]>([]);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load zones from Strapi on mount
   */
  useEffect(() => {
    loadZones();
  }, []);

  /**
   * Load zones from server
   */
  const loadZones = async () => {
    try {
      setIsLoading(true);
      const fetchedZones = await fetchZonesFromStrapi();
      setZones(fetchedZones);
      setError(null);
    } catch (err) {
      console.error('Error loading zones:', err);
      setError('Failed to load zones from server');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Refresh zones from server
   */
  const refreshZones = useCallback(async () => {
    await loadZones();
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Create a new zone
   */
  const createZone = useCallback(async (
    vertices: Point[], 
    companyName?: string
  ): Promise<Zone | null> => {
    try {
      // Validate polygon
      const polygonValidation = validatePolygon(vertices);
      if (!polygonValidation.isValid) {
        setError(polygonValidation.error || 'Invalid polygon');
        return null;
      }
      
      // Validate company name if provided
      if (companyName) {
        const nameValidation = validateCompanyName(companyName);
        if (!nameValidation.isValid) {
          setError(nameValidation.error || 'Invalid company name');
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
      const newZone = createZoneUtil(params);
      
      // Save to Strapi
      const success = await createZoneInStrapi(newZone);
      
      if (!success) {
        setError('Failed to save zone to server');
        return null;
      }
      
      // Update local state
      setZones(prev => [...prev, newZone]);
      
      return newZone;
    } catch (err) {
      console.error('Error creating zone:', err);
      setError('Failed to create zone');
      return null;
    }
  }, []);

  /**
   * Update an existing zone
   */
  const updateZone = useCallback(async (
    zoneId: string, 
    updates: UpdateZoneParams
  ): Promise<boolean> => {
    try {
      const zoneIndex = zones.findIndex(z => z.id === zoneId);
      if (zoneIndex === -1) {
        setError('Zone not found');
        return false;
      }
      
      const currentZone = zones[zoneIndex];
      
      // Validate updates
      if (updates.vertices) {
        const polygonValidation = validatePolygon(updates.vertices);
        if (!polygonValidation.isValid) {
          setError(polygonValidation.error || 'Invalid polygon');
          return false;
        }
      }
      
      if (updates.companyName !== undefined && updates.companyName !== null) {
        const nameValidation = validateCompanyName(updates.companyName);
        if (!nameValidation.isValid) {
          setError(nameValidation.error || 'Invalid company name');
          return false;
        }
      }
      
      // Apply updates
      const updatedZone = updateZoneUtil(currentZone, updates);
      
      // Save to Strapi
      const success = await updateZoneInStrapi(updatedZone);
      
      if (!success) {
        setError('Failed to update zone on server');
        return false;
      }
      
      // Update local state
      setZones(prev => {
        const newZones = [...prev];
        newZones[zoneIndex] = updatedZone;
        return newZones;
      });
      
      // Update selected zone if it's the one being updated
      if (selectedZone?.id === zoneId) {
        setSelectedZone(updatedZone);
      }
      
      return true;
    } catch (err) {
      console.error('Error updating zone:', err);
      setError('Failed to update zone');
      return false;
    }
  }, [zones, selectedZone]);

  /**
   * Delete a zone
   */
  const deleteZone = useCallback(async (zoneId: string): Promise<boolean> => {
    try {
      const zoneExists = zones.some(z => z.id === zoneId);
      if (!zoneExists) {
        setError('Zone not found');
        return false;
      }
      
      // Delete from Strapi
      const success = await deleteZoneFromStrapi(zoneId);
      
      if (!success) {
        setError('Failed to delete zone from server');
        return false;
      }
      
      // Update local state
      setZones(prev => prev.filter(z => z.id !== zoneId));
      
      // Clear selection if deleted zone was selected
      if (selectedZone?.id === zoneId) {
        setSelectedZone(null);
      }
      
      return true;
    } catch (err) {
      console.error('Error deleting zone:', err);
      setError('Failed to delete zone');
      return false;
    }
  }, [zones, selectedZone]);

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
        setError('Zone not found');
        return false;
      }
      
      const newStatus: ZoneStatus = zone.status === 'free' ? 'occupied' : 'free';
      const updates: UpdateZoneParams = {
        status: newStatus,
        companyName: newStatus === 'occupied' ? (companyName || null) : null
      };
      
      return await updateZone(zoneId, updates);
    } catch (err) {
      console.error('Error toggling zone status:', err);
      setError('Failed to toggle zone status');
      return false;
    }
  }, [zones, updateZone]);

  /**
   * Find zone at a specific point
   */
  const findZoneAtPoint = useCallback((point: Point): Zone | null => {
    return findZoneAtPointUtil(point, zones);
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
      // Clear from Strapi
      const success = await clearAllZonesInStrapi();
      
      if (!success) {
        setError('Failed to clear zones from server');
        return false;
      }
      
      // Update local state
      setZones([]);
      setSelectedZone(null);
      
      return true;
    } catch (err) {
      console.error('Error clearing zones:', err);
      setError('Failed to clear zones');
      return false;
    }
  }, []);

  /**
   * Get zone statistics
   */
  const getZoneStats = useMemo(() => ({
    total: zones.length,
    free: zones.filter(z => z.status === 'free').length,
    occupied: zones.filter(z => z.status === 'occupied').length
  }), [zones]);

  return {
    zones,
    selectedZone,
    isLoading,
    error,
    clearError,
    
    // CRUD Operations
    createZone,
    updateZone,
    deleteZone,
    toggleZoneStatus,
    
    // Selection and Filtering
    setSelectedZone,
    findZoneAtPoint,
    getZonesByStatus,
    getZoneById,
    
    // Bulk Operations
    clearAllZones,
    getZoneStats,
    
    // Refresh
    refreshZones,
  };
}
