"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { useAudio } from "@/hooks/little-lumis-hooks/use-audio"
import { useToyMatching } from "@/hooks/little-lumis-hooks/use-toy-matching"
import StarBackground from "@/components/little-lumi-components/childhood/star-background"
import CircularGallery from "@/components/little-lumi-components/childhood/circular-gallery"
import TimelineToyGame from "@/components/little-lumi-components/childhood/timeline-toy-game"
import { childhoodData } from "@/data/little-lumis-data/childhood-data"
import LittleLumiAudioController from "@/components/little-lumi-components/childhood/lil-audio-controller"
import PolaroidModal from "@/components/little-lumi-components/childhood/polaroid-modal"
import CustomCursor from "@/components/custom-cursor"

export default function ChildhoodPage() {
  const router = useRouter()
  const [selectedPolaroid, setSelectedPolaroid] = useState<Polaroid | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [showGallery, setShowGallery] = useState(true)
  const [showTimeline, setShowTimeline] = useState(false)
  const { matchedToys, matchToy, isGameCompleted } = useToyMatching(childhoodData)
  const { isMuted, toggleMute } = useAudio()
  const containerRef = useRef(null)

  useEffect(() => {
    // Simulate loading delay for entrance animation
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  interface Polaroid {
    image: string;
    text: string;
    age: number;
    description?: string;
    funFact: string;
    emoji: string;
  }

  const handlePolaroidClick = (polaroid: Polaroid): void => {
    setSelectedPolaroid(polaroid);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedPolaroid(null)
  }

  const handleStartGame = () => {
    // Navigate to game page
    router.push("/little-lumi/game")
  }

  const handleComplete = () => {
    // Navigate to next chapter
    router.push("/next-chapter")
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <StarBackground />

      <div className="container mx-auto px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-gothic text-purple-300 mb-2 glow-text-purple">Lil Lumi</h1>
          <p className="text-purple-200 max-w-2xl mx-auto">
            Journey through the nostalgic memories of Lumi's childhood. Explore the gallery and match her favorite toys
            to the right age.
          </p>
        </motion.div>

        {/* Custom cursor */}
        <AnimatePresence>

          <motion.div
            key={"default"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 50 }}
          >
            <CustomCursor className={""} defaultSize={128} />
          </motion.div>

        </AnimatePresence>
        <AnimatePresence mode="wait">
          {showGallery && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0 }}
              animate={{ opacity: isLoaded ? 1 : 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.8 }}
            >
              <div ref={containerRef} className="relative h-[500px] md:h-[600px] mb-12">
                <CircularGallery
                  items={childhoodData.map((item) => ({
                    image: item.image,
                    text: `Age ${item.age}`,
                  }))}
                  bend={3}
                  textColor="#e9d5ff" // purple-200
                  borderRadius={0.05}
                  onPolaroidClick={handlePolaroidClick}
                />
              </div>

              <motion.div
                className="flex justify-center mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <motion.button
                  onClick={handleStartGame}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-400 text-white font-medium rounded-full shadow-lg hover:shadow-purple-500/30 transition-all"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(168, 85, 247, 0.5)" }}
                  whileTap={{ scale: 0.98 }}
                  data-cursor-hover
               
                  data-cursor-color="#A855F7"
                  data-cursor-text="Start Game"
                  data-cusor-width="100"
                >
                  Start Game
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {showTimeline && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <TimelineToyGame
                toys={childhoodData.map(item => ({
                  id: item.toy.id,
                  icon: item.toy.icon,
                  name: item.toy.name,
                  targetAge: item.toy.targetAge,
                  image: item.image,
                  funFact: item.funFact
                }))}
                onMatchToy={matchToy}
                matchedToys={matchedToys}
                isCompleted={isGameCompleted}
                onComplete={handleComplete}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isModalOpen && selectedPolaroid && <PolaroidModal polaroid={selectedPolaroid} onClose={closeModal} />}
      </AnimatePresence>

      <LittleLumiAudioController isMuted={isMuted} toggleMute={toggleMute} isGameCompleted={isGameCompleted} />

      <div className="absolute bottom-4 right-4 text-purple-400 text-sm opacity-70">
        <p>Best experienced on desktop for full interactivity</p>
      </div>
    </main>
  )
}
