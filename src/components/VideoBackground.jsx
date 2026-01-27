import React, { useState, useEffect, useRef } from 'react'

const MOBILE_VIDEO = import.meta.env.BASE_URL + 'VHS_Cassette_Player_Loop_Generation.mp4'

export default function Background({ mediaFile, isImage = false }) {
  const [isMobile, setIsMobile] = useState(false)
  const videoRef = useRef(null)

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i
      setIsMobile(mobileRegex.test(userAgent.toLowerCase()) || window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // If image, show image background
  if (isImage) {
    return (
      <div
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat video-filter"
        style={{ backgroundImage: `url(${mediaFile})` }}
      />
    )
  }

  // Otherwise show video
  const src = isMobile ? MOBILE_VIDEO : mediaFile

  return (
    <video
      ref={videoRef}
      className="fixed inset-0 w-full h-full object-cover video-filter"
      src={src}
      autoPlay
      muted
      playsInline
      loop
      key={src}
    />
  )
}
