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

