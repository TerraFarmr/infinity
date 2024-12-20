import { Rect } from "react-konva";
import Konva from "konva";
import {
  calculateNextGeneration,
  chooseOrganisms,
} from "../../utils/calculate.gol.js";

const Cell = ({
  colIndex,
  rowIndex,
  cellResolution,
  spectrum,
  alive,
  setGrid,
}) => {
  const size = alive ? cellResolution : 1;

  /*
  const changeSize = useCallback(() => {
    if (rectRef.current) {
      rectRef.current.to({
        scaleX: Math.random() + 0.8,
        scaleY: Math.random() + 0.8,
        duration: 0.2,
      });
    }
  }, []);

   <Rect
        x={colIndex * cellResolution}
        y={rowIndex * cellResolution}
        width={1}
        height={1}
        fill={!alive ? spectrum.end : spectrum.start}
        key={rowIndex + colIndex}
      /> */

  return (
    <Rect
      x={colIndex * cellResolution}
      y={rowIndex * cellResolution}
      width={cellResolution}
      height={cellResolution}
      fill={alive ? spectrum.end : spectrum.start}
      key={rowIndex + colIndex}
      //shadowBlur={1}
      // stroke={alive && spectrum.start}
      // strokeWidth={alive && 2}
      onMouseOver={() => {
        //console.log(chooseOrganisms(1));
        setGrid((grid) => {
          const newGrid = [...calculateNextGeneration(grid)];
          for (let i = rowIndex - 1; i <= rowIndex + 1; i++) {
            for (let j = colIndex - 1; j <= colIndex + 1; j++) {
              if (
                i >= 0 &&
                i < newGrid.length &&
                j >= 0 &&
                j < newGrid[0].length
              ) {
                newGrid[i][j] = newGrid[i][j] === 0 ? 1 : 0;
              }
            }
          }
          return newGrid;
        });
      }}
    />
  );
};

export default Cell;
