import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { getGames } from '@/lib/gameLogService'

const STATUSES = ['Played', 'Playing', 'Want to Play']

function ProfilePage() {
  const { user } = useAuth()
  const games = getGames()

  const countsByStatus = Object.fromEntries(
    STATUSES.map((s) => [s, games.filter((g) => g.status === s).length])
  )

  const recentReviews = games
    .filter((g) => g.rating !== null || g.review !== null)
    .sort((a, b) => (b.reviewedAt ?? '').localeCompare(a.reviewedAt ?? ''))
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3">
          <Link to="/" className="text-sm text-zinc-500 transition-colors hover:text-zinc-200">
            ← Back
          </Link>
          <h1 className="text-xl font-bold tracking-tight text-violet-400">GameLog</h1>
        </div>
      </header>
      <main className="mx-auto max-w-4xl space-y-8 px-4 py-8">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">{user.username}</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Member since {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Stats</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {STATUSES.map((s) => (
              <div key={s} className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-center">
                <p className="text-2xl font-bold text-zinc-100">{countsByStatus[s]}</p>
                <p className="mt-1 text-xs text-zinc-500">{s}</p>
              </div>
            ))}
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-center">
              <p className="text-2xl font-bold text-violet-400">{games.length}</p>
              <p className="mt-1 text-xs text-zinc-500">Total Logged</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Recent Reviews</h2>
          {recentReviews.length === 0 ? (
            <p className="text-sm text-zinc-500">No reviews yet.</p>
          ) : (
            <ul className="space-y-3">
              {recentReviews.map((g) => (
                <li key={g.id} className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-zinc-100">{g.name}</p>
                    {g.rating !== null && (
                      <span className="shrink-0 text-xs font-medium text-violet-400">{g.rating}/10</span>
                    )}
                  </div>
                  {g.review && <p className="text-sm leading-relaxed text-zinc-400">{g.review}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  )
}

export default ProfilePage
