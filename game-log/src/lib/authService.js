import { supabase } from '@/lib/supabase'

/**
 * Register a new user with email, password, and a display username.
 * The username is stored in user_metadata and is accessible via user.user_metadata.username.
 * @param {string} email
 * @param {string} password
 * @param {string} username
 */
export async function register(email, password, username) {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  })
  if (error) throw new Error(error.message)
}

/**
 * Log in with email and password.
 * @param {string} email
 * @param {string} password
 */
export async function login(email, password) {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error(error.message)
}

/**
 * Log out the current user.
 */
export async function logout() {
  await supabase.auth.signOut()
}

/**
 * Return the currently authenticated Supabase user, or null.
 * @returns {Promise<import('@supabase/supabase-js').User|null>}
 */
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
