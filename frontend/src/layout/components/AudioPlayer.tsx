import { useEffect, useRef } from "react"
import { usePlayerStore } from "../../stores/usePlayerStore"

const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const preSongRef = useRef<string | null>(null)

  const { currentSong, isPlaying, playNext } = usePlayerStore()

  // handle song end
  useEffect(() => {
    const audio = audioRef.current
    const handleEnded = () => playNext()
    audio?.addEventListener('ended', handleEnded)
    return () => audio?.removeEventListener('ended', handleEnded)
  }, [playNext])

  // handle song change
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentSong) return

    const isSongChange = preSongRef.current !== currentSong.audioUrl

    if (isSongChange) {
      preSongRef.current = currentSong.audioUrl

      // ✅ pause first before loading new src — prevents AbortError
      audio.pause()
      audio.src = currentSong.audioUrl
      audio.currentTime = 0
      audio.load()

      if (isPlaying) {
        const handleCanPlay = () => {
          audio.play().catch(console.error)
        }
        audio.addEventListener('canplay', handleCanPlay, { once: true }) // ✅ once:true auto-removes listener
      }
    }
  }, [currentSong])  // ✅ only depend on currentSong, NOT isPlaying

  // handle play/pause separately — only for same song
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentSong) return

    // ✅ only toggle if src is already loaded (same song)
    if (preSongRef.current === currentSong.audioUrl) {
      if (isPlaying) {
        audio.play().catch(console.error)
      } else {
        audio.pause()
      }
    }
  }, [isPlaying])  // ✅ only depend on isPlaying

  return <audio ref={audioRef} />
}

export default AudioPlayer