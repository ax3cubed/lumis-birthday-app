
"use client"

import { motion, useInView, AnimatePresence } from "framer-motion"
import { useEffect, useRef, useMemo } from "react"

interface SplitTextProps {
  text?: string
  className?: string
  delay?: number
  animationFrom?: { opacity?: number; y?: number }
  threshold?: number
  rootMargin?: string
  textAlign?: string
  onLetterAnimationComplete?: () => void
}

const SplitText = ({
  text = "",
  className = "",
  delay = 20,
  animationFrom = { opacity: 0, y: 20 },
  threshold = 0.1,
  rootMargin = "0px",
  textAlign = "center",
  onLetterAnimationComplete,
}: SplitTextProps) => {
  // Early return for invalid text
  if (!text || typeof text !== "string") {
    console.warn("SplitText: Invalid or empty text provided:", text);
    return <div className={className} style={{ textAlign }} />;
  }

  // Memoize words and letters
  const words = useMemo(() => text.split(" ").map((word) => word.split("")), [text]);
  const letters = useMemo(() => words.flat(), [words]);

  // Viewport detection
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: true, // Only trigger once
    amount: threshold,
    margin: rootMargin,
  });

  // Log for debugging
  useEffect(() => {
    console.log("SplitText text:", text, "isInView:", isInView);
  }, [text, isInView]);

  // Animation variants
  const letterVariants = {
    hidden: animationFrom,
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay: i * (delay / 1000), // Convert ms to seconds
        ease: "easeOut",
      },
    }),
  };

  // Track animation completion
  const handleAnimationComplete = (index: number) => {
    if (index === letters.length - 1 && onLetterAnimationComplete) {
      console.log("Animation complete for", text);
      onLetterAnimationComplete();
    }
  };

  return (
    <div
      ref={ref}
      className={`split-parent inline-block ${className}`}
      style={{ textAlign, whiteSpace: "normal", wordWrap: "break-word" }}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
          {word.map((letter, letterIndex) => {
            const index = words.slice(0, wordIndex).reduce((acc, w) => acc + w.length, 0) + letterIndex;
            return (
              <AnimatePresence key={index}>
                <motion.span
                  custom={index}
                  variants={letterVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  className="inline-block"
                  onAnimationComplete={() => handleAnimationComplete(index)}
                >
                  {letter}
                </motion.span>
              </AnimatePresence>
            );
          })}
          {wordIndex < words.length - 1 && (
            <span style={{ display: "inline-block", width: "0.3em" }}> </span>
          )}
        </span>
      ))}
    </div>
  );
};

export default SplitText;
