import { Provider } from "react-redux";
import store from "../../utils/redux/store";
import Toolbar from "../atoms/Toolbar";
import InfiniteCanvas from "../organisms/canvas";
import Minimap from "../molecules/Minimap";

const Infinity = () => (
  <Provider store={store}>
    <Toolbar />
    <InfiniteCanvas />
    <Minimap />
  </Provider>
);

export default Infinity;
