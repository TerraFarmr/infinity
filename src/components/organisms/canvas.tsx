import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createModeKeyHandler, getVisibleRects, handlePointerDown, handlePointerMove, handlePointerUp } from '../../utils/helpers';
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
  updateRectangle
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

  // Add wheel event handler for panning in view mode
  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (mode === 'view') {
      event.preventDefault();
      dispatch(updateCanvas({
        position: {
          x: position.x + event.deltaX,
          y: position.y + event.deltaY
        }
      }));
    }
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
        onPointerDown={(e) => handlePointerDown(e, mode, canvasRef, position, scale, setDrawing, setTempRect, dispatch, selectRectangle)}
        onPointerMove={(e) => handlePointerMove(e, drawing, canvasRef, position, scale, setTempRect, isDarkMode)}
        onPointerUp={(e) => handlePointerUp(e, drawing, tempRect, setDrawing, setTempRect, setIsPanning, panStart, dispatch, addRectangle)}
        onWheel={handleWheel}
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
              mode={mode}
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
              mode={mode}
            />
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default InfiniteCanvas;
