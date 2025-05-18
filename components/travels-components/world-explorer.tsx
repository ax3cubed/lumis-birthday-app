"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Loader2, Menu } from "lucide-react"
import ThreeScene from "@/components/travels-components/three-scene"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import ImageSidebar from "@/components/travels-components/image-sidebar"
import ImageCarousel from "@/components/travels-components/image-carousel"
import { useRouter } from "next/navigation"
import { getCDNUrl } from "@/lib/utils"
import { get } from "http"

// Define city data
type City = {
  id: string
  name: string
  image: string
  gallery: GalleryImage[]
}
type GalleryImage = {
  id: string
  src: string
  alt: string
  caption: string
  mediaType: "image" | "video"
}
const cities: City[] = [
  {
    id: "paris",
    name: "PARIS",
    image: "https://raw.githubusercontent.com/jemmy344/cdn-images/refs/heads/main/paris.jpg",
    gallery: [
      {
        id: "paris-1",
        src: getCDNUrl("paris/paris1.mp4"),
        alt: "Disney Park",
        caption: "Disney park",
        mediaType: "video",
      },
      {
        id: "paris-2",
        src: getCDNUrl("paris/paris2.jpg"),
        alt: "Arc de Triomphe",
        caption: "Arc de Triomphe",
        mediaType: "image",
      },
      {
        id: "paris-3",
        src: getCDNUrl("paris/paris4.jpg"),
        alt: "Notre-Dame Cathedral",
        caption: "Notre-Dame Cathedral",
        mediaType: "image",
      },
      {
        id: "paris-4",
        src: getCDNUrl("paris/paris45.jpg"),
        alt: "Louvre Museum",
        caption: "Disneyland Paris",
        mediaType: "image",
      },
      {
        id: "paris-5",
        src: getCDNUrl("paris/paris5.jpg"),
        alt: "The iconic Eiffel Tower",
        caption: "The iconic Eiffel Tower",
        mediaType: "image",
      },
      {
        id: "paris-6",
        src: getCDNUrl("paris/paris55.jpg"),
        alt: "The iconic Eiffel Tower",
        caption: "The iconic Eiffel Tower",
        mediaType: "image",
      },
      {
        id: "paris-7",
        src: getCDNUrl("paris/paris555.jpg"),
        alt: "The iconic Eiffel Tower",
        caption: "The iconic Eiffel Tower",
        mediaType: "image",
      },
      {
        id: "paris-8",
        src: getCDNUrl("paris/paris56.jpg"),
        alt: "The iconic Eiffel Tower",
        caption: "The iconic Eiffel Tower",
        mediaType: "image",
      },
      {
        id: "paris-9",
        src: getCDNUrl("paris/paris6.jpg"),
        alt: "The iconic Eiffel Tower",
        caption: "The iconic Eiffel Tower",
        mediaType: "image",
      },
      {
        id: "paris-10",
        src: getCDNUrl("paris/paris67.jpg"),
        alt: "The iconic Eiffel Tower",
        caption: "The iconic Eiffel Tower",
        mediaType: "image",
      },
      {
        id: "paris-11",
        src: getCDNUrl("paris/paris70.jpg"),
        alt: "The iconic Eiffel Tower",
        caption: "The iconic Eiffel Tower",
        mediaType: "image",
      },
      {
        id: "paris-12",
        src: getCDNUrl("paris/paris890.jpg"),
        alt: "The iconic Eiffel Tower",
        caption: "The iconic Eiffel Tower",
        mediaType: "image",
      },
{
        id: "paris-13",
        src: getCDNUrl("paris/parisb.jpg"),
        alt: "The iconic Eiffel Tower",
        caption: "The iconic Eiffel Tower",
        mediaType: "image",
      },
    ],
  },
  {
    id: "amsterdam",
    name: "AMSTERDAM",
    image: "https://raw.githubusercontent.com/jemmy344/cdn-images/refs/heads/main/amsterdam-night.jpg",
    gallery: [
      {
        id: "amsterdam-1",
        src: getCDNUrl("amst/ams1.jpg"),
        alt: "Amsterdam Canals",
        caption: "Amsterdam's beautiful canals",
        mediaType: "image",
      },
      {
        id: "amsterdam-2",
        src: getCDNUrl("amst/ams2.jpg"),
        alt: "Bicycles of Amsterdam",
        caption: "Bicycles of Amsterdam",
        mediaType: "image",
      },
      {
        id: "amsterdam-3",
        src: getCDNUrl("amst/ams3.jpg"),
        alt: "Amsterdam Houses",
        caption: "Traditional Amsterdam houses",
        mediaType: "image",
      },
      {
        id: "amsterdam-4",
        src: getCDNUrl("amst/ams4.jpg"),
        alt: "Rijksmuseum",
        caption: "The Rijksmuseum",
        mediaType: "image",
      },
      {
        id: "amsterdam-5",
        src: getCDNUrl("amst/ams5.jpg"),  
        alt: "Amsterdam at Night",
        caption: "Amsterdam at night",
        mediaType: "image",
      },
    ],
  },
  {
    id: "belgium",
    name: "BELGIUM",
    image: "https://raw.githubusercontent.com/jemmy344/cdn-images/refs/heads/main/belgium.jpg",
    gallery: [
      {
        id: "belgium-1",
        src: "https://images.unsplash.com/photo-1491557345352-5929e343eb89",
        alt: "Grand Place Brussels",
        caption: "Grand Place, Brussels",
        mediaType: "image",
      },
      {
        id: "belgium-2",
        src: "https://raw.githubusercontent.com/jemmy344/cdn-images/refs/heads/main/belgium.jpg",
        alt: "Bruges Canals",
        caption: "The canals of Bruges",
        mediaType: "image",
      },
      {
        id: "belgium-3",
        src: "https://images.unsplash.com/photo-1561572020-1f8b2c3d4e5a",
        alt: "Atomium",
        caption: "The Atomium in Brussels",
        mediaType: "image",
      },
      {
        id: "belgium-4",
        src: "https://images.unsplash.com/photo-1587789202069-f57c846b85db",
        alt: "Ghent",
        caption: "Historic city of Ghent",
        mediaType: "image",
      },
      {
        id: "belgium-5",
        src: "https://images.unsplash.com/photo-1583552184141-d2a3fe2a0f91",
        alt: "Belgian Chocolate",
        caption: "Famous Belgian chocolate",
        mediaType: "image",
      },
    ],
  },
]

export default function WorldExplorer() {
  const [currentCityIndex, setCurrentCityIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [carouselOpen, setCarouselOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const router = useRouter()
  // Preload images
  useEffect(() => {
    const imagePromises = cities.map((city) => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = city.image
        img.onload = resolve
        img.onerror = reject
      })
    })

    Promise.all(imagePromises)
      .then(() => {
        setTimeout(() => setIsLoading(false), 1000) // Add a small delay for smoother UX
      })
      .catch((error) => {
        console.error("Failed to load images:", error)
        setIsLoading(false)
      })
  }, [])

  const handleCityChange = (index: number) => {
    if (isTransitioning || index === currentCityIndex) return

    setIsTransitioning(true)
    setCurrentCityIndex(index)

    // End transition after animation completes
    setTimeout(() => {
      setIsTransitioning(false)
    }, 1500) // Match this with the GSAP animation duration
  }

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index)
    setCarouselOpen(true)
  }

  const currentCity = cities[currentCityIndex]

  useEffect(() => {
    // Reset sidebar state when city changes
    setIsSidebarOpen(true)
    setCarouselOpen(false)
    setSelectedImageIndex(0)

  }, [currentCityIndex])
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-white" />
          <p className="text-lg text-white">Loading 3D Worlds...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Three.js Scene */}
      <ThreeScene currentCity={currentCity} isTransitioning={isTransitioning} />

      {/* Transition Overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Toggle Button */}
      <div className="absolute left-4 top-4 z-20">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="bg-black/30 backdrop-blur-sm hover:bg-black/50"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle image gallery</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Image Sidebar */}
      <ImageSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        mediaFiles={currentCity.gallery}
        onImageClick={handleImageClick}
        cityName={currentCity.name}
      />

      {/* Image Carousel */}
      <ImageCarousel
        isOpen={carouselOpen}
        onClose={() => setCarouselOpen(false)}
        images={currentCity.gallery}
        initialIndex={selectedImageIndex}
      />

      {/* City Selector Buttons */}
      <div className="absolute bottom-8 left-0 right-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-4">
            {cities.map((city, index) => (
              <motion.div
                key={city.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.1 * index,
                }}
              >
                <Button
                  variant={currentCityIndex === index ? "default" : "outline"}
                  className={`relative h-14 w-32 overflow-hidden border-2 ${currentCityIndex === index ? "border-white" : "border-white/20"
                    }`}
                  onClick={() => !isTransitioning && handleCityChange(index)}
                  disabled={isTransitioning}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-50"
                    style={{ backgroundImage: `url(${city.image})` }}
                  />
                  <span className="relative z-10 font-bold">{city.name}</span>
                </Button>
              </motion.div>
            ))}
            <motion.div

              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.1 * cities.length,
              }}
            >
              <Button
                variant={"ghost"}
                className={`relative h-14 w-32 overflow-hidden border-2 border-pink-500"
                    }`}
                onClick={() => router.push("/love")}
                disabled={isTransitioning}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-50 bg-slate-600"

                />
                <span className="relative z-10 font-bold">Unto the next!</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
