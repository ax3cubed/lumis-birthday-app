"use client"

import { useState, useEffect } from "react"

interface TypewriterProps {
  text: string
  delay?: number
  onComplete?: () => void
  className?: string
}

export default function Typewriter({ text, delay = 100, onComplete, className = "" }: TypewriterProps) {
  const [currentText, setCurrentText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prevText) => prevText + text[currentIndex])
        setCurrentIndex((prevIndex) => prevIndex + 1)
      }, delay)

      return () => clearTimeout(timeout)
    } else if (onComplete) {
      // Add a small delay before calling onComplete
      const completeTimeout = setTimeout(() => {
        onComplete()
      }, 1000)

      return () => clearTimeout(completeTimeout)
    }
  }, [currentIndex, delay, text, onComplete])

  return (
    <div className={className}>
      {currentText}
      <span className="animate-pulse">|</span>
    </div>
  )
}
