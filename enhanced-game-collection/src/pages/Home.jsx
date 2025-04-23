import GameCard from "../components/GameCard";

const games = [
  { name: "Rock Paper Scissors", path: "/rock-paper-scissors" },
  { name: "Memory Game", path: "/memory-game" },
  { name: "Whac-a-Mole", path: "/whac-a-mole" },
  { name: "Breakout", path: "/breakout" },
  { name: "Frogger", path: "/frogger" },
  { name: "Connect Four", path: "/connect-four" },
  { name: "Space Invaders", path: "/space-invaders" },
];

export default function Home() {
  return (
    <div className="home">
      <h1>🎮 Game Arcade</h1>
      <div className="games-grid">
        {games.map(game => (
          <GameCard key={game.name} name={game.name} path={game.path} />
        ))}
      </div>
    </div>
  );
}
