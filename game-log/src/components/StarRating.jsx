const RATINGS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

/**
 * A row of 10 clickable rating buttons.
 *
 * @param {{ value: number|null, onChange: (rating: number|null) => void }} props
 */
function StarRating({ value, onChange }) {
  return (
    <div className="flex items-center gap-0.5">
      {RATINGS.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(value === n ? null : n)}
          aria-label={`Rate ${n} out of 10`}
          aria-pressed={value === n}
          className={`text-lg transition-colors focus:outline-none ${
            n <= (value ?? 0)
              ? 'text-violet-400 hover:text-violet-300'
              : 'text-zinc-700 hover:text-zinc-500'
          }`}
        >
          {n <= (value ?? 0) ? '★' : '☆'}
        </button>
      ))}
      {value && (
        <span className="ml-2 text-xs text-zinc-500">{value}/10</span>
      )}
    </div>
  )
}

export default StarRating
