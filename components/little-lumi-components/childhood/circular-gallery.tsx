"use client"

import { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { App as CircularGalleryApp } from "./circular-gallery-core"

interface CircularGalleryProps {
  items: { image: string; text: string }[]
  bend?: number
  textColor?: string
  borderRadius?: number
  onPolaroidClick?: (polaroid: any) => void
}

export default function CircularGallery({
  items,
  bend = 3,
  textColor = "#ffffff",
  borderRadius = 0.05,
  onPolaroidClick,
}: CircularGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [galleryInstance, setGalleryInstance] = useState<any>(null)
  const [selectedPolaroid, setSelectedPolaroid] = useState<number | null>(null)

  // Create polaroid data with additional info from the childData
  const polaroidItems = items.map((item, index) => ({
    ...item,
    id: index,
    hint: `Age ${item.text.split(" ")[1]}`,
  }))

  useEffect(() => {
    if (!containerRef.current) return

    // Clear previous content to avoid stacking canvases
    containerRef.current.innerHTML = ""

    const app = new CircularGalleryApp(containerRef.current, {
      items,
      bend,
      textColor,
      borderRadius,
      font: "bold 30px serif", // Use a generic serif font
    })

    setGalleryInstance(app)

    return () => {
      app.destroy()
      if (containerRef.current) {
        containerRef.current.innerHTML = ""
      }
    }
  }, [items, bend, textColor, borderRadius])

  // Add click handler to the gallery
  useEffect(() => {
    if (!containerRef.current || !onPolaroidClick) return

    const handleClick = (e: MouseEvent) => {
      // Get the clicked element's position relative to the container
      const rect = containerRef.current!.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Find the closest polaroid to the click position
      // This is a simplified approach - in a real implementation,
      // you would get the actual clicked polaroid from the gallery instance
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const angle = Math.atan2(y - centerY, x - centerX)
      const numItems = items.length
      const index = Math.floor((angle / (2 * Math.PI) + 0.5) * numItems) % numItems

      if (index >= 0 && index < polaroidItems.length) {
        setSelectedPolaroid(index)

        // Play click sound
        const audio = new Audio("/sounds/toy-pickup.mp3")
        audio.volume = 0.2
        audio.play().catch((err) => console.log("Audio play failed:", err))

        // After a brief animation, show the modal
        setTimeout(() => {
          onPolaroidClick(polaroidItems[index])
          setSelectedPolaroid(null)
        }, 500)
      }
    }

    containerRef.current.addEventListener("click", handleClick)

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener("click", handleClick)
      }
    }
  }, [items, onPolaroidClick, polaroidItems])

  return (
    <div className="relative w-full h-full">
      <div
        className="circular-gallery w-full h-full !block !opacity-100 !visible"
        ref={containerRef}
        data-cursor-hover
        data-cursor-color="#e9d5ff"
        style={{ minHeight: 400, minWidth: 400, zIndex: 10, position: "relative" }}
      />

      {/* Polaroid hover hints */}
      <div className="absolute inset-0 pointer-events-none">
        {hoveredIndex !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                      bg-purple-900/80 text-purple-200 px-3 py-1 rounded-md
                      border border-purple-500 shadow-glow-purple"
          >
            {polaroidItems[hoveredIndex].hint}
          </motion.div>
        )}

        {/* Selected polaroid animation */}
        {selectedPolaroid !== null && (
          <motion.div
            initial={{ scale: 1, opacity: 1 }}
            animate={{
              scale: [1, 1.2, 1.2, 0.8],
              opacity: [1, 1, 0.8, 0],
              y: [0, -20, -40, -60],
            }}
            transition={{
              duration: 0.5,
              times: [0, 0.3, 0.6, 1],
            }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                      w-40 h-48 bg-white rounded-md overflow-hidden shadow-xl"
          >
            <img
              src={polaroidItems[selectedPolaroid].image || "/placeholder.svg"}
              alt={polaroidItems[selectedPolaroid].hint}
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}
      </div>
    </div>
  )
}
