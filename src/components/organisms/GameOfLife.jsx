import { useEffect, useState } from "react";
import StatsImpl from "stats.js";
import {
  genCounter,
  showControlPanel,
  addSettingsPane,
} from "../../utils/profiler.gol.js";
import CellularAutomata from "../molecules/CellularAutomata.jsx";
import { useSelector, useDispatch } from "react-redux";
import { updateProp } from "../../redux/gamePropSlice.js"; // assuming updateProp is an action creator
import {
  calculateNextGeneration,
  createGrid,
} from "../../utils/calculate.gol.js";

const GameOfLife = ({ devMode }) => {
  const dispatch = useDispatch();
  const [genTstamps, setgenTstamps] = useState([]);
  const [stats] = useState(() => new StatsImpl());
  const settings = useSelector((state) => state.gameProps);

  const { population, cellResolution, generationsPerSecond, dark, paused } =
    settings;
  const theme = dark ? "dark" : "light";
  const gridProps = {
    rows: Math.ceil(window.innerHeight / cellResolution),
    columns: Math.ceil(window.innerWidth / cellResolution),
  };

  const [grid, setGrid] = useState();
  const updateSettings = (key, value) => {
    dispatch(updateProp({ prop: key, value: value }));
  };

  useEffect(() => {
    if (devMode) showControlPanel(stats);

    if (devMode)
      addSettingsPane(
        {
          population,
          cellResolution,
          generationsPerSecond,
          dark,
        },
        updateSettings
      );
  }, []);

  useEffect(
    () => setGrid(createGrid(gridProps.rows, gridProps.columns, population)),
    [population, cellResolution]
  );

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      if (devMode) genCounter(setgenTstamps);
      if (devMode) stats.begin();
      setGrid((grid) => calculateNextGeneration(grid));
      if (devMode) stats.end();
    }, 1000 / generationsPerSecond);

    return () => clearInterval(interval);
  }, [grid, generationsPerSecond, paused]);

  return <CellularAutomata grid={grid} setGrid={setGrid} theme={theme} />;
};

export default GameOfLife;
