import { useState } from 'react'

const STATUSES = ['Want to Play', 'Playing', 'Played']

function GameResult({ game, onLog, isLogged }) {
  const [status, setStatus] = useState('Want to Play')

  return (
    <li className="flex items-center gap-4 rounded-lg border border-zinc-800 bg-zinc-900 p-3 transition-colors hover:border-zinc-700">
      {game.coverUrl ? (
        <img src={game.coverUrl} alt={game.name} className="h-16 w-12 shrink-0 rounded object-cover" />
      ) : (
        <div className="flex h-16 w-12 shrink-0 items-center justify-center rounded bg-zinc-800 text-xs text-zinc-600">
          No art
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-zinc-100">{game.name}</p>
        {game.releaseYear && <p className="text-xs text-zinc-500">{game.releaseYear}</p>}
        <div className="mt-2 flex items-center gap-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={isLogged}
            className="rounded border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs text-zinc-300 focus:border-violet-500 focus:outline-none disabled:opacity-40"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button
            onClick={() => onLog(game, status)}
            disabled={isLogged}
            className="rounded px-3 py-1.5 text-xs font-medium text-white transition-colors disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-500 bg-violet-600 hover:bg-violet-500"
          >
            {isLogged ? 'Added' : 'Add'}
          </button>
        </div>
      </div>
    </li>
  )
}

function SearchResults({ results = [], onLog, loggedIds = new Set() }) {
  if (results.length === 0) return null

  return (
    <div>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
        Search Results
      </h2>
      <ul className="space-y-2">
        {results.map((game) => (
          <GameResult key={game.id} game={game} onLog={onLog} isLogged={loggedIds.has(game.id)} />
        ))}
      </ul>
    </div>
  )
}

export default SearchResults
