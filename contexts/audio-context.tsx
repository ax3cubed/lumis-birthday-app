"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type SoundType = "ambient" | "rain" | "snow" | "click" | "close"

interface AudioContextType {
  isMuted: boolean
  toggleMute: () => void
  playSound: (type: SoundType) => void
  stopSound: (type: SoundType) => void
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isMuted, setIsMuted] = useState(true) // Default to muted
  const [audioElements, setAudioElements] = useState<Record<SoundType, HTMLAudioElement | null>>({
    ambient: null,
    rain: null,
    snow: null,
    click: null,
    close: null,
  })

  // Initialize audio elements
  useEffect(() => {
    if (typeof window === "undefined") return

    const ambient = new Audio("/sounds/ambient-city.mp3")
    ambient.loop = true
    ambient.volume = 0.3

    const rain = new Audio("/sounds/rain.mp3")
    rain.loop = true
    rain.volume = 0.4

    const snow = new Audio("/sounds/snow-wind.mp3")
    snow.loop = true
    snow.volume = 0.3

    const click = new Audio("/sounds/click.mp3")
    click.volume = 0.5

    const close = new Audio("/sounds/close.mp3")
    close.volume = 0.5

    setAudioElements({
      ambient,
      rain,
      snow,
      click,
      close,
    })

    // Start ambient sound (will be muted initially)
    ambient.play().catch((e) => console.log("Audio play prevented:", e))

    return () => {
      ambient.pause()
      rain.pause()
      snow.pause()
    }
  }, [])

  // Update mute state for all audio elements
  useEffect(() => {
    Object.values(audioElements).forEach((audio) => {
      if (audio) {
        audio.muted = isMuted
      }
    })
  }, [isMuted, audioElements])

  const toggleMute = () => {
    setIsMuted((prev) => !prev)
  }

  const playSound = (type: SoundType) => {
    const audio = audioElements[type]
    if (!audio) return

    if (type === "click" || type === "close") {
      audio.currentTime = 0
      audio.play().catch((e) => console.log("Audio play prevented:", e))
    } else {
      audio.play().catch((e) => console.log("Audio play prevented:", e))
    }
  }

  const stopSound = (type: SoundType) => {
    const audio = audioElements[type]
    if (!audio) return

    if (type !== "click" && type !== "close") {
      audio.pause()
      if (type !== "ambient") {
        audio.currentTime = 0
      }
    }
  }

  return <AudioContext.Provider value={{ isMuted, toggleMute, playSound, stopSound }}>{children}</AudioContext.Provider>
}

export function useAudioContext() {
  const context = useContext(AudioContext)
  if (context === undefined) {
    throw new Error("useAudioContext must be used within an AudioProvider")
  }
  return context
}
