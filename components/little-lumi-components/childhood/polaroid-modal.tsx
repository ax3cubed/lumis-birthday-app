"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"
import TiltedCard from "./tilted-card"

interface PolaroidModalProps {
  polaroid: {
    image: string
    text: string
    age: number
    funFact: string
    emoji: string
  }
  onClose: () => void
}

export default function PolaroidModal({ polaroid, onClose }: PolaroidModalProps) {
  const [typedText, setTypedText] = useState("")
  const [isTyping, setIsTyping] = useState(true)

  // Typewriter effect for fun fact
  useEffect(() => {
    if (!polaroid.funFact) return

    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex <= polaroid.funFact.length) {
        setTypedText(polaroid.funFact.substring(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(interval)
        setIsTyping(false)
      }
    }, 30) // Speed of typing

    return () => clearInterval(interval)
  }, [polaroid.funFact])

  // Play sound effect when modal opens
  useEffect(() => {
    const audio = new Audio("/sounds/polaroid-open.mp3")
    audio.volume = 0.4
    audio.play().catch((err) => console.log("Audio play failed:", err))

    return () => {
      audio.pause()
      audio.currentTime = 0
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        className="relative max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full aspect-[4/5] mb-4">
          <TiltedCard
            imageSrc={polaroid.image}
            altText={`Lumi at age ${polaroid.age}`}
            captionText={`Age ${polaroid.age}`}
            containerHeight="100%"
            containerWidth="100%"
            imageHeight="100%"
            imageWidth="100%"
            showMobileWarning={false}
            showTooltip={false}
            displayOverlayContent={true}
            overlayContent={
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="text-xl font-gothic text-white">Age {polaroid.age}</h3>
              </div>
            }
          />
        </div>

        <div className="bg-purple-950/90 backdrop-blur-sm rounded-xl p-6 border border-purple-800/50 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-gothic text-purple-200">Age {polaroid.age}</h3>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, 0, -5, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 2,
              }}
              className="text-2xl"
            >
              {polaroid.emoji}
            </motion.div>
          </div>

          <div className="min-h-[60px] font-handwritten text-purple-200 text-lg">
            {typedText}
            {isTyping && (
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
              >
                |
              </motion.span>
            )}
          </div>
        </div>

        {/* Close button */}
        <motion.button
          onClick={onClose}
          className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1
                    hover:bg-black/70 transition-colors backdrop-blur-sm"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Close modal"
        >
          <X size={20} />
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
