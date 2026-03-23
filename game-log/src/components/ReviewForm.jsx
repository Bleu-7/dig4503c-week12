import { useState } from 'react'
import { updateReview } from '@/lib/gameLogService'
import StarRating from '@/components/StarRating'

/**
 * @param {{ game: import('@/lib/gameLogService').LoggedGame, onSave: (updated: import('@/lib/gameLogService').LoggedGame) => void }} props
 */
function ReviewForm({ game, onSave }) {
  const [rating, setRating] = useState(game.rating ?? null)
  const [review, setReview] = useState(game.review ?? '')

  function handleSave() {
    try {
      const updated = updateReview(game.id, rating, review.trim() || null)
      if (updated) onSave(updated)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <StarRating value={rating} onChange={setRating} />
      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Write a review (optional)"
      />
      <button type="button" onClick={handleSave}>
        Save
      </button>
    </div>
  )
}

export default ReviewForm
