import { 
  Point, 
  Zone, 
  ZoneStatus, 
  ZoneValidationResult, 
  CompanyNameValidationResult,
  CreateZoneParams 
} from '@/types/map/zone';

/**
 * Generates a unique ID for a new zone
 */
export function generateZoneId(): string {
  return `zone_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Creates a new zone with the given parameters
 */
export function createZone(params: CreateZoneParams): Zone {
  const now = Date.now();
  
  return {
    id: generateZoneId(),
    vertices: [...params.vertices], // Create a copy to avoid mutations
    status: params.status || 'free',
    companyName: params.companyName || null,
    createdAt: now,
    updatedAt: now
  };
}

/**
 * Point-in-polygon detection using ray casting algorithm
 * @param point The point to test
 * @param vertices The polygon vertices
 * @returns true if point is inside the polygon
 */
export function isPointInPolygon(point: Point, vertices: Point[]): boolean {
  if (vertices.length < 3) return false;
  
  let inside = false;
  const { x, y } = point;
  
  for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    const xi = vertices[i].x;
    const yi = vertices[i].y;
    const xj = vertices[j].x;
    const yj = vertices[j].y;
    
    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }
  
  return inside;
}

/**
 * Validates a polygon for zone creation
 * @param vertices Array of polygon vertices
 * @returns Validation result with error message if invalid
 */
export function validatePolygon(vertices: Point[]): ZoneValidationResult {
  // Check vertex count (4-6 vertices as per requirements)
  if (vertices.length < 4) {
    return {
      isValid: false,
      error: 'Polygon must have at least 4 vertices'
    };
  }
  
  if (vertices.length > 6) {
    return {
      isValid: false,
      error: 'Polygon cannot have more than 6 vertices'
    };
  }
  
  // Check for minimum area (prevent tiny accidental zones)
  const area = calculatePolygonArea(vertices);
  if (area < 100) { // Minimum 100 square pixels
    return {
      isValid: false,
      error: 'Zone area is too small'
    };
  }
  
  // Check for self-intersection
  if (hasSelfintersection(vertices)) {
    return {
      isValid: false,
      error: 'Polygon cannot intersect itself'
    };
  }
  
  return { isValid: true };
}

/**
 * Calculates the area of a polygon using the shoelace formula
 * @param vertices Array of polygon vertices
 * @returns The area of the polygon
 */
export function calculatePolygonArea(vertices: Point[]): number {
  if (vertices.length < 3) return 0;
  
  let area = 0;
  for (let i = 0; i < vertices.length; i++) {
    const j = (i + 1) % vertices.length;
    area += vertices[i].x * vertices[j].y;
    area -= vertices[j].x * vertices[i].y;
  }
  
  return Math.abs(area) / 2;
}

/**
 * Checks if a polygon has self-intersections
 * @param vertices Array of polygon vertices
 * @returns true if the polygon intersects itself
 */
function hasSelfintersection(vertices: Point[]): boolean {
  const n = vertices.length;
  
  for (let i = 0; i < n; i++) {
    const line1Start = vertices[i];
    const line1End = vertices[(i + 1) % n];
    
    for (let j = i + 2; j < n; j++) {
      // Skip adjacent edges and the closing edge
      if (j === n - 1 && i === 0) continue;
      
      const line2Start = vertices[j];
      const line2End = vertices[(j + 1) % n];
      
      if (doLinesIntersect(line1Start, line1End, line2Start, line2End)) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Checks if two line segments intersect
 * @param p1 Start point of first line
 * @param q1 End point of first line
 * @param p2 Start point of second line
 * @param q2 End point of second line
 * @returns true if the lines intersect
 */
function doLinesIntersect(p1: Point, q1: Point, p2: Point, q2: Point): boolean {
  const o1 = orientation(p1, q1, p2);
  const o2 = orientation(p1, q1, q2);
  const o3 = orientation(p2, q2, p1);
  const o4 = orientation(p2, q2, q1);
  
  // General case
  if (o1 !== o2 && o3 !== o4) return true;
  
  // Special cases for collinear points
  if (o1 === 0 && onSegment(p1, p2, q1)) return true;
  if (o2 === 0 && onSegment(p1, q2, q1)) return true;
  if (o3 === 0 && onSegment(p2, p1, q2)) return true;
  if (o4 === 0 && onSegment(p2, q1, q2)) return true;
  
  return false;
}

/**
 * Finds orientation of ordered triplet (p, q, r)
 * @returns 0 if collinear, 1 if clockwise, 2 if counterclockwise
 */
function orientation(p: Point, q: Point, r: Point): number {
  const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
  if (val === 0) return 0;
  return val > 0 ? 1 : 2;
}

/**
 * Checks if point q lies on line segment pr
 */
function onSegment(p: Point, q: Point, r: Point): boolean {
  return q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
         q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y);
}

/**
 * Validates a company name according to requirements
 * @param name The company name to validate
 * @returns Validation result with error message if invalid
 */
export function validateCompanyName(name: string): CompanyNameValidationResult {
  if (!name || name.trim().length === 0) {
    return {
      isValid: false,
      error: 'Company name cannot be empty'
    };
  }
  
  const trimmedName = name.trim();
  
  if (trimmedName.length > 50) {
    return {
      isValid: false,
      error: 'Company name cannot exceed 50 characters'
    };
  }
  
  // Allow alphanumeric characters, spaces, and hyphens
  const validPattern = /^[a-zA-Z0-9\s\-]+$/;
  if (!validPattern.test(trimmedName)) {
    return {
      isValid: false,
      error: 'Company name can only contain letters, numbers, spaces, and hyphens'
    };
  }
  
  return { isValid: true };
}

/**
 * Bounding box for spatial indexing
 */
interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

/**
 * Zone with precomputed bounding box for faster hit detection
 */
interface IndexedZone extends Zone {
  boundingBox: BoundingBox;
}

/**
 * Calculates the bounding box for a polygon
 * @param vertices Array of polygon vertices
 * @returns Bounding box containing the polygon
 */
function calculateBoundingBox(vertices: Point[]): BoundingBox {
  if (vertices.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  }
  
  let minX = vertices[0].x;
  let minY = vertices[0].y;
  let maxX = vertices[0].x;
  let maxY = vertices[0].y;
  
  for (let i = 1; i < vertices.length; i++) {
    const vertex = vertices[i];
    minX = Math.min(minX, vertex.x);
    minY = Math.min(minY, vertex.y);
    maxX = Math.max(maxX, vertex.x);
    maxY = Math.max(maxY, vertex.y);
  }
  
  return { minX, minY, maxX, maxY };
}

/**
 * Checks if a point is within a bounding box
 * @param point The point to test
 * @param box The bounding box
 * @returns true if point is within the bounding box
 */
function isPointInBoundingBox(point: Point, box: BoundingBox): boolean {
  return point.x >= box.minX && point.x <= box.maxX && 
         point.y >= box.minY && point.y <= box.maxY;
}

/**
 * Creates an indexed zone with precomputed bounding box
 * @param zone The zone to index
 * @returns Indexed zone with bounding box
 */
function createIndexedZone(zone: Zone): IndexedZone {
  return {
    ...zone,
    boundingBox: calculateBoundingBox(zone.vertices)
  };
}

/**
 * Optimized zone finder using spatial indexing
 */
class ZoneFinder {
  private indexedZones: IndexedZone[] = [];
  private lastUpdateTime = 0;
  
  /**
   * Updates the internal index with new zones
   * @param zones Array of zones to index
   */
  updateIndex(zones: Zone[]): void {
    const currentTime = Date.now();
    
    // Only rebuild index if zones have changed
    if (zones.length !== this.indexedZones.length || 
        zones.some((zone, index) => 
          !this.indexedZones[index] || 
          zone.updatedAt > this.lastUpdateTime
        )) {
      
      this.indexedZones = zones.map(createIndexedZone);
      this.lastUpdateTime = currentTime;
    }
  }
  
  /**
   * Finds a zone containing the given point using optimized search
   * @param point The point to test
   * @returns The zone containing the point, or null if none found
   */
  findZoneAtPoint(point: Point): Zone | null {
    // Search in reverse order to prioritize recently created zones
    for (let i = this.indexedZones.length - 1; i >= 0; i--) {
      const indexedZone = this.indexedZones[i];
      
      // Fast bounding box check first
      if (isPointInBoundingBox(point, indexedZone.boundingBox)) {
        // Only do expensive polygon check if point is in bounding box
        if (isPointInPolygon(point, indexedZone.vertices)) {
          return indexedZone;
        }
      }
    }
    return null;
  }
}

// Global zone finder instance for performance
const globalZoneFinder = new ZoneFinder();

/**
 * Finds a zone that contains the given point (optimized version)
 * @param point The point to test
 * @param zones Array of zones to search
 * @returns The zone containing the point, or null if none found
 */
export function findZoneAtPoint(point: Point, zones: Zone[]): Zone | null {
  // For small numbers of zones, use simple linear search
  if (zones.length <= 10) {
    for (let i = zones.length - 1; i >= 0; i--) {
      if (isPointInPolygon(point, zones[i].vertices)) {
        return zones[i];
      }
    }
    return null;
  }
  
  // For larger numbers of zones, use optimized spatial indexing
  globalZoneFinder.updateIndex(zones);
  return globalZoneFinder.findZoneAtPoint(point);
}

/**
 * Updates a zone with new properties
 * @param zone The zone to update
 * @param updates The properties to update
 * @returns A new zone object with updated properties
 */
export function updateZone(zone: Zone, updates: Partial<Zone>): Zone {
  return {
    ...zone,
    ...updates,
    updatedAt: Date.now()
  };
}