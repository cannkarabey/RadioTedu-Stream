import React, { useState, useEffect } from 'react'
import VideoBackground from './components/VideoBackground'
import Player from './components/Player'
import ChannelSwitcher from './components/ChannelSwitcher'
import { FaTimes, FaFacebookF, FaTwitter, FaYoutube, FaHeart, FaHome } from 'react-icons/fa'
import Pomodoro from './components/Pomodoro'
import Nature from './components/Nature'
import Crossfader from './components/Crossfader'
import { CHANNELS, DEFAULT_CHANNEL } from './channelConfig'


export default function App() {
  const [currentChannel, setCurrentChannel] = useState(DEFAULT_CHANNEL)
  const [showLove, setShowLove] = useState(false)
  const [showNatureSounds, setShowNatureSounds] = useState(false)
  const [crossfaderValue, setCrossfaderValue] = useState(50)

  // Get current channel data
  const channel = CHANNELS[currentChannel]
  const currentBackground = import.meta.env.BASE_URL + channel.background
  const currentStreamUrl = channel.streamUrl
  const isImage = channel.isImage

  // Apply theme when channel changes
  useEffect(() => {
    document.documentElement.dataset.theme = channel.theme
  }, [currentChannel, channel.theme])

  // Auto hide love message after a few seconds
  useEffect(() => {
    if (!showLove) return
    const t = setTimeout(() => setShowLove(false), 3000)
    return () => clearTimeout(t)
  }, [showLove])

  const handleChannelChange = (channelId) => {
    setCurrentChannel(channelId)
  }

  return (
    <div className="relative min-h-full bg-bg-dark font-sans text-cream">
      <VideoBackground mediaFile={currentBackground} isImage={isImage} />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-bg-dark/60"></div>

      {/* Top header */}
      <header className="relative z-10 flex justify-between items-start p-4 sm:p-6">
        {/* Top left - channel switcher and controls */}
        <div className="flex flex-col items-start gap-3">
          {/* Channel Switcher */}
          <ChannelSwitcher
            currentChannel={currentChannel}
            onChannelChange={handleChannelChange}
          />

          {/* Nature sounds button */}
          <button
            onClick={() => setShowNatureSounds(true)}
            className="player-control text-xs sm:text-sm px-3 py-1"
            title="Add nature sounds">
            add nature sound
          </button>

          <Nature
            showNatureSounds={showNatureSounds}
            setShowNatureSounds={setShowNatureSounds}
            crossfaderValue={crossfaderValue}
          />
        </div>

        {/* Top right - social icons */}
        <div className="flex flex-col items-end gap-1 sm:gap-2">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
              <a href="https://facebook.com/radiotedu" target="_blank" rel="noreferrer" className="icon-glow">
                <FaFacebookF />
              </a>
              <a href="https://twitter.com/radiotedu" target="_blank" rel="noreferrer" className="icon-glow">
                <FaTwitter />
              </a>
              <a href="https://youtube.com/radiotedu" target="_blank" rel="noreferrer" className="icon-glow">
                <FaYoutube />
              </a>
              <button
                type="button"
                onClick={() => setShowLove(true)}
                aria-label="We love you too"
                className="icon-glow focus:outline-none"
              >
                <FaHeart />
              </button>
            </div>


            {/* Homepage button */}
            <a href="https://radiotedu.com" target="_blank" rel="noreferrer"
              className="player-control flex items-center gap-2 text-sm"
              title="Visit RadioTEDU Homepage">
              <FaHome size={14} />
              <span className="hidden sm:inline">Home</span>
            </a>
          </div>
          {showLove && (
            <div className="mt-1 text-pink-300 text-[11px] sm:text-xs tracking-wide flex items-center gap-1 animate-pulse" style={{ textShadow: '0 0 6px rgba(255,192,203,0.7)' }}>
              <span className="inline-block">we love you too!</span>
              <span className="pulse-dot">❤</span>
            </div>
          )}

          {/* Beta notice */}
          <div className="text-[11px] sm:text-sm leading-snug text-right opacity-90 max-w-[260px] font-mono">
            <span className="uppercase tracking-widest text-yellow-300 mr-2 text-[12px] sm:text-sm font-bold">beta</span>
            <div className="inline text-glow-subtle">any recommendations? send an email us! <a href="mailto:radio@tedu.edu.tr" className="underline hover:text-glow-ui">radio@tedu.edu.tr</a></div>
          </div>
        </div>
      </header>

      {/* Bottom player area */}
      <footer className="absolute bottom-0 left-0 right-0 z-10 p-4 sm:p-6">
        <div className="mb-3 sm:mb-4 text-left flex items-center gap-3">
          <span className="text-cream font-heading text-xl sm:text-2xl">radiotedu / {channel.name.toLowerCase()}</span>
          <span className="text-gold text-sm sm:text-base font-sans animate-pulse">
            on-air
          </span>
        </div>
        <div className="mb-3 sm:mb-4">
          <Player crossfaderValue={crossfaderValue} streamUrl={currentStreamUrl} />
        </div>

        {/* Mobile: Stack utilities below player */}
        <div className="flex flex-col items-center gap-3 md:hidden mt-4">
          <Crossfader
            crossfaderValue={crossfaderValue}
            setCrossfaderValue={setCrossfaderValue}
          />
          <Pomodoro />
        </div>
      </footer>

      {/* Desktop: Fixed positioned utilities */}
      <div className="hidden md:block fixed bottom-4 left-1/2 transform -translate-x-1/2 z-20">
        <Crossfader
          crossfaderValue={crossfaderValue}
          setCrossfaderValue={setCrossfaderValue}
        />
      </div>

      <div className="hidden md:block fixed bottom-4 right-4 z-20">
        <Pomodoro />
      </div>

    </div>

  )
}    
