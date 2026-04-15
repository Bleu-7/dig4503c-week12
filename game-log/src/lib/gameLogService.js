import { supabase } from '@/lib/supabase'

const VALID_STATUSES = new Set(['Played', 'Playing', 'Want to Play'])

/**
 * @typedef {'Played' | 'Playing' | 'Want to Play'} GameStatus
 */

/**
 * @typedef {{ id: number, name: string, coverUrl: string|null, releaseYear: string|null }} Game
 */

/**
 * @typedef {{ id: number, name: string, coverUrl: string|null, releaseYear: string|null, status: GameStatus, addedAt: string, rating: number|null, review: string|null, reviewedAt: string|null }} LoggedGame
 */

/** Map a Supabase snake_case row back to the camelCase shape the UI expects. */
function toLoggedGame(row) {
  return {
    id: row.id,
    name: row.name,
    coverUrl: row.cover_url,
    releaseYear: row.release_year,
    status: row.status,
    addedAt: row.added_at,
    rating: row.rating ?? null,
    review: row.review ?? null,
    reviewedAt: row.reviewed_at ?? null,
  }
}

/**
 * Return all logged games for the current user, newest first.
 * @returns {Promise<LoggedGame[]>}
 */
export async function getGames() {
  const { data, error } = await supabase
    .from('game_logs')
    .select('*')
    .order('added_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map(toLoggedGame)
}

/**
 * Add a game to the log. No-ops if already logged.
 * @param {Game} game
 * @param {GameStatus} status
 */
export async function addGame(game, status = 'Want to Play') {
  if (!VALID_STATUSES.has(status)) throw new Error(`Invalid status: ${status}`)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not logged in.')

  const { error } = await supabase.from('game_logs').upsert(
    {
      id: game.id,
      user_id: user.id,
      name: game.name,
      cover_url: game.coverUrl,
      release_year: game.releaseYear,
      status,
    },
    { onConflict: 'user_id,id', ignoreDuplicates: true }
  )
  if (error) throw error
}

/**
 * Update the status of a logged game.
 * @param {number} id
 * @param {GameStatus} status
 * @returns {Promise<LoggedGame|null>}
 */
export async function updateStatus(id, status) {
  if (!VALID_STATUSES.has(status)) throw new Error(`Invalid status: ${status}`)

  const { data, error } = await supabase
    .from('game_logs')
    .update({ status })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data ? toLoggedGame(data) : null
}

/**
 * Update the rating and review of a logged game.
 * @param {number} id
 * @param {number|null} rating
 * @param {string|null} review
 * @returns {Promise<LoggedGame|null>}
 */
export async function updateReview(id, rating, review) {
  if (rating !== null && (!Number.isFinite(rating) || !Number.isInteger(rating) || rating < 1 || rating > 10)) {
    throw new Error(`Invalid rating: ${rating}. Must be an integer 1–10 or null.`)
  }

  const { data, error } = await supabase
    .from('game_logs')
    .update({ rating: rating ?? null, review: review ?? null, reviewed_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data ? toLoggedGame(data) : null
}

/**
 * Remove a game from the log.
 * @param {number} id
 */
export async function removeGame(id) {
  const { error } = await supabase
    .from('game_logs')
    .delete()
    .eq('id', id)
  if (error) throw error
}
