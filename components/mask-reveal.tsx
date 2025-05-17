"use client"

import type React from "react"
import { useState, useRef } from "react"
import { motion } from "framer-motion"
import useMousePosition from "@/hooks/use-mouse-position"

interface MaskRevealProps {
  revealContent: React.ReactNode
  baseContent: React.ReactNode
  initialSize?: number
  hoverSize?: number
  transitionDuration?: number
}

export default function MaskReveal({
  revealContent,
  baseContent,
  initialSize = 40,
  hoverSize = 400,
  transitionDuration = 0.5,
}: MaskRevealProps) {
  const [isHovered, setIsHovered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const mousePosition = useMousePosition({ targetRef: containerRef })
  const size = isHovered ? hoverSize : initialSize

  // Use relative coordinates for more accurate positioning
  const x = mousePosition.relativeX ?? 0
  const y = mousePosition.relativeY ?? 0

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden">
      <motion.div
        className="absolute top-0 left-0 w-full h-full mask-image mask-repeat-no-repeat z-20"
        animate={{
          WebkitMaskPosition: `${x - size / 2}px ${y - size / 2}px`,
          WebkitMaskSize: `${size}px`,
        }}
        transition={{ type: "tween", ease: "backOut", duration: transitionDuration }}
        style={{
          maskImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='white'/></svg>\")",
          WebkitMaskImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='white'/></svg>\")",
        }}
      >
        <div className="w-full h-full" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
          {revealContent}
        </div>
      </motion.div>

      <div className="absolute top-0 left-0 w-full h-full z-10">{baseContent}</div>
    </div>
  )
}
