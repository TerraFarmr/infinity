import type { Rect as KonvaRect } from 'konva/lib/shapes/Rect';
import type { Transformer as KonvaTransformer } from 'konva/lib/shapes/Transformer';
import type { Rectangle } from './canvas.types';

//Props for the Rectangle component
export type RectangleProps = {
  shapeProps: Rectangle;       // Rectangle shape properties
  isSelected: boolean;        // Whether the rectangle is selected
  onSelect: () => void;       // Called when rectangle is selected
  onChange: (newAttrs: Rectangle) => void; // Called when rectangle is modified
};

//Export Konva type references for use in refs
export type { KonvaRect, KonvaTransformer };
