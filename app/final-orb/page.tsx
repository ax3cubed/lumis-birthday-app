"use client"
import LoveLetterExperience from "@/components/final-orb-components/LoveLetterExperience"
import dynamic from "next/dynamic"
import { Suspense } from "react"
 
const Globe = dynamic(() => import("@/components/final-orb-components/Globe"), { ssr: false })

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black overflow-hidden">
      <Suspense fallback={<div>Loading...</div>}>
        <Globe />
      </Suspense>
      <LoveLetterExperience />
    </main>
  )
}
