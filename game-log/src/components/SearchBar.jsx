import { useState, useEffect } from 'react'

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('Searching for:', query)
      onSearch(query)
    }, 300)
    return () => clearTimeout(timer)
  }, [query, onSearch])

  return (
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search for a game..."
    />
  )
}

export default SearchBar
