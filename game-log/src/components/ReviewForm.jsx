import { useState } from 'react'
import { updateReview } from '@/lib/gameLogService'
import StarRating from '@/components/StarRating'

/**
 * @param {{ game: import('@/lib/gameLogService').LoggedGame, onSave: (updated: import('@/lib/gameLogService').LoggedGame) => void }} props
 */
function ReviewForm({ game, onSave }) {
  const [rating, setRating] = useState(game.rating ?? null)
  const [review, setReview] = useState(game.review ?? '')

  async function handleSave() {
    try {
      const updated = await updateReview(game.id, rating, review.trim() || null)
      if (updated) onSave(updated)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-3">
      <StarRating value={rating} onChange={setRating} />
      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Write a review (optional)"
        rows={3}
        className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 transition-colors focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
      />
      <button
        type="button"
        onClick={handleSave}
        className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-500"
      >
        Save
      </button>
    </div>
  )
}

export default ReviewForm
