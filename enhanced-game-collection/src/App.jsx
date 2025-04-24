import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import RockPaperScissors from "./games/RockPaperScissors/RockPaperScissors";
import MemoryGame from "./games/MemoryGame/MemoryGame";
import WhacAMole from "./games/WhacAMole/WhacAMole";
import Breakout from "./games/Breakout/Breakout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rock-paper-scissors" element={<RockPaperScissors />} />
        <Route path="/memory-game" element={<MemoryGame />} />
        <Route path="/whac-a-mole" element={<WhacAMole />} />
        <Route path="/breakout" element={<Breakout />} />
      </Routes>
    </Router>
  );
}

export default App;
