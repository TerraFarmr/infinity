import { useEffect, useState } from "react";
import StatsImpl from "stats.js";
import { genCounter, showControlPanel } from "../../utils/profiler.gol.js";
import CellularAutomata from "../molecules/CellularAutomata.jsx";
import {
  calculateNextGeneration,
  createGrid,
} from "../../utils/calculate.gol.js";

const GameOfLife = (gameProps) => {
  let { population, cellResolution, generationsPerSecond, theme, devMode } =
    gameProps;
  const gridProps = {
    rows: Math.ceil(window.innerHeight / cellResolution),
    columns: Math.ceil(window.innerWidth / cellResolution),
  };

  const [grid, setGrid] = useState();
  const [paused, setPaused] = useState(true);
  const [genTstamps, setgenTstamps] = useState([]);
  const [stats] = useState(() => new StatsImpl());

  useEffect(() => {
    if (devMode) showControlPanel(stats);
  }, []);

  useEffect(
    () => setGrid(createGrid(gridProps.rows, gridProps.columns, population)),
    [population, cellResolution]
  );

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {

      //Update Grid
      if (devMode) genCounter(setgenTstamps);
      if (devMode) stats.begin();
      setGrid((grid) => calculateNextGeneration(grid));
      if (devMode) stats.end();
    }, 1000 / generationsPerSecond);

    return () => clearInterval(interval);
  }, [grid, generationsPerSecond, paused]);

  return (
    <CellularAutomata
      grid={grid}
      setGrid={setGrid}
      gameProps={gameProps}
      theme={theme}
      setPaused={setPaused}
    />
  );
};

export default GameOfLife;
