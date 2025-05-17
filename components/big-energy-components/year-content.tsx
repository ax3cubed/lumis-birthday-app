"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useRouter } from "next/navigation"

interface Photo {
  src: string
  alt: string
  coloredItem: string
}

interface GameItem {
  statement: string
  isLie: boolean
  hint: string
}

interface YearData {
  photos: Photo[]
  gameItems: GameItem[]
}

interface YearContentProps {
  year: number
  description: string
  data: YearData
  onPlayGame: () => void
  isCompleted: boolean
}

export default function YearContent({ year, description, data, onPlayGame, isCompleted }: YearContentProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const galleryRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % data.photos.length)
  }

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + data.photos.length) % data.photos.length)
  }

  // Parallax effect for gallery
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (galleryRef.current) {
        setScrollY(window.scrollY)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div>
      <motion.div
        className="flex flex-col md:flex-row md:items-baseline gap-2 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-3xl font-bold">{year}</h2>
        <p className="text-xl text-purple-400">{description}</p>
      </motion.div>

      {/* Photo Gallery with Parallax */}
      <div ref={galleryRef} className="relative overflow-hidden rounded-lg mb-8 h-[300px] md:h-[400px]">
        <div className="absolute inset-0 flex items-center justify-center">
          {data.photos.map((photo, index) => (
            <motion.div
              key={index}
              className="absolute inset-0 w-full h-full"
              initial={{ opacity: 0 }}
              animate={{
                opacity: currentPhotoIndex === index ? 1 : 0,
                x: currentPhotoIndex === index ? 0 : index < currentPhotoIndex ? -100 : 100,
              }}
              transition={{ duration: 0.5 }}
              style={{
                y: currentPhotoIndex === index ? scrollY * 0.1 : 0,
              }}
            >
              <div className="relative w-full h-full">
                {/* Black and white image with colored item */}
                <div className="absolute inset-0 filter grayscale">
                  <img src={photo.src || "/placeholder.svg"} alt={photo.alt} className="w-full h-full object-cover" />
                </div>

                {/* Colored item overlay */}
                <div className="absolute inset-0">
                  <img
                    src={photo.src || "/placeholder.svg"}
                    alt={`${photo.alt} - ${photo.coloredItem} in color`}
                    className="w-full h-full object-cover mix-blend-color"
                  />
                </div>

                {/* Caption */}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-3">
                  <p>
                    {photo.alt} - <span className="text-yellow-300">{photo.coloredItem}</span> in color
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Gallery navigation */}
        <div className="absolute bottom-16 left-0 right-0 flex justify-center space-x-2 z-10">
          {data.photos.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${currentPhotoIndex === index ? "bg-white" : "bg-white/50"}`}
              onClick={() => setCurrentPhotoIndex(index)}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-purple-900/40 border-purple-700/50 text-purple-400 hover:text-purple-300 z-10"
          onClick={prevPhoto}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-purple-900/40 border-purple-700/50 text-purple-400 hover:text-purple-300 z-10"
          onClick={nextPhoto}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Game Button */}
      <motion.div
        className="flex justify-center mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Button
          onClick={onPlayGame}
          data-cursor-hover
          data-cursor-color="#A855F7"
          data-cursor-text={isCompleted ? "Next Adventure" : "Play Game"}
          data-cursor-size="140"
          data-cursor-effect="glow rainbow"
          className={`${isCompleted
              ? "bg-gradient-to-r from-green-700 to-emerald-600 hover:from-green-600 hover:to-emerald-500"
              : "bg-gradient-to-r from-purple-800 to-pink-700 hover:from-purple-700 hover:to-pink-600"
            } text-white px-8 py-6 rounded-lg shadow-lg border border-purple-500/30 flex items-center gap-2`}
        >
          {isCompleted ? (
            <>
              <span>✓</span> Completed: Onto the next!
            </>
          ) : (
            <>
              Play "Two Truths and a Lie" for {year} ({description})
            </>
          )}
        </Button>
      </motion.div>
    </div>
  )
}
