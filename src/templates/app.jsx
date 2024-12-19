import React, { useState, useEffect } from "react";
import GameOfLife from "../components/organisms/GameOfLife.jsx";
import { addSettingsPane, devModeMonitor } from "../utils/profiler.gol.js";

const App = () => {
  const devMode = devModeMonitor();
  const [settings, setSettings] = useState({
    population: 25,
    cellResolution: 10,
    generationsPerSecond: 25,
    dark: true,
  });

  useEffect(() => {
    if (devMode) addSettingsPane(settings, setSettings);
  }, []);

  return (
    <GameOfLife
      population={settings.population}
      cellResolution={settings.cellResolution}
      generationsPerSecond={settings.generationsPerSecond}
      theme={settings.dark ? "dark" : "light"}
      devMode={devMode}
    />
  );
};

export default App;
