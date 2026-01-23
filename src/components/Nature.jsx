import React, { useState, useEffect, useRef } from 'react'
import { CloudRain, Wind, Flame, Waves, Bird, Zap, Moon } from 'lucide-react'
import { FaTimes } from 'react-icons/fa'

export default function Nature({ showNatureSounds, setShowNatureSounds, crossfaderValue  }) {
  const [activeNatureSounds, setActiveNatureSounds] = useState({
    rain: false,
    fire: false,
    wind: false,
    ocean: false,
    birds: false,
    thunder: false,
    crickets: false
  })

  // Slider değerlerini state'te tut
  const [soundVolumes, setSoundVolumes] = useState({
    rain: 50,
    fire: 50,
    wind: 50,
    ocean: 50,
    birds: 50,
    thunder: 50,
    crickets: 50
  })

  // Ses dosyaları için referanslar
  const audioRefs = useRef({
    rain: null,
    fire: null,
    wind: null,
    ocean: null,
    birds: null,
    thunder: null,
    crickets: null
  })

  // Ses dosyalarının yolları
  const soundPaths = {
    rain: import.meta.env.BASE_URL + 'sounds/rain.mp3',
    fire: import.meta.env.BASE_URL + 'sounds/fire.mp3',
    wind: import.meta.env.BASE_URL + 'sounds/wind.mp3',
    ocean: import.meta.env.BASE_URL + 'sounds/ocean.mp3',
    birds: import.meta.env.BASE_URL + 'sounds/birds.mp3',
    thunder: import.meta.env.BASE_URL + 'sounds/thunder.mp3',
    crickets: import.meta.env.BASE_URL + 'sounds/crickets.mp3'
  }

  // Helper function: Get sound multiplier (birds get 1.5x boost)
  function getSoundMultiplier(soundType) {
    return soundType === 'birds' ? 1.5 : 1.0
  }

  // Helper function: Calculate sound volume with crossfader (for initial setup, useEffect, handleVolumeChange)
  function calculateSoundVolumeWithCrossfader(sliderValue, crossfaderValue, multiplier) {
    const crossfaderEffect = crossfaderValue / 100
    return Math.min((sliderValue / 100) * crossfaderEffect * multiplier, 1.0)
  }

  // Helper function: Calculate sound volume without crossfader (for toggleNatureSound - preserves original behavior)
  function calculateSoundVolumeWithoutCrossfader(sliderValue, multiplier) {
    return Math.min((sliderValue / 100) * multiplier, 1.0)
  }

  // Helper function: Update audio volume with crossfader
  function updateAudioVolume(soundType, sliderValue, crossfaderValue) {
    const audio = audioRefs.current[soundType]
    if (audio) {
      const multiplier = getSoundMultiplier(soundType)
      audio.volume = calculateSoundVolumeWithCrossfader(sliderValue, crossfaderValue, multiplier)
    }
  }

  // Ses elementlerini oluştur
  useEffect(() => {
    Object.keys(soundPaths).forEach(soundType => {
      if (!audioRefs.current[soundType]) {
        const audio = new Audio(soundPaths[soundType])
        audio.loop = true
        audio.preload = 'metadata'
        
        // 🔹 İlk oluştururken crossfaderValue'yu da dikkate al
        const multiplier = getSoundMultiplier(soundType)
        audio.volume = calculateSoundVolumeWithCrossfader(soundVolumes[soundType], crossfaderValue, multiplier)
        
        audioRefs.current[soundType] = audio
      }
    })

    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        if (audio) {
          audio.pause()
          audio.currentTime = 0
        }
      })
    }
  }, [])

  useEffect(() => {
    Object.keys(soundVolumes).forEach(soundType => {
      updateAudioVolume(soundType, soundVolumes[soundType], crossfaderValue)
    })
  }, [crossfaderValue, soundVolumes]) // hem crossfader hem slider değişince tetiklenir

  const toggleNatureSound = async (soundType) => {
    const wasActive = activeNatureSounds[soundType]
    
    setActiveNatureSounds(prev => ({
      ...prev,
      [soundType]: !prev[soundType]
    }))

    const audio = audioRefs.current[soundType]
    if (!audio) return

    try {
      if (!wasActive) {
        // Ses yeni açılıyorsa -> her zaman %50'den başlasın
        const defaultVolume = 50
        audio.currentTime = 0

        // Birds için 1.5x boost, diğerleri için normal volume
        // Note: Original code calculated crossfaderEffect but did NOT use it - preserving that behavior
        const multiplier = getSoundMultiplier(soundType)
        audio.volume = calculateSoundVolumeWithoutCrossfader(defaultVolume, multiplier)

        await audio.play()
  
        // Slider state'ini de sıfırla
        setSoundVolumes(prev => ({
          ...prev,
          [soundType]: defaultVolume
        }))
      } else {
        // Ses kapatılıyorsa -> durdur
        audio.pause()
        audio.currentTime = 0
      }
    } catch (error) {
      console.error(`${soundType} sesi oynatılamadı:`, error)
      setActiveNatureSounds(prev => ({
        ...prev,
        [soundType]: wasActive
      }))
    }
  }

  const handleVolumeChange = (soundType, volume) => {
    updateAudioVolume(soundType, volume, crossfaderValue)
  
    // State'te slider değerini kaydet
    setSoundVolumes(prev => ({
      ...prev,
      [soundType]: volume
    }))
  }

  // Panel kapalıysa hiçbir şey gösterme
  if (!showNatureSounds) return null

  return (
    <div className="nature-sounds-panel">
      <div className="flex justify-between items-center mb-3">
        <span className="text-[12px] tracking-wider uppercase opacity-90">Nature Sounds</span>
        <button
          onClick={() => {
            setShowNatureSounds(false)
            // Panel kapanırken sesleri DURDURMUYORUZ - çalmaya devam etsin
          }}
          className="nature-close-btn"
        >
          <FaTimes size={10} />
        </button>
      </div>

      <div className="space-y-4">
        {/* Rain Sound */}
        <div className="nature-sound-item">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => toggleNatureSound('rain')}
              className={`nature-icon-container ${activeNatureSounds.rain ? 'active' : ''}`}
            >
              <CloudRain size={24} />
            </button>
            <span className="nature-label">rain</span>
          </div>
          {activeNatureSounds.rain && (
            <div className="nature-slider-container gap-2">
              <input
                type="range"
                min="0"
                max="100"
                value={soundVolumes.rain}
                className="nature-slider w-32" 
                onChange={(e) => handleVolumeChange('rain', parseInt(e.target.value))}
              />
              <span className="text-xs opacity-70 min-w-[35px]">{soundVolumes.rain}%</span>
            </div>
          )}
        </div>

        {/* Fire Sound */}
        <div className="nature-sound-item">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => toggleNatureSound('fire')}
              className={`nature-icon-container ${activeNatureSounds.fire ? 'active' : ''}`}
            >
              <Flame size={24} />
            </button>
            <span className="nature-label">fire</span>
          </div>
          {activeNatureSounds.fire && (
            <div className="nature-slider-container gap-2">
              <input
                type="range"
                min="0"
                max="100"
                value={soundVolumes.fire}
                className="nature-slider w-32"
                onChange={(e) => handleVolumeChange('fire', parseInt(e.target.value))}
              />
              <span className="text-xs opacity-70 min-w-[35px]">{soundVolumes.fire}%</span>
            </div>
          )}
        </div>

        {/* Wind Sound */}
        <div className="nature-sound-item">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => toggleNatureSound('wind')}
              className={`nature-icon-container ${activeNatureSounds.wind ? 'active' : ''}`}
            >
              <Wind size={20} />
            </button>
            <span className="nature-label">wind</span>
          </div>
          {activeNatureSounds.wind && (
            <div className="nature-slider-container gap-2">
              <input
                type="range"
                min="0"
                max="100"
                value={soundVolumes.wind}
                className="nature-slider w-32"
                onChange={(e) => handleVolumeChange('wind', parseInt(e.target.value))}
              />
              <span className="text-xs opacity-70 min-w-[35px]">{soundVolumes.wind}%</span>
            </div>
          )}
        </div>

        {/* Ocean Sound */}
        <div className="nature-sound-item">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => toggleNatureSound('ocean')}
              className={`nature-icon-container ${activeNatureSounds.ocean ? 'active' : ''}`}
            >
              <Waves size={20} />
            </button>
            <span className="nature-label">ocean</span>
          </div>
          {activeNatureSounds.ocean && (
            <div className="nature-slider-container gap-2">
              <input
                type="range"
                min="0"
                max="100"
                value={soundVolumes.ocean}
                className="nature-slider w-32"
                onChange={(e) => handleVolumeChange('ocean', parseInt(e.target.value))}
              />
              <span className="text-xs opacity-70 min-w-[35px]">{soundVolumes.ocean}%</span>
            </div>
          )}
        </div>

        {/* Bird Sound */}
        <div className="nature-sound-item">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => toggleNatureSound('birds')}
              className={`nature-icon-container ${activeNatureSounds.birds ? 'active' : ''}`}
            >
              <Bird size={20} />
            </button>
            <span className="nature-label">birds</span>
          </div>
          {activeNatureSounds.birds && (
            <div className="nature-slider-container gap-2">
              <input
                type="range"
                min="0"
                max="100"
                value={soundVolumes.birds}
                className="nature-slider w-32"
                onChange={(e) => handleVolumeChange('birds', parseInt(e.target.value))}
              />
              <span className="text-xs opacity-70 min-w-[35px]">{soundVolumes.birds}%</span>
            </div>
          )}
        </div>

        {/* Thunder Sound */}
        <div className="nature-sound-item">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => toggleNatureSound('thunder')}
              className={`nature-icon-container ${activeNatureSounds.thunder ? 'active' : ''}`}
            >
              <Zap size={20} />
            </button>
            <span className="nature-label">thunder</span>
          </div>
          {activeNatureSounds.thunder && (
            <div className="nature-slider-container gap-2">
              <input
                type="range"
                min="0"
                max="100"
                value={soundVolumes.thunder}
                className="nature-slider w-32"
                onChange={(e) => handleVolumeChange('thunder', parseInt(e.target.value))}
              />
              <span className="text-xs opacity-70 min-w-[35px]">{soundVolumes.thunder}%</span>
            </div>
          )}
        </div>

        {/* Crickets Sound */}
        <div className="nature-sound-item">
          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleNatureSound('crickets')}
              className={`nature-icon-container ${activeNatureSounds.crickets ? 'active' : ''}`}
            >
              <Moon size={24} />
            </button>
            <span className="nature-label">crickets</span>
          </div>

          {activeNatureSounds.crickets && (
            <div className="nature-slider-container gap-2">
              <input
                type="range"
                min="0"
                max="100"
                value={soundVolumes.crickets}
                className="nature-slider w-32"
                onChange={(e) => handleVolumeChange('crickets', parseInt(e.target.value))}
              />
              <span className="text-xs opacity-70 min-w-[35px]">
                {soundVolumes.crickets}%
              </span>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}