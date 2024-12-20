import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Rect } from "react-konva";
import Cell from "../atoms/Cell.jsx";
import { togglePause } from "../../redux/gamePropSlice.js";
import { useSelector, useDispatch } from "react-redux";

const CellularAutomata = ({ grid, setGrid, theme }) => {
  const dispatch = useDispatch();
  const click = () => {
    dispatch(togglePause());
  };
  const { cellResolution } = useSelector((state) => state.gameProps);

  const spectrum = {
    start: theme === "dark" ? "#000000" : "#ffffff",
    end: theme === "dark" ? "#ffffff" : "#000000",
  };
  useEffect(() => {
    console.log(grid);
  }, []);

  return (
    <div id="grid">
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        style={{ background: spectrum.start }}
        onClick={click}
      >
        <Layer>
          {grid?.map((row, rowIndex) => {
            return row.map((cell, colIndex) => {
              const alive = cell === 1;
              const size = alive ? cellResolution : 1;
              return (
                <Cell
                  cellResolution={cellResolution}
                  colIndex={colIndex}
                  rowIndex={rowIndex}
                  spectrum={spectrum}
                  alive={alive}
                  setGrid={setGrid}
                />
              );
            });
          })}
        </Layer>
      </Stage>
    </div>
  );
};

export default CellularAutomata;
