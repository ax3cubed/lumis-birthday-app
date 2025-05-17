"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ChevronRight, Check, X, HelpCircle, Lightbulb } from "lucide-react"

interface GameItem {
  statement: string
  isLie: boolean
  hint: string
}

interface TwoTruthsGameProps {
  gameItems: GameItem[]
  year: number
  description: string
  onComplete: () => void
  onBack: () => void
  onNext: () => void
  completed: boolean
  isLastYear: boolean
}

export default function TwoTruthsGame({
  gameItems,
  year,
  description,
  onComplete,
  onBack,
  onNext,
  completed,
  isLastYear,
}: TwoTruthsGameProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [activeHint, setActiveHint] = useState<string | null>(null)
  const [hintIndex, setHintIndex] = useState<number | null>(null)

  // Reset state when year changes
  useEffect(() => {
    setSelectedIndex(null)
    setResult(null)
    setAttempts(0)
    setShowAnswer(false)
    setHintsUsed(0)
    setActiveHint(null)
    setHintIndex(null)
  }, [year])

  const handleSelect = (index: number) => {
    if (result !== null || completed) return

    setSelectedIndex(index)

    if (gameItems[index].isLie) {
      setResult("correct")

      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })

      setTimeout(() => {
        onComplete()
      }, 2000)
    } else {
      setResult("incorrect")
      setAttempts(attempts + 1)

      // Shake animation happens via CSS

      // Reset after shake
      setTimeout(() => {
        if (attempts >= 1) {
          setShowAnswer(true)
        } else {
          setResult(null)
          setSelectedIndex(null)
        }
      }, 1000)
    }
  }

  const handleShowHint = (index: number) => {
    if (hintsUsed >= 2) return

    if (hintIndex === index) {
      // Toggle off if clicking the same hint
      setActiveHint(null)
      setHintIndex(null)
    } else {
      setActiveHint(gameItems[index].hint)
      setHintIndex(index)
      if (activeHint === null || hintIndex !== index) {
        setHintsUsed(hintsUsed + 1)
      }
    }
  }

  // Find the lie index
  const lieIndex = gameItems.findIndex((item) => item.isLie)

  return (
    <div className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-800">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mr-2 text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Two Truths and a Lie: {year}</h2>
          <p className="text-purple-400">{description}</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-300">
            Can you spot which statement about Lumi's {year} ({description}) year is a lie? Select the statement you
            think is false.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Hints: {2 - hintsUsed} remaining</span>
            <Lightbulb className="h-4 w-4 text-yellow-400" />
          </div>
        </div>

        {completed ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800 flex items-center">
              <Check className="h-5 w-5 mr-2" />
              Great job! You successfully identified the lie.
            </p>
          </div>
        ) : showAnswer ? (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <p className="text-amber-800">The lie was: "{gameItems[lieIndex].statement}"</p>
          </div>
        ) : activeHint ? (
          <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4 mb-6">
            <p className="text-blue-300 flex items-center">
              <HelpCircle className="h-5 w-5 mr-2 text-blue-400" />
              Hint: {activeHint}
            </p>
          </div>
        ) : null}
      </div>

      <div className="grid gap-4">
        <AnimatePresence>
          {gameItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card
                className={`cursor-pointer transition-all duration-300 transform hover:scale-[1.02] bg-gray-800 text-white ${
                  selectedIndex === index
                    ? result === "correct"
                      ? "border-green-500 bg-green-900/50"
                      : "border-red-500 bg-red-900/30 animate-shake"
                    : completed && item.isLie
                      ? "border-green-500 bg-green-900/50"
                      : showAnswer && item.isLie
                        ? "border-amber-500 bg-amber-900/30"
                        : hintIndex === index
                          ? "border-blue-500 bg-blue-900/20"
                          : "border-gray-700 hover:border-purple-500"
                }`}
                onClick={() => !completed && !showAnswer && handleSelect(index)}
              >
                <CardContent className="p-6 flex justify-between items-center">
                  <p className="text-lg">{item.statement}</p>

                  <div className="flex items-center gap-2">
                    {selectedIndex === index && result === "correct" && (
                      <div className="bg-green-500 text-white p-2 rounded-full">
                        <Check className="h-5 w-5" />
                      </div>
                    )}

                    {selectedIndex === index && result === "incorrect" && (
                      <div className="bg-red-500 text-white p-2 rounded-full">
                        <X className="h-5 w-5" />
                      </div>
                    )}

                    {(completed || showAnswer) && item.isLie && selectedIndex !== index && (
                      <div className="bg-green-500 text-white p-2 rounded-full">
                        <Check className="h-5 w-5" />
                      </div>
                    )}

                    {!completed && !showAnswer && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`rounded-full p-1 ${
                          hintsUsed >= 2 && hintIndex !== index ? "opacity-50 cursor-not-allowed" : ""
                        } ${hintIndex === index ? "bg-blue-900/50 text-blue-300" : "text-gray-400 hover:text-blue-300"}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          if (hintsUsed < 2 || hintIndex === index) {
                            handleShowHint(index)
                          }
                        }}
                        disabled={hintsUsed >= 2 && hintIndex !== index}
                      >
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-6 flex justify-center gap-4">
        {(completed || showAnswer) && (
          <motion.div
            className="flex gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              onClick={onBack}
              variant="outline"
              className="border-purple-700 bg-transparent text-purple-400 hover:bg-purple-900/20 hover:text-purple-300"
            >
              Back to {year} ({description})
            </Button>

            {!isLastYear && (
              <Button
                onClick={onNext}
                className="bg-gradient-to-r from-purple-800 to-pink-700 hover:from-purple-700 hover:to-pink-600 text-white"
              >
                Next Year
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
