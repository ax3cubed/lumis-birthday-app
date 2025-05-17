"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"

export default function StarBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Star properties
    interface Star {
      x: number
      y: number
      size: number
      opacity: number
      twinkleSpeed: number
      twinkleDelay: number
    }

    interface ShootingStar {
      x: number
      y: number
      length: number
      speed: number
      angle: number
      opacity: number
    }

    const stars: Star[] = []
    const starCount = Math.min(300, Math.floor(window.innerWidth / 5))
    const maxSize = 2

    // Create stars
    for (let i = 0; i < starCount; i++) {
      const star = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * maxSize,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 2 + 1,
        twinkleDelay: Math.random() * 5,
      }
      stars.push(star)

      // Set up twinkling animation with GSAP
      gsap.to(star, {
        opacity: 0.2,
        duration: star.twinkleSpeed,
        delay: star.twinkleDelay,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })
    }

    // Add occasional shooting stars
    const createShootingStar = () => {
      const shootingStar = {
        x: Math.random() * canvas.width,
        y: 0,
        length: Math.random() * 80 + 50,
        speed: Math.random() * 15 + 10,
        angle: (Math.random() * 20 + 10) * (Math.PI / 180),
        opacity: 0,
      }

      // Animate shooting star
      gsap
        .timeline()
        .to(shootingStar, {
          opacity: 0.8,
          duration: 0.2,
        })
        .to(shootingStar, {
          x: shootingStar.x + Math.cos(shootingStar.angle) * 500,
          y: shootingStar.y + Math.sin(shootingStar.angle) * 500,
          opacity: 0,
          duration: shootingStar.speed / 10,
          ease: "power1.in",
          onUpdate: () => {
            // Draw shooting star trail
            if (!ctx) return;
            ctx.beginPath()
            ctx.moveTo(shootingStar.x, shootingStar.y)
            const trailX = shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length
            const trailY = shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length

            // Create gradient for trail
            const gradient = ctx.createLinearGradient(shootingStar.x, shootingStar.y, trailX, trailY)
            gradient.addColorStop(0, `rgba(255, 255, 255, ${shootingStar.opacity})`)
            gradient.addColorStop(1, "rgba(255, 255, 255, 0)")

            ctx.strokeStyle = gradient
            ctx.lineWidth = 2
            ctx.lineTo(trailX, trailY)
            ctx.stroke()
          },
        })
    }

    // Trigger shooting stars occasionally
    const shootingStarInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        createShootingStar()
      }
    }, 3000)

    // Animation loop
    const animate = () => {
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Draw stars
        stars.forEach((star) => {
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
          ctx.fill()
        })
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      clearInterval(shootingStarInterval)
      stars.forEach((star) => {
        gsap.killTweensOf(star)
      })
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ background: "black" }} />
}
