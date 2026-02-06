import { Zone, Point } from '@/types/map/zone';
import { createZone } from './zoneUtils';
import { findZoneAtPoint } from './zoneUtils';

/**
 * Performance testing utilities for the zone management system
 */

/**
 * Performance test result
 */
export interface PerformanceTestResult {
  testName: string;
  duration: number;
  operations: number;
  operationsPerSecond: number;
  memoryUsage?: {
    used: number;
    total: number;
  };
  success: boolean;
  error?: string;
}

/**
 * Performance benchmark suite
 */
export class PerformanceBenchmark {
  private results: PerformanceTestResult[] = [];
  
  /**
   * Generate test zones for performance testing
   */
  generateTestZones(count: number, canvasWidth: number = 800, canvasHeight: number = 600): Zone[] {
    const zones: Zone[] = [];
    const margin = 50;
    const maxZoneSize = 80;
    const minZoneSize = 40;
    
    for (let i = 0; i < count; i++) {
      // Generate random position
      const centerX = margin + Math.random() * (canvasWidth - 2 * margin);
      const centerY = margin + Math.random() * (canvasHeight - 2 * margin);
      
      // Generate random size
      const size = minZoneSize + Math.random() * (maxZoneSize - minZoneSize);
      
      // Generate random polygon (4-6 vertices)
      const vertexCount = 4 + Math.floor(Math.random() * 3);
      const vertices: Point[] = [];
      
      for (let j = 0; j < vertexCount; j++) {
        const angle = (j / vertexCount) * 2 * Math.PI;
        const radius = size / 2 + (Math.random() - 0.5) * size * 0.3;
        
        vertices.push({
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius
        });
      }
      
      // Create zone
      const zone = createZone({
        vertices,
        status: Math.random() > 0.5 ? 'occupied' : 'free',
        companyName: Math.random() > 0.5 ? `Company ${i + 1}` : null
      });
      
      zones.push(zone);
    }
    
    return zones;
  }
  
  /**
   * Test zone creation performance
   */
  async testZoneCreation(zoneCount: number): Promise<PerformanceTestResult> {
    const testName = `Zone Creation (${zoneCount} zones)`;
    
    try {
      const startTime = performance.now();
      const startMemory = this.getMemoryUsage();
      
      const zones = this.generateTestZones(zoneCount);
      
      const endTime = performance.now();
      const endMemory = this.getMemoryUsage();
      
      const duration = endTime - startTime;
      const result: PerformanceTestResult = {
        testName,
        duration,
        operations: zoneCount,
        operationsPerSecond: zoneCount / (duration / 1000),
        memoryUsage: {
          used: endMemory.used - startMemory.used,
          total: endMemory.total
        },
        success: true
      };
      
      this.results.push(result);
      return result;
    } catch (error) {
      const result: PerformanceTestResult = {
        testName,
        duration: 0,
        operations: 0,
        operationsPerSecond: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      
      this.results.push(result);
      return result;
    }
  }
  
  /**
   * Test hit detection performance
   */
  async testHitDetection(zones: Zone[], testPoints: number = 1000): Promise<PerformanceTestResult> {
    const testName = `Hit Detection (${zones.length} zones, ${testPoints} tests)`;
    
    try {
      // Generate random test points
      const points: Point[] = [];
      for (let i = 0; i < testPoints; i++) {
        points.push({
          x: Math.random() * 800,
          y: Math.random() * 600
        });
      }
      
      const startTime = performance.now();
      const startMemory = this.getMemoryUsage();
      
      let hits = 0;
      for (const point of points) {
        const zone = findZoneAtPoint(point, zones);
        if (zone) hits++;
      }
      
      const endTime = performance.now();
      const endMemory = this.getMemoryUsage();
      
      const duration = endTime - startTime;
      const result: PerformanceTestResult = {
        testName: `${testName} (${hits} hits)`,
        duration,
        operations: testPoints,
        operationsPerSecond: testPoints / (duration / 1000),
        memoryUsage: {
          used: endMemory.used - startMemory.used,
          total: endMemory.total
        },
        success: true
      };
      
      this.results.push(result);
      return result;
    } catch (error) {
      const result: PerformanceTestResult = {
        testName,
        duration: 0,
        operations: 0,
        operationsPerSecond: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      
      this.results.push(result);
      return result;
    }
  }
  
  /**
   * Test canvas rendering performance (simulated)
   */
  async testCanvasRendering(zones: Zone[], renderCount: number = 100): Promise<PerformanceTestResult> {
    const testName = `Canvas Rendering (${zones.length} zones, ${renderCount} renders)`;
    
    try {
      const startTime = performance.now();
      const startMemory = this.getMemoryUsage();
      
      // Simulate canvas rendering operations
      for (let i = 0; i < renderCount; i++) {
        // Simulate zone rendering calculations
        zones.forEach(zone => {
          // Calculate bounding box
          let minX = zone.vertices[0]?.x || 0;
          let minY = zone.vertices[0]?.y || 0;
          let maxX = minX;
          let maxY = minY;
          
          zone.vertices.forEach(vertex => {
            minX = Math.min(minX, vertex.x);
            minY = Math.min(minY, vertex.y);
            maxX = Math.max(maxX, vertex.x);
            maxY = Math.max(maxY, vertex.y);
          });
          
          // Simulate polygon area calculation
          let area = 0;
          for (let j = 0; j < zone.vertices.length; j++) {
            const k = (j + 1) % zone.vertices.length;
            area += zone.vertices[j].x * zone.vertices[k].y;
            area -= zone.vertices[k].x * zone.vertices[j].y;
          }
          area = Math.abs(area) / 2;
        });
      }
      
      const endTime = performance.now();
      const endMemory = this.getMemoryUsage();
      
      const duration = endTime - startTime;
      const totalOperations = renderCount * zones.length;
      
      const result: PerformanceTestResult = {
        testName,
        duration,
        operations: totalOperations,
        operationsPerSecond: totalOperations / (duration / 1000),
        memoryUsage: {
          used: endMemory.used - startMemory.used,
          total: endMemory.total
        },
        success: true
      };
      
      this.results.push(result);
      return result;
    } catch (error) {
      const result: PerformanceTestResult = {
        testName,
        duration: 0,
        operations: 0,
        operationsPerSecond: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      
      this.results.push(result);
      return result;
    }
  }
  
  /**
   * Test storage operations performance
   */
  async testStorageOperations(zones: Zone[], operationCount: number = 100): Promise<PerformanceTestResult> {
    const testName = `Storage Operations (${zones.length} zones, ${operationCount} ops)`;
    
    try {
      const startTime = performance.now();
      const startMemory = this.getMemoryUsage();
      
      const testKey = 'performance-test-zones';
      
      // Test serialization and storage operations
      for (let i = 0; i < operationCount; i++) {
        // Serialize zones
        const serialized = JSON.stringify({
          version: '1.0.0',
          zones: zones,
          lastModified: Date.now()
        });
        
        // Simulate localStorage operations
        try {
          localStorage.setItem(testKey, serialized);
          const retrieved = localStorage.getItem(testKey);
          if (retrieved) {
            JSON.parse(retrieved);
          }
        } catch (e) {
          // Handle quota exceeded or other storage errors
          console.warn('Storage operation failed:', e);
        }
      }
      
      // Cleanup
      try {
        localStorage.removeItem(testKey);
      } catch (e) {
        // Ignore cleanup errors
      }
      
      const endTime = performance.now();
      const endMemory = this.getMemoryUsage();
      
      const duration = endTime - startTime;
      const result: PerformanceTestResult = {
        testName,
        duration,
        operations: operationCount * 2, // Read + Write operations
        operationsPerSecond: (operationCount * 2) / (duration / 1000),
        memoryUsage: {
          used: endMemory.used - startMemory.used,
          total: endMemory.total
        },
        success: true
      };
      
      this.results.push(result);
      return result;
    } catch (error) {
      const result: PerformanceTestResult = {
        testName,
        duration: 0,
        operations: 0,
        operationsPerSecond: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      
      this.results.push(result);
      return result;
    }
  }
  
  /**
   * Run comprehensive performance test suite
   */
  async runFullTestSuite(): Promise<PerformanceTestResult[]> {
    console.log('Starting performance test suite...');
    
    // Test with different zone counts
    const zoneCounts = [10, 50, 100, 200, 500];
    
    for (const count of zoneCounts) {
      console.log(`Testing with ${count} zones...`);
      
      // Test zone creation
      await this.testZoneCreation(count);
      
      // Generate zones for other tests
      const zones = this.generateTestZones(count);
      
      // Test hit detection
      await this.testHitDetection(zones, Math.min(1000, count * 10));
      
      // Test canvas rendering
      await this.testCanvasRendering(zones, Math.max(10, 100 - count / 10));
      
      // Test storage operations
      await this.testStorageOperations(zones, Math.max(10, 50 - count / 20));
      
      // Add delay between test suites to prevent browser throttling
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('Performance test suite completed');
    return this.results;
  }
  
  /**
   * Get memory usage information
   */
  private getMemoryUsage(): { used: number; total: number } {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize || 0,
        total: memory.totalJSHeapSize || 0
      };
    }
    
    return { used: 0, total: 0 };
  }
  
  /**
   * Get all test results
   */
  getResults(): PerformanceTestResult[] {
    return [...this.results];
  }
  
  /**
   * Clear test results
   */
  clearResults(): void {
    this.results = [];
  }
  
  /**
   * Generate performance report
   */
  generateReport(): string {
    if (this.results.length === 0) {
      return 'No performance test results available.';
    }
    
    let report = 'Performance Test Report\n';
    report += '======================\n\n';
    
    // Group results by test type
    const groupedResults = this.results.reduce((groups, result) => {
      const testType = result.testName.split('(')[0].trim();
      if (!groups[testType]) {
        groups[testType] = [];
      }
      groups[testType].push(result);
      return groups;
    }, {} as Record<string, PerformanceTestResult[]>);
    
    Object.entries(groupedResults).forEach(([testType, results]) => {
      report += `${testType}\n`;
      report += '-'.repeat(testType.length) + '\n';
      
      results.forEach(result => {
        report += `  ${result.testName}\n`;
        report += `    Duration: ${result.duration.toFixed(2)}ms\n`;
        report += `    Operations: ${result.operations}\n`;
        report += `    Ops/sec: ${result.operationsPerSecond.toFixed(2)}\n`;
        
        if (result.memoryUsage) {
          report += `    Memory used: ${(result.memoryUsage.used / 1024 / 1024).toFixed(2)}MB\n`;
        }
        
        if (!result.success && result.error) {
          report += `    Error: ${result.error}\n`;
        }
        
        report += '\n';
      });
    });
    
    // Summary statistics
    const successfulTests = this.results.filter(r => r.success);
    if (successfulTests.length > 0) {
      const avgDuration = successfulTests.reduce((sum, r) => sum + r.duration, 0) / successfulTests.length;
      const avgOpsPerSec = successfulTests.reduce((sum, r) => sum + r.operationsPerSecond, 0) / successfulTests.length;
      
      report += 'Summary\n';
      report += '-------\n';
      report += `Total tests: ${this.results.length}\n`;
      report += `Successful tests: ${successfulTests.length}\n`;
      report += `Failed tests: ${this.results.length - successfulTests.length}\n`;
      report += `Average duration: ${avgDuration.toFixed(2)}ms\n`;
      report += `Average ops/sec: ${avgOpsPerSec.toFixed(2)}\n`;
    }
    
    return report;
  }
}

/**
 * Browser compatibility and performance detection
 */
export class BrowserPerformanceDetector {
  /**
   * Detect browser capabilities and performance characteristics
   */
  static detectCapabilities(): {
    canvas2d: boolean;
    localStorage: boolean;
    requestAnimationFrame: boolean;
    performance: boolean;
    memory: boolean;
    devicePixelRatio: number;
    estimatedPerformance: 'high' | 'medium' | 'low';
  } {
    const capabilities = {
      canvas2d: false,
      localStorage: false,
      requestAnimationFrame: false,
      performance: false,
      memory: false,
      devicePixelRatio: window.devicePixelRatio || 1,
      estimatedPerformance: 'medium' as 'high' | 'medium' | 'low'
    };
    
    // Test Canvas 2D support
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      capabilities.canvas2d = !!ctx;
    } catch (e) {
      capabilities.canvas2d = false;
    }
    
    // Test localStorage support
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      capabilities.localStorage = true;
    } catch (e) {
      capabilities.localStorage = false;
    }
    
    // Test requestAnimationFrame support
    capabilities.requestAnimationFrame = typeof requestAnimationFrame === 'function';
    
    // Test performance API support
    capabilities.performance = typeof performance === 'object' && typeof performance.now === 'function';
    
    // Test memory API support
    capabilities.memory = 'memory' in performance;
    
    // Estimate performance based on various factors
    let performanceScore = 0;
    
    // Browser capabilities
    if (capabilities.canvas2d) performanceScore += 2;
    if (capabilities.requestAnimationFrame) performanceScore += 1;
    if (capabilities.performance) performanceScore += 1;
    if (capabilities.memory) performanceScore += 1;
    
    // Device characteristics
    if (capabilities.devicePixelRatio <= 1) performanceScore += 1;
    else if (capabilities.devicePixelRatio > 2) performanceScore -= 1;
    
    // Screen size (larger screens may indicate more powerful devices)
    if (window.screen.width >= 1920) performanceScore += 1;
    else if (window.screen.width < 1024) performanceScore -= 1;
    
    // Hardware concurrency (number of CPU cores)
    if (navigator.hardwareConcurrency) {
      if (navigator.hardwareConcurrency >= 8) performanceScore += 2;
      else if (navigator.hardwareConcurrency >= 4) performanceScore += 1;
      else if (navigator.hardwareConcurrency <= 2) performanceScore -= 1;
    }
    
    // Determine performance level
    if (performanceScore >= 6) {
      capabilities.estimatedPerformance = 'high';
    } else if (performanceScore <= 2) {
      capabilities.estimatedPerformance = 'low';
    } else {
      capabilities.estimatedPerformance = 'medium';
    }
    
    return capabilities;
  }
  
  /**
   * Get recommended settings based on detected performance
   */
  static getRecommendedSettings(): {
    maxZones: number;
    enableAnimations: boolean;
    renderQuality: 'high' | 'medium' | 'low';
    debounceDelay: number;
  } {
    const capabilities = this.detectCapabilities();
    
    switch (capabilities.estimatedPerformance) {
      case 'high':
        return {
          maxZones: 1000,
          enableAnimations: true,
          renderQuality: 'high',
          debounceDelay: 100
        };
      
      case 'medium':
        return {
          maxZones: 500,
          enableAnimations: true,
          renderQuality: 'medium',
          debounceDelay: 200
        };
      
      case 'low':
        return {
          maxZones: 100,
          enableAnimations: false,
          renderQuality: 'low',
          debounceDelay: 500
        };
      
      default:
        return {
          maxZones: 200,
          enableAnimations: true,
          renderQuality: 'medium',
          debounceDelay: 300
        };
    }
  }
}

/**
 * Memory usage monitor
 */
export class MemoryMonitor {
  private measurements: Array<{ timestamp: number; used: number; total: number }> = [];
  private intervalId: number | null = null;
  
  /**
   * Start monitoring memory usage
   */
  start(intervalMs: number = 1000): void {
    this.stop(); // Stop any existing monitoring
    
    this.intervalId = window.setInterval(() => {
      const usage = this.getCurrentMemoryUsage();
      this.measurements.push({
        timestamp: Date.now(),
        ...usage
      });
      
      // Keep only last 100 measurements
      if (this.measurements.length > 100) {
        this.measurements.shift();
      }
    }, intervalMs);
  }
  
  /**
   * Stop monitoring memory usage
   */
  stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
  
  /**
   * Get current memory usage
   */
  private getCurrentMemoryUsage(): { used: number; total: number } {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize || 0,
        total: memory.totalJSHeapSize || 0
      };
    }
    
    return { used: 0, total: 0 };
  }
  
  /**
   * Get memory usage statistics
   */
  getStats(): {
    current: { used: number; total: number };
    peak: { used: number; total: number };
    average: { used: number; total: number };
    measurements: number;
  } {
    const current = this.getCurrentMemoryUsage();
    
    if (this.measurements.length === 0) {
      return {
        current,
        peak: current,
        average: current,
        measurements: 0
      };
    }
    
    const peak = this.measurements.reduce(
      (max, measurement) => ({
        used: Math.max(max.used, measurement.used),
        total: Math.max(max.total, measurement.total)
      }),
      { used: 0, total: 0 }
    );
    
    const average = this.measurements.reduce(
      (sum, measurement) => ({
        used: sum.used + measurement.used,
        total: sum.total + measurement.total
      }),
      { used: 0, total: 0 }
    );
    
    average.used /= this.measurements.length;
    average.total /= this.measurements.length;
    
    return {
      current,
      peak,
      average,
      measurements: this.measurements.length
    };
  }
  
  /**
   * Clear measurements
   */
  clear(): void {
    this.measurements = [];
  }
}