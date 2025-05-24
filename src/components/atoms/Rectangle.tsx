import React from 'react';
import { Rect, Transformer } from 'react-konva';
import type { KonvaRect, KonvaTransformer, RectangleProps } from '../../utils/types/rectangle.types';

const Rectangle: React.FC<RectangleProps> = ({ shapeProps, isSelected, onSelect, onChange }) => {
  const shapeRef = React.useRef<KonvaRect>(null);
  const trRef = React.useRef<KonvaTransformer>(null);

  // Update transformer when selection changes
  React.useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  // Handle drag end - update position
  const handleDragEnd = (e: any) => {
    onChange({
      ...shapeProps,
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  // Handle transform end - update size and position
  const handleTransformEnd = () => {
    const node = shapeRef.current;
    if (!node) return;
    
    // Reset scale and apply to width/height instead
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);
    
    onChange({
      ...shapeProps,
      x: node.x(),
      y: node.y(),
      width: Math.max(5, node.width() * scaleX),
      height: Math.max(5, node.height() * scaleY),
    });
  };

  return (
    <>
      <Rect
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable={isSelected}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          flipEnabled={false}
          rotateEnabled={false}
          boundBoxFunc={(oldBox, newBox) => 
            Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5 ? oldBox : newBox
          }
        />
      )}
    </>
  );
};

export default Rectangle;
