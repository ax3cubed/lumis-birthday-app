import { Suspense } from "react"
import JourneyMap from "@/components/uk-journey-components/journey-map"
import AudioController from "@/components/uk-journey-components/uk-audio-controller"
import WeatherEffects from "@/components/uk-journey-components/weather-effects"
import { Toaster } from "@/components/ui/toaster"
import AnimatedTitle from "@/components/uk-journey-components/animated-title"
import { AudioProvider } from "@/contexts/audio-context"
import { WeatherProvider } from "@/contexts/weather-context"

export default function Home() {
  return (
    <AudioProvider>
      <WeatherProvider>
        <main className="min-h-screen bg-black text-white">
          <div className="container mx-auto px-4 py-8">
            <section className="mb-12">
              <AnimatedTitle
                title="Lumi Takes the UK"
                subtitle="Follow Lumi's journey through the United Kingdom, exploring milestones, memories, and the occasional weather surprise along the way."
              />
            </section>

            <section className="relative mb-20">
              <div className="sticky top-4 z-10 flex justify-end mb-4">
                <AudioController />
              </div>

              <div className="relative bg-gray-900 rounded-lg border border-gray-800 shadow-xl p-4 md:p-8 overflow-hidden">
                <Suspense
                  fallback={<div className="h-[600px] flex items-center justify-center">Loading journey map...</div>}
                >
                  <JourneyMap />
                </Suspense>
              </div>
            </section>
          </div>

          <WeatherEffects />
          <Toaster />
        </main>
      </WeatherProvider>
    </AudioProvider>
  )
}
