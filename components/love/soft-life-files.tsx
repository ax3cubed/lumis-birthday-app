"use client"

import { useState } from "react"
import PhotoCarousel from "./photo-carousel"
import LoveQuiz from "./love-quiz"
import LoveLetter from "./love-letter"

export default function SoftLifeFiles() {
  const [currentSection, setCurrentSection] = useState<"carousel" | "quiz" | "letter">("carousel")
  const [quizCompleted, setQuizCompleted] = useState(false)

  const handleQuizComplete = (score: number) => {
    setQuizCompleted(true)
    // After a short delay, show the love letter
    setTimeout(() => {
      setCurrentSection("letter")
    }, 3000)
  }

  return (
    <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="mb-12 text-center">
        <h2 className="text-4xl md:text-5xl font-serif mb-4 tracking-tight">The Soft Life Files</h2>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-light italic">
          A romantic journey through our most intimate moments
        </p>
      </div>

      <div className="flex justify-center gap-4 mb-12">
        <button
          onClick={() => setCurrentSection("carousel")}
          className={`px-6 py-2 rounded-full border border-white/30 transition-all ${
            currentSection === "carousel" ? "bg-white text-black" : "bg-transparent text-white hover:bg-white/10"
          }`}
        >
          Our Story
        </button>
        <button
          onClick={() => setCurrentSection("quiz")}
          className={`px-6 py-2 rounded-full border border-white/30 transition-all ${
            currentSection === "quiz" ? "bg-white text-black" : "bg-transparent text-white hover:bg-white/10"
          }`}
        >
          Love Quiz
        </button>
        {quizCompleted && (
          <button
            onClick={() => setCurrentSection("letter")}
            className={`px-6 py-2 rounded-full border border-white/30 transition-all ${
              currentSection === "letter" ? "bg-white text-black" : "bg-transparent text-white hover:bg-white/10"
            }`}
          >
            Love Letter
          </button>
        )}
      </div>

      <div className="min-h-[500px]">
        {currentSection === "carousel" && <PhotoCarousel />}
        {currentSection === "quiz" && <LoveQuiz onComplete={handleQuizComplete} />}
        {currentSection === "letter" && <LoveLetter />}
      </div>
    </section>
  )
}
