import type { CanvasMode, Rectangle } from './canvas.types';

//Props for the Rectangle component
export type RectangleProps = {
  shapeProps: Rectangle;       // Rectangle shape properties
  isSelected: boolean;        // Whether the rectangle is selected
  onSelect: () => void;// Called when rectangle is selected
  onDeselect: () => void;// Called when rectangle is deselected
  onChange: (newAttrs: Rectangle) => void; // Called when rectangle is modified
  mode: CanvasMode;           // Current canvas mode (draw or view)
};
