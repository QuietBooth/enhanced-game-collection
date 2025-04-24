import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Frogger.css";

export default function Frogger() {
  const [position, setPosition] = useState({ x: 5, y: 9 });
  const [obstacles, setObstacles] = useState([]);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [invincible, setInvincible] = useState(false);

  const gridSize = { cols: 10, rows: 10 };

  const jumpSound = new Audio("/sounds/jump.mp3");
  const crashSound = new Audio("/sounds/crash.mp3");
  const goalSound = new Audio("/sounds/goal.mp3");

  const move = (dx, dy) => {
    const newX = Math.min(Math.max(position.x + dx, 0), gridSize.cols - 1);
    const newY = Math.min(Math.max(position.y + dy, 0), gridSize.rows - 1);
    setPosition({ x: newX, y: newY });
    jumpSound.play();
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp") move(0, -1);
    if (e.key === "ArrowDown") move(0, 1);
    if (e.key === "ArrowLeft") move(-1, 0);
    if (e.key === "ArrowRight") move(1, 0);
  };

  useEffect(() => {
    const generateObstacle = () => {
      const lane = Math.floor(Math.random() * 4) + 3;
      const speed = Math.random() < 0.5 ? 1 : -1;
      return { x: speed > 0 ? 0 : gridSize.cols - 1, y: lane, speed };
    };

    const interval = setInterval(() => {
      setObstacles((obs) => [...obs, generateObstacle()]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setObstacles((obs) =>
        obs
          .map((o) => ({ ...o, x: o.x + o.speed }))
          .filter((o) => o.x >= 0 && o.x < gridSize.cols)
      );
    }, 300);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (
      obstacles.some((o) => o.x === position.x && o.y === position.y) &&
      !invincible
    ) {
      crashSound.play();
      setLives((l) => l - 1);
      setPosition({ x: 5, y: 9 });
    }
  }, [obstacles, position, invincible]);

  useEffect(() => {
    if (position.y === 0) {
      goalSound.play();
      setScore((s) => s + 10);
      setPosition({ x: 5, y: 9 });

      if (Math.random() < 0.3) {
        setInvincible(true);
        setTimeout(() => setInvincible(false), 3000);
      }
    }
  }, [position]);

  if (lives <= 0) {
    return (
      <div className="frogger-container">
        <h1>🐸 Frogger</h1>
        <h2>💀 Game Over!</h2>
        <p>Score: {score}</p>
        <Link to="/" className="back-button">← Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="frogger-container" tabIndex={0} onKeyDown={handleKeyDown}>
      <h1>🐸 Frogger</h1>
      <p>Lives: {lives} | Score: {score} {invincible && "🛡️"}</p>
      <div className="grid">
        {[...Array(gridSize.rows * gridSize.cols)].map((_, i) => {
          const x = i % gridSize.cols;
          const y = Math.floor(i / gridSize.cols);
          const isFrog = position.x === x && position.y === y;
          const isObstacle = obstacles.some((o) => o.x === x && o.y === y);

          return (
            <div
              key={i}
              className={`cell ${isFrog ? "frog" : ""} ${
                isObstacle ? "obstacle" : ""
              }`}
            />
          );
        })}
      </div>
      <Link to="/" className="back-button">← Back to Home</Link>
    </div>
  );
}
