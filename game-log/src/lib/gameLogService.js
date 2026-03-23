import { getCurrentUser } from '@/lib/authService'

const VALID_STATUSES = new Set(['Played', 'Playing', 'Want to Play'])

/**
 * Returns the localStorage key scoped to the current user.
 * Throws if no user is logged in.
 */
function getStorageKey() {
  const user = getCurrentUser()
  if (!user) throw new Error('Not logged in.')
  return `logged_games_${user.id}`
}

/**
 * @typedef {'Played' | 'Playing' | 'Want to Play'} GameStatus
 */

/**
 * @typedef {{ id: number, name: string, coverUrl: string|null, releaseYear: string|null }} Game
 */

/**
 * @typedef {{ id: number, name: string, coverUrl: string|null, releaseYear: string|null, status: GameStatus, addedAt: string, rating: number|null, review: string|null, reviewedAt: string|null }} LoggedGame
 */

/**
 * Return all logged games.
 * @returns {LoggedGame[]}
 */
export function getGames() {
  try {
    const parsed = JSON.parse(localStorage.getItem(getStorageKey()))
    if (!Array.isArray(parsed)) return []
    return parsed.filter((g) => g && typeof g === 'object' && typeof g.id === 'number').map((g) => ({
      ...g,
      rating: typeof g.rating === 'number' ? g.rating : null,
      review: typeof g.review === 'string' ? g.review : null,
      reviewedAt: typeof g.reviewedAt === 'string' ? g.reviewedAt : null,
    }))
  } catch {
    return []
  }
}

/**
 * Add a game to the log. No-ops if the game is already logged.
 * @param {Game} game
 * @param {GameStatus} status
 * @returns {LoggedGame} The newly added entry.
 */
export function addGame(game, status) {
  if (!VALID_STATUSES.has(status)) throw new Error(`Invalid status: ${status}`)

  const games = getGames()

  const existing = games.find((g) => g.id === game.id)
  if (existing) return existing

  const entry = {
    id: game.id,
    name: game.name,
    coverUrl: game.coverUrl,
    releaseYear: game.releaseYear,
    status,
    addedAt: new Date().toISOString(),
    rating: null,
    review: null,
    reviewedAt: null,
  }

  try {
    localStorage.setItem(getStorageKey(), JSON.stringify([...games, entry]))
  } catch (err) {
    throw new Error(`Failed to save game: ${err.message}`)
  }

  return entry
}

/**
 * Update the status of a logged game.
 * @param {number} id - The game's id.
 * @param {GameStatus} status
 * @returns {LoggedGame|null} The updated entry, or null if not found.
 */
export function updateStatus(id, status) {
  if (!VALID_STATUSES.has(status)) throw new Error(`Invalid status: ${status}`)

  const games = getGames()
  let updated = null

  const next = games.map((g) => {
    if (g.id !== id) return g
    updated = { ...g, status }
    return updated
  })

  if (!updated) return null

  try {
    localStorage.setItem(getStorageKey(), JSON.stringify(next))
  } catch (err) {
    throw new Error(`Failed to update status: ${err.message}`)
  }

  return updated
}

/**
 * Update the rating and review of a logged game.
 * @param {number} id - The game's id.
 * @param {number|null} rating - A value from 1–10, or null to clear.
 * @param {string|null} review - Review text, or null to clear.
 * @returns {LoggedGame|null} The updated entry, or null if not found.
 */
export function updateReview(id, rating, review) {
  if (rating !== null && (!Number.isFinite(rating) || !Number.isInteger(rating) || rating < 1 || rating > 10)) {
    throw new Error(`Invalid rating: ${rating}. Must be an integer 1–10 or null.`)
  }

  const games = getGames()
  let updated = null

  const next = games.map((g) => {
    if (g.id !== id) return g
    updated = { ...g, rating: rating ?? null, review: review ?? null, reviewedAt: new Date().toISOString() }
    return updated
  })

  if (!updated) return null

  try {
    localStorage.setItem(getStorageKey(), JSON.stringify(next))
  } catch (err) {
    throw new Error(`Failed to update review: ${err.message}`)
  }

  return updated
}

/**
 * Remove a game from the log.
 * @param {number} id - The game's id.
 * @returns {boolean} True if a game was removed, false if it wasn't found.
 */
export function removeGame(id) {
  const games = getGames()
  const next = games.filter((g) => g.id !== id)

  if (next.length === games.length) return false

  try {
    localStorage.setItem(getStorageKey(), JSON.stringify(next))
  } catch (err) {
    throw new Error(`Failed to remove game: ${err.message}`)
  }

  return true
}
