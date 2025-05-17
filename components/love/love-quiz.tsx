"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Heart, X, Check } from "lucide-react"

// Sample quiz data - replace with actual content
const quizQuestions = [
  {
    id: 1,
    question: "What's Lumi's favorite type of date night?",
    options: ["Fancy restaurant dinner", "Cozy movie night at home", "Game night", "Adventurous outdoor activity"],
    correctAnswer: 0,
    reactionCorrect: "You really know Lumi's idea of romance! 😍",
    reactionWrong: "Not quite! Lumi prefers a fancy restaurant dinner.",
  },
  {
    id: 2,
    question: 'Who said "I love you" first?',
    options: ["Lumi", "Her fiancé", "They said it simultaneously", "It was accidentally texted"],
    correctAnswer: 1,
    reactionCorrect: "That's right! He couldn't hold it in any longer! ❤️",
    reactionWrong: "Actually, he was the first to say those three magic words!",
  },
  {
    id: 3,
    question: "Which pet name does Lumi refuse to respond to?",
    options: ["my love", "Bibables", "Honey Bear", "Pbaby"],
    correctAnswer: 1,
    reactionCorrect: '"Bibables" is where she draws the line! 🙅‍♀️',
    reactionWrong: 'She would never! "Bibables" is the one she can\'t stand!',
  },
  {
    id: 4,
    question: "What's their go-to weekend activity?",
    options: ["Netflix marathons", "Badminton", "DIY Wine & Paint Night", "Cook Something New Together"],
    correctAnswer: 1,
    reactionCorrect: "You got it! They love playing badminton together! 🏸",
    reactionWrong: "Close, but they're badminton enthusiasts!",
  },
  {
    id: 5,
    question: "What is their song?",
    options: [
      '"Hello Sisi" by dotti the deity',
      '"Perfect" by Ed Sheeran',
      '"All of Me" by John Legend',
      '"Count on You" by Johnny Drille',
    ],
    correctAnswer: 0,
    reactionCorrect: 'Spot on! "Hello Sisi" is their special song! 🎵',
    reactionWrong: 'It\'s actually "Hello Sisi" by dotti the deity!',
  },
]

interface LoveQuizProps {
  onComplete: (score: number) => void
}

export default function LoveQuiz({ onComplete }: LoveQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [hasRetried, setHasRetried] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return // Prevent multiple selections

    setSelectedAnswer(answerIndex)
    const correct = answerIndex === quizQuestions[currentQuestion].correctAnswer
    setIsCorrect(correct)

    if (correct) {
      setScore(score + 1)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 2000)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setIsCorrect(null)
      setHasRetried(false)
    } else {
      setShowResults(true)
      onComplete(score)
    }
  }

  const handleRetry = () => {
    if (!hasRetried) {
      setSelectedAnswer(null)
      setIsCorrect(null)
      setHasRetried(true)
    } else {
      handleNextQuestion()
    }
  }

  const progressPercentage = ((currentQuestion + 1) / quizQuestions.length) * 100

  return (
    <div className="max-w-2xl mx-auto bg-black border border-white/20 rounded-xl p-6 md:p-8 shadow-xl relative overflow-hidden">
      {!showResults ? (
        <>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-300">
                Question {currentQuestion + 1}/{quizQuestions.length}
              </span>
              <span className="text-sm text-gray-300">Score: {score}</span>
            </div>
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-pink-500 to-red-500"
                initial={{ width: `${(currentQuestion / quizQuestions.length) * 100}%` }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-serif mb-6">{quizQuestions[currentQuestion].question}</h3>

            <div className="space-y-3">
              {quizQuestions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={selectedAnswer !== null && !hasRetried}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    selectedAnswer === index
                      ? isCorrect
                        ? "border-green-500 bg-green-500/20"
                        : "border-red-500 bg-red-500/20"
                      : "border-white/30 hover:border-white/60 hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {selectedAnswer === index &&
                      (isCorrect ? (
                        <Check className="text-green-500" size={20} />
                      ) : (
                        <X className="text-red-500" size={20} />
                      ))}
                  </div>
                </button>
              ))}
            </div>

            {selectedAnswer !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 rounded-lg bg-white/10 text-center"
              >
                <p className="text-lg">
                  {isCorrect
                    ? quizQuestions[currentQuestion].reactionCorrect
                    : quizQuestions[currentQuestion].reactionWrong}
                </p>

                {isCorrect || hasRetried ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNextQuestion}
                    className="mt-4 px-6 py-2 bg-white text-black rounded-full font-medium"
                  >
                    {currentQuestion < quizQuestions.length - 1 ? "Next Question" : "See Results"}
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRetry}
                    className="mt-4 px-6 py-2 border border-white/50 rounded-full font-medium hover:bg-white/10"
                  >
                    Try Again
                  </motion.button>
                )}
              </motion.div>
            )}
          </motion.div>

          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 50 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    y: -20,
                    x: Math.random() * window.innerWidth,
                    opacity: 1,
                    scale: Math.random() * 0.5 + 0.5,
                  }}
                  animate={{
                    y: window.innerHeight,
                    rotate: Math.random() * 360,
                    opacity: 0,
                  }}
                  transition={{
                    duration: Math.random() * 2 + 1,
                    ease: "easeOut",
                  }}
                  className="absolute"
                >
                  <Heart fill="true" size={Math.random() * 20 + 10} className="text-pink-500" />
                </motion.div>
              ))}
            </div>
          )}
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <h3 className="text-3xl font-serif mb-4">
            {score >= 3
              ? "You really know Lumi's soft life 💕"
              : "Close, but you're not getting an invite to the wedding yet 😅"}
          </h3>

          <div className="my-6">
            <div className="inline-block p-4 rounded-full bg-gradient-to-r from-pink-500 to-red-500">
              <Heart fill="true" size={40} className="text-white" />
            </div>
            <p className="text-xl mt-4">
              Your score: {score}/{quizQuestions.length}
            </p>
          </div>

          <p className="text-gray-300 mb-6">
            {score >= 3
              ? "Impressive! You know all the little details that make their relationship special."
              : "Don't worry! Their love story has many chapters yet to be discovered."}
          </p>

          <p className="text-sm text-gray-400 italic">A special love letter will appear shortly...</p>
        </motion.div>
      )}
    </div>
  )
}
