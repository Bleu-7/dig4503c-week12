const API_KEY = import.meta.env.VITE_RAWG_API_KEY
const BASE_URL = 'https://api.rawg.io/api'

/**
 * Search games by title.
 * @param {string} query
 * @returns {Promise<Array<{ id: number, name: string, coverUrl: string|null, releaseYear: string|null }>>}
 */
export async function searchGames(query) {
  if (!query.trim()) return []

  if (!API_KEY) throw new Error('RAWG API key is missing. Set VITE_RAWG_API_KEY in .env.local.')

  const url = `${BASE_URL}/games?key=${API_KEY}&search=${encodeURIComponent(query)}&page_size=10`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`RAWG API error: ${response.status}`)
  }

  const data = await response.json()
  const results = Array.isArray(data.results) ? data.results : []

  return results.map((game) => ({
    id: game.id,
    name: game.name,
    coverUrl: game.background_image ?? null,
    releaseYear: game.released ? game.released.slice(0, 4) : null,
  }))
}
