import GameOfLife from "../components/organisms/GameOfLife.jsx";

const App = () => (
  <GameOfLife
    population={5}
    cellResolution={10}
    generationsPerSecond={20}
    theme="dark"
  />
);

export default App;
