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
      delay={20}
      animationFrom={{ opacity: 0, y: 20 }}
      className="text-white"
      threshold={0.1}
      rootMargin="0px"
      onLetterAnimationComplete={() => {
        console.log("Title animation complete");
        setTitleComplete(true);
      }}
    />
  </h1>
  <div className="max-w-2xl mx-auto text-lg">
    <SplitText
      text={subtitle}
      delay={20}
      animationFrom={{ opacity: 0, y: 20 }}
      className="text-white"
      threshold={0.1}
      rootMargin="0px"
      onLetterAnimationComplete={() => console.log("Subtitle animation complete")}
    />
  </div>
</div>
  )
}
