"use client"

import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"

interface YearItem {
  year: number
  description: string
}

interface TimelineProps {
  years: YearItem[]
  activeYear: number
  onYearClick: (year: number) => void
  completedYears: number[]
}

export default function Timeline({ years, activeYear, onYearClick, completedYears }: TimelineProps) {
  return (
    <div className="relative">
      <h2 className="text-2xl font-bold mb-6">University Journey</h2>
      <div className="relative">
        {/* Vertical line for desktop */}
        <div className="hidden md:block absolute left-4 top-2 bottom-2 w-0.5 bg-gray-700"></div>

        {/* Horizontal line for mobile */}
        <div className="md:hidden absolute left-2 right-2 top-4 h-0.5 bg-gray-700"></div>

        <div className="flex md:flex-col flex-row md:space-y-12 space-x-12 md:space-x-0">
          {years.map((yearItem) => (
            <motion.div
              key={yearItem.year}
              className={`relative flex md:flex-row flex-col items-center cursor-pointer group`}
              onClick={() => onYearClick(yearItem.year)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className={`w-8 h-8 rounded-full flex items-center justify-center z-10 
                  ${
                    activeYear === yearItem.year
                      ? "bg-purple-600 text-white"
                      : completedYears.includes(yearItem.year)
                        ? "bg-green-500 text-white"
                        : "bg-gray-700 text-gray-200"
                  } 
                  transition-colors duration-300`}
                whileHover={{
                  backgroundColor: activeYear === yearItem.year ? "#9333ea" : "#4b5563",
                  scale: 1.1,
                }}
              >
                {completedYears.includes(yearItem.year) ? (
                  <CheckCircle size={16} />
                ) : (
                  <span className="text-sm font-bold">{yearItem.year.toString().slice(2)}</span>
                )}
              </motion.div>

              <div
                className={`md:ml-4 md:mt-0 mt-2 font-medium 
                ${
                  activeYear === yearItem.year
                    ? "text-purple-400"
                    : completedYears.includes(yearItem.year)
                      ? "text-green-400"
                      : "text-gray-300"
                } 
                group-hover:text-purple-400 transition-colors duration-300`}
              >
                <div>{yearItem.year}</div>
                <div className="text-xs text-gray-400">{yearItem.description}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
