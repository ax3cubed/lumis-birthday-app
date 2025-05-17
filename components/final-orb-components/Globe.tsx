"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { Color } from "three"

export default function Globe() {
  const mountRef = useRef<HTMLDivElement>(null)
  const [isHighResLoaded, setIsHighResLoaded] = useState(false)
  const [showHint, setShowHint] = useState(true)
  const [isInteracting, setIsInteracting] = useState(false)
  const controlsRef = useRef<OrbitControls | null>(null)

  useEffect(() => {
    if (!mountRef.current) return

    // Create scene, camera, and renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    mountRef.current.appendChild(renderer.domElement)

    // Create a starfield
    const starsGeometry = new THREE.BufferGeometry()
    const starsCount = 10000
    const positions = new Float32Array(starsCount * 3)
    for (let i = 0; i < starsCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2000
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2000
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2000
    }
    starsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.7,
      sizeAttenuation: true,
    })
    const stars = new THREE.Points(starsGeometry, starsMaterial)
    scene.add(stars)

    // Create an atmospheric glow using a custom shader
    const atmosphereVertexShader = `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `
    const atmosphereFragmentShader = `
     uniform vec3 glowColor;
     varying vec3 vNormal;
     void main() {
       float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
       gl_FragColor = vec4(glowColor, 1.0) * intensity;
     }
   `
    const atmosphereGeometry = new THREE.SphereGeometry(5.2, 32, 32)
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      uniforms: {
        glowColor: { value: new Color(0x3a86ff) },
      },
    })
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial)
    scene.add(atmosphereMesh)

    // Create wireframe globe
    const wireframeGeometry = new THREE.SphereGeometry(5, 32, 32)
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x3a86ff,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    })
    const wireframeGlobe = new THREE.Mesh(wireframeGeometry, wireframeMaterial)
    scene.add(wireframeGlobe)

    // Create solid globe (initially invisible)
    const solidGeometry = new THREE.SphereGeometry(4.9, 64, 64)
    const solidMaterial = new THREE.MeshPhongMaterial({
      color: 0x1a237e,
      transparent: true,
      opacity: 0,
    })
    const solidGlobe = new THREE.Mesh(solidGeometry, solidMaterial)
    scene.add(solidGlobe)

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    // Add point light
    const pointLight = new THREE.PointLight(0xffffff, 1)
    pointLight.position.set(10, 10, 10)
    scene.add(pointLight)

    camera.position.z = 10

    // Enhanced OrbitControls with better interactivity
    const controls = new OrbitControls(camera, renderer.domElement)
    controlsRef.current = controls

    // Enable all movement controls
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.rotateSpeed = 0.8
    controls.enableZoom = true
    controls.zoomSpeed = 0.8
    controls.minDistance = 6 // Minimum zoom distance
    controls.maxDistance = 20 // Maximum zoom distance
    controls.enablePan = true
    controls.panSpeed = 0.5
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.5

    // Add event listeners for interaction state
    controls.addEventListener("start", () => {
      setIsInteracting(true)
      if (controls.autoRotate) {
        controls.autoRotate = false
      }
    })

    controls.addEventListener("end", () => {
      setIsInteracting(false)
      // Optional: re-enable auto-rotation after a delay
      setTimeout(() => {
        if (!isInteracting && controlsRef.current) {
          controlsRef.current.autoRotate = true
        }
      }, 5000)
    })

    const colors = [
      new Color(0x3a86ff), // Blue
      new Color(0x8338ec), // Purple
      new Color(0xff006e), // Pink
      new Color(0xfb5607), // Orange
      new Color(0xffbe0b), // Yellow
    ]
    let colorIndex = 0
    let nextColorIndex = 1
    let colorT = 0
    const colorTransitionSpeed = 0.005

    const lerpColor = (a: Color, b: Color, t: number) => {
      const color = new Color()
      color.r = a.r + (b.r - a.r) * t
      color.g = a.g + (b.g - a.g) * t
      color.b = a.b + (b.b - a.b) * t
      return color
    }

    let animationId: number

    const animate = () => {
      animationId = requestAnimationFrame(animate)

      // Color transition logic
      colorT += colorTransitionSpeed
      if (colorT >= 1) {
        colorT = 0
        colorIndex = nextColorIndex
        nextColorIndex = (nextColorIndex + 1) % colors.length
      }

      const currentColor = lerpColor(colors[colorIndex], colors[nextColorIndex], colorT)

      // Update materials with new color
      if (wireframeGlobe.material instanceof THREE.MeshBasicMaterial) {
        wireframeGlobe.material.color = currentColor
      }
      if (solidGlobe.material instanceof THREE.MeshPhongMaterial) {
        solidGlobe.material.color = currentColor
      }
      if (atmosphereMesh.material instanceof THREE.ShaderMaterial) {
        atmosphereMesh.material.uniforms.glowColor.value = currentColor
      }

      // Only auto-rotate elements if not being controlled by user
      if (!isInteracting) {
        wireframeGlobe.rotation.y += 0.001
        solidGlobe.rotation.y += 0.001
        atmosphereMesh.rotation.y += 0.0005
      }

      // Always rotate stars slightly for ambient effect
      stars.rotation.y += 0.0001

      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // Load high-resolution textures
    const textureLoader = new THREE.TextureLoader()
    const loadTexture = (url: string) =>
      new Promise((resolve) => {
        textureLoader.load(url, (texture) => resolve(texture))
      })

    Promise.all([
      loadTexture("/earth-texture-compressed.jpg"),
      loadTexture("/earth-bump-compressed.jpg"),
      loadTexture("/earth-specular-compressed.jpg"),
    ]).then(([texture, bumpMap, specularMap]) => {
      const highResMaterial = new THREE.MeshPhongMaterial({
        map: texture as THREE.Texture,
        bumpMap: bumpMap as THREE.Texture,
        bumpScale: 0.05,
        specularMap: specularMap as THREE.Texture,
        specular: new THREE.Color("grey"),
      })

      // Transition to the high-res textured globe
      const transitionDuration = 1 // seconds
      const startTime = Date.now()

      const transitionToHighRes = () => {
        const elapsedTime = (Date.now() - startTime) / 1000
        const progress = Math.min(elapsedTime / transitionDuration, 1)

        solidGlobe.material = highResMaterial
        solidGlobe.material.opacity = progress
        wireframeMaterial.opacity = 0.5 * (1 - progress)

        if (progress < 1) {
          requestAnimationFrame(transitionToHighRes)
        } else {
          setIsHighResLoaded(true)
          scene.remove(wireframeGlobe)
        }
        renderer.render(scene, camera)
      }

      transitionToHighRes()
    })

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener("resize", handleResize)

    // Show hint for longer on initial load
    const hintTimer = setTimeout(() => {
      setShowHint(false)
    }, 5000) // Show hint for 5 seconds

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationId)
      mountRef.current?.removeChild(renderer.domElement)
      controls.dispose()
      clearTimeout(hintTimer)
    }
  }, [isInteracting])

  // Function to reset camera position
  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset()
    }
  }

  // Function to toggle auto-rotation
  const toggleAutoRotate = () => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = !controlsRef.current.autoRotate
    }
  }

  return (
    <div ref={mountRef} className="fixed top-0 left-0 w-full h-full z-0">
      {showHint && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white text-sm px-5 py-3 rounded-full transition-opacity duration-1000 opacity-90 hover:opacity-100 flex items-center space-x-2">
          <span className="animate-pulse mr-2">✨</span>
          <span>Drag to rotate • Scroll to zoom • Shift+drag to pan</span>
          <span className="animate-pulse ml-2">✨</span>
        </div>
      )}

      <div className="absolute bottom-4 right-4 flex space-x-2">
        <button
          onClick={resetCamera}
          className="bg-black bg-opacity-50 text-white text-sm px-3 py-1 rounded-full hover:bg-opacity-70 transition-all"
        >
          Reset View
        </button>
        <button
          onClick={toggleAutoRotate}
          className="bg-black bg-opacity-50 text-white text-sm px-3 py-1 rounded-full hover:bg-opacity-70 transition-all"
        >
          Toggle Rotation
        </button>
      </div>
    </div>
  )
}
