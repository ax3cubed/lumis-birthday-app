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

  // Custom carousel items with images only
  const customItems = carouselItems.map((item) => ({
    ...item,
    // Custom rendering for each carousel item - just the image
    render: () => (

      <>
        {item.mediaType === "image" && (
          <div className="relative w-full h-full">
            <div className="absolute inset-0 z-0">
              <Image src={item.src || "/placeholder.svg"} alt={item.alt} fill className="object-cover" priority />
            </div>
          </div>
        )}
        {item.mediaType === "video" && (
          <video className="w-full h-full object-cover" controls>
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
