import { renderHook, act } from '@testing-library/react';
import { useZoneState } from '../useZoneState';
import { Point } from '@/types/zone';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { beforeEach } from 'node:test';
import { describe } from 'node:test';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(() => null),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('useZoneState', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  it('should initialize with empty zones', () => {
    const { result } = renderHook(() => useZoneState());

    expect(result.current.zones).toEqual([]);
    expect(result.current.selectedZone).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should create a new zone', async () => {
    const { result } = renderHook(() => useZoneState());

    const vertices: Point[] = [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 }
    ];

    let createdZone;
    await act(async () => {
      createdZone = await result.current.createZone(vertices);
    });

    expect(createdZone).toBeTruthy();
    expect(createdZone?.vertices).toEqual(vertices);
    expect(createdZone?.status).toBe('free');
    expect(result.current.zones).toHaveLength(1);
    expect(mockLocalStorage.setItem).toHaveBeenCalled();
  });

  it('should create occupied zone with company name', async () => {
    const { result } = renderHook(() => useZoneState());

    const vertices: Point[] = [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 }
    ];

    let createdZone;
    await act(async () => {
      createdZone = await result.current.createZone(vertices, 'Test Company');
    });

    expect(createdZone?.status).toBe('occupied');
    expect(createdZone?.companyName).toBe('Test Company');
  });

  it('should reject invalid polygon', async () => {
    const { result } = renderHook(() => useZoneState());

    const invalidVertices: Point[] = [
      { x: 0, y: 0 },
      { x: 5, y: 0 },
      { x: 5, y: 5 }
    ];

    let createdZone;
    await act(async () => {
      createdZone = await result.current.createZone(invalidVertices);
    });

    expect(createdZone).toBeNull();
    expect(result.current.zones).toHaveLength(0);
  });

  it('should update zone', async () => {
    const { result } = renderHook(() => useZoneState());

    const vertices: Point[] = [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 }
    ];

    // Create zone first
    let createdZone;
    await act(async () => {
      createdZone = await result.current.createZone(vertices);
    });

    // Update zone
    let updateResult;
    await act(async () => {
      updateResult = await result.current.updateZone(createdZone!.id, {
        status: 'occupied',
        companyName: 'Updated Company'
      });
    });

    expect(updateResult).toBe(true);
    expect(result.current.zones[0].status).toBe('occupied');
    expect(result.current.zones[0].companyName).toBe('Updated Company');
  });

  it('should delete zone', async () => {
    const { result } = renderHook(() => useZoneState());

    const vertices: Point[] = [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 }
    ];

    // Create zone first
    let createdZone;
    await act(async () => {
      createdZone = await result.current.createZone(vertices);
    });

    // Delete zone
    let deleteResult;
    await act(async () => {
      deleteResult = await result.current.deleteZone(createdZone!.id);
    });

    expect(deleteResult).toBe(true);
    expect(result.current.zones).toHaveLength(0);
  });

  it('should toggle zone status', async () => {
    const { result } = renderHook(() => useZoneState());

    const vertices: Point[] = [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 }
    ];

    // Create zone first
    let createdZone;
    await act(async () => {
      createdZone = await result.current.createZone(vertices);
    });

    // Toggle to occupied
    await act(async () => {
      await result.current.toggleZoneStatus(createdZone!.id, 'Test Company');
    });

    expect(result.current.zones[0].status).toBe('occupied');
    expect(result.current.zones[0].companyName).toBe('Test Company');

    // Toggle back to free
    await act(async () => {
      await result.current.toggleZoneStatus(createdZone!.id);
    });

    expect(result.current.zones[0].status).toBe('free');
    expect(result.current.zones[0].companyName).toBeNull();
  });

  it('should find zone at point', async () => {
    const { result } = renderHook(() => useZoneState());

    const vertices: Point[] = [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 }
    ];

    // Create zone first
    let createdZone;
    await act(async () => {
      createdZone = await result.current.createZone(vertices);
    });

    // Find zone at point inside
    const foundZone = result.current.findZoneAtPoint({ x: 50, y: 50 });
    expect(foundZone?.id).toBe(createdZone!.id);

    // Find zone at point outside
    const notFoundZone = result.current.findZoneAtPoint({ x: 150, y: 150 });
    expect(notFoundZone).toBeNull();
  });

  it('should get zones by status', async () => {
    const { result } = renderHook(() => useZoneState());

    const vertices1: Point[] = [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 }
    ];

    const vertices2: Point[] = [
      { x: 200, y: 200 },
      { x: 300, y: 200 },
      { x: 300, y: 300 },
      { x: 200, y: 300 }
    ];

    // Create zones
    await act(async () => {
      await result.current.createZone(vertices1); // free
      await result.current.createZone(vertices2, 'Test Company'); // occupied
    });

    const freeZones = result.current.getZonesByStatus('free');
    const occupiedZones = result.current.getZonesByStatus('occupied');

    expect(freeZones).toHaveLength(1);
    expect(occupiedZones).toHaveLength(1);
    expect(occupiedZones[0].companyName).toBe('Test Company');
  });

  it('should get zone statistics', async () => {
    const { result } = renderHook(() => useZoneState());

    const vertices1: Point[] = [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 }
    ];

    const vertices2: Point[] = [
      { x: 200, y: 200 },
      { x: 300, y: 200 },
      { x: 300, y: 300 },
      { x: 200, y: 300 }
    ];

    // Create zones
    await act(async () => {
      await result.current.createZone(vertices1); // free
      await result.current.createZone(vertices2, 'Test Company'); // occupied
    });

    const stats = result.current.getZoneStats;
    expect(stats.total).toBe(2);
    expect(stats.free).toBe(1);
    expect(stats.occupied).toBe(1);
  });

  it('should clear all zones', async () => {
    const { result } = renderHook(() => useZoneState());

    const vertices: Point[] = [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 }
    ];

    // Create zone first
    await act(async () => {
      await result.current.createZone(vertices);
    });

    expect(result.current.zones).toHaveLength(1);

    // Clear all zones
    await act(async () => {
      await result.current.clearAllZones();
    });

    expect(result.current.zones).toHaveLength(0);
    expect(result.current.selectedZone).toBeNull();
  });

  it('should manage selected zone', async () => {
    const { result } = renderHook(() => useZoneState());

    const vertices: Point[] = [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 }
    ];

    // Create zone first
    let createdZone;
    await act(async () => {
      createdZone = await result.current.createZone(vertices);
    });

    // Select zone
    act(() => {
      result.current.setSelectedZone(createdZone!);
    });

    expect(result.current.selectedZone?.id).toBe(createdZone!.id);

    // Clear selection
    act(() => {
      result.current.setSelectedZone(null);
    });

    expect(result.current.selectedZone).toBeNull();
  });
});