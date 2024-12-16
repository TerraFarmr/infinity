import { useEffect, useRef, useState } from "react";
import { Stage, Layer } from "react-konva";
import Cell from "../atoms/Cell.jsx";
import FPSStats from "react-fps-stats";

const CellularAutomata = ({ grid, setGrid, gameProps, theme, setPaused }) => {
  const { population, cellResolution, generationsPerSecond } = gameProps;
  const click = () => setPaused((paused) => !paused);

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
              return (
                <Cell
                  cellResolution={cellResolution}
                  size={cell === 1 ? cellResolution : 1}
                  color={spectrum.end}
                  rowIndex={rowIndex}
                  colIndex={colIndex}
                  key={rowIndex + colIndex}
                />
              );
            });
          })}
        </Layer>
      </Stage>
      <FPSStats />
    </div>
  );
};

export default CellularAutomata;
