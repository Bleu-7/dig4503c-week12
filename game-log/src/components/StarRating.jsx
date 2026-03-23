const RATINGS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

/**
 * A row of 10 clickable rating buttons.
 *
 * @param {{ value: number|null, onChange: (rating: number|null) => void }} props
 */
function StarRating({ value, onChange }) {
  return (
    <span>
      {RATINGS.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(value === n ? null : n)}
          aria-label={`Rate ${n} out of 10`}
          aria-pressed={value === n}
        >
          {n <= (value ?? 0) ? '★' : '☆'}
        </button>
      ))}
    </span>
  )
}

export default StarRating
