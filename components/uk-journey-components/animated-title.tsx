"use client"

import { useState } from "react"
import SplitText from "@/components/uk-journey-components/split-text"

interface AnimatedTitleProps {
  title: string
  subtitle: string
}

export default function AnimatedTitle({ title, subtitle }: AnimatedTitleProps) {
  const [titleComplete, setTitleComplete] = useState(false)

  return (
    <div className="text-center">
      <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 text-white">
        <SplitText
          text={title}
          delay={50}
          animationFrom={{ opacity: 0, transform: "translate3d(0,30px,0)" }}
          className="text-white"
          onLetterAnimationComplete={() => setTitleComplete(true)}
        />
      </h1>

      {/* Only start animating the subtitle after the title animation is complete */}
      <div className="max-w-2xl mx-auto text-lg">
        <SplitText
          text={subtitle}
          delay={20}
          animationFrom={{ opacity: 0, transform: "translate3d(0,20px,0)" }}
          className="text-white"
          threshold={0}
        />
      </div>
    </div>
  )
}
