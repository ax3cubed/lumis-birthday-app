"use client"

import { useSprings, animated, easings } from "@react-spring/web"
import { useEffect, useRef, useState } from "react"

type TextAlign = "left" | "center" | "right" | "justify"

interface SplitTextProps {
  text?: string
  className?: string
  delay?: number
  animationFrom?: any
  animationTo?: any
  easing?: string
  threshold?: number
  rootMargin?: string
  textAlign?: TextAlign
  onLetterAnimationComplete?: () => void
}

const SplitText = ({
  text = "",
  className = "",
  delay = 100,
  animationFrom = { opacity: 0, transform: "translate3d(0,40px,0)" },
  animationTo = { opacity: 1, transform: "translate3d(0,0,0)" },
  easing = "easeOutCubic",
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
  onLetterAnimationComplete,
}: SplitTextProps) => {
  const words = text.split(" ").map((word) => word.split(""))
  const letters = words.flat()
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLParagraphElement>(null)
  const animatedCount = useRef(0)

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (ref.current) {
            observer.unobserve(ref.current)
          }
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [threshold, rootMargin])

  const springs = useSprings(
    letters.length,
    (i) => ({
      from: animationFrom,
      to: inView
        ? async (next: any) => {
            await next(animationTo)
            animatedCount.current += 1
            if (animatedCount.current === letters.length && onLetterAnimationComplete) {
              onLetterAnimationComplete()
            }
          }
        : animationFrom,
      delay: i * delay,
      config: { 
        easing: (t: number) => 
          typeof easings[easing as keyof typeof easings] === 'function' 
            ? (easings[easing as keyof typeof easings] as (t: number) => number)(t)
            : easings.easeOutCubic(t)
      },
    }),
  )

  return (
    <p
      ref={ref}
      className={`split-parent overflow-hidden inline ${className}`}
      style={{ textAlign, whiteSpace: "normal", wordWrap: "break-word" }}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
          {word.map((letter, letterIndex) => {
            const index = words.slice(0, wordIndex).reduce((acc, w) => acc + w.length, 0) + letterIndex

            return (
              <animated.span
                key={index}
                style={springs[index] as any}
                className="inline-block transform transition-opacity will-change-transform"
              >
                {letter}
              </animated.span>
            )
          })}
          <span style={{ display: "inline-block", width: "0.3em" }}>&nbsp;</span>
        </span>
      ))}
    </p>
  )
}

export default SplitText
