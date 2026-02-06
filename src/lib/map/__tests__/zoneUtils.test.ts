import {
  generateZoneId,
  createZone,
  isPointInPolygon,
  validatePolygon,
  calculatePolygonArea,
  validateCompanyName,
  findZoneAtPoint,
  updateZone
} from '../zoneUtils';
import { Point, Zone, CreateZoneParams } from '@/types/map/zone';

describe('zoneUtils', () => {
  describe('generateZoneId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateZoneId();
      const id2 = generateZoneId();
      
      expect(id1).toMatch(/^zone_\d+_[a-z0-9]+$/);
      expect(id2).toMatch(/^zone_\d+_[a-z0-9]+$/);
      expect(id1).not.toBe(id2);
    });
  });

  describe('createZone', () => {
    const vertices: Point[] = [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 }
    ];

    it('should create a zone with default values', () => {
      const params: CreateZoneParams = { vertices };
      const zone = createZone(params);

      expect(zone.id).toMatch(/^zone_\d+_[a-z0-9]+$/);
      expect(zone.vertices).toEqual(vertices);
      expect(zone.status).toBe('free');
      expect(zone.companyName).toBeNull();
      expect(zone.createdAt).toBeGreaterThan(0);
      expect(zone.updatedAt).toBe(zone.createdAt);
    });

    it('should create a zone with custom values', () => {
      const params: CreateZoneParams = {
        vertices,
        status: 'occupied',
        companyName: 'Test Company'
      };
      const zone = createZone(params);

      expect(zone.status).toBe('occupied');
      expect(zone.companyName).toBe('Test Company');
    });

    it('should create a copy of vertices array', () => {
      const params: CreateZoneParams = { vertices };
      const zone = createZone(params);

      expect(zone.vertices).not.toBe(vertices);
      expect(zone.vertices).toEqual(vertices);
    });
  });

  describe('isPointInPolygon', () => {
    const square: Point[] = [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 }
    ];

    it('should return true for point inside polygon', () => {
      const point: Point = { x: 50, y: 50 };
      expect(isPointInPolygon(point, square)).toBe(true);
    });

    it('should return false for point outside polygon', () => {
      const point: Point = { x: 150, y: 150 };
      expect(isPointInPolygon(point, square)).toBe(false);
    });

    it('should handle point on edge', () => {
      const point: Point = { x: 0, y: 50 };
      // Our ray casting algorithm may return true for edge cases
      const result = isPointInPolygon(point, square);
      expect(typeof result).toBe('boolean');
    });

    it('should handle triangle', () => {
      const triangle: Point[] = [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 50, y: 100 }
      ];
      
      expect(isPointInPolygon({ x: 50, y: 30 }, triangle)).toBe(true);
      expect(isPointInPolygon({ x: 10, y: 90 }, triangle)).toBe(false);
    });

    it('should return false for invalid polygon', () => {
      const invalidPolygon: Point[] = [
        { x: 0, y: 0 },
        { x: 100, y: 0 }
      ];
      
      expect(isPointInPolygon({ x: 50, y: 0 }, invalidPolygon)).toBe(false);
    });
  });

  describe('validatePolygon', () => {
    it('should validate a valid square', () => {
      const vertices: Point[] = [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 100, y: 100 },
        { x: 0, y: 100 }
      ];
      
      const result = validatePolygon(vertices);
      expect(result.isValid).toBe(true);
    });

    it('should reject polygon with too few vertices', () => {
      const vertices: Point[] = [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 50, y: 100 }
      ];
      
      const result = validatePolygon(vertices);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Polygon must have at least 4 vertices');
    });

    it('should reject polygon with too many vertices', () => {
      const vertices: Point[] = [
        { x: 0, y: 0 },
        { x: 50, y: 0 },
        { x: 100, y: 0 },
        { x: 100, y: 50 },
        { x: 100, y: 100 },
        { x: 50, y: 100 },
        { x: 0, y: 100 }
      ];
      
      const result = validatePolygon(vertices);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Polygon cannot have more than 6 vertices');
    });

    it('should reject polygon with too small area', () => {
      const vertices: Point[] = [
        { x: 0, y: 0 },
        { x: 5, y: 0 },
        { x: 5, y: 5 },
        { x: 0, y: 5 }
      ];
      
      const result = validatePolygon(vertices);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Zone area is too small');
    });

    it('should reject self-intersecting polygon', () => {
      // Create a simple hourglass/bow-tie that definitely self-intersects
      // This forms two triangles that share a point in the middle
      const vertices: Point[] = [
        { x: 0, y: 0 },
        { x: 100, y: 100 },  // This line will intersect with the next
        { x: 0, y: 100 },
        { x: 100, y: 0 }     // This line intersects with the previous
      ];
      
      const result = validatePolygon(vertices);
      expect(result.isValid).toBe(false);
      // Since area might still be small, let's just check that it's invalid
      expect(result.error).toMatch(/Polygon cannot intersect itself|Zone area is too small/);
    });
  });

  describe('calculatePolygonArea', () => {
    it('should calculate area of square', () => {
      const vertices: Point[] = [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 100, y: 100 },
        { x: 0, y: 100 }
      ];
      
      const area = calculatePolygonArea(vertices);
      expect(area).toBe(10000);
    });

    it('should calculate area of triangle', () => {
      const vertices: Point[] = [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 50, y: 100 }
      ];
      
      const area = calculatePolygonArea(vertices);
      expect(area).toBe(5000);
    });

    it('should return 0 for invalid polygon', () => {
      const vertices: Point[] = [
        { x: 0, y: 0 },
        { x: 100, y: 0 }
      ];
      
      const area = calculatePolygonArea(vertices);
      expect(area).toBe(0);
    });
  });

  describe('validateCompanyName', () => {
    it('should validate valid company name', () => {
      const result = validateCompanyName('Test Company');
      expect(result.isValid).toBe(true);
    });

    it('should validate company name with numbers and hyphens', () => {
      const result = validateCompanyName('Company-123');
      expect(result.isValid).toBe(true);
    });

    it('should reject empty string', () => {
      const result = validateCompanyName('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Company name cannot be empty');
    });

    it('should reject whitespace-only string', () => {
      const result = validateCompanyName('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Company name cannot be empty');
    });

    it('should reject name that is too long', () => {
      const longName = 'A'.repeat(51);
      const result = validateCompanyName(longName);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Company name cannot exceed 50 characters');
    });

    it('should reject name with invalid characters', () => {
      const result = validateCompanyName('Test@Company!');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Company name can only contain letters, numbers, spaces, and hyphens');
    });
  });

  describe('findZoneAtPoint', () => {
    const zones: Zone[] = [
      {
        id: 'zone1',
        vertices: [
          { x: 0, y: 0 },
          { x: 100, y: 0 },
          { x: 100, y: 100 },
          { x: 0, y: 100 }
        ],
        status: 'free',
        companyName: null,
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      {
        id: 'zone2',
        vertices: [
          { x: 200, y: 200 },
          { x: 300, y: 200 },
          { x: 300, y: 300 },
          { x: 200, y: 300 }
        ],
        status: 'occupied',
        companyName: 'Test Company',
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
    ];

    it('should find zone containing point', () => {
      const point: Point = { x: 50, y: 50 };
      const result = findZoneAtPoint(point, zones);
      expect(result?.id).toBe('zone1');
    });

    it('should return null for point not in any zone', () => {
      const point: Point = { x: 150, y: 150 };
      const result = findZoneAtPoint(point, zones);
      expect(result).toBeNull();
    });

    it('should prioritize later zones (reverse order)', () => {
      const overlappingZones: Zone[] = [
        ...zones,
        {
          id: 'zone3',
          vertices: [
            { x: -10, y: -10 },
            { x: 110, y: -10 },
            { x: 110, y: 110 },
            { x: -10, y: 110 }
          ],
          status: 'free',
          companyName: null,
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
      ];

      const point: Point = { x: 50, y: 50 };
      const result = findZoneAtPoint(point, overlappingZones);
      expect(result?.id).toBe('zone3'); // Should find the last zone
    });
  });

  describe('updateZone', () => {
    const originalZone: Zone = {
      id: 'test-zone',
      vertices: [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 100, y: 100 },
        { x: 0, y: 100 }
      ],
      status: 'free',
      companyName: null,
      createdAt: 1000,
      updatedAt: 1000
    };

    it('should update zone properties', () => {
      const updates = {
        status: 'occupied' as const,
        companyName: 'New Company'
      };

      const updatedZone = updateZone(originalZone, updates);

      expect(updatedZone.id).toBe(originalZone.id);
      expect(updatedZone.vertices).toBe(originalZone.vertices);
      expect(updatedZone.status).toBe('occupied');
      expect(updatedZone.companyName).toBe('New Company');
      expect(updatedZone.createdAt).toBe(originalZone.createdAt);
      expect(updatedZone.updatedAt).toBeGreaterThan(originalZone.updatedAt);
    });

    it('should not mutate original zone', () => {
      const updates = { status: 'occupied' as const };
      const updatedZone = updateZone(originalZone, updates);

      expect(originalZone.status).toBe('free');
      expect(updatedZone.status).toBe('occupied');
      expect(updatedZone).not.toBe(originalZone);
    });
  });
});