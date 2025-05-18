"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Carousel from "@/components/uk-journey-components/carousel"
import type { Milestone } from "@/types/milestone"

interface MilestoneCarouselProps {
  milestone: Milestone
}

export default function MilestoneCarousel({ milestone }: MilestoneCarouselProps) {
  const carouselItems = milestone.mediaList || []

  // Position state for object-position (images) and translate (videos)
  const [objectPosX, setObjectPosX] = useState(50) // percent
  const [objectPosY, setObjectPosY] = useState(50) // percent

  // Custom carousel items with images only
  const customItems = carouselItems.map((item) => ({
    ...item,
    render: () => (
      <>
        {item.mediaType === "image" && (
          <div className="relative w-full h-full">
            <div className="absolute inset-0 z-0">
              <Image
                src={item.src || "/placeholder.svg"}
                alt={item.alt}
                fill
                className="object-cover"
                priority
                style={{ objectPosition: `${String(objectPosX)}% ${String(objectPosY)}%` }}
              />
            </div>
          </div>
        )}
        {item.mediaType === "video" && (
          <video
            className="w-full h-full object-cover"
            controls
            autoPlay
            loop
            style={{ transform: `translate(${String(objectPosX - 50)}%, ${String(objectPosY - 50)}%)` }}
          >
            <source src={item.src} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </>
    ),
  }))

  // Calculate the width based on the container
  const [width, setWidth] = useState(400)

  useEffect(() => {
    const updateWidth = () => {
      // Get the smaller of window width or 500px
      const newWidth = Math.min(window.innerWidth - 40, 500)
      setWidth(newWidth)
    }

    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  return (
    <div>
      <div className="w-full flex justify-center">
        <Carousel
          items={customItems}
          baseWidth={width}
          autoplay={true}
          autoplayDelay={5000}
          pauseOnHover={true}
          loop={true}
          round={false}
        />
      </div>
      {/* Position sliders below carousel */}
      <div className="mt-4 flex flex-col items-center gap-2 bg-black/40 rounded-lg px-4 py-2 w-fit mx-auto">
        <label className="flex items-center gap-2 text-white text-xs">
          X:
          <input
            type="range"
            min={0}
            max={100}
            value={objectPosX}
            onChange={e => setObjectPosX(Number(e.target.value))}
            className="w-32"
          />
          <span>{objectPosX}%</span>
        </label>
        <label className="flex items-center gap-2 text-white text-xs">
          Y:
          <input
            type="range"
            min={0}
            max={100}
            value={objectPosY}
            onChange={e => setObjectPosY(Number(e.target.value))}
            className="w-32"
          />
          <span>{objectPosY}%</span>
        </label>
      </div>
    </div>
  )
}
