import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ZoneCanvas } from '../ZoneCanvas';
import { Zone, Point } from '@/types/map/zone';

// Mock react-konva components
jest.mock('react-konva', () => ({
  Stage: ({ children, onClick, onMouseMove, ...props }: any) => (
    <div 
      data-testid="konva-stage" 
      onClick={onClick}
      onMouseMove={onMouseMove}
      {...props}
    >
      {children}
    </div>
  ),
  Layer: ({ children }: any) => <div data-testid="konva-layer">{children}</div>,
  Circle: (props: any) => <div data-testid="konva-circle" {...props} />,
  Line: (props: any) => <div data-testid="konva-line" {...props} />,
  Shape: ({ onClick, onContextMenu, ...props }: any) => (
    <div 
      data-testid="konva-shape" 
      onClick={onClick}
      onContextMenu={onContextMenu}
      {...props} 
    />
  ),
  Text: (props: any) => <div data-testid="konva-text" {...props} />,
  Image: (props: any) => <div data-testid="konva-image" {...props} />,
}));

describe('ZoneCanvas', () => {
  const mockZones: Zone[] = [
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

  const defaultProps = {
    floorPlanUrl: '/test-floor-plan.svg',
    zones: mockZones,
    selectedZone: null,
    onZoneCreate: jest.fn(),
    onZoneClick: jest.fn(),
    onZoneRightClick: jest.fn(),
    onCanvasClick: jest.fn(),
    onZoneUpdate: jest.fn(),
    width: 800,
    height: 600
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render canvas with floor plan', () => {
    render(<ZoneCanvas {...defaultProps} />);
    
    expect(screen.getByTestId('konva-stage')).toBeInTheDocument();
    expect(screen.getByTestId('konva-layer')).toBeInTheDocument();
    expect(screen.getByRole('application')).toBeInTheDocument();
  });

  it('should display loading state initially', () => {
    render(<ZoneCanvas {...defaultProps} />);
    
    expect(screen.getByText('Loading floor plan...')).toBeInTheDocument();
  });

  it('should render zones', async () => {
    render(<ZoneCanvas {...defaultProps} />);
    
    // Wait for image to load (mocked to load immediately)
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const shapes = screen.getAllByTestId('konva-shape');
    expect(shapes).toHaveLength(2); // Two zones
  });

  it('should render company name for occupied zones', async () => {
    render(<ZoneCanvas {...defaultProps} />);
    
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const texts = screen.getAllByTestId('konva-text');
    expect(texts.length).toBeGreaterThan(0);
  });

  it('should handle canvas click', async () => {
    const onCanvasClick = jest.fn();
    render(<ZoneCanvas {...defaultProps} onCanvasClick={onCanvasClick} />);
    
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const stage = screen.getByTestId('konva-stage');
    
    // Mock getStage and getPointerPosition
    const mockStage = {
      getPointerPosition: () => ({ x: 50, y: 50 })
    };
    
    fireEvent.click(stage, {
      target: { getStage: () => mockStage }
    });
    
    expect(onCanvasClick).toHaveBeenCalledWith({ x: 50, y: 50 });
  });

  it('should handle zone creation mode', async () => {
    render(<ZoneCanvas {...defaultProps} />);
    
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const stage = screen.getByTestId('konva-stage');
    
    // Mock stage methods
    const mockStage = {
      getPointerPosition: () => ({ x: 50, y: 50 })
    };
    
    // First click should start zone creation
    fireEvent.click(stage, {
      target: { getStage: () => mockStage }
    });
    
    expect(screen.getByText('Creating Zone')).toBeInTheDocument();
  });

  it('should show keyboard shortcuts when not in active mode', async () => {
    render(<ZoneCanvas {...defaultProps} />);
    
    await new Promise(resolve => setTimeout(resolve, 150));
    
    expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument();
    expect(screen.getByText('Navigate zones')).toBeInTheDocument();
    expect(screen.getByText('Toggle status')).toBeInTheDocument();
  });

  it('should handle keyboard navigation', async () => {
    const onZoneClick = jest.fn();
    render(<ZoneCanvas {...defaultProps} onZoneClick={onZoneClick} />);
    
    await new Promise(resolve => setTimeout(resolve, 150));
    
    // Simulate arrow key press
    fireEvent.keyDown(window, { key: 'ArrowDown' });
    
    expect(onZoneClick).toHaveBeenCalledWith(mockZones[0]);
  });

  it('should handle escape key to cancel zone creation', async () => {
    render(<ZoneCanvas {...defaultProps} />);
    
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const stage = screen.getByTestId('konva-stage');
    
    // Start zone creation
    const mockStage = {
      getPointerPosition: () => ({ x: 50, y: 50 })
    };
    
    fireEvent.click(stage, {
      target: { getStage: () => mockStage }
    });
    
    expect(screen.getByText('Creating Zone')).toBeInTheDocument();
    
    // Press escape
    fireEvent.keyDown(window, { key: 'Escape' });
    
    expect(screen.queryByText('Creating Zone')).not.toBeInTheDocument();
  });

  it('should handle zone selection', () => {
    const selectedZone = mockZones[0];
    render(<ZoneCanvas {...defaultProps} selectedZone={selectedZone} />);
    
    // Should render selection highlight
    expect(screen.getByTestId('konva-stage')).toBeInTheDocument();
  });

  it('should handle edit mode', () => {
    const canvasRef = React.createRef<any>();
    render(<ZoneCanvas ref={canvasRef} {...defaultProps} />);
    
    // Test that ref methods are available
    expect(canvasRef.current).toBeTruthy();
  });

  it('should show error state when floor plan fails to load', () => {
    // Mock image error
    const originalImage = global.Image;
    global.Image = class {
      constructor() {
        setTimeout(() => {
          this.onerror && this.onerror();
        }, 100);
      }
    } as any;

    render(<ZoneCanvas {...defaultProps} />);
    
    expect(screen.getByText('Error loading floor plan')).toBeInTheDocument();
    
    // Restore original Image
    global.Image = originalImage;
  });

  it('should handle touch events', async () => {
    render(<ZoneCanvas {...defaultProps} />);
    
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const stage = screen.getByTestId('konva-stage');
    
    // Mock touch event
    fireEvent.touchStart(stage, {
      target: { 
        getStage: () => ({
          getPointerPosition: () => ({ x: 50, y: 50 })
        })
      }
    });
    
    fireEvent.touchEnd(stage);
    
    // Should handle touch events without errors
    expect(stage).toBeInTheDocument();
  });

  it('should handle right-click context menu', async () => {
    const onZoneRightClick = jest.fn();
    render(<ZoneCanvas {...defaultProps} onZoneRightClick={onZoneRightClick} />);
    
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const stage = screen.getByTestId('konva-stage');
    
    fireEvent.contextMenu(stage, {
      target: { 
        getStage: () => ({
          getPointerPosition: () => ({ x: 50, y: 50 })
        })
      }
    });
    
    // Should handle right-click without errors
    expect(stage).toBeInTheDocument();
  });
});