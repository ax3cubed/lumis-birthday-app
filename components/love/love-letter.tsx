"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Volume2, VolumeX } from "lucide-react"

export default function LoveLetter() {
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false)
  const [currentLine, setCurrentLine] = useState(0)
  const [isMuted, setIsMuted] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Sample letter content - replace with actual content
  const letterLines = [
    "My dearest Lumi,",
    "From the moment I set eyes on you on the Unilorin walkway, I knew there was something extraordinary about you.",
    "Your smile lights up even the darkest rooms, and your laugh is the soundtrack to my happiest moments.",
    "Every day with you feels like a new adventure, and the feeling of your head tucked right under my arm is priceless.",
    "You’ve taught me what it means to truly love someone with patience, understanding, and endless joy.",
    "As we build our life together, I promise to always be your biggest supporter, your trusted confidant, and your partner in all of life's adventures.",
    "Thank you for choosing me, for loving me, and for making every day feel like a gift.",
    "Forever yours,",
    "❤️",
  ]

  const isLetterFullyDisplayed = currentLine >= letterLines.length - 1

  useEffect(() => {
    if (isEnvelopeOpen && currentLine < letterLines.length) {
      const timer = setTimeout(() => {
        setCurrentLine(currentLine + 1)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isEnvelopeOpen, currentLine])

  useEffect(() => {
    if (!isMuted && audioRef.current) {
      audioRef.current.volume = 0.3
      audioRef.current.play().catch((e) => console.log("Audio play prevented:", e))
    } else if (audioRef.current) {
      audioRef.current.pause()
    }
  }, [isMuted])

  const handleEnvelopeClick = () => {
    setIsEnvelopeOpen(true)
    if (!isMuted && audioRef.current) {
      audioRef.current.play().catch((e) => console.log("Audio play prevented:", e))
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleNextLevel = () => {
    console.log("Moving to next level")
    // Add navigation or state change logic here
  }

  return (
    <div className="max-w-2xl mx-auto h-[600px] flex items-center justify-center relative">
      <audio ref={audioRef} src="/placeholder-zz6ru.png" loop />

      <button
        onClick={toggleMute}
        className="absolute top-4 right-4 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-all z-10"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>

      <AnimatePresence mode="wait">
        {!isEnvelopeOpen ? (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1, rotate: [0, -2, 2, 0] }}
            transition={{
              duration: 1.5,
              rotate: {
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "mirror",
                duration: 4,
              },
            }}
            className="cursor-pointer"
            onClick={handleEnvelopeClick}
          >
            <div className="relative w-64 h-48 bg-gray-100 rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition-transform">
              <div className="absolute inset-0 bg-[url('/vintage-paper-texture.png')] bg-cover opacity-70"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-pink-100/30 to-red-200/30"></div>

              {/* Envelope flap */}
              <div className="absolute top-0 left-0 w-full h-24 bg-gray-200 origin-bottom transform-gpu rotate-0 z-10">
                <div className="absolute inset-0 bg-[url('/vintage-paper-texture.png')] bg-cover opacity-70"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-pink-100/20 to-red-200/20"></div>
                <div className="absolute bottom-0 left-0 w-full h-full bg-transparent border-t-[100px] border-l-[128px] border-r-[128px] border-t-gray-200 border-l-transparent border-r-transparent"></div>
              </div>

              {/* Envelope body */}
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-800 font-serif text-lg z-20 mt-6">Tap to open</p>
              </div>

              {/* Heart seal */}
              <div className="absolute top-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white text-xl">❤️</span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl bg-[url('/vintage-paper-texture.png')] bg-cover rounded-lg p-8 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-100/10 to-red-200/10"></div>

            <div className="relative z-10">
              {letterLines.slice(0, currentLine + 1).map((line, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.8 }}
                  className={`mb-4 ${
                    index === 0 || index === letterLines.length - 2 || index === letterLines.length - 1
                      ? "font-handwriting text-2xl italic"
                      : "font-handwriting text-xl italic"
                  } text-gray-800`}
                >
                  {line}
                </motion.p>
              ))}
            </div>

            {/* Floating hearts background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: 15 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    y: Math.random() * 600,
                    x: Math.random() * 500,
                    opacity: Math.random() * 0.3 + 0.1,
                    scale: Math.random() * 0.5 + 0.2,
                  }}
                  animate={{
                    y: [null, Math.random() * 600],
                    x: [null, Math.random() * 500],
                  }}
                  transition={{
                    duration: Math.random() * 20 + 10,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "mirror",
                    ease: "linear",
                  }}
                  className="absolute text-red-200 text-2xl"
                >
                  ❤️
                </motion.div>
              ))}
            </div>
            {isLetterFullyDisplayed && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute bottom-8 left-0 right-0 flex justify-center"
              >
                <button
                  onClick={handleNextLevel}
                  className="px-8 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95"
                >
                  Next Level
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
