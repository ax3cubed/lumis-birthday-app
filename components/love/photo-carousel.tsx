"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Pause, Play, Volume2, VolumeX } from "lucide-react"
import { getCDNUrl } from "@/lib/utils"

// Sample data - replace with actual content
type Media = {
  id: number
  src: string
  caption: string
  accentColor: string
  accentItem: string
  mediaType: "image" | "video"
}

const media: Media[] = [
  {
    id: 1,
    src: getCDNUrl("relationship/love-1.jpg"),
    caption: "Our first picnic",
    accentColor: "red",
    accentItem: "rose",
    mediaType: "image",
  },
  {
    id: 2,
    src: getCDNUrl("relationship/love-2.mp4"),
    caption: "The time he forgot the umbrella ☔",
    accentColor: "blue",
    accentItem: "umbrella",
    mediaType: "video",
  },
  {
    id: 3,
    src: getCDNUrl("relationship/love-3.jpg"),
    caption: "Dancing under the stars",
    accentColor: "gold",
    accentItem: "necklace",
    mediaType: "image",
  },
  {
    id: 4,
    src: getCDNUrl("relationship/love-4.jpg"),
    caption: "Sunday morning pancakes",
    accentColor: "yellow",
    accentItem: "lemon",
    mediaType: "image",
  },
  {
    id: 5,
    src: getCDNUrl("relationship/love-5.jpg"),    
    caption: "Our favorite beach getaway",
    accentColor: "turquoise",
    accentItem: "ocean",
    mediaType: "image",
  },
  {
    id: 6,
    src: getCDNUrl("relationship/love-6.jpg"),
    caption: "Celebrating our anniversary",
    accentColor: "pink",
    accentItem: "cake",
    mediaType: "image",
  },
  {
    id: 7,
    src: getCDNUrl("relationship/love-7.jpg"),
    caption: "Movie nights with popcorn 🍿",
    accentColor: "purple",
    accentItem: "popcorn",
    mediaType: "image",
  },
  {
    id: 8,
    src: getCDNUrl("relationship/love-8.jpg"),
    caption: "Exploring new places together",
    accentColor: "green",
    accentItem: "leaf",
    mediaType: "image",
  },
  {
    id: 9,
    src: getCDNUrl("relationship/love-9.jpg"),
    caption: "Cuddles on a rainy day",
    accentColor: "gray",
    accentItem: "blanket",
    mediaType: "image",
  },
  {
    id: 10,
    src: getCDNUrl("relationship/love-10.jpg"),
    caption: "Our first dance as a couple",
    accentColor: "orange",
    accentItem: "flower",
    mediaType: "image",
  },
{
    id: 10,
    src: getCDNUrl("relationship/love-11.mp4"),
    caption: "Post Court Wedding Pictures",
    accentColor: "orange",
    accentItem: "flower",
    mediaType: "video",
  },
]

export default function MediaCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isVideoReady, setIsVideoReady] = useState(false)
  const [positionX, setPositionX] = useState(0)
  const [positionY, setPositionY] = useState(0)
  const [objectPosX, setObjectPosX] = useState(50) // percent
  const [objectPosY, setObjectPosY] = useState(50) // percent
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const currentMedia = media[currentIndex]
  const isVideo = currentMedia.mediaType === "video"

  const handleNext = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % media.length)
    setTimeout(() => setIsAnimating(false), 500)
    setIsVideoReady(false)
  }

  const handlePrev = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + media.length) % media.length)
    setTimeout(() => setIsAnimating(false), 500)
    setIsVideoReady(false)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      handleNext()
    }
    if (touchStart - touchEnd < -50) {
      handlePrev()
    }
  }

  const togglePause = () => {
    setIsPaused(!isPaused)
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(!isMuted)
    }
  }

  const handleVideoLoaded = () => {
    setIsVideoReady(true)
  }

  useEffect(() => {
    // Reset video state when media changes
    if (isVideo) {
      setIsMuted(true)
      if (videoRef.current) {
        videoRef.current.muted = true
        videoRef.current.currentTime = 0
      }
    }

    // Clear and restart auto-advance timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        // For videos, only advance when video ends or if it's longer than 15 seconds
        if (isVideo && videoRef.current) {
          if (videoRef.current.duration > 15) {
            // For longer videos, we still advance after 15 seconds
            handleNext()
          } else {
            // For shorter videos, let them play once before advancing
            // This will be handled in the onEnded event of the video
          }
        } else {
          // For images, advance after 5 seconds
          handleNext()
        }
      }, isVideo ? 15000 : 5000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [currentIndex, isPaused, isVideo])

  // Handle video play/pause
  useEffect(() => {
    if (videoRef.current && isVideo) {
      if (isPaused) {
        videoRef.current.pause()
      } else {
        videoRef.current.play().catch(error => {
          console.error("Video playback failed:", error)
        })
      }
    }
  }, [isPaused, isVideo])

  // Function to determine appropriate text color based on accent color
  const getTextColorClass = (color: string) => {
    const safeColors = ["red", "blue", "green", "yellow", "purple", "pink", "orange", "gray", "gold", "turquoise"]
    
    // Default to white if the color is not in our safe list
    if (!safeColors.includes(color)) return "text-white"
    
    // Map colors to appropriate Tailwind classes
    const colorMap: Record<string, string> = {
      red: "text-red-400",
      blue: "text-blue-400",
      green: "text-green-400",
      yellow: "text-yellow-300",
      purple: "text-purple-400",
      pink: "text-pink-400",
      orange: "text-orange-400",
      gray: "text-gray-300",
      gold: "text-yellow-500",
      turquoise: "text-teal-400"
    }
    
    return colorMap[color] || "text-white"
  }

  return (
    <>
      <div className="relative overflow-hidden rounded-lg shadow-2xl">
        <div
          className="relative h-[500px] md:h-[600px] w-full"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <div className="relative h-full w-full">
                {isVideo ? (
                  <div className="relative h-full w-full bg-black">
                    {!isVideoReady && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                    <video
                      ref={videoRef}
                      src={currentMedia.src}
                      className={`object-contain h-full w-full ${isVideoReady ? 'opacity-100' : 'opacity-0'}`}
                      autoPlay
                      loop
                      playsInline
                      onLoadedData={handleVideoLoaded}
                      onEnded={() => {
                        // For short videos, advance when they end if not paused
                        if (!isPaused && videoRef.current && videoRef.current.duration <= 15) {
                          handleNext()
                        }
                      }}
                      style={{ transform: `translate(${positionX}px, ${positionY}px)` }}
                    />
                  </div>
                ) : (
                  <Image
                    src={currentMedia.src || "/placeholder.svg"}
                    alt={currentMedia.caption}
                    fill
                    className="object-cover"
                    priority
                    style={{ objectPosition: `${objectPosX}% ${objectPosY}%` }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
              </div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="absolute bottom-0 left-0 right-0 p-6 md:p-8"
              >
                <p className="text-xl md:text-2xl font-serif text-white mb-2">{currentMedia.caption}</p>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100px" }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="h-0.5 bg-white"
                ></motion.div>
                <p className="text-sm text-gray-300 mt-2 italic">
                  <span className={getTextColorClass(currentMedia.accentColor)}>
                    {currentMedia.accentItem}
                  </span>{" "}
                  - the only color in our black & white world
                </p>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation controls */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all"
          aria-label="Previous media"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all"
          aria-label="Next media"
        >
          <ChevronRight size={24} />
        </button>

        {/* Dots navigation */}
        <div className="absolute bottom-24 md:bottom-20 left-1/2 -translate-x-1/2 flex gap-1.5">
          {media.map((item, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? "bg-white scale-125" : "bg-white/50"
              } ${item.mediaType === "video" ? "ring-1 ring-white/60" : ""}`}
              aria-label={`Go to slide ${index + 1}`}
              title={item.mediaType === "video" ? "Video" : "Image"}
            />
          ))}
        </div>

        {/* Video controls */}
        {isVideo && (
          <div className="absolute bottom-4 left-4 flex gap-2">
            <button
              onClick={togglePause}
              className="bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-all"
              aria-label={isPaused ? "Play" : "Pause"}
            >
              {isPaused ? <Play size={20} /> : <Pause size={20} />}
            </button>
            <button
              onClick={toggleMute}
              className="bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-all"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>
        )}

        {/* Auto-advance toggle */}
        <button
          onClick={togglePause}
          className="absolute bottom-4 right-4 bg-black/40 hover:bg-black/60 text-white px-3 py-1 rounded-full text-sm transition-all flex items-center gap-1"
        >
          {isPaused ? <Play size={14} /> : <Pause size={14} />}
          <span>{isPaused ? "Auto-play" : "Pause"}</span>
        </button>
      </div>

      {/* Position sliders OUTSIDE the carousel */}
      <div className="mt-4 flex flex-col items-center gap-2 bg-black/40 rounded-lg px-4 py-2 w-fit mx-auto">
        <label className="flex items-center gap-2 text-white text-xs">
          X:
          <input
            type="range"
            min={0}
            max={100}
            value={objectPosX}
            onChange={e => setObjectPosX(Number(e.target.value))}
            className="w-32"
          />
          <span>{objectPosX}%</span>
        </label>
        <label className="flex items-center gap-2 text-white text-xs">
          Y:
          <input
            type="range"
            min={0}
            max={100}
            value={objectPosY}
            onChange={e => setObjectPosY(Number(e.target.value))}
            className="w-32"
          />
          <span>{objectPosY}%</span>
        </label>
      </div>
    </>
  )
}