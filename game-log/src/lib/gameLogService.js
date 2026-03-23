const STORAGE_KEY = 'logged_games'

const VALID_STATUSES = new Set(['Played', 'Playing', 'Want to Play'])

/**
 * @typedef {'Played' | 'Playing' | 'Want to Play'} GameStatus
 */

/**
 * @typedef {{ id: number, name: string, coverUrl: string|null, releaseYear: string|null }} Game
 */

/**
 * @typedef {{ id: number, name: string, coverUrl: string|null, releaseYear: string|null, status: GameStatus, addedAt: string }} LoggedGame
 */

/**
 * Return all logged games.
 * @returns {LoggedGame[]}
 */
export function getGames() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return Array.isArray(parsed) ? parsed : []
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
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...games, entry]))
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch (err) {
    throw new Error(`Failed to update status: ${err.message}`)
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch (err) {
    throw new Error(`Failed to remove game: ${err.message}`)
  }

  return true
}
