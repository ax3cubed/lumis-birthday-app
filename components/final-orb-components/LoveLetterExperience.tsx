"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Download, Gift, FileText } from "lucide-react"
import Typewriter from "@/components/final-orb-components/Typewriter"
import { getCDNUrl } from "@/lib/utils"

// Letter content
const letterContent = [
  "Dear Lumi,",
  "Today's not just your birthday it's a celebration of all the moments that made you who you are. The small, quiet wins. The storms you stood through. The joy and kindness you brought into every room even when you had none left for yourself.",
  "Watching you grow, cheer others on, and light up your world is one of the greatest privileges of being your friend.",
  "This space this entire project is a letter in the truest sense: full of care, detail, and the deepest admiration. I hope it reminds you how incredibly known, appreciated, and loved you are.",
  "Happy Birthday, Lumi. You are one of one.",
  "With all my heart,",
  "Your best friend/sister",
]

// Media content - supports both images and videos
const mediaContent = [
  { type: "video", src: getCDNUrl("orb/orb-1.mp4"), alt: "Memories together"},
  { type: "image", src: getCDNUrl("orb/orb-2.jpg"), alt: "Birthday video" },
  { type: "video", src: getCDNUrl("orb/orb-3.mp4"), alt: "Special moment" },
]

export default function LoveLetterExperience() {
  const [started, setStarted] = useState(false)
  const [introComplete, setIntroComplete] = useState(false)
  const [capsuleOpen, setCapsuleOpen] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Start the experience
  const startExperience = () => {
    setStarted(true)
    if (audioRef.current) {
      audioRef.current.volume = 0.3
      audioRef.current.play().catch((err) => console.log("Audio autoplay prevented:", err))
    }
  }

  // Handle intro completion
  const handleIntroComplete = () => {
    setIntroComplete(true)
  }

  // Download functions for the Lumi Capsule
  const downloadLetter = () => {
    // In a real implementation, this would generate and download a PDF
    alert("Downloading letter PDF...")
  }

  const downloadWallpaper = () => {
    // In a real implementation, this would download the wallpaper image
    alert("Downloading custom wallpaper...")
  }

  // Render media based on type
  const renderMedia = (media: { type: string; src: string; alt: string }, index: number) => {
    return (
      <motion.div
        key={`media-${index}`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="my-12 relative overflow-hidden rounded-lg"
      >
        <div className="relative overflow-hidden rounded-lg">
          {media.type === "image" ? (
            <motion.img
              src={media.src}
              alt={media.alt}
              className="w-full h-auto rounded-lg sepia hover:sepia-0 transition-all duration-1000"
              initial={{ scale: 1 }}
              animate={{ scale: 1.05 }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
            />
          ) : (
            <video src={media.src} controls autoPlay muted loop className="w-full h-auto rounded-lg" playsInline />
          )}
        </div>
      </motion.div>
    )
  }

  if (!started) {
    return (
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-10 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 2 }}
      >
        <motion.button
          onClick={startExperience}
          className="bg-transparent border border-white/30 backdrop-blur-sm px-8 py-4 rounded-full text-white font-letter text-xl hover:bg-white/10 transition-all pointer-events-auto"
          whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255, 255, 255, 0.3)" }}
          whileTap={{ scale: 0.98 }}
        >
          <FileText className="inline-block mr-2 text-blue-300" size={20} />
          Open The Final Note
        </motion.button>
      </motion.div>
    )
  }

  return (
    <>
      <audio ref={audioRef} src="/placeholder-68u0f.png" loop />

      {/* Changed from fixed to absolute positioning and added pointer-events-none */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-10 pointer-events-none" />

      {/* Added pointer-events-auto only to the content that needs interaction */}
      <div ref={containerRef} className="absolute inset-0 overflow-y-auto z-20 px-4 py-10 md:px-10 pointer-events-none">
        <AnimatePresence>
          {!introComplete ? (
            <motion.div
              className="min-h-screen flex items-center justify-center pointer-events-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              <div className="text-center">
                <Typewriter
                  text="Happy Birthday, Lumi..."
                  delay={80}
                  onComplete={handleIntroComplete}
                  className="text-3xl md:text-4xl lg:text-5xl font-letter text-white font-light tracking-wide"
                />
              </div>
            </motion.div>
          ) : (
            <div className="max-w-3xl mx-auto pointer-events-auto">
              {/* Show all paragraphs at once for better visibility */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="mb-12 bg-black/50 backdrop-blur-sm p-8 rounded-lg"
              >
                {letterContent.map((paragraph, index) => (
                  <motion.div
                    key={`paragraph-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.3 }}
                    className="mb-8"
                  >
                    {index === 0 ? (
                      <p className="text-white font-handwritten text-3xl md:text-4xl mb-6 tracking-wide">{paragraph}</p>
                    ) : index === letterContent.length - 1 || index === letterContent.length - 2 ? (
                      <p className="text-white font-handwritten text-2xl md:text-3xl leading-relaxed tracking-wide">
                        {paragraph}
                      </p>
                    ) : (
                      <p className="text-white font-letter text-xl md:text-2xl leading-relaxed tracking-wide font-light">
                        {paragraph}
                      </p>
                    )}

                    {/* Insert media after specific paragraphs */}
                    {index === 1 && mediaContent[0] && renderMedia(mediaContent[0], 0)}
                    {index === 3 && mediaContent[1] && renderMedia(mediaContent[1], 1)}
                    {index === 5 && mediaContent[2] && renderMedia(mediaContent[2], 2)}
                  </motion.div>
                ))}
              </motion.div>

              {/* The Lumi Capsule */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1 }}
                className="mt-16 mb-32 text-center bg-black/50 backdrop-blur-sm p-8 rounded-lg"
              >
                <h3 className="text-2xl md:text-3xl font-letter text-white mb-6 font-light tracking-wide">
                  The Lumi Capsule
                </h3>

                <motion.div
                  className={`relative mx-auto w-40 h-40 rounded-full flex items-center justify-center cursor-pointer ${
                    capsuleOpen ? "bg-pink-500/20" : "bg-white/10"
                  } backdrop-blur-md border border-white/20`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCapsuleOpen(!capsuleOpen)}
                >
                  <Gift
                    size={60}
                    className={`${capsuleOpen ? "text-pink-300" : "text-white"} transition-colors duration-500`}
                  />

                  {/* Particles/sparkles effect */}
                  {capsuleOpen && (
                    <div className="absolute inset-0">
                      {[...Array(12)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 bg-pink-300 rounded-full"
                          initial={{
                            x: 0,
                            y: 0,
                            opacity: 1,
                          }}
                          animate={{
                            x: Math.random() * 200 - 100,
                            y: Math.random() * 200 - 100,
                            opacity: 0,
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "loop",
                            delay: i * 0.1,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>

                {/* Capsule contents */}
                <AnimatePresence>
                  {capsuleOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.5 }}
                      className="mt-8 overflow-hidden"
                    >
                      

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-8 p-6 bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-md rounded-lg"
                      >
                        <p className="text-xl font-handwritten text-white italic tracking-wide">
                          "Through every phase, you've only grown more luminous. Happy Birthday, Lumi."
                        </p>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
