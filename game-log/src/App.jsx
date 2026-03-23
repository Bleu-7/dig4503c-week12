import { useState, useCallback, useRef } from 'react'
import { searchGames } from '@/lib/gameSearchService'
import SearchBar from '@/components/SearchBar'
import SearchResults from '@/components/SearchResults'

function App() {
  const [results, setResults] = useState([])
  const [error, setError] = useState(null)
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
        console.log('Search results:', games)
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
      <SearchBar onSearch={handleSearch} />
      {error && <p>{error}</p>}
      <SearchResults results={results} />
    </div>
  )
}

export default App
