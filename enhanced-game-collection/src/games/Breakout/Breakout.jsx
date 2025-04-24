import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Breakout.css";

export default function Breakout() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [paddleWidth, setPaddleWidth] = useState(100);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let ballRadius = 10;
    let x = canvas.width / 2;
    let y = canvas.height - 30;
    let speed = 1.5 + level * 0.5;
    let dx = speed;
    let dy = -speed;
    let paddleX = (canvas.width - paddleWidth) / 2;
    let rightPressed = false;
    let leftPressed = false;

    let localBricks = generateBricks(level);

    const keyDownHandler = (e) => {
      if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
      } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
      }
    };

    const keyUpHandler = (e) => {
      if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
      } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
      }
    };

    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);

    function drawBall() {
      ctx.beginPath();
      ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#FFD700";
      ctx.fill();
      ctx.closePath();
    }

    function drawPaddle() {
      ctx.beginPath();
      ctx.rect(paddleX, canvas.height - 10, paddleWidth, 10);
      ctx.fillStyle = "#00bcd4";
      ctx.fill();
      ctx.closePath();
    }

    function drawBricks() {
      for (let r = 0; r < localBricks.length; r++) {
        for (let c = 0; c < localBricks[r].length; c++) {
          const b = localBricks[r][c];
          if (!b.broken) {
            ctx.beginPath();
            ctx.rect(b.x, b.y, 75, 20);
            ctx.fillStyle = "#f44336";
            ctx.fill();
            ctx.closePath();
          }
        }
      }
    }

    function detectCollision() {
      for (let r = 0; r < localBricks.length; r++) {
        for (let c = 0; c < localBricks[r].length; c++) {
          const b = localBricks[r][c];
          if (!b.broken) {
            if (
              x > b.x &&
              x < b.x + 75 &&
              y > b.y &&
              y < b.y + 20
            ) {
              dy = -dy;
              b.broken = true;
              setScore((prev) => prev + 1);

              if (Math.random() < 0.2) {
                setPaddleWidth((w) => Math.min(w + 20, canvas.width));
              }

              if (localBricks.flat().every((b) => b.broken)) {
                setTimeout(() => {
                  setLevel((prev) => prev + 1);
                  setScore(0);
                }, 500);
              }
            }
          }
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBall();
      drawPaddle();
      drawBricks();
      detectCollision();

      if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
      }

      if (y + dy < ballRadius) {
        dy = -dy;
      } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
          dy = -Math.abs(dy);
          dx *= 1.05;
          dy *= 1.05;

          dx = Math.max(Math.min(dx, 10), -10);
          dy = Math.max(Math.min(dy, 10), -10);
        } else {
          setGameOver(true); 
          setTimeout(() => {
            window.location.reload();
          }, 2000); 
          return;
        }
      }

      x += dx;
      y += dy;

      if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
      } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
      }

      requestAnimationFrame(draw);
    }

    draw();

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
      document.removeEventListener("keyup", keyUpHandler);
    };
  }, [level]);

  return (
    <div className="breakout-container">
      <h1>🧱 Breakout</h1>
      <p>Level: {level} | Score: {score}</p>
      <canvas ref={canvasRef} width="800" height="600" />
      <Link to="/" className="back-button">← Back to Home</Link>

      {gameOver && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>💥 Game Over</h2>
            <p>Restarting...</p>
          </div>
        </div>
      )}
    </div>
  );
}

function generateBricks(level) {
  const rowCount = 3 + level;
  const colCount = 8;
  const bricks = [];

  for (let r = 0; r < rowCount; r++) {
    bricks[r] = [];
    for (let c = 0; c < colCount; c++) {
      bricks[r][c] = {
        x: c * (75 + 10) + 30,
        y: r * (20 + 10) + 30,
        broken: false,
      };
    }
  }
  return bricks;
}
