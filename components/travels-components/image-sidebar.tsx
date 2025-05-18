"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Media {
  id: string
  mediaType: "image" | "video"
  src: string // Can be image or video
  alt: string
  caption: string
}

interface ImageSidebarProps {
  isOpen: boolean
  onClose: () => void
  mediaFiles: Media[]
  onImageClick: (index: number) => void
  cityName: string
}

export default function ImageSidebar({ isOpen, onClose, mediaFiles, onImageClick, cityName }: ImageSidebarProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <motion.div
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            className="fixed left-0 top-0 z-40 h-full w-64 bg-black/80 p-4 backdrop-blur-md"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">{cityName} Gallery</h2>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-white">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="mt-6 flex flex-col gap-4 overflow-y-auto pb-20">
              {mediaFiles.map((media, index) => (
                <motion.div
                  key={media.id}
                  className="group cursor-pointer overflow-hidden rounded-md"
                  whileHover={{ scale: 1.03 }}
                  onClick={() => onImageClick(index)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="relative aspect-video w-full overflow-hidden rounded-md">
                    {media.mediaType === "video" ? (
                      <video
                        loop
                        autoPlay
                        muted
                        src={media.src}
                        controls
                        className="h-full w-full object-cover"
                        poster={"https://raw.githubusercontent.com/jemmy344/cdn-images/refs/heads/main/paris.jpg"}
                      />
                    ) : (
                      <img
                        src={media.src || "https://raw.githubusercontent.com/jemmy344/cdn-images/refs/heads/main/paris.jpg"}
                        alt={media.alt}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <p className="absolute bottom-2 left-2 right-2 text-sm font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      {media.caption}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
