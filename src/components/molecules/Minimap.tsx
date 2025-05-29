import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsDarkMode, selectPosition, selectRectangles, selectScale, updateCanvas } from '../../utils/redux/canvasSlice';

const MINI_W = 200;
const MINI_H = 150;
const BUFFER_PERCENTAGE = 0.1;

const Minimap: React.FC = () => {
  const [minimapPosition, setMinimapPosition] = useState({
    x: window.innerWidth - MINI_W - 10,
    y: window.innerHeight - MINI_H - 30
  });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const dispatch = useDispatch();
  const rectangles = useSelector(selectRectangles);
  const scale = useSelector(selectScale);
  const position = useSelector(selectPosition);
  const isDarkMode = useSelector(selectIsDarkMode);

  // Calculate minimap bounds and scale
  const bounds = useMemo(() => {
    if (!rectangles.length) return { minX: 0, minY: 0, width: 1, height: 1 };
    const xs = rectangles.flatMap(r => [r.x, r.x + r.width]);
    const ys = rectangles.flatMap(r => [r.y, r.y + r.height]);
    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const maxX = Math.max(...xs);
    const maxY = Math.max(...ys);
    return { minX, minY, width: maxX - minX, height: maxY - minY };
  }, [rectangles]);

  // Add buffer and calculate scale
  const { miniScale, miniOffsetX, miniOffsetY } = useMemo(() => {
    const { minX, minY, width, height } = bounds;
    const bufferX = width * BUFFER_PERCENTAGE;
    const bufferY = height * BUFFER_PERCENTAGE;
    const shapesW = width + (2 * bufferX) || 1;
    const shapesH = height + (2 * bufferY) || 1;
    const miniScale = Math.min(MINI_W / shapesW, MINI_H / shapesH);
    const miniOffsetX = (MINI_W - shapesW * miniScale) / 2 - (minX - bufferX) * miniScale;
    const miniOffsetY = (MINI_H - shapesH * miniScale) / 2 - (minY - bufferY) * miniScale;
    return { miniScale, miniOffsetX, miniOffsetY };
  }, [bounds]);

  // Viewport rectangle in world coords
  const viewport = useMemo(() => ({
    width: window.innerWidth / scale,
    height: window.innerHeight / scale,
    x: -position.x / scale,
    y: -position.y / scale
  }), [position.x, position.y, scale]);

  // Canvas panning state
  const [canvasDragging, setCanvasDragging] = useState(false);
  const canvasDragStartRef = useRef({ x: 0, y: 0 });

  // Handle minimap click (center view on click point)
  const handleMinimapMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const rect = (e.target as HTMLDivElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // Convert to world coordinates and center view
    const worldX = (x - miniOffsetX) / miniScale;
    const worldY = (y - miniOffsetY) / miniScale;
    dispatch(updateCanvas({
      position: {
        x: -(worldX * scale - window.innerWidth / 2),
        y: -(worldY * scale - window.innerHeight / 2)
      }
    }));
    setCanvasDragging(true);
    canvasDragStartRef.current = { x: e.clientX, y: e.clientY };
  }, [dispatch, miniOffsetX, miniOffsetY, miniScale, scale]);

  // Handle minimap drag for panning the canvas
  const handleMinimapMouseMove = useCallback((e: MouseEvent) => {
    if (!canvasDragging) return;
    e.preventDefault();
    const dx = e.clientX - canvasDragStartRef.current.x;
    const dy = e.clientY - canvasDragStartRef.current.y;
    // Map minimap drag to world coordinates
    const worldDx = dx / miniScale;
    const worldDy = dy / miniScale;
    dispatch(updateCanvas({
      position: {
        x: position.x - worldDx * scale,
        y: position.y - worldDy * scale
      }
    }));
    canvasDragStartRef.current = { x: e.clientX, y: e.clientY };
  }, [canvasDragging, dispatch, miniScale, position.x, position.y, scale]);

  // Handle minimap mouse up (end canvas dragging)
  const handleMinimapMouseUp = useCallback(() => {
    setCanvasDragging(false);
  }, []);

  // Handle drag handler mouse down
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - minimapPosition.x,
      y: e.clientY - minimapPosition.y
    };
    e.stopPropagation();
  }, [minimapPosition]);

  // Handle document mouse move (for dragging)
  const handleDragMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    const maxX = window.innerWidth - MINI_W;
    const maxY = window.innerHeight - MINI_H - 10;
    const x = Math.max(0, Math.min(e.clientX - dragStartRef.current.x, maxX));
    const y = Math.max(10, Math.min(e.clientY - dragStartRef.current.y, maxY));
    requestAnimationFrame(() => {
      setMinimapPosition({ x, y });
    });
  }, [isDragging]);

  // Handle document mouse up (end dragging)
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Set up and clean up global event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
    } else {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
    }
    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  // Minimap canvas drag listeners
  useEffect(() => {
    if (canvasDragging) {
      document.addEventListener('mousemove', handleMinimapMouseMove);
      document.addEventListener('mouseup', handleMinimapMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMinimapMouseMove);
      document.removeEventListener('mouseup', handleMinimapMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMinimapMouseMove);
      document.removeEventListener('mouseup', handleMinimapMouseUp);
    };
  }, [canvasDragging, handleMinimapMouseMove, handleMinimapMouseUp]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setMinimapPosition(prev => {
        const maxX = window.innerWidth - MINI_W;
        return {
          x: Math.min(prev.x, maxX),
          y: prev.y
        };
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className={`absolute z-20 rounded select-none shadow-md ${isDarkMode ? 'bg-black/90 border border-gray-700' : 'bg-white/90 border border-gray-300'}`}
      style={{
        left: minimapPosition.x,
        top: minimapPosition.y,
        width: MINI_W,
        height: MINI_H + 20
      }}
    >
      {/* Drag Handler */}
      <div
        className={`absolute top-0 left-0 right-0 h-6 flex items-center justify-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} rounded-t ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleDragStart}
      >
        <div className={`w-10 h-1 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-400'}`}></div>
      </div>
      {/* Minimap canvas */}
      <div
        style={{
          position: 'relative',
          width: MINI_W,
          height: MINI_H,
          marginTop: 20,
          background: isDarkMode ? '#222' : '#fafafa',
          overflow: 'hidden',
          borderRadius: 6,
        }}
        onMouseDown={handleMinimapMouseDown}
      >
        {/* Rectangles */}
        {rectangles.map(rect => (
          <div
            key={rect.id}
            style={{
              position: 'absolute',
              left: rect.x * miniScale + miniOffsetX,
              top: rect.y * miniScale + miniOffsetY,
              width: rect.width * miniScale,
              height: rect.height * miniScale,
              background: isDarkMode ? '#fff' : '#000',
              border: `1px solid ${isDarkMode ? '#000' : '#fff'}`,
              opacity: 0.7,
              borderRadius: 2,
              pointerEvents: 'none',
            }}
          />
        ))}
        {/* Viewport rectangle */}
        {rectangles.length > 0 && (
          <div
            style={{
              position: 'absolute',
              left: viewport.x * miniScale + miniOffsetX,
              top: viewport.y * miniScale + miniOffsetY,
              width: viewport.width * miniScale,
              height: viewport.height * miniScale,
              border: '2px dashed red',
              borderRadius: 2,
              pointerEvents: 'none',
              boxSizing: 'border-box',
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Minimap;
