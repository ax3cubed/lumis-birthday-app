"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Carousel from "@/components/uk-journey-components/carousel"
import type { Milestone } from "@/types/milestone"

interface MilestoneCarouselProps {
  milestone: Milestone
}

export default function MilestoneCarousel({ milestone }: MilestoneCarouselProps) {
  // Create carousel items with just images
  const carouselItems = [
    {
      id: 1,
      image: milestone.image || "/placeholder-7jmze.png",
      title: milestone.title, // Keep title for accessibility but don't display it
    },
    {
      id: 2,
      image: "/placeholder-4h6wj.png",
      title: "The Experience",
    },
    {
      id: 3,
      image: "/placeholder-gjooc.png",
      title: milestone.date,
    },
  ]

  // Custom carousel items with images only
  const customItems = carouselItems.map((item) => ({
    ...item,
    // Custom rendering for each carousel item - just the image
    render: () => (
      <div className="relative w-full h-full">
        <div className="absolute inset-0 z-0">
          <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" priority />
        </div>
      </div>
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
  )
}
