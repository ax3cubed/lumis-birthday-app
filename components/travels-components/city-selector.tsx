"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface CitySelectorProps {
  cities: Array<{
    id: string
    name: string
    image: string
  }>
  currentIndex: number
  onChange: (index: number) => void
  isTransitioning: boolean
}

export default function CitySelector({ cities, currentIndex, onChange, isTransitioning }: CitySelectorProps) {
  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-center gap-4">
        {cities.map((city, index) => (
          <motion.div
            key={city.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.1 * index,
            }}
          >
            <Card
              className={cn(
                "group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg",
                currentIndex === index ? "border-2 border-white/70 bg-white/20" : "border border-white/20 bg-black/40",
              )}
              onClick={() => !isTransitioning && onChange(index)}
            >
              <CardContent className="relative p-0">
                <div
                  className="h-20 w-32 bg-cover bg-center transition-transform duration-500 group-hover:scale-110 md:h-24 md:w-40"
                  style={{ backgroundImage: `url(${city.image})` }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 p-2 text-center">
                  <span className="text-sm font-bold text-white md:text-base">{city.name}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
