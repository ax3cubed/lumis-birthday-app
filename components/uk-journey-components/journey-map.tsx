"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Panzoom } from "@/components/uk-journey-components/panzoom"
import StoryModal from "@/components/uk-journey-components/story-modal"
import NextPageButton from "@/components/uk-journey-components/next-page-button"
import { useAudioContext } from "@/contexts/audio-context"
import { useWeatherContext } from "@/contexts/weather-context"
import { milestones } from "@/data/uk-data/milestones"

// Define types for milestone and related data
type Position = {
  x: number;
  y: number;
};

type WeatherEffect = "rain" | "snow" | "fog" | "sun" | string;

type Milestone = {
  id: string;
  title: string;
  description: string;
  date: string;
  position: Position;
  weatherEffect?: WeatherEffect;
  [key: string]: any; // Allow for additional properties
};

// Define type for the color classes return object
type ColorClasses = {
  fill: string;
  stroke: string;
  innerFill: string;
  glow: string;
  hoverScale: string;
  hoverGlow: string;
};

// Define a type for milestone color assignment
type MilestoneColorMap = {
  [key: number]: string;
};

export default function JourneyMap() {
  const [selectedMilestone, setSelectedMilestone] = useState<number | null>(null)
  const [visitedMilestones, setVisitedMilestones] = useState<number[]>([])
  const [allMilestonesVisited, setAllMilestonesVisited] = useState<boolean>(false)
  const [hoveredMilestone, setHoveredMilestone] = useState<number | null>(null)
  const [milestoneColors, setMilestoneColors] = useState<MilestoneColorMap>({})
  const mapRef = useRef<SVGSVGElement>(null)
  const { playSound } = useAudioContext()
  const { triggerWeather } = useWeatherContext()

  // Available colors for milestones
  const colors: string[] = useMemo(() => [
    "amber",
    "blue",
    "emerald",
    "pink",
    "purple",
    "red",
    "teal",
    "indigo",
    "orange",
    "cyan",
    "lime",
    "fuchsia",
  ], [])

  // Check if all milestones have been visited
  useEffect(() => {
    if (visitedMilestones.length === milestones.length && !allMilestonesVisited) {
      setAllMilestonesVisited(true)
      // Play a special sound when all milestones are visited
      playSound("click")
    }
  }, [visitedMilestones, allMilestonesVisited, playSound])

  const handleMilestoneClick = (index: number): void => {
    // If milestone hasn't been visited yet, assign it a random color
    if (!visitedMilestones.includes(index)) {
      const randomColorIndex = Math.floor(Math.random() * colors.length)
      const randomColor = colors[randomColorIndex]
      
      setMilestoneColors(prev => ({
        ...prev,
        [index]: randomColor
      }))
      
      setVisitedMilestones(prev => [...prev, index])
    } else {
      // If already visited, we unvisit it (toggle behavior)
      setVisitedMilestones(prev => prev.filter(i => i !== index))
    }
    
    setSelectedMilestone(index)
    playSound("click")

    // Trigger weather effect if this milestone has one
    const milestone = milestones[index]
    if (milestone.weatherEffect) {
      triggerWeather(milestone.weatherEffect)
      if (milestone.weatherEffect === "rain") {
        playSound("rain")
      } else if (milestone.weatherEffect === "snow") {
        playSound("snow")
      }
    }
  }

  const closeModal = (): void => {
    setSelectedMilestone(null)
    playSound("close")
  }

  // Define map lines to connect milestones in a meaningful way
  const mapLines: string[] = [
    // Main journey line
    "M 100,100 L 200,200 L 300,150 L 400,180 L 500,220 L 600,250 L 700,300 L 800,350",
    // London and surrounding areas
    "M 250,400 L 350,450 L 450,500 L 550,550 L 650,600 L 750,650",
    // Winter events and holidays
    "M 500,220 L 350,250 L 250,350 L 450,200",
    // Later milestones
    "M 550,150 L 650,200 L 750,250 L 850,300",
    // Final chapter
    "M 150,500 L 250,550 L 350,600 L 400,650 L 450,700 L 550,750",
  ]

  const getColorClasses = (index: number, isVisited: boolean, isHovered: boolean): ColorClasses => {
    // Use the randomly assigned color for this milestone if it exists
    const colorName: string = isVisited 
      ? milestoneColors[index] || colors[0] // Fallback to first color if somehow not assigned
      : "gray";
    
    const glowIntensity = isHovered ? "16px" : "8px";
    
    return {
      fill: isVisited ? `fill-${colorName}-500` : "fill-gray-700",
      stroke: isVisited ? `stroke-${colorName}-600` : "stroke-gray-500",
      innerFill: isVisited ? `fill-${colorName}-600` : "fill-gray-600",
      glow: colorName,
      hoverScale: isHovered ? "scale-110" : "scale-100",
      hoverGlow: isHovered ? "filter drop-shadow(0 0 12px currentColor)" : ""
    }
  }

  return (
    <div className="relative h-[600px] md:h-[800px] w-full">
      <Panzoom>
        <svg ref={mapRef} className="w-full h-full" viewBox="0 0 1000 800" preserveAspectRatio="xMidYMid meet">
          {/* Map Background */}
          <rect x="0" y="0" width="1000" height="800" fill="#111" />

          {/* Map Lines */}
          <g className="tube-lines">
            {mapLines.map((path, index) => (
              <path
                key={index}
                d={path}
                stroke="#444"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </g>

          {/* Milestone Stations */}
          <g className="stations">
            {milestones.map((milestone, index) => {
              const isVisited = visitedMilestones.includes(index)
              const isHovered = hoveredMilestone === index
              const classes = getColorClasses(index, isVisited, isHovered)
              
              return (
                <g
                  key={index}
                  className={`station-group cursor-pointer transition-all duration-300 ${classes.hoverScale} ${classes.hoverGlow}`}
                  onClick={() => handleMilestoneClick(index)}
                  onMouseEnter={() => setHoveredMilestone(index)}
                  onMouseLeave={() => setHoveredMilestone(null)}
                  data-index={index}
                >
                  <motion.circle
                    cx={milestone.position.x}
                    cy={milestone.position.y}
                    r="18"
                    className={`station-outer transition-all duration-300 ${classes.fill} ${classes.stroke}`}
                    strokeWidth="2"
                    whileHover={{ scale: 1.1 }}
                    animate={{
                      scale: isHovered ? 1.1 : 1.0
                    }}
                    style={{
                      filter: isVisited 
                        ? `drop-shadow(0 0 ${isHovered ? '16px' : '8px'} var(--tw-${classes.glow}-500))` 
                        : isHovered 
                          ? "drop-shadow(0 0 12px #888)" 
                          : "none"
                    }}
                  />
                  <motion.circle
                    cx={milestone.position.x}
                    cy={milestone.position.y}
                    r="12"
                    className={`station-inner transition-all duration-300 ${classes.innerFill}`}
                    whileHover={{ scale: 1.1 }}
                    animate={{
                      scale: isHovered ? 1.1 : 1.0
                    }}
                  />

                  {/* Station Label */}
                  <text
                    x={milestone.position.x}
                    y={milestone.position.y + 40}
                    textAnchor="middle"
                    className="text-sm font-medium fill-gray-300 font-serif"
                  >
                    {milestone.title}
                  </text>
                </g>
              )
            })}
          </g>
        </svg>
      </Panzoom>

      {/* Next Page Button - Only show when all milestones have been visited */}
      {allMilestonesVisited && <NextPageButton />}

      {/* Story Modal */}
      <AnimatePresence>
        {selectedMilestone !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items

-center justify-center p-4 bg-black/50"
            onClick={closeModal}
          >
            <motion.div
              className="bg-gray-900 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              layoutId={`milestone-${selectedMilestone}`}
            >
              <StoryModal milestone={milestones[selectedMilestone]} onClose={closeModal} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}