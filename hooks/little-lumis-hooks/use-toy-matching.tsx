"use client"

import { useState, useEffect } from "react"

export function useToyMatching(childData) {
  const [matchedToys, setMatchedToys] = useState<Record<string, boolean>>({})
  const [isGameCompleted, setIsGameCompleted] = useState(false)

  // Match a toy to an age
  const matchToy = (toyId: string, age: number) => {
    // Find the toy data
    const toyData = childData.find((item) => item.toy.id === toyId)

    if (!toyData) return false

    // Check if the age matches
    const isMatch = toyData.age === age

    if (isMatch) {
      setMatchedToys((prev) => ({
        ...prev,
        [toyId]: true,
      }))
    }

    return isMatch
  }

  // Check if all toys are matched
  useEffect(() => {
    const allToys = childData.map((item) => item.toy.id)
    const allMatched = allToys.every((toyId) => matchedToys[toyId])

    if (allMatched && allToys.length > 0) {
      setIsGameCompleted(true)
    }
  }, [matchedToys, childData])

  return {
    matchedToys,
    matchToy,
    isGameCompleted,
  }
}
