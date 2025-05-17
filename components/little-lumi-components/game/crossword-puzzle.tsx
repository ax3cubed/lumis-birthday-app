"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import { Check, HelpCircle, RefreshCw, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

interface CrosswordPuzzleProps {
  onComplete?: () => void
}

// Define the crossword data structure
interface CrosswordWord {
  id: string
  word: string
  clue: string
  info: string
  startRow?: number
  startCol?: number
  direction?: "across" | "down"
}

// Update the CellState interface to include isPreset
interface CellState {
  letter: string
  correctLetter: string
  isRevealed: boolean
  wordIds: string[]
  isPreset: boolean
}

// Interface for word placement
interface WordPlacement {
  word: CrosswordWord
  row: number
  col: number
  direction: "across" | "down"
  score: number
}

// Interface for crossword layout
interface CrosswordLayout {
  words: CrosswordWord[]
  gridSize: { rows: number; cols: number }
  score: number
}

export default function CrosswordPuzzle({ onComplete }: CrosswordPuzzleProps) {
  const router = useRouter()
  // Define the crossword words without positions
  const initialWords: CrosswordWord[] = [
    {
      id: "ijanikin",
      word: "IJANIKIN",
      clue: "Your secondary school in Lagos",
      info: "Your secondary school in Lagos, Nigeria",
    },
    {
      id: "towergate",
      word: "TOWERGATE",
      clue: "Your primary school in Iyanapaja",
      info: "Your primary school in Iyanapaja, Lagos Nigeria",
    },
    {
      id: "dolls",
      word: "DOLLS",
      clue: "Childhood toys you enjoyed playing with",
      info: "You enjoyed playing with dolls as a child",
    },
    {
      id: "braiding",
      word: "BRAIDING",
      clue: "Activity you enjoyed with your dolls",
      info: "You enjoy braiding your dolls' hair",
    },
    {
      id: "family",
      word: "FAMILY",
      clue: "People you love spending time with",
      info: "You love spending time with family",
    },
    {
      id: "swimming",
      word: "SWIMMING",
      clue: "Lessons you took with your brother",
      info: "You had swimming lessons with your brother but you stopped",
    },
    {
      id: "beach",
      word: "BEACH",
      clue: "You once lived close to this",
      info: "You once lived close to a beach",
    },
    {
      id: "shorthair",
      word: "SHORTHAIR",
      clue: "Hairstyle you had in boarding school",
      info: "You had to cut your hair while in boarding school but you didn't like it",
    },
    {
      id: "artistry",
      word: "ARTISTRY",
      clue: "Creative skill you enjoyed",
      info: "You liked to draw and paint",
    },
  ]

  // State for generated words with positions
  const [words, setWords] = useState<CrosswordWord[]>([])
  const [gridSize, setGridSize] = useState<number>(15)
  const [grid, setGrid] = useState<CellState[][]>([])
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [selectedDirection, setSelectedDirection] = useState<"across" | "down">("across")
  const [completedWords, setCompletedWords] = useState<Set<string>>(new Set())
  const [showToast, setShowToast] = useState<{ wordId: string; info: string } | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [hintsRemaining, setHintsRemaining] = useState(3)
  const [isGenerating, setIsGenerating] = useState(true)

  // Reference to input element for mobile keyboard
  const inputRef = useRef<HTMLInputElement>(null)

  // Generate crossword layout
  useEffect(() => {
    generateCrossword()
  }, [])

  // Generate crossword layout
  const generateCrossword = () => {
    setIsGenerating(true)

    // Generate the best crossword layout
    const bestLayout = findBestCrosswordLayout(initialWords)

    // Update state with the generated layout
    setWords(bestLayout.words)
    setGridSize(Math.max(bestLayout.gridSize.rows, bestLayout.gridSize.cols))

    // Initialize the grid with the generated layout
    setGrid(initializeGrid(bestLayout.words, Math.max(bestLayout.gridSize.rows, bestLayout.gridSize.cols)))

    setIsGenerating(false)
  }

  // Find the best crossword layout
  const findBestCrosswordLayout = (wordList: CrosswordWord[]): CrosswordLayout => {
    // Sort words by length (descending)
    const sortedWords = [...wordList].sort((a, b) => b.word.length - a.word.length)

    // Set a time limit for generation (5 seconds)
    const timeLimit = 5000
    const startTime = Date.now()

    let bestLayout: CrosswordLayout = {
      words: [],
      gridSize: { rows: 0, cols: 0 },
      score: Number.NEGATIVE_INFINITY,
    }

    // Generate multiple layouts and choose the best one
    let iterations = 0
    while (Date.now() - startTime < timeLimit && iterations < 50) {
      iterations++

      const layout = generateSingleLayout(sortedWords)
      const score = scoreLayout(layout)

      if (score > bestLayout.score) {
        bestLayout = {
          words: layout.words,
          gridSize: layout.gridSize,
          score: score,
        }
      }
    }

    console.log(`Generated ${iterations} layouts in ${Date.now() - startTime}ms`)
    console.log("Best layout score:", bestLayout.score)

    return bestLayout
  }

  // Generate a single crossword layout
  const generateSingleLayout = (sortedWords: CrosswordWord[]): CrosswordLayout => {
    // Start with an empty grid (we'll track the bounds as we go)
    let placedWords: CrosswordWord[] = []
    let minRow = 0,
      maxRow = 0,
      minCol = 0,
      maxCol = 0

    // Place the first word horizontally in the middle
    const firstWord = { ...sortedWords[0], startRow: 0, startCol: 0, direction: "across" as const }
    placedWords.push(firstWord)
    maxCol = firstWord.word.length - 1

    // Try to place each remaining word
    for (let i = 1; i < sortedWords.length; i++) {
      const wordToPlace = sortedWords[i]
      const possiblePlacements: WordPlacement[] = []

      // Check for possible intersections with already placed words
      for (const placedWord of placedWords) {
        const placedWordLetters = placedWord.word.split("")
        const wordToPlaceLetters = wordToPlace.word.split("")

        // Find common letters
        for (let placedIdx = 0; placedIdx < placedWordLetters.length; placedIdx++) {
          for (let newIdx = 0; newIdx < wordToPlaceLetters.length; newIdx++) {
            if (placedWordLetters[placedIdx] === wordToPlaceLetters[newIdx]) {
              // Try placing horizontally
              if (placedWord.direction === "down") {
                const row = placedWord.startRow! + placedIdx
                const col = placedWord.startCol! - newIdx

                if (isValidPlacement(placedWords, wordToPlace, row, col, "across")) {
                  const score = calculatePlacementScore(placedWords, wordToPlace, row, col, "across", {
                    minRow,
                    maxRow,
                    minCol,
                    maxCol,
                  })
                  possiblePlacements.push({
                    word: wordToPlace,
                    row,
                    col,
                    direction: "across",
                    score,
                  })
                }
              }

              // Try placing vertically
              if (placedWord.direction === "across") {
                const row = placedWord.startRow! - newIdx
                const col = placedWord.startCol! + placedIdx

                if (isValidPlacement(placedWords, wordToPlace, row, col, "down")) {
                  const score = calculatePlacementScore(placedWords, wordToPlace, row, col, "down", {
                    minRow,
                    maxRow,
                    minCol,
                    maxCol,
                  })
                  possiblePlacements.push({
                    word: wordToPlace,
                    row,
                    col,
                    direction: "down",
                    score,
                  })
                }
              }
            }
          }
        }
      }

      // If we found valid placements, choose the best one
      if (possiblePlacements.length > 0) {
        // Sort by score (descending)
        possiblePlacements.sort((a, b) => b.score - a.score)

        const bestPlacement = possiblePlacements[0]
        const placedWord = {
          ...wordToPlace,
          startRow: bestPlacement.row,
          startCol: bestPlacement.col,
          direction: bestPlacement.direction,
        }

        placedWords.push(placedWord)

        // Update grid bounds
        if (bestPlacement.direction === "across") {
          minRow = Math.min(minRow, bestPlacement.row)
          maxRow = Math.max(maxRow, bestPlacement.row)
          minCol = Math.min(minCol, bestPlacement.col)
          maxCol = Math.max(maxCol, bestPlacement.col + wordToPlace.word.length - 1)
        } else {
          minRow = Math.min(minRow, bestPlacement.row)
          maxRow = Math.max(maxRow, bestPlacement.row + wordToPlace.word.length - 1)
          minCol = Math.min(minCol, bestPlacement.col)
          maxCol = Math.max(maxCol, bestPlacement.col)
        }
      }
    }

    // Normalize coordinates (shift everything to start at 0,0)
    if (minRow < 0 || minCol < 0) {
      const rowOffset = minRow < 0 ? Math.abs(minRow) : 0
      const colOffset = minCol < 0 ? Math.abs(minCol) : 0

      placedWords = placedWords.map((word) => ({
        ...word,
        startRow: word.startRow! + rowOffset,
        startCol: word.startCol! + colOffset,
      }))

      maxRow += rowOffset
      maxCol += colOffset
    }

    return {
      words: placedWords,
      gridSize: { rows: maxRow + 1, cols: maxCol + 1 },
      score: 0, // Will be calculated later
    }
  }

  // Check if a word placement is valid (no conflicts)
  const isValidPlacement = (
    placedWords: CrosswordWord[],
    wordToPlace: CrosswordWord,
    startRow: number,
    startCol: number,
    direction: "across" | "down",
  ): boolean => {
    const wordLength = wordToPlace.word.length
    const wordLetters = wordToPlace.word.split("")

    // Create a temporary grid to check conflicts
    const tempGrid: Record<string, { letter: string; wordIds: string[] }> = {}

    // Fill the grid with placed words
    for (const word of placedWords) {
      const letters = word.word.split("")

      for (let i = 0; i < letters.length; i++) {
        const row = word.direction === "across" ? word.startRow! : word.startRow! + i
        const col = word.direction === "across" ? word.startCol! + i : word.startCol!
        const key = `${row},${col}`

        if (!tempGrid[key]) {
          tempGrid[key] = { letter: letters[i], wordIds: [word.id] }
        } else {
          // If there's already a letter, it must match
          if (tempGrid[key].letter !== letters[i]) {
            return false
          }
          tempGrid[key].wordIds.push(word.id)
        }
      }
    }

    // Check if the new word can be placed without conflicts
    for (let i = 0; i < wordLength; i++) {
      const row = direction === "across" ? startRow : startRow + i
      const col = direction === "across" ? startCol + i : startCol
      const key = `${row},${col}`

      if (tempGrid[key] && tempGrid[key].letter !== wordLetters[i]) {
        return false
      }

      // Check adjacent cells (no words should touch except at intersections)
      if (direction === "across") {
        // Check cells above and below
        const above = `${row - 1},${col}`
        const below = `${row + 1},${col}`

        // Only allow adjacent cells if they're part of a crossing word
        if (tempGrid[above] && i > 0 && i < wordLength - 1) {
          const isCrossingWord = placedWords.some(
            (w) =>
              w.direction === "down" &&
              w.startCol === col &&
              row - 1 >= w.startRow! &&
              row - 1 < w.startRow! + w.word.length,
          )

          if (!isCrossingWord) return false
        }

        if (tempGrid[below] && i > 0 && i < wordLength - 1) {
          const isCrossingWord = placedWords.some(
            (w) =>
              w.direction === "down" &&
              w.startCol === col &&
              row + 1 >= w.startRow! &&
              row + 1 < w.startRow! + w.word.length,
          )

          if (!isCrossingWord) return false
        }
      } else {
        // Check cells to the left and right
        const left = `${row},${col - 1}`
        const right = `${row},${col + 1}`

        if (tempGrid[left] && i > 0 && i < wordLength - 1) {
          const isCrossingWord = placedWords.some(
            (w) =>
              w.direction === "across" &&
              w.startRow === row &&
              col - 1 >= w.startCol! &&
              col - 1 < w.startCol! + w.word.length,
          )

          if (!isCrossingWord) return false
        }

        if (tempGrid[right] && i > 0 && i < wordLength - 1) {
          const isCrossingWord = placedWords.some(
            (w) =>
              w.direction === "across" &&
              w.startRow === row &&
              col + 1 >= w.startCol! &&
              col + 1 < w.startCol! + w.word.length,
          )

          if (!isCrossingWord) return false
        }
      }
    }

    // Check the cells before and after the word
    if (direction === "across") {
      const before = `${startRow},${startCol - 1}`
      const after = `${startRow},${startCol + wordLength}`

      if (tempGrid[before] || tempGrid[after]) {
        return false
      }
    } else {
      const before = `${startRow - 1},${startCol}`
      const after = `${startRow + wordLength},${startCol}`

      if (tempGrid[before] || tempGrid[after]) {
        return false
      }
    }

    return true
  }

  // Calculate a score for a word placement
  const calculatePlacementScore = (
    placedWords: CrosswordWord[],
    wordToPlace: CrosswordWord,
    startRow: number,
    startCol: number,
    direction: "across" | "down",
    bounds: { minRow: number; maxRow: number; minCol: number; maxCol: number },
  ): number => {
    let score = 0
    const wordLength = wordToPlace.word.length

    // Count intersections (more is better)
    let intersections = 0
    const tempGrid: Record<string, boolean> = {}

    // Fill the grid with placed words
    for (const word of placedWords) {
      const letters = word.word.split("")

      for (let i = 0; i < letters.length; i++) {
        const row = word.direction === "across" ? word.startRow! : word.startRow! + i
        const col = word.direction === "across" ? word.startCol! + i : word.startCol!
        tempGrid[`${row},${col}`] = true
      }
    }

    // Check intersections
    for (let i = 0; i < wordLength; i++) {
      const row = direction === "across" ? startRow : startRow + i
      const col = direction === "across" ? startCol + i : startCol

      if (tempGrid[`${row},${col}`]) {
        intersections++
        score += 10 // Bonus for each intersection
      }
    }

    // Penalize for increasing grid size
    const newMinRow = Math.min(bounds.minRow, startRow)
    const newMaxRow = Math.max(bounds.maxRow, direction === "down" ? startRow + wordLength - 1 : startRow)
    const newMinCol = Math.min(bounds.minCol, startCol)
    const newMaxCol = Math.max(bounds.maxCol, direction === "across" ? startCol + wordLength - 1 : startCol)

    const currentArea = (bounds.maxRow - bounds.minRow + 1) * (bounds.maxCol - bounds.minCol + 1)
    const newArea = (newMaxRow - newMinRow + 1) * (newMaxCol - newMinCol + 1)
    const areaDifference = newArea - currentArea

    score -= areaDifference * 2 // Penalize for increasing grid size

    // Bonus for maintaining a good aspect ratio
    const currentRatio = (bounds.maxRow - bounds.minRow + 1) / (bounds.maxCol - bounds.minCol + 1)
    const newRatio = (newMaxRow - newMinRow + 1) / (newMaxCol - newMinCol + 1)
    const ratioDifference = Math.abs(1 - newRatio) - Math.abs(1 - currentRatio)

    score -= ratioDifference * 5 // Penalize for worse aspect ratio

    // Bonus for more intersections
    score += Math.min(intersections, 3) * 5

    return score
  }

  // Score a complete layout
  const scoreLayout = (layout: CrosswordLayout): number => {
    const { words, gridSize } = layout
    let score = 0

    // More words is better
    score += words.length * 20

    // Smaller grid is better
    const area = gridSize.rows * gridSize.cols
    score -= area / 10

    // Better aspect ratio is better
    const ratio = gridSize.rows / gridSize.cols
    score -= Math.abs(1 - ratio) * 10

    // More intersections is better
    const intersections = countIntersections(words)
    score += intersections * 5

    return score
  }

  // Count intersections in a layout
  const countIntersections = (words: CrosswordWord[]): number => {
    const grid: Record<string, string[]> = {}

    // Fill the grid with word IDs
    for (const word of words) {
      const wordLength = word.word.length

      for (let i = 0; i < wordLength; i++) {
        const row = word.direction === "across" ? word.startRow! : word.startRow! + i
        const col = word.direction === "across" ? word.startCol! + i : word.startCol!
        const key = `${row},${col}`

        if (!grid[key]) {
          grid[key] = [word.id]
        } else {
          grid[key].push(word.id)
        }
      }
    }

    // Count cells with more than one word
    return Object.values(grid).filter((ids) => ids.length > 1).length
  }

  // Initialize the grid
  const initializeGrid = (generatedWords: CrosswordWord[], size: number): CellState[][] => {
    const grid: CellState[][] = Array(size)
      .fill(null)
      .map(() =>
        Array(size)
          .fill(null)
          .map(() => ({
            letter: "",
            correctLetter: "",
            isRevealed: false,
            wordIds: [],
            isPreset: false,
          })),
      )

    // Fill in the grid with correct letters and word IDs
    generatedWords.forEach((word) => {
      const { startRow, startCol, direction, word: wordText, id } = word

      for (let i = 0; i < wordText.length; i++) {
        const row = direction === "across" ? startRow! : startRow! + i
        const col = direction === "across" ? startCol! + i : startCol!

        if (row < size && col < size) {
          grid[row][col].correctLetter = wordText[i]
          grid[row][col].wordIds.push(id!)
        }
      }
    })

    // Add preset letters (helpful hints)
    // Add about 1-2 preset letters per word
    generatedWords.forEach((word) => {
      const { startRow, startCol, direction, word: wordText } = word

      // Add 1-2 preset letters per word
      const numPresets = Math.min(2, Math.max(1, Math.floor(wordText.length / 4)))
      const presetIndices = new Set<number>()

      while (presetIndices.size < numPresets) {
        // Avoid first and last letter, prefer middle letters
        const idx = Math.floor(Math.random() * (wordText.length - 2)) + 1
        presetIndices.add(idx)
      }

      presetIndices.forEach((idx) => {
        const row = direction === "across" ? startRow! : startRow! + idx
        const col = direction === "across" ? startCol! + idx : startCol!

        grid[row][col].letter = wordText[idx]
        grid[row][col].isPreset = true
      })
    })

    // Add misleading characters in empty spaces
    const misleadingLetters = ["P", "X", "Z", "Q", "V", "Y", "W", "J", "U", "N"]
    let misleadingCount = 0

    // Add up to 10 misleading letters
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (!grid[row][col].correctLetter && misleadingCount < 10 && Math.random() < 0.1) {
          grid[row][col].letter = misleadingLetters[misleadingCount % misleadingLetters.length]
          grid[row][col].isPreset = true
          misleadingCount++
        }
      }
    }

    return grid
  }

  // Check if all words are completed
  useEffect(() => {
    if (words.length > 0 && completedWords.size === words.length && !isCompleted) {
      setIsCompleted(true)

      // Trigger confetti
      confetti({
        particleCount: 200,
        spread: 90,
        origin: { y: 0.6 },
      })

      // Call onComplete callback
      if (onComplete) {
        onComplete()
      }
    }
  }, [completedWords, words, isCompleted, onComplete])

  // Handle cell click
  const handleCellClick = (row: number, col: number) => {
    // Only allow clicking cells with correct letters (part of the puzzle) that aren't preset
    if (!grid[row][col].correctLetter) return

    // If the cell is preset, allow clicking but not editing
    const isEditable = !grid[row][col].isPreset

    // If clicking the same cell, toggle direction
    if (selectedCell?.row === row && selectedCell?.col === col) {
      setSelectedDirection(selectedDirection === "across" ? "down" : "across")
    } else {
      setSelectedCell({ row, col })

      // Determine direction based on available words
      const cell = grid[row][col]
      const wordIds = cell.wordIds

      if (wordIds.length > 0) {
        const acrossWord = words.find((w) => w.direction === "across" && wordIds.includes(w.id))
        const downWord = words.find((w) => w.direction === "down" && wordIds.includes(w.id))

        if (acrossWord && !downWord) {
          setSelectedDirection("across")
        } else if (!acrossWord && downWord) {
          setSelectedDirection("down")
        }
        // If both directions are available, keep the current direction or default to across
      }
    }

    // Focus the hidden input to bring up keyboard on mobile
    if (inputRef.current && isEditable) {
      inputRef.current.focus()
    }
  }

  // Handle key press
  const handleKeyPress = (key: string) => {
    if (!selectedCell) return

    const { row, col } = selectedCell

    // Don't allow editing preset cells
    if (grid[row][col].isPreset) return

    if (key === "Backspace" || key === "Delete") {
      // Handle backspace/delete
      if (grid[row][col].letter !== "") {
        // Clear current cell
        updateCell(row, col, "")
      } else {
        // Move to previous cell and clear it
        const prevCell = getAdjacentCell(row, col, -1)
        if (prevCell) {
          setSelectedCell(prevCell)
          if (!grid[prevCell.row][prevCell.col].isPreset) {
            updateCell(prevCell.row, prevCell.col, "")
          }
        }
      }
    } else if (/^[A-Za-z]$/.test(key)) {
      // Handle letter input
      updateCell(row, col, key.toUpperCase())

      // Move to next cell
      const nextCell = getAdjacentCell(row, col, 1)
      if (nextCell) {
        setSelectedCell(nextCell)
      }
    } else if (key === "ArrowRight") {
      setSelectedDirection("across")
      const nextCell = getAdjacentCell(row, col, 1, "across")
      if (nextCell) setSelectedCell(nextCell)
    } else if (key === "ArrowLeft") {
      setSelectedDirection("across")
      const prevCell = getAdjacentCell(row, col, -1, "across")
      if (prevCell) setSelectedCell(prevCell)
    } else if (key === "ArrowDown") {
      setSelectedDirection("down")
      const nextCell = getAdjacentCell(row, col, 1, "down")
      if (nextCell) setSelectedCell(nextCell)
    } else if (key === "ArrowUp") {
      setSelectedDirection("down")
      const prevCell = getAdjacentCell(row, col, -1, "down")
      if (prevCell) setSelectedCell(prevCell)
    }
  }

  // Get adjacent cell based on direction
  const getAdjacentCell = (row: number, col: number, offset: number, direction?: "across" | "down") => {
    const dir = direction || selectedDirection

    let newRow = row
    let newCol = col

    if (dir === "across") {
      newCol += offset
    } else {
      newRow += offset
    }

    // Check if new position is valid and has a correct letter
    if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize && grid[newRow][newCol].correctLetter) {
      return { row: newRow, col: newCol }
    }

    return null
  }

  // Update cell and check for completed words
  const updateCell = (row: number, col: number, letter: string) => {
    // Don't update preset letters
    if (grid[row][col].isPreset) return

    const newGrid = [...grid]
    newGrid[row][col] = { ...newGrid[row][col], letter }
    setGrid(newGrid)

    // Check if any words are completed
    checkCompletedWords(newGrid, row, col)
  }

  // Check if any words are completed
  const checkCompletedWords = (grid: CellState[][], row: number, col: number) => {
    const cell = grid[row][col]
    const wordIds = cell.wordIds

    wordIds.forEach((wordId) => {
      // Skip if already completed
      if (completedWords.has(wordId)) return

      const word = words.find((w) => w.id === wordId)
      if (!word) return

      let isComplete = true

      // Check if all letters in the word are correct
      for (let i = 0; i < word.word.length; i++) {
        const checkRow = word.direction === "across" ? word.startRow! : word.startRow! + i
        const checkCol = word.direction === "across" ? word.startCol! + i : word.startCol!

        if (checkRow >= gridSize || checkCol >= gridSize || grid[checkRow][checkCol].letter !== word.word[i]) {
          isComplete = false
          break
        }
      }

      if (isComplete) {
        // Add to completed words
        const newCompletedWords = new Set(completedWords)
        newCompletedWords.add(wordId)
        setCompletedWords(newCompletedWords)

        // Show toast with info
        setShowToast({ wordId, info: word.info })

        // Play success sound
        const audio = new Audio("/sounds/toy-match.mp3")
        audio.volume = 0.4
        audio.play().catch((err) => console.log("Audio play failed:", err))

        // Highlight the completed word
        highlightCompletedWord(word)
      }
    })
  }

  // Highlight completed word with animation
  const highlightCompletedWord = (word: CrosswordWord) => {
    const newGrid = [...grid]

    for (let i = 0; i < word.word.length; i++) {
      const row = word.direction === "across" ? word.startRow! : word.startRow! + i
      const col = word.direction === "across" ? word.startCol! + i : word.startCol!

      if (row < gridSize && col < gridSize) {
        // Add animation class or state here if needed
      }
    }

    setGrid(newGrid)
  }

  // Use a hint to reveal a letter
  const useHint = () => {
    if (hintsRemaining <= 0 || !selectedCell) return

    const { row, col } = selectedCell
    if (!grid[row][col].correctLetter || grid[row][col].isRevealed || grid[row][col].isPreset) return

    // Reveal the letter
    const newGrid = [...grid]
    newGrid[row][col] = {
      ...newGrid[row][col],
      letter: newGrid[row][col].correctLetter,
      isRevealed: true,
    }

    setGrid(newGrid)
    setHintsRemaining(hintsRemaining - 1)

    // Check if any words are completed
    checkCompletedWords(newGrid, row, col)

    // Play hint sound
    const audio = new Audio("/sounds/polaroid-open.mp3")
    audio.volume = 0.4
    audio.play().catch((err) => console.log("Audio play failed:", err))
  }

  // Reset the puzzle
  const resetPuzzle = () => {
    // Generate a new crossword layout
    generateCrossword()
    setSelectedCell(null)
    setCompletedWords(new Set())
    setIsCompleted(false)
    setHintsRemaining(3)

    // Play reset sound
    const audio = new Audio("/sounds/toy-error.mp3")
    audio.volume = 0.3
    audio.play().catch((err) => console.log("Audio play failed:", err))
  }

  // Get word at current selection
  const getCurrentWord = () => {
    if (!selectedCell) return null

    const { row, col } = selectedCell
    const cell = grid[row][col]

    // Find a word that contains this cell and matches the selected direction
    const wordId = cell.wordIds.find((id) => {
      const word = words.find((w) => w.id === id)
      return word?.direction === selectedDirection
    })

    if (!wordId) return null

    return words.find((w) => w.id === wordId)
  }

  // Get the clue for the current word
  const getCurrentClue = () => {
    const word = getCurrentWord()
    return word ? word.clue : ""
  }

  // Handle input change (for mobile keyboard)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value) {
      handleKeyPress(value[value.length - 1])
    }
    // Clear the input for next character
    e.target.value = ""
  }

  // Handle key down (for desktop keyboard)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (
      e.key === "Backspace" ||
      e.key === "Delete" ||
      e.key === "ArrowRight" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowUp" ||
      e.key === "ArrowDown"
    ) {
      e.preventDefault()
      handleKeyPress(e.key)
    }
  }

  // Handle navigation to next page
  const handleNextPage = () => {
    router.push("/big-energy-lumi/")
  }

  if (isGenerating) {
    return (
      <div className="relative bg-purple-950/30 backdrop-blur-sm rounded-xl p-6 border border-purple-800/50 shadow-lg overflow-hidden flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-purple-200">Generating crossword puzzle...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative bg-purple-950/30 backdrop-blur-sm rounded-xl p-6 border border-purple-800/50 shadow-lg overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-gothic text-purple-300">Memory Crossword</h2>

        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <button
              onClick={useHint}
              disabled={
                hintsRemaining <= 0 ||
                isCompleted ||
                !selectedCell ||
                (selectedCell && grid[selectedCell.row][selectedCell.col].isPreset)
              }
              className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2
                        ${
                          hintsRemaining > 0 && !isCompleted
                            ? "bg-purple-600 hover:bg-purple-500 text-white"
                            : "bg-purple-800/50 text-purple-300 cursor-not-allowed"
                        }`}
            >
              <HelpCircle size={16} />
              <span>Hint</span>
              <span className="inline-flex items-center justify-center w-5 h-5 bg-purple-800 rounded-full text-xs">
                {hintsRemaining}
              </span>
            </button>
          </div>

          <button
            onClick={resetPuzzle}
            className="px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-md transition-colors flex items-center gap-2"
            disabled={isCompleted}
          >
            <RefreshCw size={16} />
            <span>New Puzzle</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex flex-col gap-4">
          {/* Current clue */}
          <div className="bg-purple-900/40 p-3 rounded-md border border-purple-700/50">
            <h3 className="text-sm text-purple-300 mb-1">Current Clue:</h3>
            <p className="text-white font-medium">{getCurrentClue() || "Select a cell to see the clue"}</p>
          </div>

          {/* Crossword grid */}
          <div className="relative bg-purple-900/20 border-2 border-purple-600/50 rounded-md p-1 overflow-hidden">
            <div
              className="grid gap-1"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, minmax(30px, 1fr))`,
                width: "min(100%, 500px)",
                height: "min(100vw, 500px)",
              }}
            >
              {grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                  const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                  const isPartOfSelectedWord =
                    selectedCell && getCurrentWord()?.id && cell.wordIds.includes(getCurrentWord()?.id || "")
                  const isCompleted = cell.wordIds.some((id) => completedWords.has(id))

                  // Find if this cell is the start of any word
                  const isWordStart = words.some((w) => w.startRow === rowIndex && w.startCol === colIndex)

                  // Get the word number if it's a start cell
                  const wordNumber = isWordStart
                    ? words.findIndex((w) => w.startRow === rowIndex && w.startCol === colIndex) + 1
                    : null

                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`relative flex items-center justify-center text-lg font-bold
                                ${cell.correctLetter ? "bg-purple-800/40 hover:bg-purple-700/50" : "bg-purple-950/80"} 
                                ${isSelected ? "bg-purple-500/70 ring-2 ring-purple-300" : ""}
                                ${isPartOfSelectedWord && !isSelected ? "bg-purple-700/60" : ""}
                                ${isCompleted ? "bg-green-800/40" : ""}
                                ${cell.isRevealed ? "text-yellow-300" : cell.isPreset ? "text-blue-300" : "text-white"}
                                ${cell.isPreset && cell.correctLetter ? "cursor-pointer" : cell.correctLetter ? "cursor-pointer" : "cursor-default"}
                                transition-colors rounded-sm w-full h-full min-h-[30px]`}
                      onClick={() => (cell.correctLetter ? handleCellClick(rowIndex, colIndex) : null)}
                    >
                      {/* Word number */}
                      {wordNumber !== null && (
                        <span className="absolute top-0 left-0 text-[8px] text-purple-300 font-normal p-0.5">
                          {wordNumber}
                        </span>
                      )}

                      {cell.letter ? (
                        <span className={`text-center text-base md:text-lg ${cell.isPreset ? "font-bold" : ""}`}>
                          {cell.letter}
                        </span>
                      ) : (
                        cell.correctLetter && <span className="w-full h-full bg-purple-800/40"></span>
                      )}
                    </div>
                  )
                }),
              )}
            </div>

            {/* Hidden input for mobile keyboard */}
            <input
              ref={inputRef}
              type="text"
              className="opacity-0 absolute top-0 left-0 w-1 h-1"
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck="false"
            />
          </div>
        </div>

        {/* Clues list */}
        <div className="flex-1 bg-purple-900/20 rounded-md p-4 border border-purple-700/30 overflow-y-auto max-h-[500px]">
          <div className="mb-4">
            <h3 className="text-lg font-gothic text-purple-300 mb-2">Across</h3>
            <ul className="space-y-2">
              {words
                .filter((word) => word.direction === "across")
                .map((word, index) => (
                  <li
                    key={word.id}
                    className={`text-sm ${completedWords.has(word.id) ? "text-green-300 line-through" : "text-white"}`}
                  >
                    <span className="font-bold mr-2">
                      {words.findIndex((w) => w.startRow === word.startRow && w.startCol === word.startCol) + 1}:
                    </span>
                    {word.clue}
                    {completedWords.has(word.id) && <Check size={16} className="inline-block ml-2 text-green-300" />}
                  </li>
                ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-gothic text-purple-300 mb-2">Down</h3>
            <ul className="space-y-2">
              {words
                .filter((word) => word.direction === "down")
                .map((word) => (
                  <li
                    key={word.id}
                    className={`text-sm ${completedWords.has(word.id) ? "text-green-300 line-through" : "text-white"}`}
                  >
                    <span className="font-bold mr-2">
                      {words.findIndex((w) => w.startRow === word.startRow && w.startCol === word.startCol) + 1}:
                    </span>
                    {word.clue}
                    {completedWords.has(word.id) && <Check size={16} className="inline-block ml-2 text-green-300" />}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Toast notification for completed words */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-800 text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-md"
            onAnimationComplete={() => {
              // Auto-hide toast after 3 seconds
              setTimeout(() => setShowToast(null), 3000)
            }}
          >
            <div className="flex items-center gap-2">
              <Check size={20} className="text-green-300" />
              <div>
                <h4 className="font-bold">{words.find((w) => w.id === showToast.wordId)?.word}</h4>
                <p className="text-sm">{showToast.info}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion overlay */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center bg-purple-900/80 backdrop-blur-sm rounded-md z-30"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="text-center bg-purple-800/90 p-6 rounded-lg shadow-xl max-w-md"
            >
              <motion.h3
                animate={{
                  scale: [1, 1.05, 1],
                  textShadow: [
                    "0 0 5px rgba(233, 213, 255, 0.5)",
                    "0 0 20px rgba(233, 213, 255, 0.8)",
                    "0 0 5px rgba(233, 213, 255, 0.5)",
                  ],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="text-2xl font-gothic text-purple-200 mb-2"
              >
                Crossword Completed!
              </motion.h3>
              <p className="text-purple-200 mt-4 mb-6">
                You've successfully completed the crossword puzzle and learned more about your childhood memories!
              </p>

              <motion.button
                onClick={handleNextPage}
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-400 text-white font-medium rounded-full shadow-lg hover:shadow-purple-500/30 transition-all"
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(168, 85, 247, 0.5)" }}
                whileTap={{ scale: 0.98 }}
              >
                Your Next Adventure Awaits <ArrowRight size={18} className="ml-2" />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
