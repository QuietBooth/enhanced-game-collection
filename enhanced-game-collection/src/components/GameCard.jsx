import { Link } from "react-router-dom";
import "./GameCard.css";

export default function GameCard({ name, path }) {
  return (
    <Link to={path} className="game-card">
      <div className="card-inner">
        <h2>{name}</h2>
      </div>
    </Link>
  );
}
