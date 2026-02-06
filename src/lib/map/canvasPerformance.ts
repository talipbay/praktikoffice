import { Point, Zone } from '@/types/map/zone';

/**
 * Canvas rendering optimization utilities
 */

/**
 * Dirty region tracking for efficient canvas updates
 */
export interface DirtyRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Canvas render manager for optimized drawing operations
 */
export class CanvasRenderManager {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private dirtyRegions: DirtyRegion[] = [];
  private lastRenderTime = 0;
  private renderRequestId: number | null = null;
  private isRenderScheduled = false;
  
  // Performance tracking
  private frameCount = 0;
  private lastFpsTime = 0;
  private currentFps = 0;
  
  /**
   * Initialize the render manager with a canvas
   */
  initialize(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    if (!this.ctx) {
      throw new Error('Failed to get 2D rendering context');
    }
    
    // Enable image smoothing for better quality
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
  }
  
  /**
   * Mark a region as dirty for redrawing
   */
  markDirty(region: DirtyRegion): void {
    // Expand region slightly to avoid edge artifacts
    const expandedRegion: DirtyRegion = {
      x: Math.max(0, region.x - 2),
      y: Math.max(0, region.y - 2),
      width: region.width + 4,
      height: region.height + 4
    };
    
    this.dirtyRegions.push(expandedRegion);
    this.scheduleRender();
  }
  
  /**
   * Mark the entire canvas as dirty
   */
  markAllDirty(): void {
    if (!this.canvas) return;
    
    this.dirtyRegions = [{
      x: 0,
      y: 0,
      width: this.canvas.width,
      height: this.canvas.height
    }];
    this.scheduleRender();
  }
  
  /**
   * Schedule a render operation using requestAnimationFrame
   */
  private scheduleRender(): void {
    if (this.isRenderScheduled) return;
    
    this.isRenderScheduled = true;
    this.renderRequestId = requestAnimationFrame(() => {
      this.performRender();
      this.isRenderScheduled = false;
    });
  }
  
  /**
   * Perform the actual rendering operation
   */
  private performRender(): void {
    if (!this.ctx || !this.canvas || this.dirtyRegions.length === 0) return;
    
    const startTime = performance.now();
    
    // Merge overlapping dirty regions for efficiency
    const mergedRegions = this.mergeDirtyRegions();
    
    // Clear and redraw only dirty regions
    mergedRegions.forEach(region => {
      this.ctx!.clearRect(region.x, region.y, region.width, region.height);
    });
    
    // Trigger custom render callback if set
    if (this.onRender) {
      this.onRender(mergedRegions);
    }
    
    // Clear dirty regions
    this.dirtyRegions = [];
    
    // Update performance metrics
    this.updatePerformanceMetrics(startTime);
  }
  
  /**
   * Merge overlapping dirty regions to reduce draw calls
   */
  private mergeDirtyRegions(): DirtyRegion[] {
    if (this.dirtyRegions.length <= 1) return [...this.dirtyRegions];
    
    const merged: DirtyRegion[] = [];
    const sorted = [...this.dirtyRegions].sort((a, b) => a.x - b.x);
    
    let current = sorted[0];
    
    for (let i = 1; i < sorted.length; i++) {
      const next = sorted[i];
      
      // Check if regions overlap or are adjacent
      if (this.regionsOverlap(current, next)) {
        // Merge regions
        current = this.mergeRegions(current, next);
      } else {
        merged.push(current);
        current = next;
      }
    }
    
    merged.push(current);
    return merged;
  }
  
  /**
   * Check if two regions overlap or are adjacent
   */
  private regionsOverlap(a: DirtyRegion, b: DirtyRegion): boolean {
    return !(a.x + a.width < b.x || 
             b.x + b.width < a.x || 
             a.y + a.height < b.y || 
             b.y + b.height < a.y);
  }
  
  /**
   * Merge two regions into one
   */
  private mergeRegions(a: DirtyRegion, b: DirtyRegion): DirtyRegion {
    const minX = Math.min(a.x, b.x);
    const minY = Math.min(a.y, b.y);
    const maxX = Math.max(a.x + a.width, b.x + b.width);
    const maxY = Math.max(a.y + a.height, b.y + b.height);
    
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }
  
  /**
   * Update performance metrics
   */
  private updatePerformanceMetrics(startTime: number): void {
    const endTime = performance.now();
    this.lastRenderTime = endTime - startTime;
    
    this.frameCount++;
    
    if (endTime - this.lastFpsTime >= 1000) {
      this.currentFps = this.frameCount;
      this.frameCount = 0;
      this.lastFpsTime = endTime;
    }
  }
  
  /**
   * Get current performance metrics
   */
  getPerformanceMetrics(): { fps: number; lastRenderTime: number } {
    return {
      fps: this.currentFps,
      lastRenderTime: this.lastRenderTime
    };
  }
  
  /**
   * Calculate dirty region for a zone
   */
  static getZoneDirtyRegion(zone: Zone, padding: number = 10): DirtyRegion {
    if (zone.vertices.length === 0) {
      return { x: 0, y: 0, width: 0, height: 0 };
    }
    
    let minX = zone.vertices[0].x;
    let minY = zone.vertices[0].y;
    let maxX = zone.vertices[0].x;
    let maxY = zone.vertices[0].y;
    
    for (const vertex of zone.vertices) {
      minX = Math.min(minX, vertex.x);
      minY = Math.min(minY, vertex.y);
      maxX = Math.max(maxX, vertex.x);
      maxY = Math.max(maxY, vertex.y);
    }
    
    return {
      x: minX - padding,
      y: minY - padding,
      width: (maxX - minX) + (padding * 2),
      height: (maxY - minY) + (padding * 2)
    };
  }
  
  /**
   * Calculate dirty region for multiple zones
   */
  static getMultiZoneDirtyRegion(zones: Zone[], padding: number = 10): DirtyRegion {
    if (zones.length === 0) {
      return { x: 0, y: 0, width: 0, height: 0 };
    }
    
    const regions = zones.map(zone => this.getZoneDirtyRegion(zone, padding));
    
    let minX = regions[0].x;
    let minY = regions[0].y;
    let maxX = regions[0].x + regions[0].width;
    let maxY = regions[0].y + regions[0].height;
    
    for (const region of regions) {
      minX = Math.min(minX, region.x);
      minY = Math.min(minY, region.y);
      maxX = Math.max(maxX, region.x + region.width);
      maxY = Math.max(maxY, region.y + region.height);
    }
    
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }
  
  /**
   * Cleanup resources
   */
  cleanup(): void {
    if (this.renderRequestId) {
      cancelAnimationFrame(this.renderRequestId);
      this.renderRequestId = null;
    }
    
    this.canvas = null;
    this.ctx = null;
    this.dirtyRegions = [];
    this.isRenderScheduled = false;
  }
  
  // Callback for custom rendering logic
  onRender: ((dirtyRegions: DirtyRegion[]) => void) | null = null;
}

/**
 * Debounced function utility for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

/**
 * Throttled function utility for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCallTime = 0;
  let timeoutId: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    
    if (now - lastCallTime >= delay) {
      lastCallTime = now;
      func(...args);
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastCallTime = Date.now();
        func(...args);
        timeoutId = null;
      }, delay - (now - lastCallTime));
    }
  };
}

/**
 * Memory-efficient object pool for reducing garbage collection
 */
export class ObjectPool<T> {
  private pool: T[] = [];
  private createFn: () => T;
  private resetFn: (obj: T) => void;
  
  constructor(createFn: () => T, resetFn: (obj: T) => void, initialSize: number = 10) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    
    // Pre-populate pool
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(createFn());
    }
  }
  
  /**
   * Get an object from the pool
   */
  get(): T {
    if (this.pool.length > 0) {
      return this.pool.pop()!;
    }
    return this.createFn();
  }
  
  /**
   * Return an object to the pool
   */
  release(obj: T): void {
    this.resetFn(obj);
    this.pool.push(obj);
  }
  
  /**
   * Get current pool size
   */
  size(): number {
    return this.pool.length;
  }
}