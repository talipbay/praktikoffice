import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Generic Local Storage hook with error handling and data validation
 * Provides automatic synchronization between React state and Local Storage
 */
export interface UseLocalStorageReturn<T> {
  /** Current data from Local Storage */
  data: T;
  /** Function to update data and persist to Local Storage (debounced) */
  setData: (data: T) => void;
  /** Function to update data and persist to Local Storage immediately */
  setDataImmediate: (data: T) => void;
  /** Loading state during initial data retrieval */
  isLoading: boolean;
  /** Error message if storage operations fail */
  error: string | null;
  /** Clear error state */
  clearError: () => void;
  /** Check if Local Storage is available */
  isStorageAvailable: boolean;
}

/**
 * Options for configuring the useLocalStorage hook
 */
export interface UseLocalStorageOptions<T> {
  /** Default value if no data exists in storage */
  defaultValue: T;
  /** Optional data validation function */
  validator?: (data: unknown) => data is T;
  /** Optional data migration function for version updates */
  migrator?: (data: unknown) => T;
  /** Serialize function (defaults to JSON.stringify) */
  serializer?: (data: T) => string;
  /** Deserialize function (defaults to JSON.parse) */
  deserializer?: (data: string) => unknown;
}

/**
 * Custom hook for managing Local Storage with React state synchronization
 * Handles error cases, data validation, and migration logic
 * 
 * @param key - Local Storage key
 * @param options - Configuration options
 * @returns Object with data, setData, loading, and error states
 */
export function useLocalStorage<T>(
  key: string,
  options: UseLocalStorageOptions<T>
): UseLocalStorageReturn<T> {
  const {
    defaultValue,
    validator,
    migrator,
    serializer = JSON.stringify,
    deserializer = JSON.parse,
  } = options;

  const [data, setDataState] = useState<T>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isStorageAvailable, setIsStorageAvailable] = useState(false);
  
  // Debouncing for storage operations
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingDataRef = useRef<T | null>(null);

  /**
   * Check if Local Storage is available in the current environment
   */
  const checkStorageAvailability = (): boolean => {
    try {
      const testKey = '__localStorage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  };

  /**
   * Load data from Local Storage with validation and migration
   */
  const loadFromStorage = (): T => {
    try {
      const stored = localStorage.getItem(key);
      
      if (stored === null) {
        return defaultValue;
      }

      const parsed = deserializer(stored);
      
      // Apply migration if provided
      const migrated = migrator ? migrator(parsed) : parsed;
      
      // Validate data if validator is provided
      if (validator && !validator(migrated)) {
        console.warn(`Invalid data in localStorage for key "${key}", using default value`);
        return defaultValue;
      }
      
      return migrated as T;
    } catch (err) {
      console.error(`Error loading from localStorage for key "${key}":`, err);
      return defaultValue;
    }
  };

  /**
   * Save data to Local Storage with error handling (immediate)
   */
  const saveToStorageImmediate = useCallback((value: T): boolean => {
    if (!isStorageAvailable) {
      setError('Local Storage is not available');
      return false;
    }

    try {
      const serialized = serializer(value);
      localStorage.setItem(key, serialized);
      setError(null);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error(`Error saving to localStorage for key "${key}":`, err);
      
      // Handle quota exceeded error specifically
      if (err instanceof Error && err.name === 'QuotaExceededError') {
        setError('Storage quota exceeded. Please clear some data or export your zones.');
      } else {
        setError(`Failed to save data: ${errorMessage}`);
      }
      return false;
    }
  }, [key, serializer, isStorageAvailable]);

  /**
   * Save data to Local Storage with debouncing (500ms delay)
   */
  const saveToStorageDebounced = useCallback((value: T): void => {
    pendingDataRef.current = value;
    
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    debounceTimeoutRef.current = setTimeout(() => {
      if (pendingDataRef.current !== null) {
        saveToStorageImmediate(pendingDataRef.current);
        pendingDataRef.current = null;
      }
    }, 500);
  }, [saveToStorageImmediate]);

  /**
   * Update data and persist to Local Storage (debounced)
   */
  const setData = useCallback((newData: T) => {
    setDataState(newData);
    saveToStorageDebounced(newData);
  }, [saveToStorageDebounced]);

  /**
   * Update data and persist to Local Storage immediately (for critical operations)
   */
  const setDataImmediate = useCallback((newData: T) => {
    setDataState(newData);
    saveToStorageImmediate(newData);
  }, [saveToStorageImmediate]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Initialize hook - check storage availability and load initial data
   */
  useEffect(() => {
    let isMounted = true;
    
    const initialize = () => {
      const storageAvailable = checkStorageAvailability();
      
      if (!isMounted) return;
      setIsStorageAvailable(storageAvailable);

      if (storageAvailable) {
        const initialData = loadFromStorage();
        if (!isMounted) return;
        setDataState(initialData);
      } else {
        if (!isMounted) return;
        setError('Local Storage is not available in this browser');
        setDataState(defaultValue);
      }

      if (!isMounted) return;
      setIsLoading(false);
    };

    initialize();
    
    return () => {
      isMounted = false;
    };
  }, [key]); // Only depend on key, not the functions

  /**
   * Listen for storage events from other tabs/windows
   */
  useEffect(() => {
    if (!isStorageAvailable) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const parsed = deserializer(e.newValue);
          const migrated = migrator ? migrator(parsed) : parsed;
          
          if (!validator || validator(migrated)) {
            setDataState(migrated as T);
            setError(null);
          }
        } catch (err) {
          console.error('Error handling storage change:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, validator, migrator, deserializer, isStorageAvailable]);

  // Cleanup debounce timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
        // Save any pending data immediately on cleanup
        if (pendingDataRef.current !== null) {
          saveToStorageImmediate(pendingDataRef.current);
        }
      }
    };
  }, [saveToStorageImmediate]);

  return {
    data,
    setData,
    setDataImmediate,
    isLoading,
    error,
    clearError,
    isStorageAvailable,
  };
}