"use client"

import type React from "react"

import { useRef, useState, useEffect, type ReactNode } from "react"

interface SwipeDetectorProps {
  children: ReactNode
  onSwipe: (direction: "left" | "right") => void
}

export default function SwipeDetector({ children, onSwipe }: SwipeDetectorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50

  const onTouchStart = (e: TouchEvent | React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: TouchEvent | React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      onSwipe("left")
    } else if (isRightSwipe) {
      onSwipe("right")
    }
  }

  // Mouse events for desktop
  const [mouseStart, setMouseStart] = useState<number | null>(null)
  const [mouseEnd, setMouseEnd] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const onMouseDown = (e: MouseEvent | React.MouseEvent) => {
    setIsDragging(true)
    setMouseEnd(null)
    setMouseStart(e.clientX)
  }

  const onMouseMove = (e: MouseEvent | React.MouseEvent) => {
    if (!isDragging) return
    setMouseEnd(e.clientX)
  }

  const onMouseUp = () => {
    setIsDragging(false)

    if (!mouseStart || !mouseEnd) return

    const distance = mouseStart - mouseEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      onSwipe("left")
    } else if (isRightSwipe) {
      onSwipe("right")
    }
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Add mouse event listeners
    container.addEventListener("mousedown", onMouseDown as any)
    container.addEventListener("mousemove", onMouseMove as any)
    container.addEventListener("mouseup", onMouseUp)
    container.addEventListener("mouseleave", onMouseUp)

    return () => {
      // Remove mouse event listeners
      container.removeEventListener("mousedown", onMouseDown as any)
      container.removeEventListener("mousemove", onMouseMove as any)
      container.removeEventListener("mouseup", onMouseUp)
      container.removeEventListener("mouseleave", onMouseUp)
    }
  }, [mouseStart, isDragging])

  return (
    <div
      ref={containerRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="h-full w-full"
    >
      {children}
    </div>
  )
}
