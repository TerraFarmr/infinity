// Rectangle shape properties
export interface Rectangle {
  id: string;      // Unique identifier
  x: number;       // X position
  y: number;       // Y position
  width: number;   // Width
  height: number;  // Height
  fill: string;    // Fill color
  stroke: string;  // Stroke color
}

// Temporary rectangle without ID (used during drawing)
export type TempRect = Omit<Rectangle, 'id'>;

// Panning state reference
export type PanStart = {
  x: number;       // Initial mouse X
  y: number;       // Initial mouse Y
  offsetX: number; // Initial canvas X offset
  offsetY: number; // Initial canvas Y offset
};

// Canvas interaction modes
export type CanvasMode = 'draw' | 'view';
