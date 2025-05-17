"use client"

import { useRef, useEffect, useState, type ReactNode } from "react"
import { motion } from "framer-motion"
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PanzoomProps {
  children: ReactNode
}

export function Panzoom({ children }: PanzoomProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 3))
  }

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5))
  }

  const resetView = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const delta = e.deltaY * -0.01
        setScale((prev) => Math.max(0.5, Math.min(prev + delta, 3)))
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false })
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel)
      }
    }
  }, [])

  return (
    <div className="relative h-full w-full overflow-hidden" ref={containerRef}>
      <motion.div
        className="h-full w-full"
        style={{
          cursor: isDragging ? "grabbing" : "grab",
        }}
        drag
        dragConstraints={containerRef}
        dragElastic={0.1}
        dragMomentum={false}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        animate={{
          scale,
          x: position.x,
          y: position.y,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {children}
      </motion.div>

      <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
        <Button
          variant="outline"
          size="icon"
          onClick={zoomIn}
          className="rounded-full bg-gray-900 border-gray-700 hover:bg-gray-800"
        >
          <ZoomIn className="h-4 w-4 text-white" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={zoomOut}
          className="rounded-full bg-gray-900 border-gray-700 hover:bg-gray-800"
        >
          <ZoomOut className="h-4 w-4 text-white" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={resetView}
          className="rounded-full bg-gray-900 border-gray-700 hover:bg-gray-800"
        >
          <RotateCcw className="h-4 w-4 text-white" />
        </Button>
      </div>
    </div>
  )
}
