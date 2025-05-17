"use client"

import { useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useWeatherContext } from "@/contexts/weather-context"

export default function WeatherEffects() {
  const { activeWeather, clearWeather } = useWeatherContext()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  // Rain animation
  useEffect(() => {
    if (!canvasRef.current || activeWeather !== "rain") return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Rain drops
    const raindrops: { x: number; y: number; length: number; speed: number; opacity: number }[] = []

    for (let i = 0; i < 100; i++) {
      raindrops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: Math.random() * 20 + 10,
        speed: Math.random() * 10 + 5,
        opacity: Math.random() * 0.5 + 0.3,
      })
    }

    const drawRain = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ctx.strokeStyle = "#6b7280"
      ctx.lineWidth = 1

      for (const drop of raindrops) {
        ctx.beginPath()
        ctx.moveTo(drop.x, drop.y)
        ctx.lineTo(drop.x, drop.y + drop.length)
        ctx.globalAlpha = drop.opacity
        ctx.stroke()

        drop.y += drop.speed

        if (drop.y > canvas.height) {
          drop.y = 0 - drop.length
          drop.x = Math.random() * canvas.width
        }
      }

      animationRef.current = requestAnimationFrame(drawRain)
    }

    drawRain()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [activeWeather])

  // Snow animation
  useEffect(() => {
    if (!canvasRef.current || activeWeather !== "snow") return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Snowflakes
    const snowflakes: {
      x: number
      y: number
      radius: number
      speed: number
      opacity: number
      swing: number
      swingSpeed: number
    }[] = []

    for (let i = 0; i < 150; i++) {
      snowflakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        speed: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.3,
        swing: 0,
        swingSpeed: Math.random() * 0.02 + 0.01,
      })
    }

    const drawSnow = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = "#f8fafc"

      for (const flake of snowflakes) {
        ctx.beginPath()
        ctx.arc(flake.x + Math.sin(flake.swing) * 10, flake.y, flake.radius, 0, Math.PI * 2)
        ctx.globalAlpha = flake.opacity
        ctx.fill()

        flake.y += flake.speed
        flake.swing += flake.swingSpeed

        if (flake.y > canvas.height) {
          flake.y = 0 - flake.radius
          flake.x = Math.random() * canvas.width
        }
      }

      animationRef.current = requestAnimationFrame(drawSnow)
    }

    drawSnow()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [activeWeather])

  // Auto-clear weather effect after 10 seconds
  useEffect(() => {
    if (!activeWeather) return

    const timer = setTimeout(() => {
      clearWeather()
    }, 10000)

    return () => clearTimeout(timer)
  }, [activeWeather, clearWeather])

  return (
    <AnimatePresence>
      {activeWeather && (
        <motion.canvas
          ref={canvasRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 pointer-events-none z-50"
        />
      )}
    </AnimatePresence>
  )
}
