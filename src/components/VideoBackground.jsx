import React, { useRef } from 'react'

export default function Background({ mediaFile, isImage = false }) {
  const videoRef = useRef(null)

  // If image, show image background
  if (isImage) {
    return (
      <div
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat video-filter"
        style={{ backgroundImage: `url(${mediaFile})` }}
      />
    )
  }

  // Otherwise show video — always use the channel's configured background
  return (
    <video
      ref={videoRef}
      className="fixed inset-0 w-full h-full object-cover video-filter"
      src={mediaFile}
      autoPlay
      muted
      playsInline
      loop
      key={mediaFile}
    />
  )
}
