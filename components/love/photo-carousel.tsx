"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
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
const photos:Media[] = [
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
]

export default function PhotoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const handleNext = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length)
    setTimeout(() => setIsAnimating(false), 500)
  }

  const handlePrev = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length)
    setTimeout(() => setIsAnimating(false), 500)
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

  useEffect(() => {
    // Auto-advance carousel every 5 seconds
    intervalRef.current = setInterval(() => {
      handleNext()
    }, 5000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [currentIndex])

  return (
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
              <Image
                src={photos[currentIndex].src || "/placeholder.svg"}
                alt={photos[currentIndex].caption}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute bottom-0 left-0 right-0 p-6 md:p-8"
            >
              <p className="text-xl md:text-2xl font-serif text-white mb-2">{photos[currentIndex].caption}</p>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100px" }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="h-0.5 bg-white"
              ></motion.div>
              <p className="text-sm text-gray-300 mt-2 italic">
                <span className={`text-${photos[currentIndex].accentColor}-400`}>
                  {photos[currentIndex].accentItem}
                </span>{" "}
                - the only color in our black & white world
              </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all"
        aria-label="Previous photo"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all"
        aria-label="Next photo"
      >
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
        {photos.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? "bg-white scale-125" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
