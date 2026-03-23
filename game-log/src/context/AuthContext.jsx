import { createContext, useContext, useState } from 'react'
import { login as authLogin, logout as authLogout, getCurrentUser } from '@/lib/authService'

/**
 * @typedef {{ user: import('@/lib/authService').SessionUser|null, login: (username: string, password: string) => import('@/lib/authService').SessionUser, logout: () => void }} AuthContextValue
 */

const AuthContext = createContext(null)

/**
 * Provides auth state to the component tree.
 * Exposes: user, login(username, password), logout()
 * @param {{ children: React.ReactNode }} props
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(getCurrentUser)

  function login(username, password) {
    const session = authLogin(username, password)
    setUser(session)
    return session
  }

  function logout() {
    authLogout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Returns the current auth context: { user, login, logout }
 * Must be used inside <AuthProvider>.
 * @returns {AuthContextValue}
 */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
