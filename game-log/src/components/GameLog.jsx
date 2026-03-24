import { useState, useEffect } from 'react'
import { getGames, updateStatus, removeGame } from '@/lib/gameLogService'
import ReviewForm from '@/components/ReviewForm'

const STATUSES = ['Want to Play', 'Playing', 'Played']

function GameLog({ refreshKey, onRemove }) {
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
      onRemove?.()
    } catch (err) {
      console.error(err)
    }
  }

  function handleReviewSave(updated) {
    setGames((prev) => prev.map((g) => g.id === updated.id ? updated : g))
    setOpenReviewId(null)
  }

  if (games.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-zinc-500">No games logged yet. Search for a game above to get started.</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">My Log</h2>
      <ul className="space-y-2">
        {games.map((game) => (
          <li key={game.id} className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
            <div className="flex items-start gap-4 p-3">
              {game.coverUrl ? (
                <img src={game.coverUrl} alt={game.name} className="h-16 w-12 shrink-0 rounded object-cover" />
              ) : (
                <div className="h-16 w-12 shrink-0 rounded bg-zinc-800" />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-zinc-100">{game.name}</p>
                    {game.releaseYear && <p className="text-xs text-zinc-500">{game.releaseYear}</p>}
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <select
                      value={game.status}
                      onChange={(e) => handleStatusChange(game.id, e.target.value)}
                      className="rounded border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs text-zinc-300 focus:border-violet-500 focus:outline-none"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => setOpenReviewId(openReviewId === game.id ? null : game.id)}
                      className="rounded px-2 py-1 text-xs text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-violet-400"
                    >
                      {game.rating || game.review ? 'Edit Review' : 'Review'}
                    </button>
                    <button
                      onClick={() => handleRemove(game.id)}
                      className="rounded px-2 py-1 text-xs text-zinc-600 transition-colors hover:bg-zinc-800 hover:text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                {(game.rating || game.review) && (
                  <div className="mt-1.5 flex items-start gap-2">
                    {game.rating && (
                      <span className="shrink-0 text-xs font-medium text-violet-400">{game.rating}/10</span>
                    )}
                    {game.review && (
                      <p className="line-clamp-2 text-xs leading-relaxed text-zinc-400">{game.review}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
            {openReviewId === game.id && (
              <div className="border-t border-zinc-800 bg-zinc-950/50 p-3">
                <ReviewForm game={game} onSave={handleReviewSave} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default GameLog
