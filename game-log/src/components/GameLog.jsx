import { useState, useEffect } from 'react'
import { getGames, updateStatus, removeGame } from '@/lib/gameLogService'
import ReviewForm from '@/components/ReviewForm'

const STATUSES = ['Want to Play', 'Playing', 'Played']

function GameLog({ refreshKey }) {
  const [games, setGames] = useState([])
  const [openReviewId, setOpenReviewId] = useState(null)

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
      if (openReviewId === id) setOpenReviewId(null)
    } catch (err) {
      console.error(err)
    }
  }

  function handleReviewSave(updated) {
    setGames((prev) => prev.map((g) => g.id === updated.id ? updated : g))
    setOpenReviewId(null)
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
          {game.rating && <span>{game.rating}/10</span>}
          {game.review && (
            <span title={game.review}>
              {game.review.length > 80 ? game.review.slice(0, 80) + '…' : game.review}
            </span>
          )}
          <button onClick={() => handleRemove(game.id)}>Remove</button>
          <button onClick={() => setOpenReviewId(openReviewId === game.id ? null : game.id)}>
            {game.rating || game.review ? 'Edit Review' : 'Add Review'}
          </button>
          {openReviewId === game.id && (
            <ReviewForm game={game} onSave={handleReviewSave} />
          )}
        </li>
      ))}
    </ul>
  )
}

export default GameLog
