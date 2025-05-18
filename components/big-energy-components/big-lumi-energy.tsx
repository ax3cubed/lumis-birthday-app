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
import CustomCursor from "@/components/custom-cursor"
import { useRouter } from "next/navigation"

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
        src: "/Big-lumi/2014/Remedial1.jpg",
        alt: "Remedial photo with KDJ, Dami, Jemimah and Rashidat",
        coloredItem: "",
      },
      {
        src: "/Big-lumi/2014/Remedial2.jpg",
        alt: "Jemimah and Lumi in remedial",
        coloredItem: "",
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
        src: "/Big-lumi/2015/2015-1.jpg",
        alt: "Ready for class",
        coloredItem: "black and white",
      },
      {
        src: "/Big-lumi/2015/2015-2.jpg",
        alt: "Ready with Jemimah",
        coloredItem: "Black and white shirt",
      },
      {
        src: "/Big-lumi/2015/2015-3.jpg",
        alt: "Going out with Jemmy",
        coloredItem: "blue ankara top",
      },
      {
        src: "/Big-lumi/2015/2015-4.jpg",
        alt: "Out with Jemimah",
        coloredItem: "Blue top",
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
        src: "/Big-lumi/2016/2016-2.jpg",
        alt: "Hostel life",
        coloredItem: "",
      },
      {
        src: "/Big-lumi/2016/2016-3.jpg",
        alt: "Sunday service",
        coloredItem: "white top",
      },
      {
        src: "/Big-lumi/2016/2016-4.jpg",
        alt: "Hostel life",
        coloredItem: "",
      },
      {
        src: "/Big-lumi/2016/2016-5.jpg",
        alt: "Sunday service",
        coloredItem: "",
      },
      {
        src: "/Big-lumi/2016/2016-6.jpg",
        alt: "Jem and Lumi going for Breakfast/lunch with lumi's mum",
        coloredItem: "",
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
        src: "/Big-lumi/2017/2017-1.jpg",
        alt: "",
        coloredItem: "",
      },
      {
        src: "/Big-lumi/2017/2017-3.jpg",
        alt: "Going home for the holidays",
        coloredItem: "",
      },
      {
        src: "/Big-lumi/2017/2017-4.jpg",
        alt: "Dressed up for class",
        coloredItem: "",
      },
      {
        src: "/Big-lumi/2017/2017-5.jpg",
        alt: "After long morning of make up we still ended up missing church",
        coloredItem: "",
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
        src: "/Big-lumi/2018/2018-1.jpg",
        alt: "Photoshoot day",
        coloredItem: "",
      },
      {
        src: "/Big-lumi/2018/2018-2.jpg",
        alt: "Photo with Ellion",
        coloredItem: "",
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
        src: "/Big-lumi/2019/grad1.jpg",
        alt: "Final Year week",
        coloredItem: "",
      },
      {
        src: "/Big-lumi/2019/grad2.jpg",
        alt: "Graduation party",
        coloredItem: "",
      },
      {
        src: "/Big-lumi/2019/grad3.jpg",
        alt: "Final Year week",
        coloredItem: "",
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
        src: "/Big-lumi/2020/Nysc1.jpg",
        alt: "NYSC orientation camp",
        coloredItem: "white NYSC uniform",
      },
      {
        src: "/Big-lumi/2020/ibadan-1.jpg",
        alt: "Jemimah and Lumi in Ibadan",
        coloredItem: "red shirt",
      },
      {
        src: "/Big-lumi/2020/ibadan-3.jpg",
        alt: "Lumi visiting Ibadan",
        coloredItem: "Pink and Red top",
      },
      {
        src: "/Big-lumi/2020/lagos-2.jpg",
        alt: "Lumi ",
        coloredItem: "Red dress",
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
  const router = useRouter()
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
    if (completedYears.length === uniYears.length - 1) {
      router.push("/uk-journey")
    }
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

  // Floating icon positions (client-only)
  const [iconPositions, setIconPositions] = useState<{ x: number, y: number, x2: number, y2: number, duration: number }[]>([])

  useEffect(() => {
    if (typeof window === 'undefined') return
    // Generate random positions and durations for each icon on mount
    setIconPositions([
      ...Array(7).fill(0).map(() => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        x2: Math.random() * window.innerWidth,
        y2: Math.random() * window.innerHeight,
        duration: 20 + Math.random() * 10,
      }))
    ])
  }, [])

  return (
    <div className="relative min-h-screen bg-black text-white py-16 px-4 md:px-8" ref={containerRef}>
      <CustomCursor defaultSize={48} />
      <AnimatePresence>{winState && <WinState onClose={handleCloseWinState} />}</AnimatePresence>

      <motion.h1
        className="text-4xl md:text-6xl font-bold text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        data-cursor-hover
        data-cursor-size="80"
        data-cursor-color="#a78bfa"
        data-cursor-text="Big Lumi!"
        data-cursor-effect="glow rainbow"
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400"
          data-cursor-hover
          data-cursor-size="150"
          data-cursor-color="#f472b6"
          data-cursor-text="Go Lumi!"
          data-cursor-effect="neon"
        >
          Big Lumi Energy
        </span>
      </motion.h1>

      <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto">
        {/* Timeline on left for desktop, top for mobile */}
        <div className={`${isMobile ? "w-full mb-8" : "w-1/4"}`}
          data-cursor-hover
          data-cursor-size="56"
          data-cursor-color="#f472b6"
          data-cursor-text="Timeline"
          data-cursor-effect="shadow"
        >
          <Timeline
            years={uniYears}
            activeYear={activeYear}
            onYearClick={handleYearClick}
            completedYears={completedYears}
          />
        </div>

        {/* Content on right for desktop, bottom for mobile */}
        <div className={`${isMobile ? "w-full" : "w-3/4"} relative`}
          data-cursor-hover
          data-cursor-size="64"
          data-cursor-color="#fbbf24"
          data-cursor-effect="glass"
        >
          <AnimatePresence mode="wait">
            {!showGame ? (
              <motion.div
                key="year-content"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                data-cursor-hover
                data-cursor-size="128"
                data-cursor-color="#f472b6"
                data-cursor-text="Memories"
                data-cursor-effect="blend"
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
                key={`game-content-${activeYear}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                data-cursor-hover
                data-cursor-size="128"
                data-cursor-color="#fbbf24"
                data-cursor-text="Game!"
                data-cursor-effect="neon"
              >
                <TwoTruthsGame
                  key={activeYear}
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
              data-cursor-hover
              data-cursor-size="48"
              data-cursor-color="#a78bfa"
              data-cursor-text="Previous"
              data-cursor-effect="invert"
            >
              <ChevronLeft size={16}
                data-cursor-hover
                data-cursor-size="40"
                data-cursor-color="#a78bfa"
                data-cursor-text="Back"
                data-cursor-effect="shadow"
              />
              Previous Year
            </Button>

            <Button
              variant="outline"
              onClick={handleNextYear}
              disabled={activeYear === uniYears[uniYears.length - 1].year}
              className="flex items-center gap-2 border-purple-700 bg-transparent text-purple-400 hover:bg-purple-900/20 hover:text-purple-300"
              data-cursor-hover
              data-cursor-size="48"
              data-cursor-color="#fbbf24"
              data-cursor-text="Next"
              data-cursor-effect="glow"
            >
              Next Year
              <ChevronRight size={16}
                data-cursor-hover
                data-cursor-size="40"
                data-cursor-color="#fbbf24"
                data-cursor-text="Next"
                data-cursor-effect="neon"
              />
            </Button>
          </div>
        </div>
      </div>

      {/* Floating university-themed icons */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {[
          "📚", "☕", "💻", "🎓", "🎭", "🎨", "📝"
        ].map((icon, index) => (
          <motion.div
            key={index}
            className="absolute text-2xl opacity-30"
            initial={{
              x: iconPositions[index]?.x ?? 0,
              y: iconPositions[index]?.y ?? 0,
            }}
            animate={{
              x: [iconPositions[index]?.x ?? 0, iconPositions[index]?.x2 ?? 100],
              y: [iconPositions[index]?.y ?? 0, iconPositions[index]?.y2 ?? 100],
              rotate: [0, 360],
            }}
            transition={{
              duration: iconPositions[index]?.duration ?? 25,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
            data-cursor-hover
            data-cursor-size="40"
            data-cursor-color="#a78bfa"
            data-cursor-text="Fun!"
            data-cursor-effect="rainbow"
          >
            {icon}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
