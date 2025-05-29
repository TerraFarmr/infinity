import type { Rectangle, TempRect } from './types/canvas.types';

// Generate unique ID for rectangles
export const generateId = (): string =>
  `rect_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

// Convert screen (pixel) coordinates to world (canvas) coordinates
export const screenToWorld = (x: number, y: number, position: {x: number, y: number}, scale: number) => ({
  x: (x - position.x) / scale,
  y: (y - position.y) / scale,
});

// Convert world (canvas) coordinates to screen (pixel) coordinates
export const worldToScreen = (x: number, y: number, position: {x: number, y: number}, scale: number) => ({
  x: x * scale + position.x,
  y: y * scale + position.y,
});

// Get rectangles visible in the current viewport
export const getVisibleRects = (
  rectangles: Rectangle[],
  minX: number, maxX: number, minY: number, maxY: number
) => rectangles.filter(r => r.x + r.width > minX && r.x < maxX && r.y + r.height > minY && r.y < maxY);

// Keyboard shortcut handler for mode switching
export const createModeKeyHandler = (dispatch: any, setMode: any) => (e: KeyboardEvent) => {
  if (e.metaKey && !e.shiftKey && !e.altKey) {
    if (e.key.toLowerCase() === 'v') { dispatch(setMode('view')); e.preventDefault(); }
    else if (e.key.toLowerCase() === 'd') { dispatch(setMode('draw')); e.preventDefault(); }
  }
};

// Pointer event handlers for drawing and selection
export const handlePointerDown = (
  event: React.PointerEvent<HTMLDivElement>,
  mode: string,
  canvasRef: React.RefObject<HTMLDivElement | null>,
  position: { x: number; y: number },
  scale: number,
  setDrawing: (drawing: { x: number; y: number } | null) => void,
  setTempRect: (rect: TempRect | null) => void,
  dispatch: any,
  selectRectangle: any
) => {
  if (mode === 'draw') {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const wx = (x - position.x) / scale;
    const wy = (y - position.y) / scale;
    setDrawing({ x: wx, y: wy });
    setTempRect(null);
  } else if (mode === 'view') {
    if (event.target === canvasRef.current) {
      dispatch(selectRectangle(null));
    }
  }
};

export const handlePointerMove = (
  event: React.PointerEvent<HTMLDivElement>,
  drawing: { x: number; y: number } | null,
  canvasRef: React.RefObject<HTMLDivElement | null>,
  position: { x: number; y: number },
  scale: number,
  setTempRect: (rect: TempRect | null) => void,
  isDarkMode: boolean
) => {
  if (drawing) {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const wx = (x - position.x) / scale;
    const wy = (y - position.y) / scale;
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

export const handlePointerUp = (
  event: React.PointerEvent<HTMLDivElement>,
  drawing: { x: number; y: number } | null,
  tempRect: TempRect | null,
  setDrawing: (drawing: { x: number; y: number } | null) => void,
  setTempRect: (rect: TempRect | null) => void,
  setIsPanning: (isPanning: boolean) => void,
  panStart: React.MutableRefObject<{ x: number; y: number; offsetX: number; offsetY: number; } | null>,
  dispatch: any,
  addRectangle: any
) => {
  if (drawing && tempRect && tempRect.width > 5 && tempRect.height > 5) {
    dispatch(addRectangle({ ...tempRect }));
  }
  setDrawing(null);
  setTempRect(null);
  setIsPanning(false);
  panStart.current = null;
};
