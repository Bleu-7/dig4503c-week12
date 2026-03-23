import { useState } from 'react'

const STATUSES = ['Want to Play', 'Playing', 'Played']

function GameResult({ game, onLog }) {
  const [status, setStatus] = useState('Want to Play')

  return (
    <li>
      {game.coverUrl && (
        <img src={game.coverUrl} alt={game.name} width={64} />
      )}
      <span>{game.name}</span>
      {game.releaseYear && <span> ({game.releaseYear})</span>}
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <button onClick={() => onLog(game, status)}>Add to Log</button>
    </li>
  )
}

function SearchResults({ results = [], onLog }) {
  return (
    <ul>
      {results.map((game) => (
        <GameResult key={game.id} game={game} onLog={onLog} />
      ))}
    </ul>
  )
}

export default SearchResults
