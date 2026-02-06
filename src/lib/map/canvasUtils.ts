import { Point, Zone, ZoneStatus } from '@/types/map/zone';

/**
 * Style configuration for rendering zones
 */
export interface ZoneStyle {
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  opacity: number;
}

/**
 * Canvas drawing context with additional properties
 */
export interface CanvasDrawingContext {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  scale: number;
  offset: Point;
}

/**
 * Gets the default style for a zone based on its status
 * @param status The zone status
 * @param isSelected Whether the zone is currently selected
 * @returns Style configuration for the zone
 */
export function getZoneStyle(status: ZoneStatus, isSelected: boolean = false): ZoneStyle {
  const baseStyles = {
    free: {
      fillColor: isSelected ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.2)', // Green
      strokeColor: isSelected ? '#16a34a' : '#22c55e',
      strokeWidth: isSelected ? 3 : 2,
      opacity: 0.8
    },
    occupied: {
      fillColor: isSelected ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)', // Red
      strokeColor: isSelected ? '#dc2626' : '#ef4444',
      strokeWidth: isSelected ? 3 : 2,
      opacity: 0.8
    }
  };
  
  return baseStyles[status];
}

/**
 * Converts mouse event coordinates to canvas coordinates
 * @param event The mouse event
 * @param canvas The canvas element
 * @returns Point in canvas coordinate system
 */
export function getCanvasCoordinates(event: MouseEvent, canvas: HTMLCanvasElement): Point {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  
  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY
  };
}

/**
 * Converts touch event coordinates to canvas coordinates
 * @param touch The touch object
 * @param canvas The canvas element
 * @returns Point in canvas coordinate system
 */
export function getTouchCanvasCoordinates(touch: Touch, canvas: HTMLCanvasElement): Point {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  
  return {
    x: (touch.clientX - rect.left) * scaleX,
    y: (touch.clientY - rect.top) * scaleY
  };
}

/**
 * Clears the entire canvas
 * @param ctx The canvas rendering context
 */
export function clearCanvas(ctx: CanvasRenderingContext2D): void {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

/**
 * Draws a polygon on the canvas
 * @param ctx The canvas rendering context
 * @param vertices Array of polygon vertices
 * @param style Style configuration for the polygon
 */
export function drawPolygon(
  ctx: CanvasRenderingContext2D, 
  vertices: Point[], 
  style: ZoneStyle
): void {
  if (vertices.length < 3) return;
  
  ctx.save();
  
  // Begin path
  ctx.beginPath();
  ctx.moveTo(vertices[0].x, vertices[0].y);
  
  // Draw lines to each vertex
  for (let i = 1; i < vertices.length; i++) {
    ctx.lineTo(vertices[i].x, vertices[i].y);
  }
  
  // Close the path
  ctx.closePath();
  
  // Apply fill
  ctx.fillStyle = style.fillColor;
  ctx.fill();
  
  // Apply stroke
  ctx.strokeStyle = style.strokeColor;
  ctx.lineWidth = style.strokeWidth;
  ctx.stroke();
  
  ctx.restore();
}

/**
 * Draws text centered within a polygon
 * @param ctx The canvas rendering context
 * @param text The text to draw
 * @param vertices Array of polygon vertices
 * @param fontSize Font size in pixels
 * @param color Text color
 */
export function drawTextInPolygon(
  ctx: CanvasRenderingContext2D,
  text: string,
  vertices: Point[],
  fontSize: number = 14,
  color: string = '#000000'
): void {
  if (vertices.length === 0 || !text.trim()) return;
  
  // Calculate centroid of the polygon
  const centroid = calculatePolygonCentroid(vertices);
  
  ctx.save();
  
  // Set text properties
  ctx.font = `${fontSize}px Arial, sans-serif`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Add text shadow for better readability
  ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
  ctx.shadowBlur = 2;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;
  
  // Draw the text
  ctx.fillText(text, centroid.x, centroid.y);
  
  ctx.restore();
}

/**
 * Calculates the centroid (center point) of a polygon
 * @param vertices Array of polygon vertices
 * @returns The centroid point
 */
export function calculatePolygonCentroid(vertices: Point[]): Point {
  if (vertices.length === 0) return { x: 0, y: 0 };
  
  let centroidX = 0;
  let centroidY = 0;
  let area = 0;
  
  for (let i = 0; i < vertices.length; i++) {
    const j = (i + 1) % vertices.length;
    const cross = vertices[i].x * vertices[j].y - vertices[j].x * vertices[i].y;
    area += cross;
    centroidX += (vertices[i].x + vertices[j].x) * cross;
    centroidY += (vertices[i].y + vertices[j].y) * cross;
  }
  
  area *= 0.5;
  
  if (Math.abs(area) < 1e-10) {
    // Fallback to simple average for degenerate cases
    const avgX = vertices.reduce((sum, v) => sum + v.x, 0) / vertices.length;
    const avgY = vertices.reduce((sum, v) => sum + v.y, 0) / vertices.length;
    return { x: avgX, y: avgY };
  }
  
  centroidX /= (6 * area);
  centroidY /= (6 * area);
  
  return { x: centroidX, y: centroidY };
}

/**
 * Draws a complete zone with styling and text
 * @param ctx The canvas rendering context
 * @param zone The zone to draw
 * @param isSelected Whether the zone is currently selected
 */
export function drawZone(
  ctx: CanvasRenderingContext2D, 
  zone: Zone, 
  isSelected: boolean = false
): void {
  const style = getZoneStyle(zone.status, isSelected);
  
  // Draw the polygon
  drawPolygon(ctx, zone.vertices, style);
  
  // Draw company name if zone is occupied
  if (zone.status === 'occupied' && zone.companyName) {
    drawTextInPolygon(ctx, zone.companyName, zone.vertices, 14, '#000000');
  }
}

/**
 * Draws vertex handles for zone editing
 * @param ctx The canvas rendering context
 * @param vertices Array of polygon vertices
 * @param handleSize Size of the vertex handles in pixels
 */
export function drawVertexHandles(
  ctx: CanvasRenderingContext2D,
  vertices: Point[],
  handleSize: number = 8
): void {
  ctx.save();
  
  ctx.fillStyle = '#3b82f6'; // Blue
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  
  vertices.forEach(vertex => {
    ctx.beginPath();
    ctx.arc(vertex.x, vertex.y, handleSize / 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  });
  
  ctx.restore();
}

/**
 * Draws a temporary polygon during creation
 * @param ctx The canvas rendering context
 * @param vertices Current vertices being created
 * @param currentPoint Current mouse position
 */
export function drawTemporaryPolygon(
  ctx: CanvasRenderingContext2D,
  vertices: Point[],
  currentPoint: Point | null = null
): void {
  if (vertices.length === 0) return;
  
  ctx.save();
  
  // Draw existing vertices
  ctx.fillStyle = '#3b82f6';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  
  vertices.forEach(vertex => {
    ctx.beginPath();
    ctx.arc(vertex.x, vertex.y, 4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  });
  
  // Draw lines between vertices
  if (vertices.length > 1) {
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    
    ctx.beginPath();
    ctx.moveTo(vertices[0].x, vertices[0].y);
    
    for (let i = 1; i < vertices.length; i++) {
      ctx.lineTo(vertices[i].x, vertices[i].y);
    }
    
    // Draw line to current mouse position if provided
    if (currentPoint) {
      ctx.lineTo(currentPoint.x, currentPoint.y);
    }
    
    ctx.stroke();
  }
  
  ctx.restore();
}

/**
 * Sets up canvas for high-DPI displays
 * @param canvas The canvas element
 * @param ctx The canvas rendering context
 * @param width Desired width in CSS pixels
 * @param height Desired height in CSS pixels
 */
export function setupHighDPICanvas(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void {
  const devicePixelRatio = window.devicePixelRatio || 1;
  
  // Set the actual size in memory (scaled up for high-DPI)
  canvas.width = width * devicePixelRatio;
  canvas.height = height * devicePixelRatio;
  
  // Scale the canvas back down using CSS
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  
  // Scale the drawing context so everything draws at the correct size
  ctx.scale(devicePixelRatio, devicePixelRatio);
}

/**
 * Checks if a point is near a vertex (for editing interactions)
 * @param point The point to check
 * @param vertex The vertex to check against
 * @param threshold Distance threshold in pixels
 * @returns true if the point is near the vertex
 */
export function isPointNearVertex(point: Point, vertex: Point, threshold: number = 10): boolean {
  const dx = point.x - vertex.x;
  const dy = point.y - vertex.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance <= threshold;
}

/**
 * Finds the nearest vertex to a given point
 * @param point The point to check
 * @param vertices Array of vertices to search
 * @param threshold Maximum distance threshold
 * @returns Index of the nearest vertex, or -1 if none found within threshold
 */
export function findNearestVertex(point: Point, vertices: Point[], threshold: number = 10): number {
  let nearestIndex = -1;
  let nearestDistance = threshold;
  
  vertices.forEach((vertex, index) => {
    const dx = point.x - vertex.x;
    const dy = point.y - vertex.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = index;
    }
  });
  
  return nearestIndex;
}