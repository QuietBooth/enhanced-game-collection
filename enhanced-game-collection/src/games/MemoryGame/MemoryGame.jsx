import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./MemoryGame.css";

const CARD_PAIRS = ["🍕", "🍔", "🍟", "🌭", "🍩", "🍿"];
const shuffledDeck = () => {
  const cards = [...CARD_PAIRS, ...CARD_PAIRS]
    .sort(() => Math.random() - 0.5)
    .map((value, index) => ({ id: index, value, flipped: false, matched: false }));
  return cards;
};

export default function MemoryGame() {
  const [cards, setCards] = useState(shuffledDeck());
  const [flippedCards, setFlippedCards] = useState([]);
  const [matches, setMatches] = useState(0);
  const [time, setTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [showWinMessage, setShowWinMessage] = useState(false);

  useEffect(() => {
    let interval;
    if (timerRunning) {
      interval = setInterval(() => setTime((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  useEffect(() => {
    if (matches === CARD_PAIRS.length) {
      setTimerRunning(false);
      setShowWinMessage(true);

      setTimeout(() => {
        setCards(shuffledDeck());
        setMatches(0);
        setTime(0);
        setFlippedCards([]);
        setShowWinMessage(false);
      }, 3000);
    }
  }, [matches]);

  const handleCardClick = (index) => {
    if (!timerRunning) setTimerRunning(true);
    if (flippedCards.length === 2 || cards[index].flipped || cards[index].matched) return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    const newFlipped = [...flippedCards, index];
    setCards(newCards);
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (newCards[first].value === newCards[second].value) {
        newCards[first].matched = newCards[second].matched = true;
        setMatches((m) => m + 1);
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          newCards[first].flipped = newCards[second].flipped = false;
          setCards([...newCards]);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="memory-game">
      <h1>🧠 Memory Game</h1>
      <p>Time: {time}s</p>

      <div className="grid">
        {cards.map((card, i) => (
          <div
            key={card.id}
            className={`card ${card.flipped || card.matched ? "flipped" : ""}`}
            onClick={() => handleCardClick(i)}
          >
            <div className="card-inner">
              <div className="card-front">❓</div>
              <div className="card-back">{card.value}</div>
            </div>
          </div>
        ))}
      </div>

      <Link to="/" className="back-button">← Back to Home</Link>

      {showWinMessage && (
        <div className="popup">
          <div className="popup-content">
            <h2>🎉 You Win!</h2>
            <p>Your time: {time} seconds</p>
            <p>Restarting in 3 seconds...</p>
          </div>
        </div>
      )}
    </div>
  );
}
