"use client"

import { ChildhoodDataItem } from "@/data/little-lumis-data/childhood-data"
import { useState, useEffect } from "react"

export function useToyMatching(childData:ChildhoodDataItem[]) {
  const [matchedToys, setMatchedToys] = useState<Record<string, boolean>>({})
  const [isGameCompleted, setIsGameCompleted] = useState(false)

  // Match a toy to an age
  const matchToy = (toyId: number, age: number) => {
    // Find the toy data
    const toyData = childData.find((item) => item.age === toyId)

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
    const allToys = childData.map((item) => item.age)
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
