import { useState, useCallback, useRef, useMemo } from 'react'
import { Routes, Route, Navigate, Link } from 'react-router-dom'
import { searchGames } from '@/lib/gameSearchService'
import { addGame, getGames } from '@/lib/gameLogService'
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
  const [addKey, setAddKey] = useState(0)
  const [logKey, setLogKey] = useState(0)
  const latestQueryRef = useRef('')
  const lastSearchedRef = useRef('')

  const loggedIds = useMemo(
    () => new Set(getGames().map((g) => g.id)),
    [addKey]
  )

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
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold tracking-tight text-violet-400">GameLog</h1>
          <div className="flex items-center gap-3 text-sm">
            <Link to="/profile" className="text-zinc-400 transition-colors hover:text-zinc-100">
              {user.username}
            </Link>
            <button
              type="button"
              onClick={logout}
              className="text-zinc-500 transition-colors hover:text-zinc-200"
            >
              Log out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl space-y-6 px-4 py-8">
        <SearchBar onSearch={handleSearch} />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <SearchResults
          results={results}
          loggedIds={loggedIds}
          onLog={(game, status) => {
            try {
              addGame(game, status)
              setAddKey((k) => k + 1)
              setLogKey((k) => k + 1)
            } catch (err) {
              console.error(err)
            }
          }}
        />
        <GameLog
          refreshKey={logKey}
          onRemove={() => setAddKey((k) => k + 1)}
        />
      </main>
    </div>
  )
}

function LoginPage() {
  const { user } = useAuth()
  const [authView, setAuthView] = useState('login')

  if (user) return <Navigate to="/" replace />

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-zinc-100">
      <div className="w-full max-w-sm">
        <h1 className="mb-8 text-center text-3xl font-bold tracking-tight text-violet-400">GameLog</h1>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          {authView === 'login' ? (
            <>
              <LoginForm />
              <p className="mt-4 text-center text-sm text-zinc-500">
                No account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthView('signup')}
                  className="text-violet-400 transition-colors hover:text-violet-300"
                >
                  Sign up
                </button>
              </p>
            </>
          ) : (
            <>
              <SignUpForm />
              <p className="mt-4 text-center text-sm text-zinc-500">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthView('login')}
                  className="text-violet-400 transition-colors hover:text-violet-300"
                >
                  Log in
                </button>
              </p>
            </>
          )}
        </div>
      </div>
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
