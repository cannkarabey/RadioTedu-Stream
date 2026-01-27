import React, { useEffect, useRef, useState } from 'react'
import { FaTimes, FaPlay, FaPause, FaSync, FaClock, FaPlus, FaMinus, FaVolumeUp, FaVolumeMute, FaBook, FaCoffee, FaBell } from 'react-icons/fa'

const DEFAULT_FOCUS = 25
const DEFAULT_BREAK = 5
const MIN_TIME = 1
const MAX_TIME = 120

export default function Pomodoro() {
  const [focusTime, setFocusTime] = useState(DEFAULT_FOCUS)
  const [breakTime, setBreakTime] = useState(DEFAULT_BREAK)
  const [phase, setPhase] = useState('focus') // 'focus' | 'break'
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_FOCUS * 60)
  const [running, setRunning] = useState(false)
  const [closed, setClosed] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [focusCount, setFocusCount] = useState(0)
  const [breakCount, setBreakCount] = useState(0)
  const [alarmActive, setAlarmActive] = useState(false)
  const [toast, setToast] = useState(null) // { title, body }

  const intervalRef = useRef(null)

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  // Format time helper
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0')
    const secs = (seconds % 60).toString().padStart(2, '0')
    return { mins, secs }
  }

  // Calculate progress
  const calculateProgress = () => {
    const total = (phase === 'focus' ? focusTime : breakTime) * 60
    return 1 - secondsLeft / total
  }

  // Web Audio API - generate beep sound
  const audioContextRef = useRef(null)
  const oscillatorRef = useRef(null)
  const gainNodeRef = useRef(null)

  // Play notification beep (repeating)
  const playSound = () => {
    if (!soundEnabled) return

    try {
      // Create audio context if needed
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
      }

      const ctx = audioContextRef.current

      // Stop any existing sound
      stopSound()

      // Create oscillator for beep
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(800, ctx.currentTime) // 800Hz beep

      // Beep pattern: on-off-on-off repeating
      const beepDuration = 0.15
      const pauseDuration = 0.1
      const totalDuration = 5 // Total duration before it stops automatically

      // Volume envelope for pleasant sound
      gainNode.gain.setValueAtTime(0, ctx.currentTime)

      // Create repeating beep pattern
      let time = ctx.currentTime
      for (let i = 0; i < 15; i++) {
        gainNode.gain.setValueAtTime(0.3, time)
        gainNode.gain.setValueAtTime(0, time + beepDuration)
        time += beepDuration + pauseDuration
      }

      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + totalDuration)

      oscillatorRef.current = oscillator
      gainNodeRef.current = gainNode
    } catch (e) {
      console.log('Audio error:', e)
    }
  }

  // Stop notification sound
  const stopSound = () => {
    try {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop()
        oscillatorRef.current.disconnect()
        oscillatorRef.current = null
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect()
        gainNodeRef.current = null
      }
    } catch (e) {
      // Already stopped
    }
  }

  // Send notification (in-app toast + browser notification)
  const sendNotification = (title, body) => {
    // Show in-app toast (always works)
    setToast({ title, body })

    // Also try browser notification as backup
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, { body, tag: 'pomodoro' })
      } catch (e) {
        // Ignore browser notification errors
      }
    }
  }

  // Clear toast when alarm is dismissed
  const clearToast = () => {
    setToast(null)
  }

  // Timer tick logic
  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }

    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          // Timer complete! STOP and alert - do NOT increment counter here
          setRunning(false) // STOP the timer
          setAlarmActive(true) // Activate alarm state

          // Send notification based on completed phase
          if (phase === 'focus') {
            sendNotification('🍅 Focus Complete!', `Great work! Time for a ${breakTime} min break.`)
          } else {
            sendNotification('☕ Break Over!', `Ready for another ${focusTime} min focus session?`)
          }

          // Play alarm sound
          playSound()

          // Vibrate if available
          if (navigator.vibrate) {
            try { navigator.vibrate([200, 100, 200, 100, 200]) } catch (_) { }
          }

          return 0 // Stay at 0
        }
        return prev - 1
      })
    }, 1000)

    return () => intervalRef.current && clearInterval(intervalRef.current)
  }, [running, phase, focusTime, breakTime, soundEnabled])

  // Dismiss alarm, increment counter, and AUTO-START next phase
  const dismissAlarm = () => {
    stopSound()
    setAlarmActive(false)
    clearToast() // Clear the toast notification

    // Increment counter for the COMPLETED phase
    if (phase === 'focus') {
      setFocusCount(c => c + 1)
    } else {
      setBreakCount(c => c + 1)
    }

    // Switch to next phase
    const nextPhase = phase === 'focus' ? 'break' : 'focus'
    const nextSeconds = (nextPhase === 'focus' ? focusTime : breakTime) * 60

    setPhase(nextPhase)
    setSecondsLeft(nextSeconds)
    setRunning(true) // AUTO-START the next phase
  }

  // Start/pause timer
  const toggleRun = () => {
    if (alarmActive) {
      // If alarm is active, dismiss it first
      dismissAlarm()
    } else {
      setRunning(r => !r)
    }
  }

  // Reset timer
  const reset = () => {
    setPhase('focus')
    setSecondsLeft(focusTime * 60)
    setRunning(false)
    stopSound()
    setAlarmActive(false)
  }

  // Reset counts
  const resetCounts = () => {
    setFocusCount(0)
    setBreakCount(0)
  }

  // Apply preset
  const applyPreset = (focus, brk) => {
    setFocusTime(focus)
    setBreakTime(brk)
    setSecondsLeft(focus * 60)
    setPhase('focus')
    setRunning(false)
    setAlarmActive(false)
  }

  // Time adjustment handlers (only +/- buttons, no keyboard arrows)
  const adjustTime = (type, delta) => {
    if (type === 'focus') {
      const newVal = Math.min(MAX_TIME, Math.max(MIN_TIME, focusTime + delta))
      setFocusTime(newVal)
      if (phase === 'focus' && !running) {
        setSecondsLeft(newVal * 60)
      }
    } else {
      const newVal = Math.min(MAX_TIME, Math.max(MIN_TIME, breakTime + delta))
      setBreakTime(newVal)
      if (phase === 'break' && !running) {
        setSecondsLeft(newVal * 60)
      }
    }
  }

  // Handle keyboard input for time
  const handleTimeInput = (type, value) => {
    const num = parseInt(value) || MIN_TIME
    const clamped = Math.min(MAX_TIME, Math.max(MIN_TIME, num))
    if (type === 'focus') {
      setFocusTime(clamped)
      if (phase === 'focus' && !running) {
        setSecondsLeft(clamped * 60)
      }
    } else {
      setBreakTime(clamped)
      if (phase === 'break' && !running) {
        setSecondsLeft(clamped * 60)
      }
    }
  }

  const progress = calculateProgress()
  const { mins, secs } = formatTime(secondsLeft)

  // Minimized state
  if (closed) {
    return (
      <button
        aria-label="Open Pomodoro"
        onClick={() => setClosed(false)}
        className="pomodoro-toggle text-xs"
      >
        <FaClock size={14} />
      </button>
    )
  }

  return (
    <div className="pomodoro-panel" style={{ width: showSettings ? '280px' : '240px', minWidth: '240px' }}>

      {/* Header with mode-based background color */}
      <div
        className="flex items-center justify-between mb-2 gap-2 p-2 -m-2 mb-1 rounded-t"
        style={{
          background: alarmActive
            ? 'rgba(255, 107, 107, 0.3)'
            : phase === 'focus'
              ? 'rgba(100, 149, 237, 0.2)'
              : 'rgba(72, 187, 120, 0.2)',
          borderBottom: '1px solid var(--border-subtle)'
        }}
      >
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[11px] tracking-wider uppercase opacity-90 whitespace-nowrap">
            {phase === 'focus' ? '📚 Focus' : '☕ Break'}
          </span>
          {/* Set counter */}
          <span className="text-[10px] opacity-70 whitespace-nowrap">
            <FaBook size={8} className="inline mr-1" />{focusCount}
            <span className="mx-1">|</span>
            <FaCoffee size={8} className="inline mr-1" />{breakCount}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            className="icon-btn"
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Mute' : 'Unmute'}
          >
            {soundEnabled ? <FaVolumeUp size={9} /> : <FaVolumeMute size={9} />}
          </button>
          <button
            className="icon-btn"
            onClick={() => setShowSettings(!showSettings)}
            title="Settings"
          >
            <FaClock size={9} />
          </button>
          <button
            className="icon-btn"
            aria-label="Close"
            onClick={() => setClosed(true)}
          >
            <FaTimes size={9} />
          </button>
        </div>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div className="mb-3 p-2 rounded bg-bg-secondary/50 border border-border-subtle animate-slideDown">
          <div className="text-[10px] uppercase tracking-wide mb-2 opacity-70">Custom Times</div>

          {/* Focus time - only +/- buttons, display only */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px]">Focus:</span>
            <div className="flex items-center gap-1">
              <button
                className="icon-btn"
                onClick={() => adjustTime('focus', -1)}
                disabled={focusTime <= MIN_TIME}
              >
                <FaMinus size={8} />
              </button>
              <input
                type="text"
                value={focusTime}
                onChange={(e) => handleTimeInput('focus', e.target.value)}
                className="w-8 text-center text-[11px] font-mono bg-transparent border-b border-warm-gray focus:border-gold focus:outline-none"
              />
              <button
                className="icon-btn"
                onClick={() => adjustTime('focus', 1)}
                disabled={focusTime >= MAX_TIME}
              >
                <FaPlus size={8} />
              </button>
              <span className="text-[9px] opacity-60">min</span>
            </div>
          </div>

          {/* Break time - only +/- buttons, display only */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px]">Break:</span>
            <div className="flex items-center gap-1">
              <button
                className="icon-btn"
                onClick={() => adjustTime('break', -1)}
                disabled={breakTime <= MIN_TIME}
              >
                <FaMinus size={8} />
              </button>
              <input
                type="text"
                value={breakTime}
                onChange={(e) => handleTimeInput('break', e.target.value)}
                className="w-8 text-center text-[11px] font-mono bg-transparent border-b border-warm-gray focus:border-gold focus:outline-none"
              />
              <button
                className="icon-btn"
                onClick={() => adjustTime('break', 1)}
                disabled={breakTime >= MAX_TIME}
              >
                <FaPlus size={8} />
              </button>
              <span className="text-[9px] opacity-60">min</span>
            </div>
          </div>

          {/* Presets */}
          <div className="flex gap-1 mt-2">
            <button
              className={`mode-chip text-[9px] ${focusTime === 25 && breakTime === 5 ? 'active' : ''}`}
              onClick={() => applyPreset(25, 5)}
            >
              25/5
            </button>
            <button
              className={`mode-chip text-[9px] ${focusTime === 50 && breakTime === 10 ? 'active' : ''}`}
              onClick={() => applyPreset(50, 10)}
            >
              50/10
            </button>
            <button
              className="mode-chip text-[9px]"
              onClick={resetCounts}
              title="Reset counts"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Timer display */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <svg width="70" height="70" viewBox="0 0 36 36" className="-rotate-90">
            <circle
              cx="18" cy="18" r="16"
              stroke="var(--icon-color)"
              strokeWidth="2"
              fill="none"
              opacity="0.25"
            />
            <circle
              cx="18" cy="18" r="16"
              stroke={alarmActive ? '#ff6b6b' : 'var(--gold)'}
              strokeWidth="2"
              fill="none"
              strokeDasharray={2 * Math.PI * 16}
              strokeDashoffset={(1 - progress) * 2 * Math.PI * 16}
              strokeLinecap="round"
            />
          </svg>
          <div className={`absolute inset-0 flex items-center justify-center text-[14px] font-mono select-none ${alarmActive ? 'animate-pulse text-red-400' : ''}`}>
            {mins}:{secs}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-1">
          {/* Alarm active - show dismiss button */}
          {alarmActive ? (
            <button
              onClick={dismissAlarm}
              className="control-btn animate-pulse px-3"
              style={{ background: 'rgba(255, 107, 107, 0.3)', borderColor: '#ff6b6b', minWidth: '50px' }}
              title="Dismiss alarm"
            >
              <FaBell size={12} />
            </button>
          ) : (
            <div className="flex gap-1">
              <button onClick={toggleRun} className="control-btn" aria-label={running ? 'Pause' : 'Start'}>
                {running ? <FaPause size={10} /> : <FaPlay size={10} />}
              </button>
              <button onClick={reset} className="control-btn" aria-label="Reset">
                <FaSync size={10} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification Overlay */}
      {toast && (
        <div
          className="fixed top-4 right-4 z-50 animate-slideDown"
          style={{
            background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.95), rgba(40, 40, 40, 0.95))',
            border: '1px solid var(--gold)',
            borderRadius: '12px',
            padding: '16px 20px',
            minWidth: '280px',
            maxWidth: '350px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5), 0 0 20px rgba(201, 169, 98, 0.3)'
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-lg font-bold text-gold mb-1">{toast.title}</div>
              <div className="text-sm text-cream opacity-90">{toast.body}</div>
            </div>
            <button
              onClick={dismissAlarm}
              className="flex-shrink-0 p-2 rounded-lg bg-gold/20 hover:bg-gold/40 transition-all"
              style={{ color: 'var(--gold)' }}
            >
              <FaBell size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
