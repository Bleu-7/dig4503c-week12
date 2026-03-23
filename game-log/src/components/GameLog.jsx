import { useState, useEffect } from 'react'
import { getGames, updateStatus, removeGame } from '@/lib/gameLogService'

const STATUSES = ['Want to Play', 'Playing', 'Played']

function GameLog({ refreshKey }) {
  const [games, setGames] = useState([])

  useEffect(() => {
    setGames(getGames())
  }, [refreshKey])

  function handleStatusChange(id, status) {
    try {
      updateStatus(id, status)
      setGames((prev) => prev.map((g) => g.id === id ? { ...g, status } : g))
    } catch (err) {
      console.error(err)
    }
  }

  function handleRemove(id) {
    try {
      removeGame(id)
      setGames((prev) => prev.filter((g) => g.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  if (games.length === 0) return <p>No games logged yet.</p>

  return (
    <ul>
      {games.map((game) => (
        <li key={game.id}>
          {game.coverUrl && (
            <img src={game.coverUrl} alt={game.name} width={64} />
          )}
          <span>{game.name}</span>
          {game.releaseYear && <span> ({game.releaseYear})</span>}
          <select
            value={game.status}
            onChange={(e) => handleStatusChange(game.id, e.target.value)}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button onClick={() => handleRemove(game.id)}>Remove</button>
        </li>
      ))}
    </ul>
  )
}

export default GameLog
