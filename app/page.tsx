"use client"

import { useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAtom } from "jotai"
import { useRouter } from "next/navigation"
import CustomCursor from "@/components/custom-cursor"
import WavyBackground from "@/components/wavy-background"
import HiddenEmoji from "@/components/hidden-emoji"
import AudioController from "@/components/audio-controller"
import { gameStartedAtom, instructionsRevealedAtom, emojiFoundAtom, audioEnabledAtom } from "@/lib/atoms"

export default function Home() {
  const [gameStarted, setGameStarted] = useAtom(gameStartedAtom)
  const [instructionsRevealed, setInstructionsRevealed] = useAtom(instructionsRevealedAtom)
  const [emojiFound, setEmojiFound] = useAtom(emojiFoundAtom)
  const [audioEnabled, setAudioEnabled] = useAtom(audioEnabledAtom)
  const audioControllerRef = useRef<any>(null)
  const router = useRouter()

  // Update the audio initialization in the useEffect hook

  // Replace the existing useEffect for audio with this improved version:
  useEffect(() => {
    // Enable audio on first user interaction
    const enableOnInteraction = () => {
      setAudioEnabled(true)
      console.log("Audio enabled by user interaction")

      // Try to play audio
      if (audioControllerRef.current) {
        audioControllerRef.current.playInitialLayer()
      }

      // Remove event listeners once triggered
      document.removeEventListener("click", enableOnInteraction)
      document.removeEventListener("keydown", enableOnInteraction)
    }

    // Add event listeners for user interaction
    document.addEventListener("click", enableOnInteraction)
    document.addEventListener("keydown", enableOnInteraction)

    return () => {
      document.removeEventListener("click", enableOnInteraction)
      document.removeEventListener("keydown", enableOnInteraction)
    }
  }, [setAudioEnabled])

  // Handle initial text hover to reveal instructions
  const handleRevealInstructions = () => {
    setInstructionsRevealed(true)
  }

  // Handle start game button click
  const handleStartGame = () => {
    setGameStarted(true)
  }

  // Handle emoji found
  const handleEmojiFound = () => {
    setEmojiFound(true)
    if (audioEnabled && audioControllerRef.current) {
      audioControllerRef.current.playFinalLayer()
      console.log("Final audio layer triggered")
    }
  }

  // Handle reset game
  const handleReset = () => {
    setGameStarted(false)
    setInstructionsRevealed(false)
    setEmojiFound(false)
    setAudioEnabled(false)
    if (audioControllerRef.current) {
      // Ensure all audio is stopped and resources are released
      if (typeof audioControllerRef.current.dispose === "function") {
        audioControllerRef.current.dispose();
      }
    }
    setTimeout(() => {
      router.push("/little-lumi/childhood")
    }, 350)
  }

  // Enable audio on first user interaction
  const enableAudio = () => {
    setAudioEnabled(true)
    console.log("Audio enabled by user interaction")

    // Try to play audio
    if (audioControllerRef.current) {
      audioControllerRef.current.playInitialLayer()
      console.log("Initial audio layer triggered (user)")
    }
  }

  // Add a useEffect to listen for the custom emojiProximity event
  useEffect(() => {
    // Listen for proximity events from the HiddenEmoji component
    const handleEmojiProximity = (e: CustomEvent) => {
      if (audioEnabled && audioControllerRef.current && gameStarted && !emojiFound) {
        const { distance, proximity } = e.detail

        // If we're very close to the emoji, start transitioning to ambient-3
        if (distance < 100) {
          // Adjust the gain of ambient-3 based on proximity
          audioControllerRef.current.adjustFinalGain(proximity * 0.5)
          console.log(`Proximity to emoji: ${proximity.toFixed(2)}, adjusting ambient-3 gain`)
        }
      }
    }

    // Add event listener for the custom event
    window.addEventListener("emojiProximity", handleEmojiProximity as EventListener)

    return () => {
      window.removeEventListener("emojiProximity", handleEmojiProximity as EventListener)
    }
  }, [audioEnabled, gameStarted, emojiFound])

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black text-white">
      {/* Wavy background */}
      <WavyBackground
        lineColor="rgba(255, 255, 255, 0.3)"
        backgroundColor="rgba(0, 0, 0, 0.9)"
        waveSpeedX={0.02}
        waveSpeedY={0.01}
        waveAmpX={40}
        waveAmpY={20}
        friction={0.9}
        tension={0.01}
        maxCursorMove={120}
        xGap={12}
        yGap={36}
      />

      {/* Vignette effect */}
      <div className="absolute inset-0 pointer-events-none bg-radial-gradient" />

      {/* Audio controller (hidden) */}
      <AudioController ref={audioControllerRef} enabled={audioEnabled} />

      {/* Custom cursor */}
      <AnimatePresence>
        {(gameStarted || !gameStarted) && (
          <motion.div
            key={gameStarted ? "torch" : "default"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 50 }}
          >
            <CustomCursor className={gameStarted ? "cursor-torch" : ""} defaultSize={128} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {!gameStarted && !emojiFound && (
            <motion.div
              key="initial"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center relative w-full h-full flex items-center justify-center"
            >
              {/* Base content - visible by default */}
              <div
                className="text-3xl md:text-5xl font-gothic gothic-glow mb-8 animate-float max-w-md"
                data-cursor-hover
                data-cursor-size="128"
                data-cursor-color="rgba(255, 255, 255, 0.5)"
                data-cursor-clip-target="reveal-text"
                onClick={enableAudio}
                onMouseEnter={(e) => {
                  handleRevealInstructions()
                  // Crossfade to ambient-2 when hovering
                  if (audioEnabled && audioControllerRef.current) {
                    audioControllerRef.current.playSecondLayer()
                    console.log("Hover: crossfade to ambient-2")
                  }
                }}
                onMouseLeave={(e) => {
                  // Crossfade back to ambient-1 when not hovering
                  if (audioEnabled && audioControllerRef.current && !gameStarted) {
                    audioControllerRef.current.playInitialLayer()
                    console.log("Hover out: crossfade back to ambient-1")
                  }
                }}
              >
                Hey Lumi, Hover to see something cool!
              </div>

              {/* Hidden reveal content - only visible through mask */}
              <div
                id="reveal-text"
                className="absolute inset-0 flex items-center justify-center opacity-0"
                style={{
                  visibility: "hidden",
                  backgroundColor: "rgba(0, 0, 0, 0.9)",
                }}
              >
                <div className="flex flex-col items-center justify-center max-w-sm">
                  <div className="text-2xl md:text-4xl font-gothic gothic-glow-eerie mb-8 text-center">
                    Let&apos;s play a game... Find the hidden emoji
                  </div>
                  <button
                    onClick={handleStartGame}
                    className="px-6 py-3 bg-gray-900 bg-opacity-30 border border-gray-500 rounded-lg text-white hover:bg-gray-800 transition-colors font-gothic"
                    data-cursor-hover
                    data-cursor-text="Start"
                  >
                    Start Game
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {gameStarted && !emojiFound && (
            <motion.div
              key="game"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full"
            >
              <HiddenEmoji onFound={handleEmojiFound} />
            </motion.div>
          )}

          {emojiFound && (
            <motion.div
              key="found"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="text-4xl md:text-6xl font-gothic gothic-glow mb-8 text-white max-w-sm mx-auto"
              >
                Found me!
              </motion.div>

              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
                onClick={handleReset}
                className="px-6 py-3 bg-gray-900 bg-opacity-30 border border-gray-500 rounded-lg text-white hover:bg-gray-800 transition-colors font-gothic"
                data-cursor-hover
                data-cursor-text="Next Adventure"
              >
                Next Adventure
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Audio status indicator */}
      <div className="fixed top-4 right-4 z-20 flex items-center">
        <div className={`w-3 h-3 rounded-full mr-2 ${audioEnabled ? "bg-green-500" : "bg-red-500"}`}></div>
        <span className="text-xs font-gothic">Audio: {audioEnabled ? "On" : "Off"}</span>
      </div>

      {/* Mute button */}
      <button
        onClick={() => {
          const newState = !audioEnabled
          setAudioEnabled(newState)
          console.log(`Audio ${newState ? "enabled" : "disabled"} by mute button`)

          if (audioControllerRef.current) {
            if (newState) {
              audioControllerRef.current.unmuteAll()
              if (gameStarted && !emojiFound) {
                audioControllerRef.current.playSecondLayer()
              } else if (emojiFound) {
                audioControllerRef.current.playFinalLayer()
              } else {
                audioControllerRef.current.playInitialLayer()
              }
            } else {
              audioControllerRef.current.muteAll()
            }
          }
        }}
        className="absolute bottom-4 right-4 z-20 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-colors"
        data-cursor-hover
        data-cursor-text={audioEnabled ? "Mute" : "Unmute"}
      >
        {audioEnabled ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        )}
      </button>
    </main>
  )
}
