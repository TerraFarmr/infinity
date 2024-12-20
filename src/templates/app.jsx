import React, { useState, useEffect } from "react";
import { Provider } from "react-redux";
import GameOfLife from "../components/organisms/GameOfLife.jsx";
import { devModeMonitor } from "../utils/profiler.gol.js";
import store from "../redux/store";

const App = () => {
  const devMode = devModeMonitor();

  return (
    <Provider store={store}>
      <GameOfLife devMode={devMode} />
    </Provider>
  );
};

export default App;
