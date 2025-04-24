import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./SpaceInvaders.css";

export default function SpaceInvaders() {
  const [playerX, setPlayerX] = useState(5);
  const [bullets, setBullets] = useState([]);
  const [aliens, setAliens] = useState([]);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [boss, setBoss] = useState(null);

  const gridCols = 11;
  const gridRows = 12;
  const gameRef = useRef(null);

  useEffect(() => {
    generateAliens();
    gameRef.current.focus();
  }, [level]);

  const generateAliens = () => {
    let newAliens = [];
    const rows = 2 + Math.floor(level / 2);
    const cols = 4 + level;

    for (let row = 0; row < Math.min(rows, 5); row++) {
      for (let col = 0; col < Math.min(cols, 9); col++) {
        newAliens.push({
          x: col,
          y: row,
          type: row % 2 === 0 ? "slow" : "fast",
        });
      }
    }
    setAliens(newAliens);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setAliens((prev) =>
        prev.map((alien) => ({
          ...alien,
          y: alien.y + 1,
        }))
      );
    }, Math.max(1500 - level * 100, 400));  
    return () => clearInterval(interval);
  }, [level]);

  useEffect(() => {
    const bulletInterval = setInterval(() => {
      setBullets((prev) =>
        prev
          .map((b) => ({ ...b, y: b.y - 1 }))
          .filter((b) => b.y >= 0)
      );
    }, 100);

    return () => clearInterval(bulletInterval);
  }, []);

  const shoot = () => {
    new Audio("/sounds/pew.mp3").play();
    setBullets([...bullets, { x: playerX, y: gridRows - 2 }]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft" && playerX > 0) setPlayerX(playerX - 1);
    if (e.key === "ArrowRight" && playerX < gridCols - 1) setPlayerX(playerX + 1);
    if (e.key === " " || e.key === "Enter") shoot();
  };

  useEffect(() => {
    let hitAliens = [];

    bullets.forEach((bullet) => {
      aliens.forEach((alien) => {
        if (alien.x === bullet.x && alien.y === bullet.y) {
          hitAliens.push(alien);
        }
      });
    });

    if (hitAliens.length) {
      new Audio("/sounds/explode.mp3").play();
      setAliens((prev) => prev.filter((a) => !hitAliens.includes(a)));
      setBullets((prev) =>
        prev.filter((b) => !hitAliens.some((a) => a.x === b.x && a.y === b.y))
      );
      setScore((s) => s + hitAliens.length * 10);
    }

    if (aliens.some((a) => a.y >= gridRows - 1)) {
      setLives((l) => l - 1);
      setPlayerX(5);
      generateAliens();
    }

    if (aliens.length === 0 && !boss) {
      setBoss({ x: 4, y: 0, health: 3 + level });
    }
  }, [bullets, aliens]);

  useEffect(() => {
    if (!boss) return;

    const bossInterval = setInterval(() => {
      setBoss((prev) => (prev ? { ...prev, y: prev.y + 1 } : null));
    }, 700);

    return () => clearInterval(bossInterval);
  }, [boss]);

  useEffect(() => {
    if (!boss) return;

    const hit = bullets.some((b) => b.x === boss.x && b.y === boss.y);
    if (hit) {
      new Audio("/sounds/explode.mp3").play();
      setBoss((prev) =>
        prev && prev.health > 1
          ? { ...prev, health: prev.health - 1 }
          : null
      );
      setBullets((prev) =>
        prev.filter((b) => !(b.x === boss.x && b.y === boss.y))
      );
      if (boss.health <= 1) {
        setScore((s) => s + 100);
        setLevel((l) => l + 1);
      }
    }

    if (boss && boss.y >= gridRows - 1) {
      setLives((l) => l - 1);
      setBoss(null);
    }
  }, [bullets, boss]);

  if (lives <= 0) {
    return (
      <div className="space-container">
        <h1>👾 Space Invaders</h1>
        <h2>Game Over</h2>
        <p>Score: {score}</p>
        <Link to="/" className="back-button">← Back to Home</Link>
      </div>
    );
  }

  return (
    <div
      className="space-container"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      ref={gameRef}
    >
      <h1>👾 Space Invaders</h1>
      <p className="tip">← Move | → Move | Space to Shoot</p>
      <p>Level: {level} | Score: {score} | Lives: {lives}</p>

      <div className="grid">
        {[...Array(gridCols * gridRows)].map((_, i) => {
          const x = i % gridCols;
          const y = Math.floor(i / gridCols);
          const isPlayer = x === playerX && y === gridRows - 1;
          const isBullet = bullets.some((b) => b.x === x && b.y === y);
          const isAlien = aliens.some((a) => a.x === x && a.y === y);
          const isBoss = boss && boss.x === x && boss.y === y;

          return (
            <div
              key={i}
              className={`cell ${
                isPlayer
                  ? "player"
                  : isBoss
                  ? "boss"
                  : isAlien
                  ? "alien"
                  : isBullet
                  ? "bullet"
                  : ""
              }`}
            />
          );
        })}
      </div>
      <Link to="/" className="back-button">← Back to Home</Link>
    </div>
  );
}
