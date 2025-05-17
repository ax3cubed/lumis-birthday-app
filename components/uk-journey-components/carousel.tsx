"use client"

import { useEffect, useState, useRef, useMemo } from "react"
import { motion, useMotionValue, useTransform } from "framer-motion"
// replace icons with your own if needed
// import { FiCircle, FiCode, FiFileText, FiLayers, FiLayout } from "react-icons/fi"

const DRAG_BUFFER = 0
const VELOCITY_THRESHOLD = 500
const GAP = 16
const SPRING_OPTIONS = { type: "spring", stiffness: 300, damping: 30 }

interface CarouselItem {
  title?: string;
  render?: () => React.ReactNode;
  [key: string]: any;
}

export default function Carousel({
  items = [] as CarouselItem[],
  baseWidth = 300,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  loop = false,
  round = false,
}) {
  const containerPadding = 16
  const itemWidth = baseWidth - containerPadding * 2
  const trackItemOffset = itemWidth + GAP

  const carouselItems = loop ? [...items, items[0]] : items
  const [currentIndex, setCurrentIndex] = useState(0)
  const x = useMotionValue(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  const containerRef = useRef<HTMLDivElement | null>(null)

  const ranges = useMemo(() => {
    return carouselItems.map((_, index) => {
      return [-(index + 1) * trackItemOffset, -index * trackItemOffset, -(index - 1) * trackItemOffset]
    })
  }, [carouselItems, trackItemOffset])

  useEffect(() => {
    if (pauseOnHover && containerRef.current) {
      const container = containerRef.current
      const handleMouseEnter = () => setIsHovered(true)
      const handleMouseLeave = () => setIsHovered(false)
      container.addEventListener("mouseenter", handleMouseEnter)
      container.addEventListener("mouseleave", handleMouseLeave)
      return () => {
        container.removeEventListener("mouseenter", handleMouseEnter)
        container.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [pauseOnHover])

  useEffect(() => {
    if (autoplay && (!pauseOnHover || !isHovered)) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev === items.length - 1 && loop) {
            return prev + 1 // Animate to clone.
          }
          if (prev === carouselItems.length - 1) {
            return loop ? 0 : prev
          }
          return prev + 1
        })
      }, autoplayDelay)
      return () => clearInterval(timer)
    }
  }, [autoplay, autoplayDelay, isHovered, loop, items.length, carouselItems.length, pauseOnHover])

  const effectiveTransition = isResetting ? { duration: 0 } : SPRING_OPTIONS

  const handleAnimationComplete = () => {
    if (loop && currentIndex === carouselItems.length - 1) {
      setIsResetting(true)
      x.set(0)
      setCurrentIndex(0)
      setTimeout(() => setIsResetting(false), 50)
    }
  }

  interface DragEndInfo {
    offset: {
      x: number;
    };
    velocity: {
      x: number;
    };
  }

  const handleDragEnd = (_: any, info: DragEndInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    if (offset < -DRAG_BUFFER || velocity < -VELOCITY_THRESHOLD) {
      if (loop && currentIndex === items.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex((prev) => Math.min(prev + 1, carouselItems.length - 1));
      }
    } else if (offset > DRAG_BUFFER || velocity > VELOCITY_THRESHOLD) {
      if (loop && currentIndex === 0) {
        setCurrentIndex(items.length - 1);
      } else {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
      }
    }
  };

  const dragProps = loop
    ? {}
    : {
        dragConstraints: {
          left: -trackItemOffset * (carouselItems.length - 1),
          right: 0,
        },
      }

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden p-4 rounded-[24px] border border-[#333]"
      style={{
        width: `${baseWidth}px`,
        height: `${round ? baseWidth : baseWidth * 0.75}px`,
      }}
    >
      <motion.div
        className="flex"
        drag="x"
        {...dragProps}
        style={{
          width: itemWidth,
          gap: `${GAP}px`,
          perspective: 1000,
          perspectiveOrigin: `${currentIndex * trackItemOffset + itemWidth / 2}px 50%`,
          x,
        }}
        onDragEnd={handleDragEnd}
        animate={{ x: -(currentIndex * trackItemOffset) }}
        transition={effectiveTransition}
        onAnimationComplete={handleAnimationComplete}
      >
        {carouselItems.map((item, index) => {
          const outputRange = [90, 0, -90]
          const rotateY = useTransform(x, ranges[index], outputRange, { clamp: false })
          return (
            <motion.div
              key={index}
              className="relative shrink-0 overflow-hidden cursor-grab active:cursor-grabbing rounded-[12px]"
              style={{
                width: itemWidth,
                height: round ? itemWidth : itemWidth * 0.75,
                rotateY: rotateY,
                ...(round && { borderRadius: "50%" }),
              }}
              transition={effectiveTransition}
            >
              {/* Render the custom content if provided, otherwise just render the item */}
              {item.render ? item.render() : <div className="w-full h-full bg-gray-800">{item.title}</div>}
            </motion.div>
          )
        })}
      </motion.div>
      <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10">
        <div className="flex gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full">
          {items.map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 w-2 rounded-full cursor-pointer transition-colors duration-150 ${
                currentIndex % items.length === index ? "bg-white" : "bg-white/40"
              }`}
              animate={{
                scale: currentIndex % items.length === index ? 1.2 : 1,
              }}
              onClick={() => setCurrentIndex(index)}
              transition={{ duration: 0.15 }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
