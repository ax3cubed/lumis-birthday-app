"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, ChevronLeft } from "lucide-react"
import Timeline from "@/components/big-energy-components/timeline"
import YearContent from "@/components/big-energy-components/year-content"
import TwoTruthsGame from "@/components/big-energy-components/two-truths-game"
import WinState from "@/components/big-energy-components/win-state"
import { Button } from "@/components/ui/button"
import { useMediaQuery } from "@/hooks/use-media-query"

// University years data with descriptions
const uniYears = [
  { year: 2014, description: "Remedial" },
  { year: 2015, description: "Freshman" },
  { year: 2016, description: "Year 2" },
  { year: 2017, description: "Year 3" },
  { year: 2018, description: "Year 4" },
  { year: 2019, description: "Graduation" },
  { year: 2020, description: "NYSC" },
]

// Sample data for each year
const yearData = {
  2014: {
    photos: [
      {
        src: "/placeholder-dnuut.png",
        alt: "Remedial orientation",
        coloredItem: "red backpack",
      },
      {
        src: "/placeholder-23rb3.png",
        alt: "First campus visit",
        coloredItem: "green notebook",
      },
      {
        src: "/placeholder-dd92g.png",
        alt: "Remedial study group",
        coloredItem: "yellow textbook",
      },
    ],
    gameItems: [
      {
        statement: "Lumi and Jemimah were friends from day one.",
        isLie: true,
        hint: "Think about when they actually became friends...",
      },
      {
        statement: "Lumi loved going to class early.",
        isLie: false,
        hint: "Lumi was always punctual for her classes",
      },
      {
        statement: "Lumi had a green mosquito net.",
        isLie: false,
        hint: "The color of the mosquito net is a distinctive memory",
      },
    ],
  },
  2015: {
    photos: [
      {
        src: "/placeholder-g47fl.png",
        alt: "Freshman orientation",
        coloredItem: "blue ID card",
      },
      {
        src: "/placeholder-yf4dp.png",
        alt: "First dorm room",
        coloredItem: "pink bedspread",
      },
      {
        src: "/placeholder-5x0ng.png",
        alt: "Campus tour",
        coloredItem: "orange campus map",
      },
    ],
    gameItems: [
      {
        statement: "Jemimah was the first to visit Lumi's room in Lagos Hostel.",
        isLie: false,
        hint: "Think about who visited Lumi first at the hostel",
      },
      {
        statement: "On Lumi's first day of school, the first friends she saw were Jemimah, Temi, and Mercy.",
        isLie: false,
        hint: "These three friends were indeed the first people Lumi met",
      },
      {
        statement: "Lumi and Jemimah were roommates.",
        isLie: true,
        hint: "Consider their living arrangements during freshman year",
      },
    ],
  },
  2016: {
    photos: [
      {
        src: "/placeholder-gfvyq.png",
        alt: "Sophomore study session",
        coloredItem: "purple laptop",
      },
      {
        src: "/placeholder-34kov.png",
        alt: "Campus festival",
        coloredItem: "red festival banner",
      },
      {
        src: "/placeholder-7nqi0.png",
        alt: "Department excursion",
        coloredItem: "gold department logo",
      },
    ],
    gameItems: [
      {
        statement: "Lumi's mum came for a surprise visit early on a Saturday morning.",
        isLie: false,
        hint: "This unexpected visit is a memorable event",
      },
      {
        statement: "Lumi got her first contact lenses.",
        isLie: false,
        hint: "Think about changes to Lumi's appearance this year",
      },
      {
        statement: "Lumi became a church worker.",
        isLie: true,
        hint: "Consider Lumi's involvement with religious activities",
      },
    ],
  },
  2017: {
    photos: [
      {
        src: "/placeholder-gcggw.png",
        alt: "Junior year project",
        coloredItem: "green circuit board",
      },
      {
        src: "/placeholder-i4ybr.png",
        alt: "Internship first day",
        coloredItem: "blue company logo",
      },
      {
        src: "/placeholder-fhxmj.png",
        alt: "Department competition",
        coloredItem: "red award ribbon",
      },
    ],
    gameItems: [
      {
        statement: "Lumi secured an internship at a major sugar company.",
        isLie: false,
        hint: "This internship was an important milestone",
      },
      {
        statement: "Lumi had a teddy bear named Snowball.",
        isLie: false,
        hint: "Think about Lumi's personal belongings",
      },
      {
        statement: "Lumi attended the same church as Jemimah (Redeemed Christian Church).",
        isLie: true,
        hint: "Consider where Lumi and Jemimah worshipped",
      },
    ],
  },
  2018: {
    photos: [
      {
        src: "/placeholder-jm0if.png",
        alt: "Final year project",
        coloredItem: "yellow project poster",
      },
      {
        src: "/placeholder-cz7mq.png",
        alt: "Job fair",
        coloredItem: "blue resume folder",
      },
      {
        src: "/university-graduation.png",
        alt: "Senior class photo",
        coloredItem: "green department banner",
      },
    ],
    gameItems: [
      {
        statement: "Lumi had plans to start a recycling company with her friends.",
        isLie: false,
        hint: "This entrepreneurial idea was discussed among friends",
      },
      {
        statement: "Lumi received three job offers before graduation.",
        isLie: true,
        hint: "Think about Lumi's job prospects at this time",
      },
      {
        statement: "Lumi was nervous during her project defense.",
        isLie: false,
        hint: "Project defense is often a stressful experience",
      },
    ],
  },
  2019: {
    photos: [
      {
        src: "/university-graduation.png",
        alt: "Graduation ceremony",
        coloredItem: "blue graduation gown",
      },
      {
        src: "/placeholder-x30um.png",
        alt: "Graduation party",
        coloredItem: "pink champagne glass",
      },
      {
        src: "/placeholder-jm0if.png",
        alt: "Family celebration",
        coloredItem: "gold graduation cap",
      },
    ],
    gameItems: [
      {
        statement: "Lumi's graduation photos went viral on campus social media.",
        isLie: true,
        hint: "Consider the popularity of Lumi's graduation photos",
      },
      {
        statement: "Lumi wore a suit for graduation.",
        isLie: false,
        hint: "Think about Lumi's graduation attire",
      },
      {
        statement: "Lumi participated in final year week.",
        isLie: false,
        hint: "Final year week is a significant event for graduates",
      },
    ],
  },
  2020: {
    photos: [
      {
        src: "/placeholder-cz7mq.png",
        alt: "NYSC orientation camp",
        coloredItem: "green NYSC uniform",
      },
      {
        src: "/placeholder-dnuut.png",
        alt: "Community service project",
        coloredItem: "red volunteer badge",
      },
      {
        src: "/placeholder-5x0ng.png",
        alt: "NYSC passing out parade",
        coloredItem: "white NYSC cap",
      },
    ],
    gameItems: [
      {
        statement: "Ellion was Lumi's bunkmate at NYSC camp.",
        isLie: false,
        hint: "Think about Lumi's sleeping arrangements in NYSC camp",
      },
      {
        statement: "Lumi and Jemimah served in the same office.",
        isLie: true,
        hint: "Consider where Lumi and Jemimah were posted for service",
      },
      {
        statement: "Lumi lived with her uncle during her service year.",
        isLie: false,
        hint: "Living arrangements during NYSC are important memories",
      },
    ],
  },
}

export default function BigLumiEnergy() {
  const [activeYear, setActiveYear] = useState(2014)
  const [showGame, setShowGame] = useState(false)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [winState, setWinState] = useState(false)
  const [completedYears, setCompletedYears] = useState<number[]>([])
  const [gameStates, setGameStates] = useState<Record<number, boolean>>({})

  const isMobile = useMediaQuery("(max-width: 768px)")
  const containerRef = useRef<HTMLDivElement>(null)

  // Reset game state when changing years
  useEffect(() => {
    setGameCompleted(gameStates[activeYear] || false)
    // Always show year content first when changing years
    setShowGame(false)
  }, [activeYear, gameStates])

  const handleYearClick = (year: number) => {
    setActiveYear(year)
    setShowGame(false)
  }

  const handleGameComplete = () => {
    if (!completedYears.includes(activeYear)) {
      setCompletedYears([...completedYears, activeYear])
    }

    // Update the game state for this specific year
    setGameStates((prev) => ({
      ...prev,
      [activeYear]: true,
    }))

    setGameCompleted(true)

    // If all years are completed, show win state
    if (completedYears.length === uniYears.length - 1) {
      setTimeout(() => {
        setWinState(true)
      }, 1000)
    }
  }

  const handleShowGame = () => {
    setShowGame(true)
  }

  const handleBackToYear = () => {
    setShowGame(false)
  }

  const handleNextYear = () => {
    const currentIndex = uniYears.findIndex((item) => item.year === activeYear)
    if (currentIndex < uniYears.length - 1) {
      setActiveYear(uniYears[currentIndex + 1].year)
      // Always show year content first when navigating to next year
      setShowGame(false)
    }
  }

  const handlePrevYear = () => {
    const currentIndex = uniYears.findIndex((item) => item.year === activeYear)
    if (currentIndex > 0) {
      setActiveYear(uniYears[currentIndex - 1].year)
      setShowGame(false)
    }
  }

  const handleCloseWinState = () => {
    setWinState(false)
  }

  // Find the current year's description
  const activeYearData = uniYears.find((item) => item.year === activeYear)
  const yearDescription = activeYearData ? activeYearData.description : ""

  return (
    <div className="relative min-h-screen bg-black text-white py-16 px-4 md:px-8" ref={containerRef}>
      <AnimatePresence>{winState && <WinState onClose={handleCloseWinState} />}</AnimatePresence>

      <motion.h1
        className="text-4xl md:text-6xl font-bold text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
          Big Lumi Energy
        </span>
      </motion.h1>

      <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto">
        {/* Timeline on left for desktop, top for mobile */}
        <div className={`${isMobile ? "w-full mb-8" : "w-1/4"}`}>
          <Timeline
            years={uniYears}
            activeYear={activeYear}
            onYearClick={handleYearClick}
            completedYears={completedYears}
          />
        </div>

        {/* Content on right for desktop, bottom for mobile */}
        <div className={`${isMobile ? "w-full" : "w-3/4"} relative`}>
          <AnimatePresence mode="wait">
            {!showGame ? (
              <motion.div
                key="year-content"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <YearContent
                  year={activeYear}
                  description={yearDescription}
                  data={yearData[activeYear as keyof typeof yearData]}
                  onPlayGame={handleShowGame}
                  isCompleted={gameStates[activeYear] || false}
                />
              </motion.div>
            ) : (
              <motion.div
                key={`game-content-${activeYear}`} // Add year to key to force re-render
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <TwoTruthsGame
                  key={activeYear} // Add key to force re-render when year changes
                  gameItems={yearData[activeYear as keyof typeof yearData].gameItems}
                  year={activeYear}
                  description={yearDescription}
                  onComplete={handleGameComplete}
                  onBack={handleBackToYear}
                  onNext={handleNextYear}
                  completed={gameStates[activeYear] || false}
                  isLastYear={activeYear === uniYears[uniYears.length - 1].year}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevYear}
              disabled={activeYear === uniYears[0].year}
              className="flex items-center gap-2 border-purple-700 bg-transparent text-purple-400 hover:bg-purple-900/20 hover:text-purple-300"
            >
              <ChevronLeft size={16} />
              Previous Year
            </Button>

            <Button
              variant="outline"
              onClick={handleNextYear}
              disabled={activeYear === uniYears[uniYears.length - 1].year}
              className="flex items-center gap-2 border-purple-700 bg-transparent text-purple-400 hover:bg-purple-900/20 hover:text-purple-300"
            >
              Next Year
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Floating university-themed icons */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {["📚", "☕", "💻", "🎓", "🎭", "🎨", "📝"].map((icon, index) => (
          <motion.div
            key={index}
            className="absolute text-2xl opacity-30"
            initial={{
              x: Math.random() * 100,
              y: Math.random() * 100,
            }}
            animate={{
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
              rotate: [0, 360],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          >
            {icon}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
