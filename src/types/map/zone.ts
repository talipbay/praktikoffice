/**
 * Core data model interfaces for the Interactive Zone Manager
 */

/**
 * Represents a 2D point with x and y coordinates
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Zone status enumeration
 */
export type ZoneStatus = 'free' | 'occupied';

/**
 * Represents a polygonal zone on the floor plan
 */
export interface Zone {
  /** Unique identifier for the zone */
  id: string;
  /** Array of vertices defining the polygon (4-6 vertices) */
  vertices: Point[];
  /** Current occupancy status of the zone */
  status: ZoneStatus;
  /** Company name if zone is occupied, null if free */
  companyName: string | null;
  /** Timestamp when zone was created */
  createdAt: number;
  /** Timestamp when zone was last updated */
  updatedAt: number;
}

/**
 * Storage structure for persisting zones in Local Storage
 */
export interface ZoneStorage {
  /** Version for data migration compatibility */
  version: string;
  /** Array of all zones */
  zones: Zone[];
  /** Timestamp of last modification */
  lastModified: number;
}

/**
 * Validation schema for zone creation
 */
export interface ZoneValidationResult {
  /** Whether the zone is valid */
  isValid: boolean;
  /** Error message if validation fails */
  error?: string;
}

/**
 * Company name validation result
 */
export interface CompanyNameValidationResult {
  /** Whether the company name is valid */
  isValid: boolean;
  /** Error message if validation fails */
  error?: string;
}

/**
 * Zone creation parameters
 */
export interface CreateZoneParams {
  /** Array of vertices defining the polygon */
  vertices: Point[];
  /** Optional initial status (defaults to 'free') */
  status?: ZoneStatus;
  /** Optional company name if status is 'occupied' */
  companyName?: string | null;
}

/**
 * Zone update parameters
 */
export interface UpdateZoneParams {
  /** Optional new vertices */
  vertices?: Point[];
  /** Optional new status */
  status?: ZoneStatus;
  /** Optional new company name */
  companyName?: string | null;
}