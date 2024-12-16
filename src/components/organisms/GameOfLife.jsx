import { useEffect, useState } from "react";
import {
  calculateNextGeneration,
  createGrid,
} from "../../utils/calculate.gol.js";
import CellularAutomata from "../molecules/CellularAutomata.jsx";

const GameOfLife = () => {
  const gameProps = {
    population: 15,
    cellResolution: 15,
    generationsPerSecond: 200,
  };
  const { population, cellResolution, generationsPerSecond } = gameProps;
  const gridProps = {
    rows: Math.ceil(window.innerHeight / cellResolution),
    columns: Math.ceil(window.innerWidth / cellResolution),
  };

  const [grid, setGrid] = useState();
  const [paused, setPaused] = useState(true);
  //   const [genTstamps, setgenTstamps] = useState([]);

  useEffect(
    () => setGrid(createGrid(gridProps.rows, gridProps.columns, population)),
    []
  );
  const handleGridChange = (grid) => {}; // drawGrid(grid, canvasRef, gameProps)

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setGrid((grid) => calculateNextGeneration(grid));
      handleGridChange(grid);

      //Profile perfomance of GOL engine
      //   setgenTstamps((timestamps) => [...timestamps, Date.now()]);
      //   if (genTstamps?.length % 100 === 0)
      //     console.log(
      //       `Time taken for 100 Gens: ${
      //         genTstamps[genTstamps.length - 1] -
      //         genTstamps[genTstamps.length - 100]
      //       }ms`
      //     );
    }, 1000 / generationsPerSecond);

    return () => clearInterval(interval);
  }, [grid, generationsPerSecond, paused]);

  return (
    <CellularAutomata
      grid={grid}
      setGrid={setGrid}
      gameProps={gameProps}
      theme="dark"
      setPaused={setPaused}
    />
  );
};

export default GameOfLife;
