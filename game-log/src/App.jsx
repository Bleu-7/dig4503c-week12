import { useState, useCallback, useRef } from 'react'
import { Routes, Route, Navigate, Link } from 'react-router-dom'
import { searchGames } from '@/lib/gameSearchService'
import { addGame } from '@/lib/gameLogService'
import { useAuth } from '@/context/AuthContext'
import SearchBar from '@/components/SearchBar'
import SearchResults from '@/components/SearchResults'
import GameLog from '@/components/GameLog'
import SignUpForm from '@/components/SignUpForm'
import LoginForm from '@/components/LoginForm'
import RequireAuth from '@/components/RequireAuth'
import ProfilePage from '@/components/ProfilePage'

function MainPage() {
  const { user, logout } = useAuth()
  const [results, setResults] = useState([])
  const [error, setError] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const latestQueryRef = useRef('')
  const lastSearchedRef = useRef('')

  const handleSearch = useCallback(async (query) => {
    const trimmed = query.trim()
    if (!trimmed) {
      setResults([])
      setError(null)
      lastSearchedRef.current = ''
      return
    }
    if (trimmed === lastSearchedRef.current) return
    lastSearchedRef.current = trimmed
    latestQueryRef.current = trimmed
    setError(null)
    try {
      const games = await searchGames(trimmed)
      if (trimmed === latestQueryRef.current) {
        setResults(games)
      }
    } catch (err) {
      if (trimmed === latestQueryRef.current) {
        setError(err.message)
      }
    }
  }, [])

  return (
    <div>
      <h1>GameLog</h1>
      <p>
        Logged in as: <Link to="/profile">{user.username}</Link>{' '}
        <button type="button" onClick={logout}>Log out</button>
      </p>
      <SearchBar onSearch={handleSearch} />
      {error && <p>{error}</p>}
      <SearchResults
        results={results}
        onLog={(game, status) => {
          try {
            addGame(game, status)
            setRefreshKey((k) => k + 1)
          } catch (err) {
            console.error(err)
          }
        }}
      />
      <GameLog refreshKey={refreshKey} />
    </div>
  )
}

function LoginPage() {
  const { user } = useAuth()
  const [authView, setAuthView] = useState('login')

  if (user) return <Navigate to="/" replace />

  return (
    <div>
      <h1>GameLog</h1>
      {authView === 'login' ? (
        <>
          <LoginForm />
          <p>
            No account?{' '}
            <button type="button" onClick={() => setAuthView('signup')}>Sign up</button>
          </p>
        </>
      ) : (
        <>
          <SignUpForm />
          <p>
            Already have an account?{' '}
            <button type="button" onClick={() => setAuthView('login')}>Log in</button>
          </p>
        </>
      )}
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={
        <RequireAuth>
          <MainPage />
        </RequireAuth>
      } />
      <Route path="/profile" element={
        <RequireAuth>
          <ProfilePage />
        </RequireAuth>
      } />
    </Routes>
  )
}

export default App
