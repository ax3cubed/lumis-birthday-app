"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Check, ChevronRight } from "lucide-react"
import confetti from "canvas-confetti"
import TiltedCard from "./tilted-card"

interface TimelineToyGameProps {
  toys: Array<{
    id: string
    icon: string
    name: string
    targetAge: number
    image: string
    funFact: string
  }>
  onMatchToy: (toyId: string, age: number) => boolean
  matchedToys: Record<string, boolean>
  isCompleted: boolean
  onComplete: () => void
}

export default function TimelineToyGame({
  toys,
  onMatchToy,
  matchedToys,
  isCompleted,
  onComplete,
}: TimelineToyGameProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [showNextButton, setShowNextButton] = useState(false)
  const [selectedAge, setSelectedAge] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showFunFact, setShowFunFact] = useState(false)
  const gameRef = useRef<HTMLDivElement>(null)

  // Get current toy
  const currentToy = toys[currentStep]

  // Reset selected age when step changes
  useEffect(() => {
    setSelectedAge(null)
    setShowFeedback(false)
    setIsCorrect(false)
    setShowFunFact(false)
  }, [currentStep])

  // Show next button when all toys are matched
  useEffect(() => {
    if (isCompleted && currentStep >= toys.length - 1) {
      setTimeout(() => {
        setShowNextButton(true)
      }, 1500)
    }
  }, [isCompleted, currentStep, toys.length])

  // Trigger confetti when game is completed
  useEffect(() => {
    if (isCompleted) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }
  }, [isCompleted])

  const handleAgeSelect = (age: number) => {
    if (showFeedback) return

    setSelectedAge(age)
    const isCorrect = onMatchToy(currentToy.id, age)
    setIsCorrect(isCorrect)
    setShowFeedback(true)

    // Play sound based on result
    const audio = new Audio(isCorrect ? "/sounds/toy-match.mp3" : "/sounds/toy-error.mp3")
    audio.volume = isCorrect ? 0.4 : 0.3
    audio.play().catch((err) => console.log("Audio play failed:", err))

    // Show fun fact after correct match
    if (isCorrect) {
      setTimeout(() => {
        setShowFunFact(true)
      }, 1000)
    }
  }

  const handleNextStep = () => {
    if (currentStep < toys.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  return (
    <div
      ref={gameRef}
      className="relative bg-black/40 backdrop-blur-sm rounded-xl p-8 border border-purple-800/50 shadow-lg"
    >
      <h2 className="text-2xl md:text-3xl font-gothic text-purple-200 mb-6 text-center">Lumi's Childhood Timeline</h2>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-purple-300 text-sm">Progress</span>
          <span className="text-purple-300 text-sm">
            {currentStep + 1} of {toys.length}
          </span>
        </div>
        <div className="w-full h-2 bg-purple-900/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-purple-300"
            initial={{ width: `${(currentStep / toys.length) * 100}%` }}
            animate={{ width: `${((currentStep + 1) / toys.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="flex flex-col items-center">
          <div className="w-full max-w-[300px] h-[300px] mb-4">
            <TiltedCard
              imageSrc={currentToy.image}
              altText={`Lumi at age ${currentToy.targetAge}`}
              captionText={`Age ${currentToy.targetAge}`}
              containerHeight="300px"
              containerWidth="100%"
              imageHeight="300px"
              imageWidth="300px"
              showMobileWarning={false}
            />
          </div>
          <div className="flex items-center justify-center mt-2 space-x-2">
            <div className="w-12 h-12 flex items-center justify-center bg-purple-900/60 rounded-full">
              <span className="text-2xl">{currentToy.icon}</span>
            </div>
            <h3 className="text-xl text-purple-200 font-gothic">{currentToy.name}</h3>
          </div>
        </div>

        <div className="flex flex-col">
          <h3 className="text-xl text-purple-200 font-gothic mb-4">At what age did Lumi love this toy?</h3>

          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 8 }, (_, i) => i + 1).map((age) => (
              <motion.button
                key={`age-${age}`}
                className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${
                  selectedAge === age
                    ? isCorrect
                      ? "border-green-500 bg-green-500/20"
                      : "border-red-500 bg-red-500/20"
                    : "border-purple-700/50 bg-purple-900/30 hover:bg-purple-800/30"
                }`}
                onClick={() => handleAgeSelect(age)}
                whileHover={{ scale: selectedAge === null ? 1.05 : 1 }}
                whileTap={{ scale: selectedAge === null ? 0.98 : 1 }}
                disabled={selectedAge !== null}
              >
                <span className="text-lg font-gothic text-purple-100">Age {age}</span>

                {selectedAge === age && (
                  <motion.div
                    className="absolute top-2 right-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {isCorrect ? (
                      <Check className="text-green-400" size={18} />
                    ) : (
                      <motion.div
                        className="text-red-400"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 0.5, times: [0, 0.2, 0.8, 1] }}
                      >
                        ✕
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {showFeedback && isCorrect && showFunFact && (
              <motion.div
                className="mt-6 p-4 rounded-lg bg-purple-900/40 border border-purple-500/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-purple-200 font-handwritten text-lg">{currentToy.funFact}</p>

                {currentStep < toys.length - 1 && (
                  <motion.button
                    className="mt-4 flex items-center justify-center w-full py-2 px-4 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium transition-colors"
                    onClick={handleNextStep}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    Continue <ChevronRight size={18} className="ml-1" />
                  </motion.button>
                )}
              </motion.div>
            )}

            {showFeedback && !isCorrect && (
              <motion.div
                className="mt-6 p-4 rounded-lg bg-red-900/30 border border-red-500/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-red-200">That's not quite right. Try another age!</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Completion message and next button */}
      <AnimatePresence>
        {isCompleted && showNextButton && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-xl z-10"
          >
            <motion.div
              className="text-center px-6"
              animate={{
                scale: [1, 1.05, 1],
                textShadow: [
                  "0 0 5px rgba(233, 213, 255, 0.5)",
                  "0 0 20px rgba(233, 213, 255, 0.8)",
                  "0 0 5px rgba(233, 213, 255, 0.5)",
                ],
              }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            >
              <h3 className="text-3xl md:text-4xl font-gothic text-purple-200 mb-4">
                You've completed Lumi's timeline!
              </h3>
              <p className="text-purple-300 mb-8 max-w-md mx-auto">
                You've matched all her favorite childhood toys correctly and discovered her journey through the years.
              </p>

              <motion.button
                onClick={onComplete}
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-400 text-white font-medium rounded-full shadow-lg hover:shadow-purple-500/30 transition-all"
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(168, 85, 247, 0.5)" }}
                whileTap={{ scale: 0.98 }}
              >
                Continue to Next Chapter <ArrowRight size={18} className="ml-2" />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
