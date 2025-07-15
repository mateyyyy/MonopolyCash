import { Routes, Route } from "react-router-dom";
import Config from "./pages/Config";
import "./App.css";
import Game from "./pages/Game";

function App() {
  return (
    <Routes>
      <Route path="/game" element={<Game />} />
      <Route path="/config" element={<Config />} />
    </Routes>
  );
}

export default App;
