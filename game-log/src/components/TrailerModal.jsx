import { useEffect, useState } from 'react'
import { X, Loader2, VideoOff } from 'lucide-react'
import { fetchGameTrailer } from '@/lib/youtubeService'

/**
 * Full-screen modal that fetches and plays the official YouTube trailer for a game.
 * @param {{ game: object, onClose: () => void }} props
 */
function TrailerModal({ game, onClose }) {
  const [trailer, setTrailer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    fetchGameTrailer(game.name)
      .then((result) => {
        if (!cancelled) {
          setTrailer(result)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message)
          setLoading(false)
        }
      })

    return () => { cancelled = true }
  }, [game.name])

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl mx-4 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
          <div className="min-w-0">
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Official Trailer</p>
            <p className="text-sm font-medium text-zinc-100 truncate">{game.name}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 shrink-0 rounded-md p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
            aria-label="Close trailer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="aspect-video bg-zinc-950 flex items-center justify-center">
          {loading && (
            <div className="flex flex-col items-center gap-2 text-zinc-500">
              <Loader2 size={28} className="animate-spin" />
              <p className="text-xs">Finding trailer…</p>
            </div>
          )}

          {!loading && error && (
            <div className="flex flex-col items-center gap-2 text-zinc-500 px-6 text-center">
              <VideoOff size={28} />
              <p className="text-xs">{error}</p>
            </div>
          )}

          {!loading && !error && !trailer && (
            <div className="flex flex-col items-center gap-2 text-zinc-500 px-6 text-center">
              <VideoOff size={28} />
              <p className="text-xs">No trailer found for "{game.name}"</p>
            </div>
          )}

          {!loading && !error && trailer && (
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${trailer.videoId}?autoplay=1&rel=0`}
              title={trailer.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default TrailerModal
