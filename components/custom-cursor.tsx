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
  textSize?: number // px, for text in cursor
  circleBgColor?: string // fallback background color
  circleOpacity?: number // fallback opacity
  mouseEffects?: string[] // e.g. ["glow", "shadow", "blend", ...]
}

export default function CustomCursor({ className, defaultSize = 32, textSize, circleBgColor, circleOpacity, mouseEffects = [] }: CustomCursorProps) {
  const cursorOuterRef = useRef<HTMLDivElement>(null)
  const cursorInnerRef = useRef<HTMLDivElement>(null)
  const requestRef = useRef<number | null>(null)
  const previousTimeRef = useRef<number | null>(null)

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
          // @ts-ignore: webkitClipPath is supported in browsers
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
            // @ts-ignore: webkitClipPath is supported in browsers
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

  // Generate filter style based on the filter type and mouseEffects
  const getFilterStyle = () => {
    let style: any = {}
    if (cursorFilter) {
      switch (cursorFilter) {
        case "invert":
          style.filter = "invert(1)"
          break
        case "sepia":
          style.filter = "sepia(1)"
          break
        case "grayscale":
          style.filter = "grayscale(1)"
          break
        case "blur":
          style.filter = "blur(2px)"
          break
        case "brightness":
          style.filter = "brightness(1.5)"
          break
        case "contrast":
          style.filter = "contrast(1.5)"
          break
        case "hue-rotate":
          style.filter = "hue-rotate(90deg)"
          break
        case "saturate":
          style.filter = "saturate(2)"
          break
        default:
          style.filter = cursorFilter
      }
    }
    // Mouse effects
    if (mouseEffects.includes("invert")) style.filter = (style.filter || "") + " invert(1)"
    if (mouseEffects.includes("blur")) style.filter = (style.filter || "") + " blur(2px)"
    if (mouseEffects.includes("grayscale")) style.filter = (style.filter || "") + " grayscale(1)"
    if (mouseEffects.includes("hue-rotate")) style.filter = (style.filter || "") + " hue-rotate(90deg)"
    if (mouseEffects.includes("saturate")) style.filter = (style.filter || "") + " saturate(2)"
    if (mouseEffects.includes("contrast")) style.filter = (style.filter || "") + " contrast(1.5)"
    if (mouseEffects.includes("brightness")) style.filter = (style.filter || "") + " brightness(1.5)"
    return style
  }

  // Mouse effect box shadows
  const getBoxShadow = () => {
    let shadow = ""
    if (mouseEffects.includes("glow")) shadow += "0 0 32px 8px #a78bfa, ";
    if (mouseEffects.includes("shadow")) shadow += "0 4px 24px 0 rgba(0,0,0,0.18), ";
    if (mouseEffects.includes("neon")) shadow += "0 0 16px 4px #00fff7, 0 0 32px 8px #00fff7, ";
    if (mouseEffects.includes("rainbow")) shadow += "0 0 24px 8px #f472b6, 0 0 24px 8px #facc15, 0 0 24px 8px #34d399, 0 0 24px 8px #60a5fa, ";
    if (mouseEffects.includes("glass")) shadow += "0 4px 32px 0 rgba(255,255,255,0.18), ";
    if (shadow.endsWith(", ")) shadow = shadow.slice(0, -2)
    return shadow || undefined
  }

  // Mouse effect blend modes
  const getBlendMode = () => {
    if (mouseEffects.includes("blend")) return "multiply"
    if (mouseEffects.includes("glass")) return "overlay"
    return undefined
  }

  // Mouse effect background
  const getBg = () => {
    if (mouseEffects.includes("rainbow")) return "linear-gradient(135deg, #f472b6, #facc15, #34d399, #60a5fa)"
    if (mouseEffects.includes("neon")) return "#00fff7"
    if (mouseEffects.includes("glass")) return "rgba(255,255,255,0.12)"
    return undefined
  }

  // Calculate cursor sizes
  const getOuterSize = () => {
    if (cursorSize) return cursorSize
    if (cursorText) return isHovering ? 128 : defaultSize
    return isHovering ? 128 : defaultSize
  }
  const getInnerSize = () => {
    if (cursorSize) return Math.max(8, cursorSize / 4)
    return 8
  }
  const outerSize = getOuterSize()
  const innerSize = getInnerSize()
  const borderWidth = 2
  const isTorch = className?.includes("cursor-torch")
  const torchSize = isTorch ? 200 : outerSize

  // Use prop or state for bg/opacity
  const effectiveBgColor = cursorBgColor || circleBgColor || (mouseEffects.includes("glass") ? "rgba(255,255,255,0.12)" : undefined) || "transparent"
  const effectiveOpacity = cursorOpacity ?? circleOpacity ?? 1
  const effectiveTextSize = textSize || Math.max(16, Math.floor(outerSize / 5))

  return (
    <>
      {/* Main cursor element */}
      <div
        ref={cursorOuterRef}
        className={cn(
          "fixed top-0 left-0 pointer-events-none z-50 rounded-full transition-all duration-100 ease-out flex items-center justify-center",
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
          boxShadow: getBoxShadow() || (isTorch
            ? "0 0 40px 20px rgba(255, 255, 255, 0.3), inset 0 0 30px rgba(255, 255, 255, 0.3)"
            : isActive
            ? "0 0 16px 4px rgba(168, 85, 247, 0.3)"
            : isHovering
            ? "0 0 24px 8px rgba(139, 92, 246, 0.2)"
            : "none"),
          background: getBg(),
          mixBlendMode: getBlendMode(),
          transition: "box-shadow 0.2s, border-color 0.2s, background 0.2s, width 0.2s, height 0.2s",
          ...getFilterStyle(),
        }}
      >
        {/* Background layer with opacity */}
        {!cursorText && (
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                isTorch
                  ? "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 80%, transparent 100%)"
                  : isActive
                  ? "rgba(168, 85, 247, 0.12)"
                  : isHovering
                  ? "rgba(139, 92, 246, 0.10)"
                  : effectiveBgColor,
              opacity: effectiveOpacity,
              transition: "background 0.2s, opacity 0.2s",
            }}
          />
        )}

        {/* Text centered in cursor */}
        {cursorText && (
          <div
            className="absolute inset-0 rounded-full flex items-center justify-center overflow-hidden"
            style={{
              backgroundColor: effectiveBgColor,
              opacity: effectiveOpacity,
              color: "#ffffff",
              fontSize: `${effectiveTextSize}px`,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              transition: "background 0.2s, opacity 0.2s, font-size 0.2s",
            }}
          >
            <span className="font-medium whitespace-nowrap w-full text-center" style={{lineHeight: 1}}>{cursorText}</span>
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
            background: isActive
              ? "radial-gradient(circle at 50% 50%, #a855f7 0%, #7c3aed 100%)"
              : isHovering
              ? "radial-gradient(circle at 50% 50%, #c4b5fd 0%, #a78bfa 100%)"
              : cursorColor || "#ffffff",
            width: `${innerSize}px`,
            height: `${innerSize}px`,
            boxShadow: getBoxShadow() || (isActive
              ? "0 0 8px 2px #a855f7, 0 0 2px 1px #7c3aed"
              : isHovering
              ? "0 0 8px 2px #a78bfa"
              : "none"),
            transition: "background 0.2s, box-shadow 0.2s, width 0.2s, height 0.2s",
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
