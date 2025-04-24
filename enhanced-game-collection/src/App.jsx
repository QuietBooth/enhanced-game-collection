import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import RockPaperScissors from "./games/RockPaperScissors/RockPaperScissors";
import MemoryGame from "./games/MemoryGame/MemoryGame";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rock-paper-scissors" element={<RockPaperScissors />} />
        <Route path="/memory-game" element={<MemoryGame />} />
      </Routes>
    </Router>
  );
}

export default App;
