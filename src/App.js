import AppRoutes from "./components/AppRoutes";
import {BrowserRouter} from "react-router-dom";

function App() {
  return (
    <div className="App">
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    </div>
  );
}

export default App;