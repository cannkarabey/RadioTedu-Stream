import React, { useState } from 'react'
import { RotateCcw, Sliders, ChevronDown } from 'lucide-react'

export default function Crossfader({ crossfaderValue, setCrossfaderValue }) {
  const [closed, setClosed] = useState(false)

  const handleCrossfaderChange = (e) => {
    const value = parseInt(e.target.value)
    setCrossfaderValue(value)
  }

  // Reset fonksiyonu - slider'ı %50'ye getirir
  const resetToCenter = () => {
    setCrossfaderValue(50)
  }

  // Yüzde hesaplamaları
  const musicPercentage = 100 - crossfaderValue
  const naturePercentage = crossfaderValue

  // Compact mode — sadece yüzdeleri ve açma butonunu göster
  if (closed) {
    return (
      <button
        onClick={() => setClosed(false)}
        className="crossfader-compact"
        title="Expand crossfader"
      >
        <Sliders size={14} className="crossfader-compact-icon" />
        <span className="crossfader-compact-label">🎵 {musicPercentage}%</span>
        <span className="crossfader-compact-divider">|</span>
        <span className="crossfader-compact-label">🌿 {naturePercentage}%</span>
        <ChevronDown size={12} className="crossfader-compact-chevron" />
      </button>
    )
  }

  return (
    <div className="crossfader-container">
      {/* Header with close button */}
      <div className="crossfader-header">
        <div className="crossfader-labels">
          <span className="crossfader-label left">Just Music</span>
          <span className="crossfader-label right">Just Nature</span>
        </div>
        <button
          onClick={() => setClosed(true)}
          className="crossfader-close-btn"
          title="Minimize crossfader"
        >
          ✕
        </button>
      </div>

      {/* Crossfader Slider */}
      <div className="crossfader-slider-wrapper">
        <input
          type="range"
          min="0"
          max="100"
          value={crossfaderValue}
          onChange={handleCrossfaderChange}
          className="crossfader-slider"
        />

        {/* Center indicator */}
        <div className="crossfader-center-mark"></div>
      </div>

      {/* Percentage Display */}
      <div className="crossfader-percentages">
        <span className="crossfader-percentage music">
          {musicPercentage}%
        </span>

        {/* Reset Button - Yüzdelerin ortasında */}
        <button
          onClick={resetToCenter}
          className="crossfader-reset-btn"
          title="Reset to 50/50"
        >
          <RotateCcw size={12} />
          <span className="reset-text">reset</span>
        </button>

        <span className="crossfader-percentage nature">
          {naturePercentage}%
        </span>
      </div>
    </div>
  )
}