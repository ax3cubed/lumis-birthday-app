"use client"

import { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAtom } from "jotai"
import { emojiPositionAtom, emojiOpacityAtom, emojiFoundAtom } from "@/lib/atoms"

interface HiddenEmojiProps {
  onFound: () => void
}

export default function HiddenEmoji({ onFound }: HiddenEmojiProps) {
  const [position, setPosition] = useAtom(emojiPositionAtom)
  const [opacity, setOpacity] = useAtom(emojiOpacityAtom)
  const [isFound, setIsFound] = useAtom(emojiFoundAtom)
  const pulseCountRef = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const mousePositionRef = useRef({ x: 0, y: 0 })
  const emojiRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)
  const hintVisibleRef = useRef(false)

  // Set random position for the emoji
  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const rect = container.getBoundingClientRect()

    // Ensure emoji is not too close to the edges and more centered
    const margin = 1
    const centerBias = 0 // Bias toward center (0 = no bias, 1 = always center)

    // Calculate position with center bias
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const randomX = Math.random() * (rect.width - 2 * margin) + margin
    const randomY = Math.random() * (rect.height - 2 * margin) + margin

    const x = randomX * (1 - centerBias) + centerX * centerBias
    const y = randomY * (1 - centerBias) + centerY * centerBias

    setPosition({ x, y })
    console.log("Emoji positioned at:", x, y)

    // Set up pulse interval for visibility hints
    const pulseInterval = setInterval(() => {
      pulseCountRef.current += 1

      // Make the emoji briefly more visible as a hint
      setOpacity(0.3) // Flash to visible
      setTimeout(() => {
        setOpacity(0) // Back to invisible
      }, 300)

      // Show directional hint occasionally
      if (pulseCountRef.current % 3 === 0 && hintRef.current) {
        hintVisibleRef.current = true
        hintRef.current.style.opacity = "0.7"
        setTimeout(() => {
          if (hintRef.current) {
            hintRef.current.style.opacity = "0"
            hintVisibleRef.current = false
          }
        }, 1000)
      }
    }, 5000)

    return () => clearInterval(pulseInterval)
  }, [setPosition, setOpacity])

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return

      const container = containerRef.current
      const rect = container.getBoundingClientRect()

      mousePositionRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }

      // Calculate distance to emoji
      const dx = mousePositionRef.current.x - position.x
      const dy = mousePositionRef.current.y - position.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      // Update hint arrow direction if visible
      if (hintVisibleRef.current && hintRef.current) {
        const angle = Math.atan2(dy, dx) * (180 / Math.PI)
        hintRef.current.style.transform = `translate(-50%, -50%) rotate(${angle + 180}deg)`
      }

      // Fade in emoji based on proximity (torch light effect)
      // Increased proximity threshold for easier finding
      const proximityThreshold = 200 // Larger threshold for torch effect
      if (distance < proximityThreshold) {
        const newOpacity = Math.max(0, 1 - distance / proximityThreshold)
        setOpacity(newOpacity)

        // If we're very close to the emoji, trigger a custom event for audio cue
        if (distance < 100 && !isFound) {
          // Dispatch a custom event that can be listened for in the parent component
          const closeEvent = new CustomEvent("emojiProximity", {
            detail: {
              distance,
              proximity: 1 - distance / proximityThreshold,
            },
          })
          window.dispatchEvent(closeEvent)
        }
      } else {
        setOpacity(0)
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [position, setOpacity, isFound])

  // Handle emoji click
  const handleEmojiClick = () => {
    if (opacity > 0.3) {
      // Lower threshold for easier clicking
      setIsFound(true)
      setTimeout(() => {
        onFound()
      }, 1000)
    }
  }

  return (
    <div ref={containerRef} className="w-full h-full relative bg-black bg-opacity-90">
      {/* Dark overlay for torch effect */}
      <div className="absolute inset-0 bg-black opacity-90 pointer-events-none"></div>

      {/* Directional hint arrow */}
      <div
        ref={hintRef}
        className="absolute left-1/2 top-1/2 w-12 h-12 pointer-events-none z-10 transition-opacity duration-500"
        style={{
          opacity: 0,
          transform: "translate(-50%, -50%)",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <polyline points="19 12 12 19 5 12"></polyline>
        </svg>
      </div>

      {/* Debug position indicator (only visible in development) */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed top-4 left-4 bg-black bg-opacity-70 text-white p-2 text-xs z-50 font-gothic">
          Emoji at: {Math.round(position.x)}, {Math.round(position.y)}
        </div>
      )}

      <AnimatePresence>
        {!isFound ? (
          <motion.div
            ref={emojiRef}
            className="absolute cursor-pointer z-10 emoji-pulse"
            style={{
              left: position.x,
              top: position.y,
              opacity: opacity,
              transform: "translate(-50%, -50%)",
              fontSize: "2.5rem", // Larger emoji
              userSelect: "none",
              filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.7))",
            }}
            onClick={handleEmojiClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            🖤
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.2, 1] }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute z-10"
            style={{
              left: position.x,
              top: position.y,
              transform: "translate(-50%, -50%)",
              fontSize: "3rem",
              filter: "drop-shadow(0 0 15px rgba(255, 255, 255, 0.9))",
            }}
          >
            🖤
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint text */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white opacity-30 font-gothic gothic-glow text-center max-w-xs">
        <p>Find the hidden heart in the darkness...</p>
      </div>
    </div>
  )
}
