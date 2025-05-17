"use client"

import { useState, useEffect, type RefObject } from "react"

interface MousePosition {
  clientX: number | null
  clientY: number | null
  relativeX: number | null
  relativeY: number | null
}

interface UseMousePositionProps {
  targetRef?: RefObject<HTMLElement>
}

export default function useMousePosition({ targetRef }: UseMousePositionProps = {}) {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    clientX: null,
    clientY: null,
    relativeX: null,
    relativeY: null,
  })

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      let relativeX = null
      let relativeY = null

      if (targetRef && targetRef.current) {
        const rect = targetRef.current.getBoundingClientRect()
        relativeX = ev.clientX - rect.left
        relativeY = ev.clientY - rect.top
      }

      setMousePosition({
        clientX: ev.clientX,
        clientY: ev.clientY,
        relativeX,
        relativeY,
      })
    }

    window.addEventListener("mousemove", updateMousePosition)

    return () => {
      window.removeEventListener("mousemove", updateMousePosition)
    }
  }, [targetRef])

  return mousePosition
}
