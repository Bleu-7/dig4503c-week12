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
    <div>
      <p><Link to="/">← Back</Link></p>
      <h1>{user.username}'s Profile</h1>
      <p>Member since: {new Date(user.createdAt).toLocaleDateString()}</p>

      <h2>Stats</h2>
      <ul>
        {STATUSES.map((s) => (
          <li key={s}>{s}: {countsByStatus[s]}</li>
        ))}
        <li>Total logged: {games.length}</li>
      </ul>

      <h2>Recent Reviews</h2>
      {recentReviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <ul>
          {recentReviews.map((g) => (
            <li key={g.id}>
              <strong>{g.name}</strong>
              {g.rating !== null && <span> — {g.rating}/10</span>}
              {g.review && <p>{g.review}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ProfilePage
