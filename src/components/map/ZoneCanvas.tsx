'use client';

import React, { useRef, useEffect, useState, useCallback, useImperativeHandle, useMemo } from 'react';
import { Stage, Layer, Image as KonvaImage, Circle, Line, Shape, Text } from 'react-konva';
import { Point, Zone } from '@/types/map/zone';
import { getZoneStyle, calculatePolygonCentroid } from '@/lib/map/canvasUtils';
import { isPointInPolygon, validatePolygon, findZoneAtPoint } from '@/lib/map/zoneUtils';
import { CanvasRenderManager, debounce, throttle } from '@/lib/map/canvasPerformance';
import { config } from '@/lib/map/config';

/**
 * Props for the ZoneCanvas component
 */
export interface ZoneCanvasProps {
  /** URL of the floor plan image */
  floorPlanUrl: string;
  /** Array of zones to display */
  zones: Zone[];
  /** Currently selected zone */
  selectedZone: Zone | null;
  /** Callback when a new zone is created */
  onZoneCreate: (vertices: Point[]) => void;
  /** Callback when a zone is clicked */
  onZoneClick: (zone: Zone) => void;
  /** Callback when a zone is right-clicked */
  onZoneRightClick: (zone: Zone, point: Point) => void;
  /** Callback when canvas is clicked (not on a zone) */
  onCanvasClick: (point: Point) => void;
  /** Callback when a zone is updated during editing */
  onZoneUpdate?: (zoneId: string, updates: { vertices: Point[] }) => void;
  /** Callback to start editing a zone */
  onStartEdit?: (zoneId: string) => void;
  /** Callback when a zone should be deleted */
  onZoneDelete?: (zone: Zone) => void;
  /** Canvas width */
  width?: number;
  /** Canvas height */
  height?: number;
  /** Whether edit mode is enabled */
  isEditModeEnabled?: boolean;
}

/**
 * Context menu item interface
 */
export interface ContextMenuItem {
  label: string;
  action: () => void;
  icon?: string;
}

/**
 * Exposed methods for controlling the canvas
 */
export interface ZoneCanvasRef {
  startEditingZone: (zoneId: string) => void;
  cancelZoneEditing: () => void;
  saveZoneEdits: () => void;
  isEditingZone: boolean;
}

/**
 * Interactive canvas component for zone management
 * Handles floor plan rendering, zone drawing, and user interactions
 */
export const ZoneCanvas = React.forwardRef<ZoneCanvasRef, ZoneCanvasProps>(({
  floorPlanUrl,
  zones,
  selectedZone,
  onZoneCreate,
  onZoneClick,
  onZoneRightClick,
  onCanvasClick,
  onZoneUpdate,
  onStartEdit,
  onZoneDelete,
  width = 800,
  height = 600,
  isEditModeEnabled = false
}, ref) => {
  // Ensure valid dimensions
  const safeWidth = Math.max(width || 800, 100);
  const safeHeight = Math.max(height || 600, 100);
  // Original image dimensions (1920x1080)
  const ORIGINAL_WIDTH = 1920;
  const ORIGINAL_HEIGHT = 1080;
  
  // Calculate scale factors for coordinate transformation
  const scaleX = safeWidth / ORIGINAL_WIDTH;
  const scaleY = safeHeight / ORIGINAL_HEIGHT;
  
  /**
   * Convert canvas coordinates to original image coordinates
   */
  const canvasToOriginal = useCallback((point: Point): Point => {
    try {
      return {
        x: point.x / scaleX,
        y: point.y / scaleY
      };
    } catch (error) {
      console.error('Error in canvasToOriginal:', error);
      return point;
    }
  }, [scaleX, scaleY]);
  
  /**
   * Convert original image coordinates to canvas coordinates
   */
  const originalToCanvas = useCallback((point: Point): Point => {
    try {
      return {
        x: point.x * scaleX,
        y: point.y * scaleY
      };
    } catch (error) {
      console.error('Error in originalToCanvas:', error);
      return point;
    }
  }, [scaleX, scaleY]);
  
  /**
   * Convert array of original coordinates to canvas coordinates
   */
  const originalVerticestoCanvas = useCallback((vertices: Point[]): Point[] => {
    try {
      return vertices.map(originalToCanvas);
    } catch (error) {
      console.error('Error in originalVerticestoCanvas:', error);
      return vertices;
    }
  }, [originalToCanvas]);

  /**
   * Find the nearest vertex to a point within a threshold
   */
  const findNearestVertexIndex = useCallback((point: Point, vertices: Point[], threshold: number = 15): number => {
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
  }, []);

  /**
   * Find zone at a specific point (memoized for performance)
   */
  const findZoneAtPointMemo = useCallback((point: Point, zones: Zone[]): Zone | null => {
    return findZoneAtPoint(point, zones);
  }, []);
  const stageRef = useRef<any>(null);
  const renderManagerRef = useRef<CanvasRenderManager | null>(null);
  const [floorPlanImage, setFloorPlanImage] = useState<HTMLImageElement | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  
  // Performance tracking
  const [renderStats, setRenderStats] = useState({ fps: 0, lastRenderTime: 0 });
  
  // Zone creation state
  const [isCreatingZone, setIsCreatingZone] = useState(false);
  const [currentVertices, setCurrentVertices] = useState<Point[]>([]);
  const [mousePosition, setMousePosition] = useState<Point | null>(null);
  
  // Zone editing state
  const [isEditingZone, setIsEditingZone] = useState(false);
  const [editingZoneId, setEditingZoneId] = useState<string | null>(null);
  const [isDraggingVertex, setIsDraggingVertex] = useState(false);
  const [draggingVertexIndex, setDraggingVertexIndex] = useState<number>(-1);
  const [editingVertices, setEditingVertices] = useState<Point[]>([]);
  const [dragStartPosition, setDragStartPosition] = useState<Point | null>(null);
  const [isLongPressActive, setIsLongPressActive] = useState(false);
  const [cursorStyle, setCursorStyle] = useState('default');
  


  /**
   * Load the floor plan image
   */
  useEffect(() => {
    if (!floorPlanUrl) return;

    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      setFloorPlanImage(img);
      setImageLoaded(true);
      setImageError(null);
    };
    
    img.onerror = () => {
      console.error('Failed to load floor plan image from:', floorPlanUrl);
      setImageError(`Failed to load floor plan image from: ${floorPlanUrl}`);
      setImageLoaded(false);
    };
    
    img.src = floorPlanUrl;
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [floorPlanUrl]);

  // Touch event handling state
  const [touchStartTime, setTouchStartTime] = useState<number>(0);
  const [touchStartPosition, setTouchStartPosition] = useState<Point | null>(null);
  const [isLongPress, setIsLongPress] = useState(false);

  /**
   * Handle canvas click/tap events
   */
  const handleStageClick = useCallback((e: any) => {
    // Ignore if this was a long press or vertex dragging
    if (isLongPress || isDraggingVertex || isLongPressActive) {
      setIsLongPress(false);
      return;
    }

    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();
    
    if (!pointerPosition) return;

    const canvasPoint: Point = {
      x: pointerPosition.x,
      y: pointerPosition.y
    };
    
    // Convert to original image coordinates for storage
    const originalPoint = canvasToOriginal(canvasPoint);

    // If we're editing a zone and edit mode is enabled and vertex editing is allowed, check for vertex clicks first (use canvas coordinates for UI)
    if (config.features.vertexEditing && isEditingZone && editingZoneId && isEditModeEnabled) {
      // Convert editing vertices to canvas coordinates for hit testing
      const canvasEditingVertices = originalVerticestoCanvas(editingVertices);
      const vertexIndex = findNearestVertexIndex(canvasPoint, canvasEditingVertices);
      if (vertexIndex !== -1) {
        // Start dragging this vertex
        setIsDraggingVertex(true);
        setDraggingVertexIndex(vertexIndex);
        return;
      }
    }

    // Check if we clicked on a zone (use canvas coordinates for hit testing)
    const clickedZone = findZoneAtPointMemo(canvasPoint, zones.map(zone => ({
      ...zone,
      vertices: originalVerticestoCanvas(zone.vertices)
    })));
    
    if (clickedZone) {
      onZoneClick(clickedZone);
      return;
    }

    // If we're creating a zone, add vertex (store in original coordinates)
    if (isCreatingZone) {
      const newVertices = [...currentVertices, originalPoint];
      
      // Check if we should complete the polygon (need at least 3 points)
      if (newVertices.length >= 3) {
        // Check if we clicked near the first vertex to close the polygon (use canvas coordinates for distance)
        const firstVertexCanvas = originalToCanvas(newVertices[0]);
        const distance = Math.sqrt(
          Math.pow(canvasPoint.x - firstVertexCanvas.x, 2) + Math.pow(canvasPoint.y - firstVertexCanvas.y, 2)
        );
        
        if (distance < 25) { // Increased threshold for easier completion
          // Complete the zone with current vertices (in original coordinates)
          onZoneCreate(currentVertices);
          setIsCreatingZone(false);
          setCurrentVertices([]);
          setMousePosition(null);
          return;
        }
      }
      
      // Check maximum vertices (6 as per requirements)
      if (newVertices.length >= 6) {
        // Auto-complete the zone (in original coordinates)
        onZoneCreate(newVertices);
        setIsCreatingZone(false);
        setCurrentVertices([]);
        setMousePosition(null);
        return;
      }
      
      setCurrentVertices(newVertices);
      
    } else if (!isEditingZone && !isEditModeEnabled && config.features.zoneCreation) {
      // Start creating a new zone only if not in edit mode, edit mode is disabled, and zone creation is enabled (store in original coordinates)
      setIsCreatingZone(true);
      setCurrentVertices([originalPoint]);
    }

    onCanvasClick(originalPoint);
  }, [zones, isCreatingZone, isEditingZone, editingZoneId, editingVertices, onZoneClick, onCanvasClick, isLongPress, isDraggingVertex, isLongPressActive, currentVertices, onZoneCreate, setMousePosition, isEditModeEnabled]);

  /**
   * Handle right-click events and long press (touch)
   */
  const handleStageRightClick = useCallback((e: any) => {
    e.evt.preventDefault();
    
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();
    
    if (!pointerPosition) return;

    const point: Point = {
      x: pointerPosition.x,
      y: pointerPosition.y
    };

    const clickedZone = findZoneAtPointMemo(point, zones);
    
    if (clickedZone) {
      onZoneRightClick(clickedZone, point);
    }
  }, [zones, onZoneRightClick]);

  /**
   * Handle mouse/touch down for vertex dragging
   */
  const handlePointerDown = useCallback((e: any) => {
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();
    
    if (!pointerPosition) return;

    const canvasPoint: Point = {
      x: pointerPosition.x,
      y: pointerPosition.y
    };
    
    const originalPoint = canvasToOriginal(canvasPoint);

    // Check if we clicked on a vertex of the selected zone for editing (only if edit mode is enabled and vertex editing is allowed)
    if (config.features.vertexEditing && isEditModeEnabled && selectedZone) {
      const canvasVertices = originalVerticestoCanvas(selectedZone.vertices);
      const vertexIndex = findNearestVertexIndex(canvasPoint, canvasVertices, 20); // 20px threshold
      
      if (vertexIndex !== -1) {
        // Start vertex dragging
        setIsEditingZone(true);
        setEditingZoneId(selectedZone.id);
        setEditingVertices([...selectedZone.vertices]);
        setIsDraggingVertex(true);
        setDraggingVertexIndex(vertexIndex);
        setDragStartPosition(originalPoint);
        setIsLongPressActive(true);
        
        // Prevent default click behavior
        e.evt.preventDefault();
        return;
      }
    }

    // If not on a vertex, handle normal touch/click
    setTouchStartTime(Date.now());
    setTouchStartPosition(canvasPoint);
    setIsLongPress(false);
    
    // Set up long press timer for context menu
    setTimeout(() => {
      const currentTime = Date.now();
      if (currentTime - touchStartTime >= 500 && !isDraggingVertex) { // 500ms for long press
        setIsLongPress(true);
        
        // Trigger right-click behavior for long press
        const clickedZone = findZoneAtPointMemo(canvasPoint, zones.map(zone => ({
          ...zone,
          vertices: originalVerticestoCanvas(zone.vertices)
        })));
        if (clickedZone) {
          onZoneRightClick(clickedZone, canvasPoint);
        }
      }
    }, 500);
  }, [touchStartTime, zones, onZoneRightClick, canvasToOriginal, originalVerticestoCanvas, findNearestVertexIndex, isDraggingVertex]);

  /**
   * Handle pointer up - save changes automatically
   */
  const handlePointerUp = useCallback(() => {
    try {
      setTouchStartTime(0);
      setTouchStartPosition(null);
      setIsLongPressActive(false);
      
      // Auto-save vertex changes when dragging ends
      if (isDraggingVertex && editingZoneId && onZoneUpdate) {
        try {
          // Validate the edited polygon
          const validation = validatePolygon(editingVertices);
          
          if (validation.isValid) {
            // Save the changes automatically
            onZoneUpdate(editingZoneId, { vertices: editingVertices });
            console.log('Auto-saved zone changes');
          } else {
            console.warn('Invalid polygon, changes not saved:', validation.error);
          }
        } catch (error) {
          console.error('Error validating or saving polygon:', error);
        }
        
        // Exit edit mode
        setIsEditingZone(false);
        setEditingZoneId(null);
        setEditingVertices([]);
        setIsDraggingVertex(false);
        setDraggingVertexIndex(-1);
        setDragStartPosition(null);
      }
    } catch (error) {
      console.error('Error in handlePointerUp:', error);
    }
  }, [isDraggingVertex, editingZoneId, editingVertices, onZoneUpdate]);

  /**
   * Handle mouse up to stop vertex dragging and auto-save
   */
  const handleStageMouseUp = useCallback(() => {
    handlePointerUp();
  }, [handlePointerUp]);

  /**
   * Handle mouse move for visual feedback during zone creation and vertex dragging (throttled)
   */
  const handleStageMouseMove = useCallback(throttle((e: any) => {
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();
    
    if (!pointerPosition) return;

    const canvasPoint: Point = {
      x: pointerPosition.x,
      y: pointerPosition.y
    };
    
    const originalPoint = canvasToOriginal(canvasPoint);

    // Update cursor based on state
    if (isDraggingVertex) {
      setCursorStyle('grabbing');
    } else if (isCreatingZone) {
      setCursorStyle('crosshair');
    } else if (isEditingZone && editingVertices.length > 0) {
      // Check if hovering over a vertex
      const canvasVertices = originalVerticestoCanvas(editingVertices);
      const nearestIndex = findNearestVertexIndex(canvasPoint, canvasVertices, 15);
      setCursorStyle(nearestIndex !== -1 ? 'grab' : 'default');
    } else {
      // Check if hovering over a zone
      const hoveredZone = findZoneAtPointMemo(originalPoint, zones);
      setCursorStyle(hoveredZone ? 'pointer' : 'default');
    }

    // Handle vertex dragging (store in original coordinates)
    if (isDraggingVertex && draggingVertexIndex !== -1 && isLongPressActive) {
      const newVertices = [...editingVertices];
      newVertices[draggingVertexIndex] = originalPoint;
      
      // Validate the new polygon shape in real-time
      const validation = validatePolygon(newVertices);
      
      // Always update for visual feedback, even if invalid (we'll validate on save)
      setEditingVertices(newVertices);
      return;
    }

    // Handle zone creation feedback (store in original coordinates)
    if (isCreatingZone) {
      setMousePosition(originalPoint);
    }
  }, 16), [isCreatingZone, isDraggingVertex, draggingVertexIndex, editingVertices, isLongPressActive, canvasToOriginal, isEditingZone, originalVerticestoCanvas, findNearestVertexIndex, findZoneAtPointMemo, zones]); // 16ms = ~60fps







  /**
   * Start editing a zone
   */
  const startEditingZone = useCallback((zoneIdOrZone: string | Zone) => {
    if (!config.features.vertexEditing) {
      console.warn('Cannot start editing: vertex editing is disabled');
      return;
    }
    
    if (!isEditModeEnabled) {
      console.warn('Cannot start editing: edit mode is disabled');
      return;
    }
    
    const zone = typeof zoneIdOrZone === 'string' 
      ? zones.find(z => z.id === zoneIdOrZone)
      : zoneIdOrZone;
      
    if (!zone) {
      console.error('Zone not found for editing');
      return;
    }
    
    // Only allow editing of the selected zone
    if (!selectedZone || zone.id !== selectedZone.id) {
      console.warn('Cannot edit zone: only the selected zone can be edited');
      return;
    }
    
    setIsEditingZone(true);
    setEditingZoneId(zone.id);
    setEditingVertices([...zone.vertices]); // Create a copy
    setIsCreatingZone(false); // Cancel any zone creation
    setCurrentVertices([]);
  }, [zones, isEditModeEnabled, selectedZone]);

  /**
   * Cancel zone editing
   */
  const cancelZoneEditing = useCallback(() => {
    setIsEditingZone(false);
    setEditingZoneId(null);
    setEditingVertices([]);
    setIsDraggingVertex(false);
    setDraggingVertexIndex(-1);
  }, []);

  /**
   * Save zone edits (now handled automatically on pointer up)
   */
  const saveZoneEdits = useCallback(() => {
    // This is now handled automatically in handlePointerUp
    console.log('Zone edits are now saved automatically on drag release');
  }, []);

  /**
   * Expose methods to parent component
   */
  useImperativeHandle(ref, () => ({
    startEditingZone: (zoneId: string) => startEditingZone(zoneId),
    cancelZoneEditing,
    saveZoneEdits,
    isEditingZone
  }), [startEditingZone, cancelZoneEditing, saveZoneEdits, isEditingZone]);

  /**
   * Cancel zone creation
   */
  const cancelZoneCreation = useCallback(() => {
    setIsCreatingZone(false);
    setCurrentVertices([]);
    setMousePosition(null);
  }, []);

  /**
   * Render temporary polygon during creation
   */
  const renderTemporaryPolygon = useCallback(() => {
    if (currentVertices.length < 1) return null;

    // Convert vertices to canvas coordinates for rendering
    const canvasVertices = originalVerticestoCanvas(currentVertices);
    const points: number[] = [];
    
    // Add existing vertices
    canvasVertices.forEach(vertex => {
      points.push(vertex.x, vertex.y);
    });
    
    // Only add mouse position as a line from last vertex if we have at least one vertex
    if (mousePosition && currentVertices.length >= 1) {
      // Convert mouse position to canvas coordinates
      const canvasMousePosition = originalToCanvas(mousePosition);
      const lastCanvasVertex = canvasVertices[canvasVertices.length - 1];
      return (
        <Line
          points={[lastCanvasVertex.x, lastCanvasVertex.y, canvasMousePosition.x, canvasMousePosition.y]}
          stroke="#3b82f6"
          strokeWidth={2}
          dash={[5, 5]}
          listening={false}
        />
      );
    }

    // If we have multiple vertices, draw the polygon outline
    if (currentVertices.length >= 2) {
      return (
        <Line
          points={points}
          stroke="#3b82f6"
          strokeWidth={2}
          dash={[5, 5]}
          listening={false}
        />
      );
    }

    return null;
  }, [currentVertices, mousePosition, originalVerticestoCanvas, originalToCanvas]);

  /**
   * Render vertex handles for zone creation
   */
  const renderVertexHandles = useCallback(() => {
    // Convert vertices to canvas coordinates for rendering
    const canvasVertices = originalVerticestoCanvas(currentVertices);
    return canvasVertices.map((vertex, index) => (
      <Circle
        key={`vertex-${index}`}
        x={vertex.x}
        y={vertex.y}
        radius={6}
        fill={index === 0 ? "#22c55e" : "#3b82f6"} // First vertex is green
        stroke="#ffffff"
        strokeWidth={2}
        listening={false}
      />
    ));
  }, [currentVertices, originalVerticestoCanvas]);

  /**
   * Render completion hint circle around first vertex
   */
  const renderCompletionHint = useCallback(() => {
    if (currentVertices.length < 3) return null;
    
    // Convert first vertex to canvas coordinates
    const firstCanvasVertex = originalToCanvas(currentVertices[0]);
    
    return (
      <Circle
        x={firstCanvasVertex.x}
        y={firstCanvasVertex.y}
        radius={25}
        stroke="#22c55e"
        strokeWidth={2}
        dash={[3, 3]}
        listening={false}
      />
    );
  }, [currentVertices, originalToCanvas]);

  /**
   * Memoized zone rendering for performance optimization
   */
  const memoizedZones = useMemo(() => {
    return zones.map((zone) => ({
      zone,
      isSelected: selectedZone?.id === zone.id,
      isBeingEdited: isEditingZone && editingZoneId === zone.id
    }));
  }, [zones, selectedZone, isEditingZone, editingZoneId]);

  /**
   * Render existing zones with status-based styling
   */
  const renderZones = useCallback(() => {
    return memoizedZones.map(({ zone, isSelected, isBeingEdited }) => {
      const style = getZoneStyle(zone.status, isSelected);
      
      // Use editing vertices if this zone is being edited, otherwise use original vertices
      const originalVertices = isBeingEdited ? editingVertices : zone.vertices;
      
      // Convert to canvas coordinates for rendering
      const vertices = originalVerticestoCanvas(originalVertices);
      
      // Create points array for Konva Line component
      const points: number[] = [];
      vertices.forEach(vertex => {
        points.push(vertex.x, vertex.y);
      });
      
      // Calculate centroid for text positioning (use canvas coordinates)
      const centroid = calculatePolygonCentroid(vertices);
      
      return (
        <React.Fragment key={zone.id}>
          {/* Zone polygon */}
          <Shape
            sceneFunc={(context, shape) => {
              const ctx = context._context;
              
              // Draw the polygon
              ctx.beginPath();
              ctx.moveTo(vertices[0].x, vertices[0].y);
              
              for (let i = 1; i < vertices.length; i++) {
                ctx.lineTo(vertices[i].x, vertices[i].y);
              }
              
              ctx.closePath();
              
              // Apply fill
              ctx.fillStyle = style.fillColor;
              ctx.fill();
              
              // Apply stroke
              ctx.strokeStyle = style.strokeColor;
              ctx.lineWidth = style.strokeWidth;
              ctx.stroke();
              
              // Call fillStrokeShape to ensure proper rendering
              context.fillStrokeShape(shape);
            }}
            listening={!isBeingEdited} // Disable zone clicking when editing
            onClick={() => !isBeingEdited && onZoneClick(zone)}
            onContextMenu={(e) => {
              if (!isBeingEdited) {
                e.evt.preventDefault();
                const stage = e.target.getStage();
                if (stage) {
                  const pointerPosition = stage.getPointerPosition();
                  if (pointerPosition) {
                    onZoneRightClick(zone, { x: pointerPosition.x, y: pointerPosition.y });
                  }
                }
              }
            }}
          />
          
          {/* Company name text for occupied zones */}
          {zone.status === 'occupied' && zone.companyName && (
            <Text
              x={centroid.x}
              y={centroid.y}
              text={zone.companyName}
              fontSize={16}
              fontFamily="Arial, sans-serif"
              fontStyle="bold"
              fill="#1f2937"
              align="center"
              verticalAlign="middle"
              offsetX={zone.companyName.length * 4} // Approximate text width offset for larger font
              offsetY={8} // Half of font size for vertical centering
              shadowColor="rgba(255, 255, 255, 0.9)"
              shadowBlur={4}
              shadowOffsetX={0}
              shadowOffsetY={0}
              stroke="#ffffff"
              strokeWidth={3}
              listening={false}
            />
          )}
          
          {/* Selection highlight */}
          {isSelected && !isBeingEdited && (
            <>
              <Line
                points={[...points, vertices[0].x, vertices[0].y]} // Close the polygon
                stroke="#3b82f6"
                strokeWidth={3}
                dash={[8, 4]}
                listening={false}
              />
              
              {/* Show draggable vertices for selected zones only when edit mode is enabled and vertex editing is allowed */}
              {config.features.vertexEditing && isEditModeEnabled && vertices.map((vertex, index) => (
                <Circle
                  key={`vertex-handle-${index}`}
                  x={vertex.x}
                  y={vertex.y}
                  radius={6}
                  fill="#3b82f6"
                  stroke="#ffffff"
                  strokeWidth={2}
                  listening={false}
                  opacity={0.8}
                />
              ))}
            </>
          )}
          
          {/* Edit mode highlight and vertex handles */}
          {isBeingEdited && (
            <>
              {/* Edit mode highlight */}
              <Line
                points={[...points, vertices[0].x, vertices[0].y]} // Close the polygon
                stroke="#f59e0b"
                strokeWidth={3}
                dash={[6, 3]}
                listening={false}
              />
              
              {/* Vertex handles */}
              {vertices.map((vertex, index) => (
                <Circle
                  key={`edit-vertex-${index}`}
                  x={vertex.x}
                  y={vertex.y}
                  radius={isDraggingVertex && draggingVertexIndex === index ? 12 : 10}
                  fill={isDraggingVertex && draggingVertexIndex === index ? "#f59e0b" : "#3b82f6"}
                  stroke="#ffffff"
                  strokeWidth={3}
                  listening={false} // We handle dragging at stage level
                  shadowColor="rgba(0, 0, 0, 0.3)"
                  shadowBlur={4}
                  shadowOffsetX={1}
                  shadowOffsetY={1}
                />
              ))}
            </>
          )}
        </React.Fragment>
      );
    });
  }, [memoizedZones, editingVertices, draggingVertexIndex, onZoneClick, onZoneRightClick, originalVerticestoCanvas, isEditModeEnabled]);

  /**
   * Effect to cancel editing when edit mode is disabled
   */
  useEffect(() => {
    if (!isEditModeEnabled && isEditingZone) {
      cancelZoneEditing();
    }
  }, [isEditModeEnabled, isEditingZone, cancelZoneEditing]);

  /**
   * Performance monitoring effect
   */
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const updateStats = () => {
        if (renderManagerRef.current) {
          const stats = renderManagerRef.current.getPerformanceMetrics();
          setRenderStats(stats);
        }
      };
      
      const interval = setInterval(updateStats, 1000); // Update every second
      return () => clearInterval(interval);
    }
  }, []);

  /**
   * Handle keyboard events for zone creation, editing, and navigation
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if the canvas container or stage has focus
      const canvasContainer = stageRef.current?.getStage()?.container();
      const isCanvasFocused = document.activeElement === canvasContainer || 
                             document.activeElement?.closest('.canvas-container');
      
      // Debug logging
      if (['Delete', 'Backspace', 'e', ' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        console.log('Key pressed:', e.key, {
          isCanvasFocused,
          selectedZone: selectedZone?.id,
          activeElement: document.activeElement?.tagName,
          isCreatingZone,
          isEditingZone
        });
      }
      
      // Handle keyboard events if canvas is focused OR if we have a selected zone (for global shortcuts)
      if (!isCanvasFocused && !isCreatingZone && !isEditingZone && !selectedZone) {
        return;
      }
      
      // Don't handle if user is typing in an input field
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      // Prevent default behavior for our handled keys
      const handledKeys = ['Escape', 'Enter', 'Delete', 'Backspace', 'Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'e', ' '];
      
      if (handledKeys.includes(e.key)) {
        // Only prevent default if we're in an active mode or handling navigation
        if (isCreatingZone || isEditingZone || (selectedZone && ['Delete', 'Backspace', 'e', ' '].includes(e.key)) || ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
          e.preventDefault();
        }
      }

      // Zone creation and editing controls
      if (e.key === 'Escape') {
        if (isCreatingZone) {
          cancelZoneCreation();
        } else if (isEditingZone) {
          cancelZoneEditing();
        }
      } else if (e.key === 'Enter') {
        if (isEditingZone) {
          saveZoneEdits();
        }
      }
      
      // Zone deletion shortcuts (only if deletion is enabled)
      else if (config.features.zoneDeletion && (e.key === 'Delete' || e.key === 'Backspace') && selectedZone && !isCreatingZone && !isEditingZone) {
        if (onZoneDelete) {
          // Show confirmation and delete zone
          const confirmed = window.confirm(`Are you sure you want to delete this zone${selectedZone.companyName ? ` occupied by ${selectedZone.companyName}` : ''}?`);
          if (confirmed) {
            onZoneDelete(selectedZone);
          }
        } else {
          // Fallback to right-click behavior
          onZoneRightClick(selectedZone, { x: 0, y: 0 });
        }
      }
      
      // Zone navigation shortcuts
      else if (zones.length > 0 && !isCreatingZone && !isEditingZone) {
        const currentIndex = selectedZone ? zones.findIndex(z => z.id === selectedZone.id) : -1;
        
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          // Select next zone
          const nextIndex = currentIndex < zones.length - 1 ? currentIndex + 1 : 0;
          onZoneClick(zones[nextIndex]);
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          // Select previous zone
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : zones.length - 1;
          onZoneClick(zones[prevIndex]);
        }
      }
      
      // Edit mode shortcut (only if edit mode is enabled and vertex editing is allowed)
      else if (config.features.vertexEditing && e.key === 'e' && selectedZone && !isCreatingZone && !isEditingZone && !e.ctrlKey && !e.metaKey && isEditModeEnabled) {
        startEditingZone(selectedZone);
      }
      
      // Toggle zone status shortcut
      else if (e.key === ' ' && selectedZone && !isCreatingZone && !isEditingZone) {
        e.preventDefault();
        onZoneClick(selectedZone); // This will toggle the status
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isCreatingZone, 
    isEditingZone, 
    selectedZone, 
    zones, 
    cancelZoneCreation, 
    cancelZoneEditing, 
    saveZoneEdits, 
    onZoneClick, 
    onZoneRightClick, 
    onZoneDelete,
    startEditingZone,
    isEditModeEnabled
  ]);





  // Show loading state
  if (!imageLoaded && !imageError) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg"
        style={{ width, height }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading floor plan...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (imageError) {
    return (
      <div 
        className="flex items-center justify-center bg-red-50 border-2 border-red-200 rounded-lg"
        style={{ width, height }}
      >
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading floor plan</p>
          <p className="text-red-500 text-sm">{imageError}</p>
        </div>
      </div>
    );
  }



  // Error boundary for canvas rendering
  if (isNaN(scaleX) || isNaN(scaleY) || scaleX <= 0 || scaleY <= 0 || safeWidth <= 0 || safeHeight <= 0) {
    console.error('Invalid canvas parameters:', { scaleX, scaleY, width, height, safeWidth, safeHeight });
    return (
      <div className="flex items-center justify-center bg-red-50 border-2 border-red-200 rounded-lg p-6" style={{ width: 400, height: 300 }}>
        <div className="text-center">
          <p className="text-red-600 font-medium">Canvas Configuration Error</p>
          <p className="text-red-500 text-sm mt-1">Dimensions: {safeWidth}x{safeHeight}</p>
          <p className="text-red-500 text-xs mt-1">Scale: {scaleX.toFixed(3)}x{scaleY.toFixed(3)}</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative overflow-hidden canvas-container canvas-large no-select focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" 
      tabIndex={0}
      role="application"
      aria-label="Interactive zone management canvas"
      aria-describedby="canvas-instructions"
      onFocus={() => {
        try {
          // Ensure canvas gets focus for keyboard events
          if (stageRef.current) {
            stageRef.current.getStage().container().focus();
          }
        } catch (error) {
          console.error('Error setting canvas focus:', error);
        }
      }}
      onClick={() => {
        try {
          // Ensure canvas gets focus when clicked
          if (stageRef.current) {
            stageRef.current.getStage().container().focus();
          }
        } catch (error) {
          console.error('Error setting canvas focus on click:', error);
        }
      }}
    >
      <Stage
        ref={stageRef}
        width={safeWidth}
        height={safeHeight}
        onClick={handleStageClick}
        onTap={handleStageClick}
        onContextMenu={handleStageRightClick}
        onMouseMove={handleStageMouseMove}
        onMouseDown={handlePointerDown}
        onMouseUp={handleStageMouseUp}
        onTouchStart={handlePointerDown}
        onTouchEnd={handlePointerUp}
        tabIndex={0}
        style={{ cursor: cursorStyle }}
        onError={(error: any) => {
          console.error('Konva Stage error:', error);
        }}
      >
        <Layer>
          {/* Floor plan image */}
          {floorPlanImage && (
            <KonvaImage
              image={floorPlanImage}
              width={safeWidth}
              height={safeHeight}
              listening={false}
            />
          )}
          
          {/* Existing zones with status-based styling */}
          {renderZones()}
          
          {/* Temporary zone creation feedback */}
          {isCreatingZone && renderTemporaryPolygon()}
          
          {/* Vertex handles for current zone creation */}
          {isCreatingZone && renderVertexHandles()}
          
          {/* Mouse position indicator during zone creation */}
          {isCreatingZone && mousePosition && (() => {
            const canvasMousePosition = originalToCanvas(mousePosition);
            return (
              <Circle
                x={canvasMousePosition.x}
                y={canvasMousePosition.y}
                radius={3}
                fill="#94a3b8"
                stroke="#ffffff"
                strokeWidth={1}
                listening={false}
              />
            );
          })()}
          
          {/* Completion hint circle */}
          {isCreatingZone && renderCompletionHint()}
        </Layer>
      </Stage>
      
      {/* Zone creation instructions - Responsive */}
      {isCreatingZone && (
        <div 
          id="canvas-instructions"
          className="zone-instructions absolute top-4 left-4 bg-blue-100 border border-blue-300 rounded-lg p-3 shadow-lg md:relative md:top-auto md:left-auto md:transform-none"
          role="status"
          aria-live="polite"
        >
          <p className="text-blue-800 text-sm font-medium">Creating Zone</p>
          <p className="text-blue-600 text-xs mt-1">
            {safeWidth < 600 ? 'Tap' : 'Click'} to add vertices ({currentVertices.length}/6)
          </p>
          {currentVertices.length >= 3 ? (
            <p className="text-green-600 text-xs">
              {safeWidth < 600 ? 'Tap' : 'Click'} near first vertex (green circle) to complete
            </p>
          ) : (
            <p className="text-blue-600 text-xs">
              Need {3 - currentVertices.length} more vertices to complete (minimum 3)
            </p>
          )}
          <p className="text-gray-500 text-xs">Press Escape to cancel</p>
        </div>
      )}
      
      {/* Zone editing instructions */}
      {config.features.vertexEditing && isEditingZone && isEditModeEnabled && (
        <div 
          id="canvas-instructions"
          className="zone-instructions absolute top-4 left-4 bg-amber-100 border border-amber-300 rounded-lg p-3 shadow-lg md:relative md:top-auto md:left-auto md:transform-none"
          role="status"
          aria-live="polite"
        >
          <p className="text-amber-800 text-sm font-medium">Editing Zone</p>
          <p className="text-amber-600 text-xs mt-1">
            {isDraggingVertex ? 'Dragging vertex - release to save' : 'Long press and drag vertex handles to reshape'}
          </p>
          <p className="text-green-600 text-xs">
            Changes save automatically when you release
          </p>
          <p className="text-gray-500 text-xs">Click "Exit Edit Mode" button to finish editing</p>
        </div>
      )}

      {/* Edit mode active but not editing message */}
      {config.features.vertexEditing && isEditModeEnabled && !isEditingZone && !isCreatingZone && (
        <div 
          className="zone-instructions absolute bottom-4 left-4 bg-amber-50 border border-amber-200 rounded-lg p-3 shadow-lg"
          role="status"
          aria-live="polite"
        >
          <p className="text-amber-800 text-sm font-medium">Edit Mode Active</p>
          <p className="text-amber-600 text-xs mt-1">
            Zone creation is disabled. Select a zone to edit or exit edit mode to create new zones.
          </p>
        </div>
      )}



    </div>
  );
});

ZoneCanvas.displayName = 'ZoneCanvas';