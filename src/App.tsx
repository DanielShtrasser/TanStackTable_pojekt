import { Provider } from "react-redux";

import DataDisplay from "./components/DataDisplay";
import SideMenu from "./components/SideMenu";
import { store } from "./redux/store/store";
import "./App.css";

function App() {
  return (
    <div className="wr">
      <Provider store={store}>
        <SideMenu />
        <DataDisplay />
      </Provider>
    </div>
  );
}

export default App;
