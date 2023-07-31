import { Provider } from "react-redux";
import NavTree from "./src/NavTree";
import { store } from "./src/store";

export default function App() {
  return (
    <Provider store={store}>
      <NavTree />
    </Provider>
  );
}
