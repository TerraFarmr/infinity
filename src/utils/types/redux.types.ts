import type { Rectangle, CanvasMode } from './canvas.types';

export interface CanvasState {
  rectangles: Rectangle[];            // All rectangles on canvas
  mode: CanvasMode;                  // Current interaction mode
  scale: number;                     // Zoom level
  position: { x: number; y: number }; // Canvas position
  selectedId: string | null;          // Selected rectangle ID
  isDarkMode: boolean;               // Dark/light theme toggle
}

// Redux store types
export type RootState = { canvas: CanvasState };
