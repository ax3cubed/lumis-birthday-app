"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"
import { Button } from "@/components/ui/button"

interface WinStateProps {
  onClose: () => void
}

export default function WinState({ onClose }: WinStateProps) {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Create audio element for celebration sound
    const celebrationAudio = new Audio("/placeholder.mp3")
    celebrationAudio.volume = 0.5
    setAudio(celebrationAudio)

    // Play celebration sound
    celebrationAudio.play().catch((e) => console.log("Audio playback prevented:", e))

    // Trigger confetti explosion
    const duration = 5 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      // Random confetti bursts
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    }, 250)

    return () => {
      clearInterval(interval)
      if (audio) {
        audio.pause()
        audio.currentTime = 0
      }
    }
  }, [])

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative w-full max-w-lg">
        <motion.div
          className="absolute -top-20 -left-20 right-0 bottom-0"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
          style={{
            backgroundImage: "url('/placeholder-x30um.png')",
            backgroundSize: "cover",
            opacity: 0.3,
          }}
        />

        <motion.div
          className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl p-8 text-center relative z-10 shadow-2xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            delay: 0.2,
          }}
        >
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">✨ Big Lumi Energy Unlocked ✨</h2>

            <div className="mb-8 relative h-60">
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              >
                <img
                  src="/placeholder.svg?height=300&width=200&query=dancing silhouette with sparkles"
                  alt="Lumi silhouette dancing"
                  className="h-full object-contain"
                />
              </motion.div>
            </div>

            <p className="text-white text-lg mb-8">
              Congratulations! You've unlocked all of Lumi's university memories and experienced the full Big Lumi
              Energy!
            </p>

            <Button
              onClick={onClose}
              className="bg-gradient-to-r from-purple-800 to-pink-700 hover:from-purple-700 hover:to-pink-600 text-white px-8 py-2 text-lg font-medium border border-purple-500/30"
            >
              Continue the Journey
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}
