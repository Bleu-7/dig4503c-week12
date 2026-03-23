function SearchResults({ results = [] }) {
  return (
    <ul>
      {results.map((game) => (
        <li key={game.id}>
          {game.coverUrl && (
            <img src={game.coverUrl} alt={game.name} width={64} />
          )}
          <span>{game.name}</span>
          {game.releaseYear && <span> ({game.releaseYear})</span>}
        </li>
      ))}
    </ul>
  )
}

export default SearchResults
