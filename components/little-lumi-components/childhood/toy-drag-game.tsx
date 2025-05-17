"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"

interface ToyDragGameProps {
  toys: Array<{
    id: string
    icon: string
    name: string
    targetAge: number
  }>
  onMatchToy: (toyId: string, age: number) => boolean
  matchedToys: Record<string, boolean>
  isCompleted: boolean
}

export default function ToyDragGame({ toys, onMatchToy, matchedToys, isCompleted }: ToyDragGameProps) {
  const [draggedToy, setDraggedToy] = useState<string | null>(null)
  const [dropTargets] = useState(() => {
    // Create drop targets for each age (1-8)
    return Array.from({ length: 8 }, (_, i) => i + 1)
  })
  const gameRef = useRef<HTMLDivElement>(null)

  // Store toy positions
  const [toyPositions, setToyPositions] = useState<Record<string, { x: number; y: number; scale: number }>>(() => {
    return toys.reduce(
      (acc, toy) => {
        acc[toy.id] = { x: 0, y: 0, scale: 1 }
        return acc
      },
      {} as Record<string, { x: number; y: number; scale: number }>,
    )
  })

  const handleDragStart = (toyId: string) => {
    if (matchedToys[toyId]) return

    setDraggedToy(toyId)
    // Play pickup sound
    const audio = new Audio("/sounds/toy-pickup.mp3")
    audio.volume = 0.3
    audio.play().catch((err) => console.log("Audio play failed:", err))
  }

  const handleDragEnd = (info: any, toy: (typeof toys)[0]) => {
    if (matchedToys[toy.id]) return

    setDraggedToy(null)

    // Check if dropped on a valid target
    if (gameRef.current) {
      const gameRect = gameRef.current.getBoundingClientRect()
      const dropTargetElements = gameRef.current.querySelectorAll(".drop-target")

      let matched = false

      dropTargetElements.forEach((element) => {
        const targetRect = element.getBoundingClientRect()
        const targetAge = Number.parseInt(element.getAttribute("data-age") || "0", 10)

        // Check if the toy is dropped within the target area
        if (
          info.point.x >= targetRect.left &&
          info.point.x <= targetRect.right &&
          info.point.y >= targetRect.top &&
          info.point.y <= targetRect.bottom
        ) {
          // Try to match the toy with the age
          const isCorrectMatch = onMatchToy(toy.id, targetAge)

          if (isCorrectMatch) {
            matched = true
            // Play success sound
            const audio = new Audio("/sounds/toy-match.mp3")
            audio.volume = 0.4
            audio.play().catch((err) => console.log("Audio play failed:", err))

            // Update position to center of target
            setToyPositions((prev) => ({
              ...prev,
              [toy.id]: {
                x: targetRect.left + targetRect.width / 2 - gameRect.left - 40,
                y: targetRect.top + targetRect.height / 2 - gameRect.top - 40,
                scale: 1.2,
              },
            }))
          }
        }
      })

      if (!matched && !matchedToys[toy.id]) {
        // Return to original position with a shake effect
        setToyPositions((prev) => ({
          ...prev,
          [toy.id]: { x: 0, y: 0, scale: 1 },
        }))

        // Play error sound
        const audio = new Audio("/sounds/toy-error.mp3")
        audio.volume = 0.3
        audio.play().catch((err) => console.log("Audio play failed:", err))

        // Add shake animation after returning to original position
        setTimeout(() => {
          const shakeToy = async () => {
            for (let i = 0; i < 5; i++) {
              const xOffset = i % 2 === 0 ? 10 : -10
              setToyPositions((prev) => ({
                ...prev,
                [toy.id]: {
                  x: xOffset,
                  y: 0,
                  scale: 1,
                },
              }))
              await new Promise((resolve) => setTimeout(resolve, 50))
            }

            // Return to center
            setToyPositions((prev) => ({
              ...prev,
              [toy.id]: { x: 0, y: 0, scale: 1 },
            }))
          }

          shakeToy()
        }, 100)
      }
    }
  }

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

  return (
    <div ref={gameRef} className="relative bg-purple-950/50 rounded-lg p-6 border border-purple-800">
      <h2 className="text-2xl font-gothic text-purple-300 mb-4 text-center">Match the Toys to Lil Lumi's Ages</h2>

      {/* Drop targets (invisible until hover) */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {dropTargets.map((age) => (
          <div
            key={`age-${age}`}
            className="drop-target relative h-20 rounded border-2 border-dashed border-purple-700/30 
                      flex items-center justify-center transition-all duration-300
                      hover:border-purple-500/50"
            data-age={age}
          >
            <span className="text-purple-400 font-gothic">Age {age}</span>
          </div>
        ))}
      </div>

      {/* Toys to drag */}
      <div className="flex flex-wrap justify-center gap-6 mt-8">
        {toys.map((toy) => (
          <motion.div
            key={toy.id}
            className={`relative w-20 h-20 flex items-center justify-center 
                      bg-purple-900/60 rounded-full cursor-grab active:cursor-grabbing
                      border-2 ${matchedToys[toy.id] ? "border-green-500" : "border-purple-700"}
                      ${matchedToys[toy.id] ? "opacity-70" : "hover:shadow-glow-purple"}`}
            animate={toyPositions[toy.id]}
            transition={{ type: "spring", damping: 15 }}
            drag={!matchedToys[toy.id]}
            dragConstraints={gameRef}
            dragElastic={0.1}
            dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
            whileDrag={{ scale: 1.1, zIndex: 10 }}
            onDragStart={() => handleDragStart(toy.id)}
            onDragEnd={(_, info) => handleDragEnd(info, toy)}
            data-cursor-hover
          >
            <span className="text-3xl">{toy.icon}</span>
            <span className="absolute -bottom-6 text-xs text-purple-300 whitespace-nowrap">{toy.name}</span>
          </motion.div>
        ))}
      </div>

      {/* Completion message */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-purple-950/90 rounded-lg"
          >
            <div className="text-center">
              <motion.h3
                animate={{
                  scale: [1, 1.1, 1],
                  textShadow: [
                    "0 0 5px rgba(233, 213, 255, 0.5)",
                    "0 0 20px rgba(233, 213, 255, 0.8)",
                    "0 0 5px rgba(233, 213, 255, 0.5)",
                  ],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="text-3xl font-gothic text-purple-200 mb-2"
              >
                You know Lil Lumi so well!
              </motion.h3>
              <p className="text-purple-300">You've matched all her favorite childhood toys correctly.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
