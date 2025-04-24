import { useState } from "react";
import { Link } from "react-router-dom";

import "./RockPaperScissors.css";

const choices = ["rock", "paper", "scissors"];
const getRandomChoice = () => choices[Math.floor(Math.random() * choices.length)];

const outcomes = {
  rock: { rock: "draw", paper: "lose", scissors: "win" },
  paper: { rock: "win", paper: "draw", scissors: "lose" },
  scissors: { rock: "lose", paper: "win", scissors: "draw" },
};

export default function RockPaperScissors() {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState("");

  const playSound = (outcome) => {
    const soundMap = {
      win: new Audio("/sounds/win.mp3"),
      lose: new Audio("/sounds/lose.mp3"),
      draw: new Audio("/sounds/draw.mp3"),
    };
    soundMap[outcome]?.play();
  };

  const handleClick = (choice) => {
    const computer = getRandomChoice();
    const outcome = outcomes[choice][computer];

    setPlayerChoice(choice);
    setComputerChoice(computer);
    setResult(outcome);
    playSound(outcome);
  };

  return (
    <div className="rps-container">
      <h1>Rock Paper Scissors</h1>
      <div className="choices">
        {choices.map((choice) => (
          <button
            key={choice}
            className={`choice-btn ${playerChoice === choice ? "selected" : ""}`}
            onClick={() => handleClick(choice)}
          >
            {choice}
          </button>
        ))}
      </div>

      <Link to="/" className="back-button">← Back to Home</Link>

      {result && (
        <div className="results">
          <p>You chose: <strong>{playerChoice}</strong></p>
          <p>Computer chose: <strong>{computerChoice}</strong></p>
          <h2>You {result}!</h2>
        </div>
      )}
    </div>
  );
}
