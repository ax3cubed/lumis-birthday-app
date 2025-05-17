"use client"

import TiltedCard from "./tilted-card"

interface Toy {
  id: number
  icon: string
  name: string
  targetAge: number
  image: string
  funFact: string
}

interface TimelineToyGameProps {
  toy: Toy
}

export default function TimelineToyGame({ toy }: TimelineToyGameProps) {
  if (!toy) return null

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="w-full max-w-[300px] h-[300px] mb-4">
        <TiltedCard
          imageSrc={toy.image}
          altText={`Lumi at age ${toy.targetAge}`}
          captionText={`Age ${toy.targetAge}`}
          containerHeight="300px"
          containerWidth="100%"
          imageHeight="300px"
          imageWidth="300px"
          showMobileWarning={false}
        />
      </div>
      <div className="flex items-center justify-center mt-2 space-x-2">
        <div className="w-12 h-12 flex items-center justify-center bg-purple-900/60 rounded-full">
          <span className="text-2xl">{toy.icon}</span>
        </div>
        <h3 className="text-xl text-purple-200 font-gothic">{toy.name}</h3>
      </div>
      <p className="mt-4 text-purple-200 font-handwritten text-lg text-center">{toy.funFact}</p>
    </div>
  )
}
