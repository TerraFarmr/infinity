import React from 'react';
import { Rnd } from 'react-rnd';
import type { RectangleProps } from '../../utils/types/rectangle.types';

const RectangleDiv: React.FC<RectangleProps> = React.memo(({ shapeProps, isSelected, onSelect, onChange, onDeselect, mode }) => {
  return (
    <Rnd
      size={{ width: shapeProps.width, height: shapeProps.height }}
      position={{ x: shapeProps.x, y: shapeProps.y }}
      onDragStop={(e, d) => {
        onChange({ ...shapeProps, x: d.x, y: d.y });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        onChange({
          ...shapeProps,
          width: parseFloat(ref.style.width),
          height: parseFloat(ref.style.height),
          x: position.x,
          y: position.y,
        });
      }}
      style={{
        background: shapeProps.fill,
        border: `2px solid ${isSelected ? '#1976d2' : shapeProps.stroke}`,
        boxShadow: isSelected ? '0 0 0 2px #1976d288' : '0 1px 4px #0001',
        transition: 'box-shadow 0.15s',
        zIndex: isSelected ? 10 : 1,
        outline: 'none',
        userSelect: 'none',
        willChange: 'transform',
      }}
      enableResizing={isSelected && mode === 'view'}
      disableDragging={!isSelected || mode !== 'view'}
      onMouseEnter={onSelect}
      onMouseLeave={onDeselect}
      tabIndex={0}
    />
  );
});

export default RectangleDiv;
