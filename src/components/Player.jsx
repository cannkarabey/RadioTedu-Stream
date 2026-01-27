import React, { useEffect, useRef, useState } from 'react'
import { FaPlay, FaPause, FaExclamationTriangle, FaRedo } from 'react-icons/fa'

export default function Player({ crossfaderValue = 50, streamUrl }) {
  // Helper function: Calculate player volume with crossfader effect
  function calculatePlayerVolume(volume, crossfaderValue) {
    return volume * ((100 - crossfaderValue) / 100)
  }

  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [streamError, setStreamError] = useState(false)
  const [loading, setLoading] = useState(true)

  const VOLUME_BARS = 10

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = volume

    const handleCanPlay = () => {
      setLoading(false)
      setStreamError(false)
    }

    const handleError = () => {
      setLoading(false)
      setStreamError(true)
      setPlaying(false)
    }

    const handlePlaying = () => {
      setPlaying(true)
      setStreamError(false)
    }

    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('error', handleError)
    audio.addEventListener('playing', handlePlaying)

    const tryPlay = async () => {
      try {
        await audio.play()
        setPlaying(true)
      } catch (e) {
        setPlaying(false)
      }
    }
    tryPlay()

    return () => {
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('playing', handlePlaying)
    }
  }, [])

  // Stream URL değiştiğinde audio reload et
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !streamUrl) return

    setLoading(true)
    setStreamError(false)
    audio.load()
    audio.play().then(() => {
      setPlaying(true)
    }).catch(() => {
      setPlaying(false)
    })
  }, [streamUrl])

  // 🔹 Crossfader veya kullanıcı volume değiştiğinde gerçek çıkış volumesını uygula
  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current
      if (!audio) return
      // Player için crossfader etkisi: (100 - crossfaderValue) / 100
      audio.volume = calculatePlayerVolume(volume, crossfaderValue) // 🔹 Crossfader ekleme
    }
  }, [volume, crossfaderValue])

  const togglePlay = async () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      try {
        await audio.play()
        setPlaying(true)
      } catch {
        // ignore
      }
    }
  }

  const retryStream = () => {
    const audio = audioRef.current
    if (!audio) return
    setLoading(true)
    setStreamError(false)
    audio.load()
    audio.play().then(() => {
      setPlaying(true)
    }).catch(() => {
      setStreamError(true)
      setLoading(false)
    })
  }

  return (
    <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
      <audio ref={audioRef} src={streamUrl} autoPlay />

      {/* Controls group */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Error indicator */}
        {streamError && (
          <div className="flex items-center gap-2 text-yellow-400 text-xs">
            <FaExclamationTriangle size={12} />
            <span className="hidden sm:inline">Stream unavailable</span>
          </div>
        )}

        {/* Loading indicator */}
        {loading && !streamError && (
          <span className="text-cream text-xs animate-pulse">connecting...</span>
        )}

        {/* Play/Pause */}
        <button
          onClick={togglePlay}
          className={`player-control ${playing ? 'active' : ''} ${streamError ? 'opacity-50' : ''}`}
          aria-label={playing ? 'Pause' : 'Play'}
          disabled={streamError}
        >
          {playing ? <FaPause size={14} /> : <FaPlay size={14} />}
        </button>

        {/* Always visible restart button */}
        <button
          onClick={retryStream}
          className="player-control"
          title="Restart stream"
        >
          <FaRedo size={12} />
        </button>
      </div>

      {/* Volume bars */}
      <div className="flex items-end gap-1 ml-2 sm:ml-4">
        {Array.from({ length: VOLUME_BARS }).map((_, i) => {
          const barVolume = (i + 1) / VOLUME_BARS
          const isActive = volume >= barVolume
          return (
            <div
              key={i}
              className={`volume-bar cursor-pointer ${isActive ? 'active' : ''}`}
              style={{ height: `${10 + i * 1.5}px` }}
              onClick={() => setVolume(barVolume)}
              title={`Set volume to ${Math.round(barVolume * 100)}%`}
            />
          )
        })}
      </div>
    </div>
  )
}

