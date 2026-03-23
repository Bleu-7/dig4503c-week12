const USERS_KEY = 'auth_users'
const SESSION_KEY = 'auth_session'

// NOTE: Passwords are stored in plaintext. This is intentional for the
// localStorage MVP. When migrating to Supabase, auth will be delegated
// entirely to Supabase Auth and this service will be replaced.

/**
 * @typedef {{ id: string, username: string, password: string, createdAt: string }} StoredUser
 */

/**
 * @typedef {{ id: string, username: string, createdAt: string }} SessionUser
 * A user object safe to expose to the UI — no password field.
 */

/**
 * @param {StoredUser} user
 * @returns {SessionUser}
 */
function toSessionUser({ id, username, createdAt }) {
  return { id, username, createdAt }
}

/**
 * @returns {StoredUser[]}
 */
function getUsers() {
  try {
    const parsed = JSON.parse(localStorage.getItem(USERS_KEY))
    if (!Array.isArray(parsed)) return []
    return parsed.filter((u) => u && typeof u === 'object' && typeof u.id === 'string' && typeof u.username === 'string' && typeof u.createdAt === 'string')
  } catch {
    return []
  }
}

/**
 * @param {StoredUser[]} users
 */
function saveUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  } catch (err) {
    throw new Error(`Failed to save users: ${err.message}`)
  }
}

/**
 * Register a new user. Throws if the username is already taken or inputs are invalid.
 * @param {string} username
 * @param {string} password
 * @returns {SessionUser} The newly created user.
 */
export function register(username, password) {
  if (typeof username !== 'string' || username.trim() === '') {
    throw new Error('Username is required.')
  }
  if (typeof password !== 'string' || password.length < 6) {
    throw new Error('Password must be at least 6 characters.')
  }

  const trimmed = username.trim()
  const users = getUsers()

  const exists = users.some((u) => u.username.toLowerCase() === trimmed.toLowerCase())
  if (exists) throw new Error(`Username "${trimmed}" is already taken.`)

  const user = {
    id: crypto.randomUUID(),
    username: trimmed,
    password,
    createdAt: new Date().toISOString(),
  }

  saveUsers([...users, user])
  return toSessionUser(user)
}

/**
 * Log in with an existing username and password.
 * Sets the active session in localStorage.
 * Throws if credentials are invalid.
 * @param {string} username
 * @param {string} password
 * @returns {SessionUser} The authenticated user.
 */
export function login(username, password) {
  if (typeof username !== 'string' || username.trim() === '') {
    throw new Error('Username is required.')
  }
  if (typeof password !== 'string' || password === '') {
    throw new Error('Password is required.')
  }

  const trimmed = username.trim()
  const users = getUsers()

  const user = users.find((u) => u.username.toLowerCase() === trimmed.toLowerCase())
  if (!user || user.password !== password) {
    throw new Error('Invalid username or password.')
  }

  const session = toSessionUser(user)

  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  } catch (err) {
    throw new Error(`Failed to save session: ${err.message}`)
  }

  return session
}

/**
 * Log out the current user by clearing the active session.
 */
export function logout() {
  localStorage.removeItem(SESSION_KEY)
}

/**
 * Return the currently logged-in user, or null if no session exists.
 * @returns {SessionUser|null}
 */
export function getCurrentUser() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SESSION_KEY))
    if (!parsed || typeof parsed.id !== 'string' || typeof parsed.username !== 'string' || typeof parsed.createdAt !== 'string') return null
    return parsed
  } catch {
    return null
  }
}
