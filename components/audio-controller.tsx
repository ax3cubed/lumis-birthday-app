"use client"

import { forwardRef, useImperativeHandle, useRef, useEffect, useState } from "react"

interface AudioControllerProps {
  enabled: boolean
}

const AudioController = forwardRef<any, AudioControllerProps>(({ enabled }, ref) => {
  const initialAudioRef = useRef<HTMLAudioElement | null>(null)
  const secondAudioRef = useRef<HTMLAudioElement | null>(null)
  const finalAudioRef = useRef<HTMLAudioElement | null>(null)
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
  const [initialSource, setInitialSource] = useState<MediaElementAudioSourceNode | null>(null)
  const [secondSource, setSecondSource] = useState<MediaElementAudioSourceNode | null>(null)
  const [finalSource, setFinalSource] = useState<MediaElementAudioSourceNode | null>(null)
  const [initialGain, setInitialGain] = useState<GainNode | null>(null)
  const [secondGain, setSecondGain] = useState<GainNode | null>(null)
  const [finalGain, setFinalGain] = useState<GainNode | null>(null)
  const audioInitializedRef = useRef(false)

  // Set up audio context and nodes
  useEffect(() => {
    if (!enabled || audioInitializedRef.current) return

    console.log("Initializing audio context")

    try {
      // Create audio context
      const context = new (window.AudioContext || (window as any).webkitAudioContext)()
      setAudioContext(context)

      // Resume audio context (needed for Chrome)
      if (context.state === "suspended") {
        context
          .resume()
          .then(() => {
            console.log("AudioContext resumed successfully")
          })
          .catch((err) => {
            console.error("Failed to resume AudioContext:", err)
          })
      }

      // Create audio elements with direct URLs
      initialAudioRef.current = new Audio("/audio/ambient-1.mp3")
      secondAudioRef.current = new Audio("/audio/ambient-2.mp3")
      finalAudioRef.current = new Audio("/audio/ambient-3.mp3")

      // Log audio element creation
      console.log("Audio elements created:", {
        initial: initialAudioRef.current,
        second: secondAudioRef.current,
        final: finalAudioRef.current,
      })

      // Set properties
      initialAudioRef.current.loop = true
      secondAudioRef.current.loop = true
      finalAudioRef.current.loop = true

      // Preload audio
      initialAudioRef.current.preload = "auto"
      secondAudioRef.current.preload = "auto"
      finalAudioRef.current.preload = "auto"

      // Add error event listeners to detect loading issues
      initialAudioRef.current.addEventListener("error", (e) => {
        console.error("Error loading initial audio:", e)
      })
      secondAudioRef.current.addEventListener("error", (e) => {
        console.error("Error loading second audio:", e)
      })
      finalAudioRef.current.addEventListener("error", (e) => {
        console.error("Error loading final audio:", e)
      })

      // Set volume directly on audio elements as fallback
      initialAudioRef.current.volume = 0.5
      secondAudioRef.current.volume = 0
      finalAudioRef.current.volume = 0

      // Create sources
      const initial = context.createMediaElementSource(initialAudioRef.current)
      const second = context.createMediaElementSource(secondAudioRef.current)
      const final = context.createMediaElementSource(finalAudioRef.current)

      setInitialSource(initial)
      setSecondSource(second)
      setFinalSource(final)

      // Create gain nodes
      const initialGainNode = context.createGain()
      const secondGainNode = context.createGain()
      const finalGainNode = context.createGain()

      setInitialGain(initialGainNode)
      setSecondGain(secondGainNode)
      setFinalGain(finalGainNode)

      // Set initial gain values
      initialGainNode.gain.value = 0.5
      secondGainNode.gain.value = 0
      finalGainNode.gain.value = 0

      // Connect nodes
      initial.connect(initialGainNode)
      second.connect(secondGainNode)
      final.connect(finalGainNode)

      initialGainNode.connect(context.destination)
      secondGainNode.connect(context.destination)
      finalGainNode.connect(context.destination)

      // Start playing initial audio with fade in
      initialAudioRef.current
        .play()
        .then(() => {
          console.log("Initial audio playing successfully")
          fadeGain(initialGainNode.gain, 0, 0.5, 2)
        })
        .catch((e) => {
          console.error("Audio play failed:", e)
          // Try again with user interaction
          document.addEventListener(
            "click",
            function playOnClick() {
              if (initialAudioRef.current) {
                initialAudioRef.current.play().catch((e) => console.error("Retry play failed:", e))
              }
              document.removeEventListener("click", playOnClick)
            },
            { once: true },
          )
        })

      // Also load and prepare the other audio files
      secondAudioRef.current.load()
      finalAudioRef.current.load()

      // Mark as initialized
      audioInitializedRef.current = true
    } catch (error) {
      console.error("Error setting up audio:", error)
    }

    return () => {
      // Clean up
      if (initialAudioRef.current) initialAudioRef.current.pause()
      if (secondAudioRef.current) secondAudioRef.current.pause()
      if (finalAudioRef.current) finalAudioRef.current.pause()

      if (audioContext) {
        audioContext.close()
      }
    }
  }, [enabled])

  // Helper function to fade gain
  const fadeGain = (gainNode: AudioParam, startValue: number, endValue: number, duration: number) => {
    if (!audioContext) return

    const now = audioContext.currentTime
    gainNode.setValueAtTime(startValue, now)
    gainNode.linearRampToValueAtTime(endValue, now + duration)
  }

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    // Update the playInitialLayer method to use smoother crossfading
    playInitialLayer: () => {
      console.log("playInitialLayer called", {
        initialGain: initialGain?.gain.value,
        secondGain: secondGain?.gain.value,
        finalGain: finalGain?.gain.value,
        audioContext: audioContext?.state,
      })

      if (!initialGain || !secondGain || !finalGain || !audioContext) {
        console.warn("Audio not fully initialized yet")
        return
      }

      // Smoother crossfade - fade out others, fade in initial
      fadeGain(secondGain.gain, secondGain.gain.value, 0, 1.5)
      fadeGain(finalGain.gain, finalGain.gain.value, 0, 1.5)
      fadeGain(initialGain.gain, initialGain.gain.value, 0.5, 1)

      // Ensure audio is playing
      if (initialAudioRef.current && initialAudioRef.current.paused) {
        initialAudioRef.current
          .play()
          .then(() => {
            console.log("Initial audio playing")
          })
          .catch((e) => {
            console.error("Initial audio play failed:", e)
          })
      }

      // Make sure the other tracks are loaded and playing but with zero gain
      if (secondAudioRef.current) {
        if (secondAudioRef.current.paused) {
          secondAudioRef.current.play().catch((e) => console.error("Second audio play failed:", e))
        }
      }
      if (finalAudioRef.current) {
        if (finalAudioRef.current.paused) {
          finalAudioRef.current.play().catch((e) => console.error("Final audio play failed:", e))
        }
      }
    },

    // Update the playSecondLayer method for smoother crossfading
    playSecondLayer: () => {
      console.log("playSecondLayer called", {
        initialGain: initialGain?.gain.value,
        secondGain: secondGain?.gain.value,
        finalGain: finalGain?.gain.value,
        audioContext: audioContext?.state,
      })

      if (!initialGain || !secondGain || !finalGain || !audioContext) {
        console.warn("Audio not fully initialized yet")
        return
      }

      // Smoother crossfade - fade out initial, fade in second
      fadeGain(initialGain.gain, initialGain.gain.value, 0.1, 1.5) // Keep a bit of ambient-1 in the background
      fadeGain(finalGain.gain, finalGain.gain.value, 0, 1.5)
      fadeGain(secondGain.gain, secondGain.gain.value, 0.6, 1)

      // Ensure audio is playing
      if (secondAudioRef.current && secondAudioRef.current.paused) {
        secondAudioRef.current
          .play()
          .then(() => {
            console.log("Second audio playing")
          })
          .catch((e) => {
            console.error("Second audio play failed:", e)
          })
      }

      // Make sure the other tracks are playing but with appropriate gain
      if (initialAudioRef.current && initialAudioRef.current.paused) {
        initialAudioRef.current.play().catch((e) => console.error("Initial audio play failed:", e))
      }
    },

    playFinalLayer: () => {
      console.log("playFinalLayer called", {
        initialGain: initialGain?.gain.value,
        secondGain: secondGain?.gain.value,
        finalGain: finalGain?.gain.value,
        audioContext: audioContext?.state,
      })

      if (!initialGain || !secondGain || !finalGain || !audioContext) {
        console.warn("Audio not fully initialized yet")
        return
      }

      // Fade out others, fade in final
      fadeGain(initialGain.gain, initialGain.gain.value, 0, 1)
      fadeGain(secondGain.gain, secondGain.gain.value, 0, 1)
      fadeGain(finalGain.gain, finalGain.gain.value, 0.7, 1)

      // Ensure audio is playing
      if (finalAudioRef.current && finalAudioRef.current.paused) {
        finalAudioRef.current
          .play()
          .then(() => {
            console.log("Final audio playing")
          })
          .catch((e) => {
            console.error("Final audio play failed:", e)
          })
      }
    },

    muteAll: () => {
      console.log("muteAll called")

      if (!initialGain || !secondGain || !finalGain || !audioContext) {
        console.warn("Audio not fully initialized yet")
        return
      }

      // Mute all audio
      fadeGain(initialGain.gain, initialGain.gain.value, 0, 0.5)
      fadeGain(secondGain.gain, secondGain.gain.value, 0, 0.5)
      fadeGain(finalGain.gain, finalGain.gain.value, 0, 0.5)
    },

    unmuteAll: () => {
      console.log("unmuteAll called")

      if (!initialGain || !secondGain || !finalGain || !audioContext) {
        console.warn("Audio not fully initialized yet")
        return
      }

      // Determine which layer to unmute based on current state
      if (finalAudioRef.current && !finalAudioRef.current.paused) {
        fadeGain(finalGain.gain, 0, 0.7, 0.5)
      } else if (secondAudioRef.current && !secondAudioRef.current.paused) {
        fadeGain(secondGain.gain, 0, 0.5, 0.5)
      } else {
        fadeGain(initialGain.gain, 0, 0.5, 0.5)
      }
    },
    // Add a new method to adjust the final gain based on proximity
    adjustFinalGain: (gainValue: number) => {
      if (!finalGain || !audioContext) {
        console.warn("Audio not fully initialized yet")
        return
      }

      // Make sure final audio is playing
      if (finalAudioRef.current && finalAudioRef.current.paused) {
        finalAudioRef.current
          .play()
          .then(() => console.log("Final audio playing (proximity)"))
          .catch((e) => console.error("Final audio play failed:", e))
      }

      // Set the gain directly without fading for responsive feedback
      const now = audioContext.currentTime
      finalGain.gain.setValueAtTime(gainValue, now)
    },
  }))

  // Debug audio element
  return (
    <div className="sr-only">
      {/* Hidden audio elements for debugging */}
      <audio src="/audio/ambient-1.mp3" id="debug-audio-1" loop />
      <audio src="/audio/ambient-2.mp3" id="debug-audio-2" loop />
      <audio src="/audio/ambient-3.mp3" id="debug-audio-3" loop />
    </div>
  )
})

AudioController.displayName = "AudioController"

export default AudioController
