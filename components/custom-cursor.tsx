"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { useAtom } from "jotai"
import { cn } from "@/lib/utils"
import useMousePosition from "@/hooks/use-mouse-position"
import {
  cursorPositionAtom,
  targetPositionAtom,
  cursorVisibleAtom,
  cursorActiveAtom,
  cursorHoveringAtom,
  cursorTextAtom,
  cursorColorAtom,
  cursorBgColorAtom,
  cursorOpacityAtom,
  cursorSizeAtom,
  clipMaskTargetAtom,
  isExclusionAtom,
  cursorClassesAtom,
  cursorFilterAtom,
} from "@/lib/atoms"

interface CustomCursorProps {
  className?: string
  defaultSize?: number
}

export default function CustomCursor({ className, defaultSize = 32 }: CustomCursorProps) {
  const cursorOuterRef = useRef<HTMLDivElement>(null)
  const cursorInnerRef = useRef<HTMLDivElement>(null)
  const requestRef = useRef<number>()
  const previousTimeRef = useRef<number>()

  // Jotai state
  const [cursorPosition, setCursorPosition] = useAtom(cursorPositionAtom)
  const [targetPosition, setTargetPosition] = useAtom(targetPositionAtom)
  const [isVisible, setIsVisible] = useAtom(cursorVisibleAtom)
  const [isActive, setIsActive] = useAtom(cursorActiveAtom)
  const [isHovering, setIsHovering] = useAtom(cursorHoveringAtom)
  const [cursorText, setCursorText] = useAtom(cursorTextAtom)
  const [cursorColor, setCursorColor] = useAtom(cursorColorAtom)
  const [cursorBgColor, setCursorBgColor] = useAtom(cursorBgColorAtom)
  const [cursorOpacity, setCursorOpacity] = useAtom(cursorOpacityAtom)
  const [cursorSize, setCursorSize] = useAtom(cursorSizeAtom)
  const [clipMaskTarget, setClipMaskTarget] = useAtom(clipMaskTargetAtom)
  const [isExclusion, setIsExclusion] = useAtom(isExclusionAtom)
  const [cursorClasses, setCursorClasses] = useAtom(cursorClassesAtom)
  const [cursorFilter, setCursorFilter] = useAtom(cursorFilterAtom)

  // Get mouse position using the enhanced hook
  const mousePosition = useMousePosition()

  // Check if device is touch-enabled
  useEffect(() => {
    const isTouchDevice = () => {
      return "ontouchstart" in window || navigator.maxTouchPoints > 0
    }

    if (!isTouchDevice()) {
      setIsVisible(true)
      document.body.style.cursor = "none"
    }

    return () => {
      document.body.style.cursor = ""
    }
  }, [setIsVisible])

  // Update target position when mouse position changes
  useEffect(() => {
    if (mousePosition.clientX !== null && mousePosition.clientY !== null) {
      // Set target position immediately to cursor position for instant updates
      setTargetPosition({
        x: mousePosition.clientX,
        y: mousePosition.clientY,
      })

      // Also update cursor position directly for instant response
      setCursorPosition({
        x: mousePosition.clientX,
        y: mousePosition.clientY,
      })
    }
  }, [mousePosition, setTargetPosition, setCursorPosition])

  // Animation loop using requestAnimationFrame
  const animateCursor = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      // Smooth cursor movement - reduced smoothing factor for faster response
      setCursorPosition((prev) => ({
        x: prev.x + (targetPosition.x - prev.x) * 0.5, // Increased from 0.15 to 0.5
        y: prev.y + (targetPosition.y - prev.y) * 0.5,
      }))

      if (cursorInnerRef.current && cursorOuterRef.current) {
        // Center the cursor elements on the mouse position
        cursorInnerRef.current.style.transform = `translate(${cursorPosition.x}px, ${cursorPosition.y}px) translate(-50%, -50%)`
        cursorOuterRef.current.style.transform = `translate(${cursorPosition.x}px, ${cursorPosition.y}px) translate(-50%, -50%)`
      }

      // Update clip mask position if active
      if (clipMaskTarget) {
        const targetElement = document.getElementById(clipMaskTarget)
        if (targetElement) {
          // Make the element visible but with opacity 0 initially
          targetElement.style.visibility = "visible"
          targetElement.style.opacity = "1"

          // Apply the clip-path
          const clipPathValue = `circle(${getOuterSize() / 2}px at ${cursorPosition.x}px ${cursorPosition.y}px)`
          targetElement.style.clipPath = clipPathValue
          targetElement.style.webkitClipPath = clipPathValue
        }
      }
    }
    previousTimeRef.current = time
    requestRef.current = requestAnimationFrame(animateCursor)
  }

  // Start animation loop
  useEffect(() => {
    requestRef.current = requestAnimationFrame(animateCursor)
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [targetPosition])

  // Mouse down/up event handlers
  useEffect(() => {
    const handleMouseDown = () => setIsActive(true)
    const handleMouseUp = () => setIsActive(false)

    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)
    return () => {
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [setIsActive])

  // Mouse enter/leave window event handlers
  useEffect(() => {
    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)

    document.documentElement.addEventListener("mouseleave", handleMouseLeave)
    document.documentElement.addEventListener("mouseenter", handleMouseEnter)
    return () => {
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave)
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter)
    }
  }, [setIsVisible])

  // Interactive elements event handlers
  useEffect(() => {
    const handleElementMouseEnter = (e: MouseEvent) => {
      const target = e.currentTarget as HTMLElement
      setIsHovering(true)

      // Check for text attribute
      const text = target.getAttribute("data-cursor-text")
      if (text) {
        setCursorText(text)
      }

      // Check for color attribute
      const color = target.getAttribute("data-cursor-color")
      if (color) {
        setCursorColor(color)
      }

      // Check for background color attribute
      const bgColor = target.getAttribute("data-cursor-bg-color")
      if (bgColor) {
        setCursorBgColor(bgColor)
      }

      // Check for opacity attribute
      const opacity = target.getAttribute("data-cursor-opacity")
      if (opacity) {
        setCursorOpacity(Number.parseFloat(opacity))
      }

      // Check for filter attribute
      const filter = target.getAttribute("data-cursor-filter")
      if (filter) {
        setCursorFilter(filter)
      }

      // Check for class attribute
      const classes = target.getAttribute("data-cursor-class")
      if (classes) {
        setCursorClasses(classes)
      }

      // Check for size attribute
      const size = target.getAttribute("data-cursor-size")
      if (size) {
        setCursorSize(Number.parseInt(size, 10))
      }

      // Check for clip mask target
      const clipTarget = target.getAttribute("data-cursor-clip-target")
      if (clipTarget) {
        setClipMaskTarget(clipTarget)

        // Hide the cursor when using clip mask
        if (cursorOuterRef.current) cursorOuterRef.current.style.opacity = "0.3"
        if (cursorInnerRef.current) cursorInnerRef.current.style.opacity = "0.3"
      }

      // Check for exclusion mode
      const exclusion = target.hasAttribute("data-cursor-exclusion")
      if (exclusion) {
        setIsExclusion(true)
        // Show the default cursor when in exclusion mode
        target.style.cursor = "auto"
      }

      // Magnetic effect
      if (target.hasAttribute("data-cursor-magnetic")) {
        const rect = target.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        gsap.to(target, {
          x: (cursorPosition.x - centerX) * 0.3,
          y: (cursorPosition.y - centerY) * 0.3,
          duration: 0.6,
          ease: "power3.out",
        })
      }

      // Stick effect
      if (target.hasAttribute("data-cursor-stick")) {
        const rect = target.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        // Force the cursor to stick to the center
        setCursorPosition({ x: centerX, y: centerY })
        setTargetPosition({ x: centerX, y: centerY })

        // Add a class to the target for visual feedback
        target.classList.add("cursor-stuck")
      }
    }

    const handleElementMouseLeave = (e: MouseEvent) => {
      const target = e.currentTarget as HTMLElement
      setIsHovering(false)
      setCursorText("")
      setCursorColor(null)
      setIsExclusion(false)
      setCursorBgColor(null)
      setCursorOpacity(1)
      setCursorFilter(null)
      setCursorClasses("")
      setCursorSize(null)

      // Reset clip mask
      if (target.hasAttribute("data-cursor-clip-target")) {
        const clipTarget = target.getAttribute("data-cursor-clip-target")
        if (clipTarget) {
          const targetElement = document.getElementById(clipTarget)
          if (targetElement) {
            targetElement.style.clipPath = "circle(0)"
            targetElement.style.webkitClipPath = "circle(0)"
            targetElement.style.visibility = "hidden"
            targetElement.style.opacity = "0"
          }
        }

        // Show the cursor again
        if (cursorOuterRef.current) cursorOuterRef.current.style.opacity = "1"
        if (cursorInnerRef.current) cursorInnerRef.current.style.opacity = "1"

        setClipMaskTarget(null)
      }

      // Reset cursor style
      if (target.hasAttribute("data-cursor-exclusion")) {
        target.style.cursor = ""
      }

      // Reset magnetic effect
      if (target.hasAttribute("data-cursor-magnetic")) {
        gsap.to(target, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
        })
      }

      // Reset stick effect
      if (target.hasAttribute("data-cursor-stick")) {
        target.classList.remove("cursor-stuck")
      }
    }

    // Select all interactive elements
    const interactiveElements = document.querySelectorAll(
      "a, button, input, textarea, select, [data-cursor-hover], [data-cursor-text], [data-cursor-color], [data-cursor-bg-color], [data-cursor-opacity], [data-cursor-filter], [data-cursor-class], [data-cursor-size], [data-cursor-clip-target], [data-cursor-magnetic], [data-cursor-exclusion], [data-cursor-stick]",
    )

    interactiveElements.forEach((element) => {
      element.addEventListener("mouseenter", handleElementMouseEnter as EventListener)
      element.addEventListener("mouseleave", handleElementMouseLeave as EventListener)
    })

    return () => {
      interactiveElements.forEach((element) => {
        element.removeEventListener("mouseenter", handleElementMouseEnter as EventListener)
        element.removeEventListener("mouseleave", handleElementMouseLeave as EventListener)
      })
    }
  }, [
    cursorPosition,
    setCursorPosition,
    setTargetPosition,
    setIsHovering,
    setCursorText,
    setCursorColor,
    setIsExclusion,
    setCursorBgColor,
    setCursorOpacity,
    setCursorFilter,
    setCursorClasses,
    setCursorSize,
    setClipMaskTarget,
  ])

  if (!isVisible) return null

  // Generate filter style based on the filter type
  const getFilterStyle = () => {
    if (!cursorFilter) return {}

    switch (cursorFilter) {
      case "invert":
        return { filter: "invert(1)" }
      case "sepia":
        return { filter: "sepia(1)" }
      case "grayscale":
        return { filter: "grayscale(1)" }
      case "blur":
        return { filter: "blur(2px)" }
      case "brightness":
        return { filter: "brightness(1.5)" }
      case "contrast":
        return { filter: "contrast(1.5)" }
      case "hue-rotate":
        return { filter: "hue-rotate(90deg)" }
      case "saturate":
        return { filter: "saturate(2)" }
      default:
        return { filter: cursorFilter } // Allow custom filter values
    }
  }

  // Calculate cursor sizes
  const getOuterSize = () => {
    if (cursorSize) return cursorSize
    if (cursorText) return isHovering ? 64 : defaultSize
    return isHovering ? 64 : defaultSize
  }

  const getInnerSize = () => {
    if (cursorSize) return cursorSize / 4
    return 8
  }

  const outerSize = getOuterSize()
  const innerSize = getInnerSize()
  const borderWidth = cursorSize ? Math.max(2, Math.floor(cursorSize / 16)) : 2

  // Check if torch effect should be applied
  const isTorch = className?.includes("cursor-torch")

  // Increase torch size for game mode
  const torchSize = isTorch ? 200 : outerSize

  return (
    <>
      {/* Main cursor element */}
      <div
        ref={cursorOuterRef}
        className={cn(
          "fixed top-0 left-0 pointer-events-none z-50 rounded-full transition-all duration-100 ease-out",
          isActive && "scale-90",
          isExclusion && "mix-blend-normal",
          isTorch && "cursor-torch-effect",
          cursorClasses,
          className,
        )}
        style={{
          transform: `translate(${cursorPosition.x}px, ${cursorPosition.y}px) translate(-50%, -50%)`,
          willChange: "transform",
          width: `${isTorch ? torchSize : outerSize}px`,
          height: `${isTorch ? torchSize : outerSize}px`,
          border: `${borderWidth}px solid ${cursorColor || "#ffffff"}`,
          boxShadow: isTorch
            ? "0 0 40px 20px rgba(255, 255, 255, 0.3), inset 0 0 30px rgba(255, 255, 255, 0.3)"
            : "none",
          ...getFilterStyle(),
        }}
      >
        {/* Background layer with opacity */}
        {!cursorText && (
          <div
            className="absolute inset-0 rounded-full"
            style={{
              backgroundColor: cursorBgColor || (isTorch ? "rgba(255, 255, 255, 0.15)" : "transparent"),
              opacity: cursorOpacity,
            }}
          />
        )}

        {/* Text centered in cursor */}
        {cursorText && (
          <div
            className="absolute inset-0 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: cursorBgColor || "rgba(0, 0, 0, 0.7)",
              opacity: cursorOpacity,
              color: "#ffffff",
              fontSize: `${Math.max(12, Math.floor(outerSize / 4))}px`,
            }}
          >
            <span className="font-medium whitespace-nowrap">{cursorText}</span>
          </div>
        )}

        {/* Clip mask for exclusion mode */}
        {isExclusion && (
          <div
            className="absolute inset-0 rounded-full"
            style={{
              mixBlendMode: "difference",
              backgroundColor: "#ffffff",
            }}
          />
        )}
      </div>

      {/* Inner dot */}
      {!cursorText && !isHovering && (
        <div
          ref={cursorInnerRef}
          className={cn(
            "fixed top-0 left-0 pointer-events-none z-50 rounded-full transition-all duration-100 ease-out",
            isActive && "scale-90",
            isExclusion && "mix-blend-normal",
            cursorClasses,
          )}
          style={{
            transform: `translate(${cursorPosition.x}px, ${cursorPosition.y}px) translate(-50%, -50%)`,
            willChange: "transform",
            backgroundColor: cursorColor || "#ffffff",
            width: `${innerSize}px`,
            height: `${innerSize}px`,
            ...getFilterStyle(),
          }}
        >
          {/* Clip mask for exclusion mode */}
          {isExclusion && (
            <div
              className="absolute inset-0 rounded-full"
              style={{
                mixBlendMode: "difference",
                backgroundColor: "#ffffff",
              }}
            />
          )}
        </div>
      )}
    </>
  )
}
