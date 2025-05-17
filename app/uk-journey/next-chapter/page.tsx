import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NextChapter() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold font-serif mb-6 text-white">Lumi's Next Chapter</h1>

        <p className="text-xl md:text-2xl mb-8 text-gray-300">The journey continues...</p>

        <div className="space-y-6 mb-12 text-lg text-gray-300">
          <p>
            After exploring the UK and creating countless memories, Lumi's adventure is just beginning. What new
            experiences await in the next chapter of this journey?
          </p>
          <p>
            Stay tuned as we continue to follow Lumi's path through life in the United Kingdom, with new milestones,
            challenges, and discoveries on the horizon.
          </p>
        </div>

        <Link href="/travels" passHref>
          <Button variant="outline" size="lg" className="gap-2">

            <span>Next Adventure Awaits!</span>
            <ArrowRight className="h-4 w-4 animate-bounce" />
          </Button>
        </Link>
      </div>
    </main>
  )
}
