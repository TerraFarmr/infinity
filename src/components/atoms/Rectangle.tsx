import React,{useRef} from 'react';
import type { RectangleProps } from '../../utils/types/rectangle.types';

const RectangleDiv: React.FC<RectangleProps> = React.memo(({ shapeProps, isSelected, onSelect, onChange, onDeselect }) => {
  const rectRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={rectRef}
      tabIndex={0}
      style={{
        position: 'absolute',
        left: shapeProps.x,
        top: shapeProps.y,
        width: shapeProps.width,
        height: shapeProps.height,
        background: shapeProps.fill,
        border: `2px solid ${isSelected ? '#1976d2' : shapeProps.stroke}`,
        boxShadow: isSelected ? '0 0 0 2px #1976d288' : '0 1px 4px #0001',
        transition: 'box-shadow 0.15s',
        zIndex: isSelected ? 10 : 1,
        outline: 'none',
        userSelect: 'none',
        willChange: 'transform',
      }}
      onMouseEnter={() => onSelect()}
      onMouseLeave={() => onDeselect()}
    />
  );
});

export default RectangleDiv;
