const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY
const BASE_URL = 'https://www.googleapis.com/youtube/v3'

/**
 * Fetch the top YouTube trailer for a game title.
 * @param {string} gameName
 * @returns {Promise<{ videoId: string, title: string, thumbnail: string } | null>}
 */
export async function fetchGameTrailer(gameName) {
  if (!API_KEY) throw new Error('YouTube API key is missing. Set VITE_YOUTUBE_API_KEY in .env.local.')

  const query = encodeURIComponent(`${gameName} official game trailer`)
  const url = `${BASE_URL}/search?part=snippet&q=${query}&type=video&maxResults=1&key=${API_KEY}`

  const response = await fetch(url)
  if (!response.ok) throw new Error(`YouTube API error: ${response.status}`)

  const data = await response.json()
  const item = data.items?.[0]
  if (!item) return null

  return {
    videoId: item.id.videoId,
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails?.high?.url ?? null,
  }
}
