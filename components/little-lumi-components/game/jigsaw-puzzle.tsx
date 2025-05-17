"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { gsap } from "gsap"
import { Draggable } from "gsap/Draggable"
import confetti from "canvas-confetti"

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(Draggable)
}

interface JigsawPuzzleProps {
  image: string
  gridSize?: number
  onComplete?: () => void
  funFact?: string
  age?: number
}

interface PuzzlePiece {
  id: number
  x: number
  y: number
  width: number
  height: number
  correctX: number
  correctY: number
  isPlaced: boolean
  row: number
  col: number
}

export default function JigsawPuzzle({ image, gridSize = 4, onComplete, funFact, age }: JigsawPuzzleProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const puzzleAreaRef = useRef<HTMLDivElement>(null)
  const piecesAreaRef = useRef<HTMLDivElement>(null)
  const [pieces, setPieces] = useState<PuzzlePiece[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCompleted, setIsCompleted] = useState(false)
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
  const draggablesRef = useRef<any[]>([])
  const piecesRef = useRef<HTMLDivElement[]>([])

  // Add these new state variables after the other useState declarations
  const [hintsRemaining, setHintsRemaining] = useState(3)
  const [showHint, setShowHint] = useState(false)

  // Load image and create puzzle pieces
  useEffect(() => {
    const img = new Image()
    img.src = image
    img.onload = () => {
      // Calculate aspect ratio and size
      const maxWidth = 600 // Maximum width for the puzzle area
      const maxHeight = 600 // Maximum height for the puzzle area

      let width = img.width
      let height = img.height

      // Scale down if needed
      if (width > maxWidth) {
        const ratio = maxWidth / width
        width = maxWidth
        height = height * ratio
      }

      if (height > maxHeight) {
        const ratio = maxHeight / height
        height = maxHeight
        width = width * ratio
      }

      setImageSize({ width, height })

      // Create puzzle pieces
      const pieceWidth = width / gridSize
      const pieceHeight = height / gridSize
      const newPieces: PuzzlePiece[] = []

      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          const id = row * gridSize + col
          const correctX = col * pieceWidth
          const correctY = row * pieceHeight

          // Initial position will be set by GSAP
          newPieces.push({
            id,
            width: pieceWidth,
            height: pieceHeight,
            correctX,
            correctY,
            x: correctX,
            y: correctY,
            isPlaced: false,
            row,
            col,
          })
        }
      }

      setPieces(newPieces)
      setIsLoading(false)
    }

    img.onerror = () => {
      console.error("Failed to load image")
      setIsLoading(false)
    }
  }, [image, gridSize])

  // Initialize GSAP draggables after pieces are created
  useEffect(() => {
    if (pieces.length === 0 || !puzzleAreaRef.current || !piecesAreaRef.current || typeof window === "undefined") return

    // Clear any existing draggables
    if (draggablesRef.current.length) {
      draggablesRef.current.forEach((draggable) => draggable.kill())
      draggablesRef.current = []
    }

    // Wait for DOM to update with pieces
    setTimeout(() => {
      // Get references to areas
      const puzzleAreaRect = puzzleAreaRef.current!.getBoundingClientRect()
      const piecesAreaRect = piecesAreaRef.current!.getBoundingClientRect()

      // Shuffle pieces with GSAP
      piecesRef.current.forEach((pieceEl, index) => {
        if (!pieceEl) return

        const piece = pieces[index]

        // Calculate random position within the pieces area
        const padding = 10 // Padding from edges
        const availableWidth = piecesAreaRect.width - piece.width - padding * 2
        const availableHeight = piecesAreaRect.height - piece.height - padding * 2

        const randomX = padding + Math.random() * availableWidth
        const randomY = padding + Math.random() * availableHeight

        // Animate to random position
        gsap.fromTo(
          pieceEl,
          {
            x: 0,
            y: 0,
            rotation: 0,
            scale: 0,
            opacity: 0,
          },
          {
            x: randomX,
            y: randomY,
            rotation: Math.random() * 10 - 5,
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: "back.out(1.2)",
            delay: index * 0.01,
          },
        )

        // Create draggable
        const draggable = Draggable.create(pieceEl, {
          type: "x,y",
          bounds: containerRef.current,
          edgeResistance: 0.65,
          throwProps: true,
          onDragStart: function () {
            // Skip if piece is already placed
            const pieceId = Number(this.target.getAttribute("data-id"))
            const piece = pieces.find((p) => p.id === pieceId)
            if (piece?.isPlaced) {
              return
            }

            // Bring to front
            gsap.set(this.target, { zIndex: 100 })

            // Play pickup sound
            const audio = new Audio("/sounds/toy-pickup.mp3")
            audio.volume = 0.2
            audio.play().catch((err) => console.log("Audio play failed:", err))
          },
          onDragEnd: function () {
            // Get piece info
            const pieceId = Number(this.target.getAttribute("data-id"))
            const piece = pieces.find((p) => p.id === pieceId)

            // Skip if piece is already placed
            if (!piece || piece.isPlaced) {
              return
            }

            // Reset z-index
            gsap.to(this.target, {
              zIndex: 10,
              duration: 0.3,
            })

            const pieceRect = this.target.getBoundingClientRect()
            const puzzleRect = puzzleAreaRef.current!.getBoundingClientRect()

            // Check if piece center is over the puzzle area
            const pieceCenterX = pieceRect.left + pieceRect.width / 2
            const pieceCenterY = pieceRect.top + pieceRect.height / 2

            if (
              pieceCenterX >= puzzleRect.left &&
              pieceCenterX <= puzzleRect.right &&
              pieceCenterY >= puzzleRect.top &&
              pieceCenterY <= puzzleRect.bottom
            ) {
              // Calculate which grid cell the piece is over
              const relativeX = pieceCenterX - puzzleRect.left
              const relativeY = pieceCenterY - puzzleRect.top

              const cellX = Math.floor(relativeX / piece.width)
              const cellY = Math.floor(relativeY / piece.height)

              // Check if this is the correct position for this piece
              if (cellX === piece.col && cellY === piece.row) {
                // Calculate the correct position within the puzzle area
                const correctPosX = puzzleRect.left + piece.col * piece.width - pieceRect.left + this.startX
                const correctPosY = puzzleRect.top + piece.row * piece.height - pieceRect.top + this.startY

                // Snap to correct position
                gsap.to(this.target, {
                  x: correctPosX,
                  y: correctPosY,
                  rotation: 0,
                  duration: 0.3,
                  ease: "power2.out",
                  onComplete: () => {
                    // Mark as placed
                    setPieces((prev) => prev.map((p) => (p.id === pieceId ? { ...p, isPlaced: true } : p)))

                    // Play satisfying snap sound with higher volume
                    const audio = new Audio("/sounds/toy-match.mp3")
                    audio.volume = 0.7
                    audio.play().catch((err) => console.log("Audio play failed:", err))

                    // Add a subtle scale animation for more satisfaction
                    gsap.fromTo(this.target, { scale: 1.1 }, { scale: 1, duration: 0.3, ease: "elastic.out(1, 0.5)" })

                    // Disable dragging for this piece
                    this.disable()
                  },
                })
              } else {
                // If this is NOT the correct position, wiggle and return to pile
                // Play error sound
                const audio = new Audio("/sounds/toy-error.mp3")
                audio.volume = 0.5
                audio.play().catch((err) => console.log("Audio play failed:", err))

                // Wiggle animation
                gsap
                  .timeline()
                  .to(this.target, { rotation: -5, duration: 0.1 })
                  .to(this.target, { rotation: 5, duration: 0.1 })
                  .to(this.target, { rotation: -5, duration: 0.1 })
                  .to(this.target, { rotation: 0, duration: 0.1 })
                  .then(() => {
                    // Get pieces area dimensions
                    const piecesAreaRect = piecesAreaRef.current!.getBoundingClientRect()

                    // Calculate random position within the pieces area
                    const padding = 10
                    const availableWidth = piecesAreaRect.width - piece.width - padding * 2
                    const availableHeight = piecesAreaRect.height - piece.height - padding * 2

                    const randomX = padding + Math.random() * availableWidth
                    const randomY = padding + Math.random() * availableHeight

                    // Animate back to pieces area
                    gsap.to(this.target, {
                      x: randomX,
                      y: randomY,
                      rotation: Math.random() * 10 - 5,
                      duration: 0.6,
                      ease: "back.out(1.2)",
                    })
                  })
              }
            }
          },
        })[0]

        draggablesRef.current.push(draggable)
      })
    }, 100)

    return () => {
      // Clean up draggables
      if (draggablesRef.current.length) {
        draggablesRef.current.forEach((draggable) => draggable.kill())
        draggablesRef.current = []
      }
    }
  }, [pieces])

  // Check if puzzle is completed
  useEffect(() => {
    if (pieces.length > 0 && pieces.every((piece) => piece.isPlaced)) {
      setIsCompleted(true)

      // Trigger confetti
      confetti({
        particleCount: 200,
        spread: 90,
        origin: { y: 0.6 },
      })

      // Play success sound
      const audio = new Audio("/sounds/success-melody.mp3")
      audio.volume = 0.4
      audio.play().catch((err) => console.log("Audio play failed:", err))

      // Call onComplete callback
      if (onComplete) {
        onComplete()
      }
    }
  }, [pieces, onComplete])

  // Add this function before the return statement
  const handleUseHint = () => {
    if (hintsRemaining <= 0 || isCompleted) return

    // Play hint sound
    const audio = new Audio("/sounds/polaroid-open.mp3")
    audio.volume = 0.4
    audio.play().catch((err) => console.log("Audio play failed:", err))

    // Show hint
    setShowHint(true)
    setHintsRemaining((prev) => prev - 1)

    // Hide hint after 3 seconds
    setTimeout(() => {
      setShowHint(false)
    }, 3000)
  }

  // Handle shuffle button click
  const handleShuffle = () => {
    if (isCompleted) return

    // Reset pieces state
    setPieces((prev) =>
      prev.map((piece) => ({
        ...piece,
        isPlaced: false,
      })),
    )

    // Re-enable all draggables
    draggablesRef.current.forEach((draggable) => draggable.enable())

    // Shuffle pieces with GSAP
    const piecesAreaRect = piecesAreaRef.current!.getBoundingClientRect()

    piecesRef.current.forEach((pieceEl, index) => {
      if (!pieceEl) return

      const piece = pieces[index]

      // Calculate random position within the pieces area
      const padding = 10 // Padding from edges
      const availableWidth = piecesAreaRect.width - piece.width - padding * 2
      const availableHeight = piecesAreaRect.height - piece.height - padding * 2

      const randomX = padding + Math.random() * availableWidth
      const randomY = padding + Math.random() * availableHeight

      // Animate to random position
      gsap.to(pieceEl, {
        x: randomX,
        y: randomY,
        rotation: Math.random() * 10 - 5,
        scale: 1,
        duration: 0.5,
        ease: "back.out(1.2)",
        delay: index * 0.01,
      })
    })

    // Play shuffle sound
    const audio = new Audio("/sounds/toy-error.mp3")
    audio.volume = 0.3
    audio.play().catch((err) => console.log("Audio play failed:", err))
  }

  return (
    <div
      ref={containerRef}
      className="relative bg-purple-950/30 backdrop-blur-sm rounded-xl p-6 border border-purple-800/50 shadow-lg overflow-hidden"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-gothic text-purple-300">
          {age ? `Age ${age} Memory` : "Memory Puzzle"}
        </h2>

        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <button
              onClick={handleUseHint}
              disabled={hintsRemaining <= 0 || isCompleted || showHint}
              className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2
                        ${
                          hintsRemaining > 0 && !isCompleted && !showHint
                            ? "bg-purple-600 hover:bg-purple-500 text-white"
                            : "bg-purple-800/50 text-purple-300 cursor-not-allowed"
                        }`}
            >
              <span>Hint</span>
              <span className="inline-flex items-center justify-center w-5 h-5 bg-purple-800 rounded-full text-xs">
                {hintsRemaining}
              </span>
            </button>
          </div>

          <button
            onClick={handleShuffle}
            className="px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-md transition-colors"
            disabled={isCompleted}
          >
            Shuffle Pieces
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-purple-300">Loading puzzle...</div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Puzzle area (left side) */}
          <div
            ref={puzzleAreaRef}
            className="relative border-2 border-purple-500/50 rounded-md bg-purple-900/20 flex-shrink-0"
            style={{
              width: imageSize.width,
              height: imageSize.height,
            }}
          >
            {/* Grid lines for visual guidance */}
            <div
              className="absolute inset-0 grid"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                gridTemplateRows: `repeat(${gridSize}, 1fr)`,
              }}
            >
              {Array.from({ length: gridSize * gridSize }).map((_, index) => (
                <div key={index} className="border border-purple-500/20"></div>
              ))}
            </div>

            {/* Hint overlay */}
            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 flex items-center justify-center"
                >
                  <motion.div
                    className="absolute inset-0 bg-purple-900/10 backdrop-blur-[1px]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                  <motion.img
                    src={image}
                    alt="Puzzle hint"
                    className="w-full h-full object-cover opacity-80"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.8 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", damping: 15 }}
                  />
                  <motion.div
                    className="absolute bottom-4 left-0 right-0 text-center text-white text-sm bg-purple-900/70 py-1"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                  >
                    Hint will disappear in 3 seconds...
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Pieces area (right side) */}
          <div
            ref={piecesAreaRef}
            className="relative border-2 border-dashed border-purple-500/30 rounded-md bg-purple-900/10 flex-grow"
            style={{
              minHeight: imageSize.height,
              minWidth: 300,
            }}
          >
            {/* Puzzle pieces */}
            {pieces.map((piece, index) => (
              <div
                key={piece.id}
                ref={(el) => {
                  if (el) piecesRef.current[index] = el
                }}
                data-id={piece.id}
                className={`absolute cursor-grab active:cursor-grabbing overflow-hidden
                          ${piece.isPlaced ? "shadow-md" : "shadow-lg"}`}
                style={{
                  width: piece.width,
                  height: piece.height,
                  backgroundImage: `url(${image})`,
                  backgroundSize: `${imageSize.width}px ${imageSize.height}px`,
                  backgroundPosition: `-${piece.correctX}px -${piece.correctY}px`,
                  borderWidth: "3px",
                  borderColor: "rgba(139, 92, 246, 0.7)",
                  borderStyle: "solid",
                  borderRadius: "4px",
                  zIndex: piece.isPlaced ? 5 : 10,
                  opacity: 0, // Initially hidden, will be shown by GSAP
                  filter: "brightness(1.1)", // Increase brightness for better visibility
                  boxShadow: "0 6px 10px rgba(0, 0, 0, 0.4)", // Enhanced shadow for larger pieces
                }}
              />
            ))}
          </div>

          {/* Completion overlay */}
          <AnimatePresence>
            {isCompleted && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute top-0 left-0 flex items-center justify-center bg-purple-900/80 backdrop-blur-sm rounded-md z-30"
                style={{
                  width: imageSize.width,
                  height: imageSize.height,
                }}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="text-center bg-purple-800/90 p-6 rounded-lg shadow-xl max-w-md"
                >
                  <motion.h3
                    animate={{
                      scale: [1, 1.05, 1],
                      textShadow: [
                        "0 0 5px rgba(233, 213, 255, 0.5)",
                        "0 0 20px rgba(233, 213, 255, 0.8)",
                        "0 0 5px rgba(233, 213, 255, 0.5)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    className="text-2xl font-gothic text-purple-200 mb-2"
                  >
                    Puzzle Completed!
                  </motion.h3>

                  {funFact && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="text-purple-200 font-handwritten text-lg mt-4"
                    >
                      {funFact}
                    </motion.p>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
