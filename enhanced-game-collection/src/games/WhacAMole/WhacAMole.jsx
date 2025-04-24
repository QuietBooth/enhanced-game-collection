import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./WhacAMole.css";

const generateMoleType = () => (Math.random() < 0.2 ? "bonus" : "normal");

export default function WhacAMole() {
  const [score, setScore] = useState(0);
  const [activeHole, setActiveHole] = useState(null);
  const [moleType, setMoleType] = useState("normal");
  const [speed, setSpeed] = useState(1000);

  useEffect(() => {
    const interval = setInterval(() => {
      const newHole = Math.floor(Math.random() * 6);
      setActiveHole(newHole);
      setMoleType(generateMoleType());
    }, speed);

    return () => clearInterval(interval);
  }, [speed]);

  useEffect(() => {
    if (score >= 10 && speed > 500) {
      setSpeed(800);
    }
    if (score >= 20 && speed > 300) {
      setSpeed(600);
    }
  }, [score]);

  const handleMoleClick = () => {
    if (moleType === "bonus") {
      setScore(score + 5);
    } else {
      setScore(score + 1);
    }
    setActiveHole(null);
  };

  return (
    <div className="whac-container">
      <h1>🐹 Whac-a-Mole</h1>
      <p>Score: {score}</p>
      <div className="grid">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="hole">
            {activeHole === i && (
              <div
                className={`mole ${moleType}`}
                onClick={handleMoleClick}
              >
                {moleType === "bonus" ? "👑" : "🐹"}
              </div>
            )}
          </div>
        ))}
      </div>
      <Link to="/" className="back-button">← Back to Home</Link>
    </div>
  );
}
