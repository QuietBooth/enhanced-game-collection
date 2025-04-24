import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./ConnectFour.css";

const ROWS = 6;
const COLS = 7;
const EMPTY = null;

const createBoard = () => Array(ROWS).fill(null).map(() => Array(COLS).fill(EMPTY));

export default function ConnectFour() {
  const [board, setBoard] = useState(createBoard());
  const [playerTurn, setPlayerTurn] = useState("red");
  const [winner, setWinner] = useState(null);
  const [timer, setTimer] = useState(10);

  useEffect(() => {
    if (winner) return;

    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          handleTimeout();
          return 10;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [playerTurn, winner]);

  const handleTimeout = () => {
    if (playerTurn === "yellow") return;
    makeAIMove(); 
  };

  const dropPiece = (col) => {
    if (winner) return;

    const newBoard = board.map((row) => [...row]);

    for (let r = ROWS - 1; r >= 0; r--) {
      if (!newBoard[r][col]) {
        newBoard[r][col] = playerTurn;
        break;
      }
    }

    setBoard(newBoard);
    checkWin(newBoard);
    setPlayerTurn(playerTurn === "red" ? "yellow" : "red");
    setTimer(10);
  };

  const makeAIMove = () => {
    const validCols = board[0].map((_, colIndex) => colIndex).filter((col) => board[0][col] === EMPTY);
    const chosenCol = validCols[Math.floor(Math.random() * validCols.length)];
    setTimeout(() => dropPiece(chosenCol), 500); // delay for realism
  };

  useEffect(() => {
    if (playerTurn === "yellow" && !winner) {
      makeAIMove();
    }
  }, [playerTurn]);

  const checkWin = (b) => {
    const directions = [
      [0, 1], [1, 0], [1, 1], [1, -1]
    ];

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const player = b[r][c];
        if (!player) continue;

        for (let [dx, dy] of directions) {
          let count = 1;
          for (let i = 1; i < 4; i++) {
            const nr = r + dx * i;
            const nc = c + dy * i;
            if (nr < 0 || nc < 0 || nr >= ROWS || nc >= COLS || b[nr][nc] !== player) break;
            count++;
          }
          if (count === 4) {
            setWinner(player);
            return;
          }
        }
      }
    }
  };

  return (
    <div className="connect-four">
      <h1>🟡 Connect Four 🔴</h1>
      <p>{winner ? `${winner.toUpperCase()} wins! 🎉` : `Turn: ${playerTurn.toUpperCase()} | Timer: ${timer}s`}</p>

      <div className="board">
        {board.map((row, rowIndex) => (
          <div className="row" key={rowIndex}>
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`cell ${cell || ""}`}
                onClick={() => playerTurn === "red" && dropPiece(colIndex)}
              />
            ))}
          </div>
        ))}
      </div>

      {winner && <p className="winner">🏆 {winner.toUpperCase()} wins!</p>}
      <Link to="/" className="back-button">← Back to Home</Link>
    </div>
  );
}
