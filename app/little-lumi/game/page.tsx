"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useAudio } from "@/hooks/little-lumis-hooks/use-audio"
import StarBackground from "@/components/little-lumi-components/childhood/star-background"
import CrosswordPuzzle from "@/components/little-lumi-components/game/crossword-puzzle"
import LittleLumiAudioController from "@/components/little-lumi-components/childhood/lil-audio-controller"


export default function GamePage() {
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const { isMuted, toggleMute } = useAudio()

  useEffect(() => {
    // Simulate loading delay for entrance animation
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const handlePuzzleComplete = () => {
    setIsCompleted(true)
  }

  const handleNextLevel = () => {
    // For now, just reload the page to get a new random puzzle
    router.push("/big-energy-lumi/")
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <StarBackground />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-6"
        >
          <h1 className="text-3xl md:text-4xl font-gothic text-purple-300 mb-2 glow-text-purple">Memory Crossword</h1>
          <p className="text-purple-200 max-w-2xl mx-auto">
            Fill in the crossword puzzle with words from your childhood memories. Click on a cell and type to enter
            letters.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full"
        >
          <CrosswordPuzzle onComplete={handlePuzzleComplete} />
        </motion.div>

        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="flex justify-center mt-8"
          >
            <button
              onClick={handleNextLevel}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-400 text-white font-medium rounded-full shadow-lg hover:shadow-purple-500/30 transition-all"
            >
              Your next memory awaits!
            </button>
          </motion.div>
        )}
      </div>

      <LittleLumiAudioController isMuted={isMuted} toggleMute={toggleMute} isGameCompleted={isCompleted} />

      <div className="absolute bottom-4 right-4 text-purple-400 text-sm opacity-70">
        <p>Best experienced on desktop for full interactivity</p>
      </div>
    </main>
  )
}
