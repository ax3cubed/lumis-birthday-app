"use client"
import { Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAudioContext } from "@/contexts/audio-context"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function UkJourneyAudioController() {
  const { isMuted, toggleMute } = useAudioContext()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-gray-900 border-gray-700 shadow-md hover:bg-gray-800"
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX className="h-4 w-4 text-white" /> : <Volume2 className="h-4 w-4 text-white" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isMuted ? "Unmute sounds" : "Mute sounds"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
