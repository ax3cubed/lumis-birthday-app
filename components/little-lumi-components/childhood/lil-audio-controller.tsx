"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Volume2, VolumeX } from "lucide-react"

interface LittleLumiAudioControllerProps {
  isMuted: boolean
  toggleMute: () => void
  isGameCompleted: boolean
}

export default function LittleLumiAudioController({ isMuted, toggleMute, isGameCompleted }: LittleLumiAudioControllerProps) {
  const ambientRef = useRef<HTMLAudioElement | null>(null)
  const successRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio elements
  useEffect(() => {
    // Create ambient audio
    ambientRef.current = new Audio("/sounds/ambient-childhood.mp3")
    ambientRef.current.loop = true
    ambientRef.current.volume = 0.2

    // Create success audio
    successRef.current = new Audio("/sounds/success-melody.mp3")
    successRef.current.loop = false
    successRef.current.volume = 0.4

    // Start playing ambient audio with fade-in
    if (!isMuted) {
      ambientRef.current.volume = 0
      ambientRef.current.play().catch((err) => console.log("Audio play failed:", err))

      // Fade in
      let vol = 0
      const fadeIn = setInterval(() => {
        if (vol < 0.2) {
          vol = Math.min(0.2, vol + 0.01) // Ensure volume never exceeds 0.2
          if (ambientRef.current) ambientRef.current.volume = vol
        } else {
          clearInterval(fadeIn)
        }
      }, 100)
    }

    return () => {
      // Clean up audio on unmount
      if (ambientRef.current) {
        ambientRef.current.pause()
        ambientRef.current = null
      }

      if (successRef.current) {
        successRef.current.pause()
        successRef.current = null
      }
    }
  }, [])

  // Handle mute/unmute
  useEffect(() => {
    if (ambientRef.current) {
      if (isMuted) {
        ambientRef.current.volume = 0
      } else {
        ambientRef.current.volume = 0.2
        ambientRef.current.play().catch((err) => console.log("Audio play failed:", err))
      }
    }

    if (successRef.current) {
      if (isMuted) {
        successRef.current.volume = 0
      } else {
        successRef.current.volume = 0.4
      }
    }
  }, [isMuted])

  // Play success audio when game is completed
  useEffect(() => {
    if (isGameCompleted && successRef.current && !isMuted) {
      // Fade out ambient audio
      let ambientVol = ambientRef.current?.volume || 0
      const fadeOut = setInterval(() => {
        if (ambientVol > 0 && ambientRef.current) {
          ambientVol = Math.max(0, ambientVol - 0.01) // Ensure volume never goes below 0
          ambientRef.current.volume = ambientVol
        } else {
          clearInterval(fadeOut)
          if (ambientRef.current) {
            ambientRef.current.volume = 0 // Explicitly set to 0 to be safe
            ambientRef.current.pause()
          }
        }
      }, 50)

      // Play success audio
      successRef.current.play().catch((err) => console.log("Audio play failed:", err))
    }
  }, [isGameCompleted, isMuted])

  return (
    <motion.button
      className="fixed bottom-4 left-4 z-20 bg-purple-900/70 p-2 rounded-full
                border border-purple-700 hover:bg-purple-800/80 transition-colors"
      onClick={toggleMute}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isMuted ? "Unmute audio" : "Mute audio"}
      data-cursor-hover
      data-cursor-text={isMuted ? "Unmute" : "Mute"}
    >
      {isMuted ? <VolumeX size={20} className="text-purple-300" /> : <Volume2 size={20} className="text-purple-300" />}
    </motion.button>
  )
}
