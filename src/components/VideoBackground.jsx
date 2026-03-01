import React, { useRef } from 'react'

export default function Background({ mediaFile, isImage = false, focusPoint = 'center center' }) {
  const videoRef = useRef(null)

  // If image, show image background
  if (isImage) {
    return (
      <div
        className="fixed inset-0 w-full h-full bg-cover bg-no-repeat video-filter"
        style={{ backgroundImage: `url(${mediaFile})`, backgroundPosition: focusPoint }}
      />
    )
  }

  // Otherwise show video — always use the channel's configured background
  return (
    <video
      ref={videoRef}
      className="fixed inset-0 w-full h-full object-cover video-filter"
      style={{ objectPosition: focusPoint }}
      src={mediaFile}
      autoPlay
      muted
      playsInline
      loop
      key={mediaFile}
    />
  )
}
