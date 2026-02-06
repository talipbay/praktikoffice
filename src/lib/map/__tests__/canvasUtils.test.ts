import {
  getZoneStyle,
  getCanvasCoordinates,
  getTouchCanvasCoordinates,
  calculatePolygonCentroid,
  isPointNearVertex,
  findNearestVertex
} from '../canvasUtils';
import { Point, ZoneStatus } from '@/types/map/zone';

describe('canvasUtils', () => {
  describe('getZoneStyle', () => {
    it('should return correct style for free zone', () => {
      const style = getZoneStyle('free', false);
      
      expect(style.fillColor).toBe('rgba(34, 197, 94, 0.2)');
      expect(style.strokeColor).toBe('#22c55e');
      expect(style.strokeWidth).toBe(2);
      expect(style.opacity).toBe(0.8);
    });

    it('should return correct style for occupied zone', () => {
      const style = getZoneStyle('occupied', false);
      
      expect(style.fillColor).toBe('rgba(239, 68, 68, 0.2)');
      expect(style.strokeColor).toBe('#ef4444');
      expect(style.strokeWidth).toBe(2);
      expect(style.opacity).toBe(0.8);
    });

    it('should return selected style for free zone', () => {
      const style = getZoneStyle('free', true);
      
      expect(style.fillColor).toBe('rgba(34, 197, 94, 0.3)');
      expect(style.strokeColor).toBe('#16a34a');
      expect(style.strokeWidth).toBe(3);
    });

    it('should return selected style for occupied zone', () => {
      const style = getZoneStyle('occupied', true);
      
      expect(style.fillColor).toBe('rgba(239, 68, 68, 0.3)');
      expect(style.strokeColor).toBe('#dc2626');
      expect(style.strokeWidth).toBe(3);
    });
  });

  describe('getCanvasCoordinates', () => {
    const mockCanvas = {
      getBoundingClientRect: () => ({
        left: 10,
        top: 20,
        width: 400,
        height: 300
      }),
      width: 800,
      height: 600
    } as HTMLCanvasElement;

    it('should convert mouse coordinates to canvas coordinates', () => {
      const mockEvent = {
        clientX: 110, // 10 + 100
        clientY: 120  // 20 + 100
      } as MouseEvent;

      const coords = getCanvasCoordinates(mockEvent, mockCanvas);
      
      expect(coords.x).toBe(200); // (110 - 10) * (800 / 400)
      expect(coords.y).toBe(200); // (120 - 20) * (600 / 300)
    });

    it('should handle edge coordinates', () => {
      const mockEvent = {
        clientX: 10, // left edge
        clientY: 20  // top edge
      } as MouseEvent;

      const coords = getCanvasCoordinates(mockEvent, mockCanvas);
      
      expect(coords.x).toBe(0);
      expect(coords.y).toBe(0);
    });
  });

  describe('getTouchCanvasCoordinates', () => {
    const mockCanvas = {
      getBoundingClientRect: () => ({
        left: 10,
        top: 20,
        width: 400,
        height: 300
      }),
      width: 800,
      height: 600
    } as HTMLCanvasElement;

    it('should convert touch coordinates to canvas coordinates', () => {
      const mockTouch = {
        clientX: 110,
        clientY: 120
      } as Touch;

      const coords = getTouchCanvasCoordinates(mockTouch, mockCanvas);
      
      expect(coords.x).toBe(200);
      expect(coords.y).toBe(200);
    });
  });

  describe('calculatePolygonCentroid', () => {
    it('should calculate centroid of square', () => {
      const vertices: Point[] = [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 100, y: 100 },
        { x: 0, y: 100 }
      ];

      const centroid = calculatePolygonCentroid(vertices);
      
      expect(centroid.x).toBeCloseTo(50, 1);
      expect(centroid.y).toBeCloseTo(50, 1);
    });

    it('should calculate centroid of triangle', () => {
      const vertices: Point[] = [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 50, y: 100 }
      ];

      const centroid = calculatePolygonCentroid(vertices);
      
      expect(centroid.x).toBeCloseTo(50, 1);
      expect(centroid.y).toBeCloseTo(33.33, 1);
    });

    it('should handle empty array', () => {
      const centroid = calculatePolygonCentroid([]);
      
      expect(centroid.x).toBe(0);
      expect(centroid.y).toBe(0);
    });

    it('should handle degenerate polygon (fallback to average)', () => {
      const vertices: Point[] = [
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 }
      ];

      const centroid = calculatePolygonCentroid(vertices);
      
      expect(centroid.x).toBe(0);
      expect(centroid.y).toBe(0);
    });
  });

  describe('isPointNearVertex', () => {
    const vertex: Point = { x: 50, y: 50 };

    it('should return true for point within threshold', () => {
      const point: Point = { x: 55, y: 55 };
      expect(isPointNearVertex(point, vertex, 10)).toBe(true);
    });

    it('should return false for point outside threshold', () => {
      const point: Point = { x: 65, y: 65 };
      expect(isPointNearVertex(point, vertex, 10)).toBe(false);
    });

    it('should return true for point exactly on threshold', () => {
      const point: Point = { x: 60, y: 50 }; // Distance = 10
      expect(isPointNearVertex(point, vertex, 10)).toBe(true);
    });

    it('should use default threshold of 10', () => {
      const point: Point = { x: 59, y: 50 }; // Distance = 9
      expect(isPointNearVertex(point, vertex)).toBe(true);
      
      const farPoint: Point = { x: 61, y: 50 }; // Distance = 11
      expect(isPointNearVertex(farPoint, vertex)).toBe(false);
    });
  });

  describe('findNearestVertex', () => {
    const vertices: Point[] = [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 }
    ];

    it('should find nearest vertex within threshold', () => {
      const point: Point = { x: 5, y: 5 };
      const index = findNearestVertex(point, vertices, 10);
      expect(index).toBe(0);
    });

    it('should return -1 if no vertex within threshold', () => {
      const point: Point = { x: 50, y: 50 };
      const index = findNearestVertex(point, vertices, 10);
      expect(index).toBe(-1);
    });

    it('should find closest vertex when multiple are within threshold', () => {
      const point: Point = { x: 8, y: 8 };
      const index = findNearestVertex(point, vertices, 20);
      expect(index).toBe(0); // Closest to (0,0)
    });

    it('should use default threshold of 10', () => {
      const point: Point = { x: 9, y: 0 };
      const index = findNearestVertex(point, vertices);
      expect(index).toBe(0);
      
      const farPoint: Point = { x: 11, y: 0 };
      const farIndex = findNearestVertex(farPoint, vertices);
      expect(farIndex).toBe(-1);
    });

    it('should handle empty vertices array', () => {
      const point: Point = { x: 0, y: 0 };
      const index = findNearestVertex(point, []);
      expect(index).toBe(-1);
    });
  });
});