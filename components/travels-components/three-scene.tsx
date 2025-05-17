"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import gsap from "gsap"

interface ThreeSceneProps {
  currentCity: {
    id: string
    name: string
    image: string
  }
  isTransitioning: boolean
}

// Define letter shapes for voxel text
const shapes: { [key: string]: number[][] } = {
  P: [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
    [1, 0, 0],
    [1, 0, 0],
  ],
  A: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  R: [
    [1, 1, 1, 0, 0],
    [1, 0, 1, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 1, 0],
    [1, 0, 0, 1, 0],
  ],
  I: [
    [1, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 1],
  ],
  S: [
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 1, 0],
    [1, 1, 1, 1, 0],
  ],
  M: [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  D: [
    [1, 1, 1, 0, 0],
    [1, 0, 0, 1, 0],
    [1, 0, 0, 1, 0],
    [1, 0, 0, 1, 0],
    [1, 1, 1, 0, 0],
  ],
  B: [
    [1, 1, 1, 0, 0],
    [1, 0, 0, 1, 0],
    [1, 1, 1, 0, 0],
    [1, 0, 0, 1, 0],
    [1, 1, 1, 0, 0],
  ],
  E: [
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 0],
    [1, 0, 0],
    [1, 1, 1],
  ],
  L: [
    [1, 0, 0],
    [1, 0, 0],
    [1, 0, 0],
    [1, 0, 0],
    [1, 1, 1],
  ],
  G: [
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 1, 1, 0],
    [1, 0, 0, 1, 0],
    [1, 1, 1, 1, 0],
  ],
  U: [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
}

export default function ThreeScene({ currentCity, isTransitioning }: ThreeSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const textGroupRef = useRef<THREE.Group | null>(null)
  const environmentRef = useRef<THREE.Mesh | null>(null)
  const requestRef = useRef<number | null>(null)
  const previousCityRef = useRef<string>(currentCity.id)

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return

    // Create scene
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Create camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 15
    cameraRef.current = camera

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.maxDistance = 20
    controls.minDistance = 5
    controlsRef.current = controls

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    // Handle window resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return

      cameraRef.current.aspect = window.innerWidth / window.innerHeight
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", handleResize)

    // Animation loop
    const animate = () => {
      requestRef.current = requestAnimationFrame(animate)

      if (controlsRef.current) {
        controlsRef.current.update()
      }

      if (textGroupRef.current) {
        textGroupRef.current.rotation.y += 0.005
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current)
      }
    }

    animate()

    // Cleanup
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }

      if (rendererRef.current && rendererRef.current.domElement && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement)
      }

      window.removeEventListener("resize", handleResize)

      // Dispose resources
      if (rendererRef.current) {
        rendererRef.current.dispose()
      }
    }
  }, [])

  // Create or update environment and text
  useEffect(() => {
    if (!sceneRef.current) return

    const createEnvironment = (imageUrl: string) => {
      // Create a sphere for the environment
      const geometry = new THREE.SphereGeometry(500, 60, 40)
      geometry.scale(-1, 1, 1) // Invert the sphere so the texture is on the inside

      const texture = new THREE.TextureLoader().load(imageUrl)
      texture.mapping = THREE.EquirectangularReflectionMapping

      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0, // Start transparent
      })

      const mesh = new THREE.Mesh(geometry, material)
      return mesh
    }

    const createVoxelText = (text: string) => {
      const group = new THREE.Group()
      const boxSize = 0.5
      const spacing = 0.6

      let totalWidth = 0
      const letterGroups: THREE.Group[] = []

      // Calculate total width and create letter groups
      for (let letterIndex = 0; letterIndex < text.length; letterIndex++) {
        const letter = text[letterIndex]
        if (!shapes[letter]) {
          console.warn(`Shape for letter "${letter}" not found`)
          continue
        }

        const letterShape = shapes[letter]
        const letterGroup = new THREE.Group()
        const letterWidth = letterShape[0].length * spacing
        totalWidth += letterWidth + spacing

        letterGroups.push(letterGroup)
      }

      let offsetX = -totalWidth / 2

      // Create voxels for each letter
      for (let letterIndex = 0; letterIndex < text.length; letterIndex++) {
        const letter = text[letterIndex]
        if (!shapes[letter]) continue

        const letterShape = shapes[letter]
        const letterGroup = letterGroups[letterIndex]

        if (!letterGroup) continue

        const letterWidth = letterShape[0].length * spacing

        for (let i = 0; i < letterShape.length; i++) {
          for (let j = 0; j < letterShape[i].length; j++) {
            if (letterShape[i][j]) {
              // Create voxel
              const geometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize)
              const material = new THREE.MeshPhysicalMaterial({
                color: 0x00a8ff,
                roughness: 0.1,
                metalness: 0.8,
                transparent: true,
                opacity: 0.9,
                transmission: 0.2,
                clearcoat: 1,
              })

              const voxel = new THREE.Mesh(geometry, material)
              voxel.position.set(j * spacing, (letterShape.length - i - 1) * spacing, 0)

              // Add edges to voxel
              const edges = new THREE.LineSegments(
                new THREE.EdgesGeometry(geometry),
                new THREE.LineBasicMaterial({ color: 0x0070f3, linewidth: 2 }),
              )

              voxel.add(edges)
              letterGroup.add(voxel)
            }
          }
        }

        letterGroup.position.x = offsetX + letterWidth / 2
        offsetX += letterWidth + spacing

        group.add(letterGroup)
      }

      // Set initial opacity to 0
      group.traverse((object) => {
        if (object instanceof THREE.Mesh && object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((mat) => {
              mat.transparent = true
              mat.opacity = 0
            })
          } else {
            object.material.transparent = true
            object.material.opacity = 0
          }
        }
      })

      return group
    }

    // Function to clean up objects and dispose resources
    const cleanupObject = (object: THREE.Object3D) => {
      if (!object) return

      // Remove all children
      while (object.children.length > 0) {
        cleanupObject(object.children[0])
        object.remove(object.children[0])
      }

      // Dispose geometries and materials
      if (object instanceof THREE.Mesh) {
        if (object.geometry) {
          object.geometry.dispose()
        }

        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose())
          } else {
            object.material.dispose()
          }
        }
      }
    }

    // Handle city transition
    const handleCityTransition = async () => {
      // Step 1: Fade out current objects if they exist
      const fadeOutPromise = new Promise<void>((resolve) => {
        if (textGroupRef.current || environmentRef.current) {
          // Fade out text
          if (textGroupRef.current) {
            textGroupRef.current.traverse((object) => {
              if (object instanceof THREE.Mesh && object.material) {
                if (Array.isArray(object.material)) {
                  object.material.forEach((mat) => {
                    gsap.to(mat, {
                      opacity: 0,
                      duration: 0.5,
                    })
                  })
                } else {
                  gsap.to(object.material, {
                    opacity: 0,
                    duration: 0.5,
                  })
                }
              }
            })

            gsap.to(textGroupRef.current.position, {
              y: -10,
              duration: 0.5,
              ease: "power2.in",
            })
          }

          // Fade out environment
          if (environmentRef.current && environmentRef.current.material) {
            if (Array.isArray(environmentRef.current.material)) {
              environmentRef.current.material.forEach((mat) => {
                gsap.to(mat, {
                  opacity: 0,
                  duration: 0.5,
                })
              })
            } else {
              gsap.to(environmentRef.current.material, {
                opacity: 0,
                duration: 0.5,
              })
            }
          }

          // Wait for animations to complete
          setTimeout(() => {
            resolve()
          }, 600)
        } else {
          resolve()
        }
      })

      // Wait for fade out to complete
      await fadeOutPromise

      // Step 2: Remove and clean up old objects
      if (sceneRef.current) {
        if (textGroupRef.current) {
          cleanupObject(textGroupRef.current)
          sceneRef.current.remove(textGroupRef.current)
          textGroupRef.current = null
        }

        if (environmentRef.current) {
          cleanupObject(environmentRef.current)
          sceneRef.current.remove(environmentRef.current)
          environmentRef.current = null
        }
      }

      // Step 3: Create and add new objects
      if (sceneRef.current) {
        // Create new environment
        const newEnvironment = createEnvironment(currentCity.image)
        sceneRef.current.add(newEnvironment)
        environmentRef.current = newEnvironment

        // Create new text
        const newTextGroup = createVoxelText(currentCity.name)
        newTextGroup.position.y = 10 // Start from above
        sceneRef.current.add(newTextGroup)
        textGroupRef.current = newTextGroup

        // Step 4: Animate in the new objects
        // Fade in environment
        if (newEnvironment.material && !Array.isArray(newEnvironment.material)) {
          gsap.to(newEnvironment.material, {
            opacity: 1,
            duration: 1,
            delay: 0.2,
          })
        }

        // Animate in text
        gsap.to(newTextGroup.position, {
          y: 0,
          duration: 1.5,
          delay: 0.2,
          ease: "elastic.out(1, 0.5)",
        })

        // Fade in text
        newTextGroup.traverse((object) => {
          if (object instanceof THREE.Mesh && object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((mat) => {
                gsap.to(mat, {
                  opacity: 0.9,
                  duration: 1,
                  delay: 0.2,
                })
              })
            } else {
              gsap.to(object.material, {
                opacity: 0.9,
                duration: 1,
                delay: 0.2,
              })
            }
          }
        })

        // Add floating animation to text
        gsap.to(newTextGroup.position, {
          y: "+=0.5",
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1.7, // Start after the entrance animation
        })
      }
    }

    // If this is the first load or we're transitioning to a new city
    if (!environmentRef.current || previousCityRef.current !== currentCity.id) {
      handleCityTransition()
      previousCityRef.current = currentCity.id
    }
  }, [currentCity])

  return <div ref={containerRef} className="h-full w-full" />
}
