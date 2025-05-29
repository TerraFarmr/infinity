import type { Rectangle } from './types/canvas.types';

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

// Canvas gesture handlers factory
export const createCanvasGestureHandlers = (opts: {
  mode: string,
  drawing: any,
  tempRect: any,
  setDrawing: any,
  setTempRect: any,
  setIsPanning: any,
  panStart: any,
  canvasRef: any,
  position: any,
  scale: number,
  isDarkMode: boolean,
  dispatch: any,
  updateCanvas: any,
  selectRectangle: any,
  addRectangle: any,
}) => ({
  onDrag: ({ event, delta: [dx, dy], pinching, first, last }: any) => {
    if (opts.mode === 'view' && !opts.drawing && !pinching) {
      if (first) opts.setIsPanning(true);
      if (last) opts.setIsPanning(false);
      opts.dispatch(opts.updateCanvas({ position: { x: opts.position.x + dx, y: opts.position.y + dy } }));
    }
  },
  onWheel: ({ event }: any) => {
    event.preventDefault();
    const rect = opts.canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    const oldScale = opts.scale;
    const scaleBy = 1.05;
    const direction = event.deltaY > 0 ? -1 : 1;
    const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    const mousePointTo = screenToWorld(pointer.x, pointer.y, opts.position, oldScale);
    const newOffsetX = pointer.x - mousePointTo.x * newScale;
    const newOffsetY = pointer.y - mousePointTo.y * newScale;
    opts.dispatch(opts.updateCanvas({ scale: newScale, position: { x: newOffsetX, y: newOffsetY } }));
  },
  onPinch: ({ origin, da: [d], event }: any) => {
    event.preventDefault();
    const rect = opts.canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pointer = { x: origin[0] - rect.left, y: origin[1] - rect.top };
    const oldScale = opts.scale;
    const scaleBy = 1.05;
    const newScale = oldScale * (d > 0 ? scaleBy : 1 / scaleBy);
    const mousePointTo = screenToWorld(pointer.x, pointer.y, opts.position, oldScale);
    const newOffsetX = pointer.x - mousePointTo.x * newScale;
    const newOffsetY = pointer.y - mousePointTo.y * newScale;
    opts.dispatch(opts.updateCanvas({ scale: newScale, position: { x: newOffsetX, y: newOffsetY } }));
  },
  onPointerDown: ({ event }: any) => {
    if (opts.mode === 'draw') {
      const rect = opts.canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const { x: wx, y: wy } = screenToWorld(x, y, opts.position, opts.scale);
      opts.setDrawing({ x: wx, y: wy });
      opts.setTempRect(null);
    } else if (opts.mode === 'view') {
      if (event.target === opts.canvasRef.current) {
        opts.dispatch(opts.selectRectangle(null));
      }
    }
  },
  onPointerMove: ({ event }: any) => {
    if (opts.drawing) {
      const rect = opts.canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const { x: wx, y: wy } = screenToWorld(x, y, opts.position, opts.scale);
      opts.setTempRect({
        x: Math.min(opts.drawing.x, wx),
        y: Math.min(opts.drawing.y, wy),
        width: Math.abs(wx - opts.drawing.x),
        height: Math.abs(wy - opts.drawing.y),
        fill: opts.isDarkMode ? "#ffffff" : "#000000",
        stroke: opts.isDarkMode ? "#000000" : "#ffffff"
      });
    }
  },
  onPointerUp: ({ event }: any) => {
    if (opts.drawing && opts.tempRect && opts.tempRect.width > 5 && opts.tempRect.height > 5) {
      opts.dispatch(opts.addRectangle({ ...opts.tempRect }));
    }
    opts.setDrawing(null);
    opts.setTempRect(null);
    opts.setIsPanning(false);
    opts.panStart.current = null;
  }
});
