import { renderHook } from '@testing-library/react';
import { useZoneState } from '../useZoneState';

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

describe('useZoneState - Simple Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with empty zones', () => {
    const { result } = renderHook(() => useZoneState());

    expect(result.current.zones).toEqual([]);
    expect(result.current.selectedZone).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('should have all required methods', () => {
    const { result } = renderHook(() => useZoneState());

    expect(typeof result.current.createZone).toBe('function');
    expect(typeof result.current.updateZone).toBe('function');
    expect(typeof result.current.deleteZone).toBe('function');
    expect(typeof result.current.setSelectedZone).toBe('function');
  });
});