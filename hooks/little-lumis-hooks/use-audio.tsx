"use client"

import { useState, useEffect } from "react"

export function useAudio() {
  const [isMuted, setIsMuted] = useState(false)

  // Load mute preference from localStorage
  useEffect(() => {
    const savedMuteState = localStorage.getItem("lil-lumi-muted")
    if (savedMuteState) {
      setIsMuted(savedMuteState === "true")
    }
  }, [])

  // Save mute preference to localStorage
  const toggleMute = () => {
    const newMuteState = !isMuted
    setIsMuted(newMuteState)
    localStorage.setItem("lil-lumi-muted", newMuteState.toString())
  }

  return {
    isMuted,
    toggleMute,
  }
}
