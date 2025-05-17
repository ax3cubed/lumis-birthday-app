"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Image {
  id: string
  src: string
  alt: string
  caption: string
}

interface ImageCarouselProps {
  isOpen: boolean
  onClose: () => void
  images: Image[]
  initialIndex: number
}

export default function ImageCarousel({ isOpen, onClose, images, initialIndex }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  // Reset to initial index when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex)
    }
  }, [isOpen, initialIndex])

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case "ArrowLeft":
          handlePrevious()
          break
        case "ArrowRight":
          handleNext()
          break
        case "Escape":
          onClose()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 z-10 text-white hover:bg-white/10"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Previous button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 z-10 h-12 w-12 rounded-full text-white hover:bg-white/10"
            onClick={handlePrevious}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          {/* Next button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 z-10 h-12 w-12 rounded-full text-white hover:bg-white/10"
            onClick={handleNext}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>

          {/* Image container */}
          <div className="relative h-full w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                className="absolute inset-0 flex items-center justify-center p-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative max-h-full max-w-full">
                  <img
                    src={images[currentIndex].src || "/placeholder.svg"}
                    alt={images[currentIndex].alt}
                    className="max-h-[80vh] max-w-full rounded-lg object-contain"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4 text-center text-white backdrop-blur-sm">
                    <p className="text-lg font-medium">{images[currentIndex].caption}</p>
                    <p className="text-sm text-white/70">
                      {currentIndex + 1} / {images.length}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
