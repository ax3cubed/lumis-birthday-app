"use client"

import { useRef, useEffect } from "react"

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Particle class
    class Particle {
      x: number
      y: number
      size: number
      speedY: number
      color: string
      alpha: number

      constructor() {
        this.x = Math.random() * canvas!.width
        this.y = Math.random() * canvas!.height
        this.size = Math.random() * 3 + 0.5
        this.speedY = -Math.random() * 0.5 - 0.2
        this.alpha = Math.random() * 0.5 + 0.1
        this.color = this.getRandomColor()
      }

      getRandomColor() {
        // Fix: Ensure alpha is properly formatted as a string with fixed decimal places
        const alphaStr = this.alpha.toFixed(2)

        const colors = [
          `rgba(233, 213, 255, ${alphaStr})`, // purple-200
          `rgba(216, 180, 254, ${alphaStr})`, // purple-300
          `rgba(192, 132, 252, ${alphaStr})`, // purple-400
        ]

        return colors[Math.floor(Math.random() * colors.length)]
      }

      update() {
        this.y += this.speedY

        // Reset particle when it goes off screen
        if (this.y < -10) {
          this.y = canvas!.height + 10
          this.x = Math.random() * canvas!.width
        }
      }

      draw() {
        if (!ctx) return

        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Create particles
    const particles: Particle[] = []
    const particleCount = Math.min(100, Math.floor(window.innerWidth / 20))

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles.forEach((particle) => {
        particle.update()
        particle.draw()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return (
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ background: "transparent" }} />
  )
}
