import { Rect } from "react-konva";
import Konva from "konva";

const Cell = ({ colIndex, rowIndex, cellResolution, size, color }) => {
  // const rectRef = useRef(null);

  // const changeSize = useCallback(() => {
  //   if (rectRef.current) {
  //     rectRef.current.to({
  //       scaleX: Math.random() + 0.8,
  //       scaleY: Math.random() + 0.8,
  //       duration: 0.2,
  //     });
  //   }
  // }, []);

  return (
    <Rect
      x={colIndex * cellResolution}
      y={rowIndex * cellResolution}
      width={size}
      height={size}
      fill={color}
      key={rowIndex + colIndex}
      shadowBlur={1}
      //ref={rectRef}
      // draggable
      // onDragStart={changeSize}
    />
  );
};

export default Cell;
