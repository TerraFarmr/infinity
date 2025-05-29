import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createModeKeyHandler, getVisibleRects, screenToWorld } from '../../utils/helpers';
import {
  addRectangle,
  deselectRectangle,
  selectIsDarkMode,
  selectMode,
  selectPosition,
  selectRectangle,
  selectRectangles,
  selectScale,
  selectSelectedId,
  setMode,
  updateCanvas,
  updateRectangle,
} from "../../utils/redux/canvasSlice";
import type { PanStart, Rectangle, TempRect } from "../../utils/types/canvas.types";
import RectangleDiv from "../atoms/Rectangle";

const CANVAS_WIDTH = window.innerWidth;
const CANVAS_HEIGHT = window.innerHeight;
const CULL_PADDING = 200; // Extra px around viewport for culling

const InfiniteCanvas: React.FC = () => {
  const dispatch = useDispatch();
  const mode = useSelector(selectMode);
  const rectangles = useSelector(selectRectangles);
  const scale = useSelector(selectScale);
  const position = useSelector(selectPosition);
  const selectedId = useSelector(selectSelectedId);
  const isDarkMode = useSelector(selectIsDarkMode);

  // Drawing state
  const [drawing, setDrawing] = useState<null | { x: number; y: number }>(null);
  const [tempRect, setTempRect] = useState<TempRect | null>(null);

  // Pan state
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef<PanStart | null>(null);

  // Canvas ref for coordinate transforms
  const canvasRef = useRef<HTMLDivElement>(null);

  // Coordinate transforms (now from helpers)
  // Viewport culling
  const minX = -position.x / scale - CULL_PADDING / scale;
  const minY = -position.y / scale - CULL_PADDING / scale;
  const maxX = minX + CANVAS_WIDTH / scale + 2 * CULL_PADDING / scale;
  const maxY = minY + CANVAS_HEIGHT / scale + 2 * CULL_PADDING / scale;
  const visibleRects = useMemo(() => getVisibleRects(rectangles, minX, maxX, minY, maxY), [rectangles, minX, maxX, minY, maxY]);

  // Vanilla React event handlers for gesture handling
  const handleMouseDown = (e: React.MouseEvent) => {
    if (mode === 'view' && !drawing) {
      setIsPanning(true);
      panStart.current = { x: e.clientX, y: e.clientY, offsetX: position.x, offsetY: position.y };
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isPanning && panStart.current) {
      const dx = e.clientX - panStart.current.x;
      const dy = e.clientY - panStart.current.y;
      dispatch(updateCanvas({ position: { x: panStart.current.offsetX + dx, y: panStart.current.offsetY + dy } }));
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    panStart.current = null;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    const oldScale = scale;
    const scaleBy = 1.05;
    const direction = e.deltaY > 0 ? -1 : 1;
    const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    const mousePointTo = screenToWorld(pointer.x, pointer.y, position, oldScale);
    const newOffsetX = pointer.x - mousePointTo.x * newScale;
    const newOffsetY = pointer.y - mousePointTo.y * newScale;
    dispatch(updateCanvas({ scale: newScale, position: { x: newOffsetX, y: newOffsetY } }));
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (mode === 'draw') {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const { x: wx, y: wy } = screenToWorld(x, y, position, scale);
      setDrawing({ x: wx, y: wy });
      setTempRect(null);
    } else if (mode === 'view') {
      if (e.target === canvasRef.current) {
        dispatch(selectRectangle(null));
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (drawing) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const { x: wx, y: wy } = screenToWorld(x, y, position, scale);
      setTempRect({
        x: Math.min(drawing.x, wx),
        y: Math.min(drawing.y, wy),
        width: Math.abs(wx - drawing.x),
        height: Math.abs(wy - drawing.y),
        fill: isDarkMode ? "#ffffff" : "#000000",
        stroke: isDarkMode ? "#000000" : "#ffffff"
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (drawing && tempRect && tempRect.width > 5 && tempRect.height > 5) {
      dispatch(addRectangle({ ...tempRect }));
    }
    setDrawing(null);
    setTempRect(null);
    setIsPanning(false);
    panStart.current = null;
  };

  // Set up global event listeners for mouse move and mouse up
  useEffect(() => {
    if (isPanning) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isPanning]);

  // Update rectangle colors when mode changes
  React.useEffect(() => {
    rectangles.forEach(rect => {
      dispatch(updateRectangle({
        id: rect.id,
        fill: isDarkMode ? "#ffffff" : "#000000",
        stroke: isDarkMode ? "#000000" : "#ffffff"
      }));
    });
  }, [isDarkMode, dispatch]);

  // Keyboard shortcut for mode switching
  useEffect(() => {
    const handler = createModeKeyHandler(dispatch, setMode);
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [dispatch]);

  // Error boundary fallback
  const [hasError, setHasError] = useState(false);
  const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return hasError ? <div className="text-red-500">Canvas error</div> : <>{children}</>;
  };

  return (
    <ErrorBoundary>
      <div
        ref={canvasRef}
        className={`absolute top-0 left-0 w-full h-full overflow-hidden select-none ${isDarkMode ? 'bg-black' : 'bg-white'}`}
        style={{
          cursor: mode === "draw" ? "crosshair" : isPanning ? "grabbing" : "grab",
          touchAction: 'none',
        }}
        tabIndex={0}
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            willChange: 'transform',
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: '0 0',
          }}
        >
          {/* Virtualized visible rectangles */}
          {visibleRects.map(rect => (
            <RectangleDiv
              key={rect.id}
              shapeProps={rect}
              isSelected={rect.id === selectedId}
              onSelect={() => { if (mode === 'view') dispatch(selectRectangle(rect.id)); }}
              onDeselect={() => { if (mode === 'view') dispatch(deselectRectangle()); }}
              onChange={(newAttrs: Rectangle) => dispatch(updateRectangle(newAttrs))}
            />
          ))}
          {/* Temporary rectangle while drawing */}
          {tempRect && (
            <RectangleDiv
              shapeProps={{ ...tempRect, id: 'temp_rect' }}
              isSelected={false}
              onSelect={() => {}}
              onDeselect={() => {}}
              onChange={() => {}}
            />
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default InfiniteCanvas;
