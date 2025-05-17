"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { useAudioContext } from "./audio-context"

type WeatherType = "rain" | "snow" | null

interface WeatherContextType {
  activeWeather: WeatherType
  triggerWeather: (type: WeatherType) => void
  clearWeather: () => void
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined)

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [activeWeather, setActiveWeather] = useState<WeatherType>(null)
  const { playSound, stopSound } = useAudioContext()

  const triggerWeather = useCallback(
    (type: WeatherType) => {
      // Clear any existing weather first
      if (activeWeather) {
        stopSound(activeWeather)
      }

      setActiveWeather(type)

      if (type) {
        playSound(type)
      }
    },
    [activeWeather, playSound, stopSound],
  )

  const clearWeather = useCallback(() => {
    if (activeWeather) {
      stopSound(activeWeather)
    }
    setActiveWeather(null)
  }, [activeWeather, stopSound])

  return (
    <WeatherContext.Provider value={{ activeWeather, triggerWeather, clearWeather }}>
      {children}
    </WeatherContext.Provider>
  )
}

export function useWeatherContext() {
  const context = useContext(WeatherContext)
  if (context === undefined) {
    throw new Error("useWeatherContext must be used within a WeatherProvider")
  }
  return context
}
