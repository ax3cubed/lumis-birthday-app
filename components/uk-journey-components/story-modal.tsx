"use client"

import { useState } from "react"
import { X, Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Milestone } from "@/types/milestone"
import MilestoneCarousel from "@/components/uk-journey-components/milestone-carousel"

interface StoryModalProps {
  milestone: Milestone
  onClose: () => void
}

export default function StoryModal({ milestone, onClose }: StoryModalProps) {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)

  const toggleAudio = () => {
    setIsAudioPlaying(!isAudioPlaying)
    // Audio playback logic would go here
  }

  return (
    <div className="relative bg-gray-900 text-white">
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        {milestone.audio && (
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 border-none"
            onClick={toggleAudio}
          >
            {isAudioPlaying ? <Pause className="h-4 w-4 text-white" /> : <Play className="h-4 w-4 text-white" />}
          </Button>
        )}
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 border-none"
          onClick={onClose}
        >
          <X className="h-4 w-4 text-white" />
        </Button>
      </div>

      <div className="mb-6">
        <MilestoneCarousel milestone={milestone} />
      </div>

      <div className="p-6">
        <div className="inline-block px-3 py-1 bg-amber-500 text-white text-sm font-medium rounded-full mb-2">
          {milestone.date}
        </div>
        <h2 className="text-white text-2xl md:text-3xl font-bold font-serif mb-4">{milestone.title}</h2>

        <div className="prose prose-invert max-w-none">
          <p className="text-lg italic font-serif mb-4">"{milestone.quote}"</p>
          <p className="text-gray-300">{milestone.description}</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {milestone.tags?.map((tag, index) => (
            <span key={index} className="px-3 py-1 bg-gray-800 text-gray-200 text-sm rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
