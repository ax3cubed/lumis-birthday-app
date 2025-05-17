import { atom } from "jotai"

// Game state atoms
export const gameStartedAtom = atom(false)
export const instructionsRevealedAtom = atom(false)
export const emojiFoundAtom = atom(false)
export const audioEnabledAtom = atom(false)

// Cursor state atoms
export const cursorPositionAtom = atom({ x: 0, y: 0 })
export const targetPositionAtom = atom({ x: 0, y: 0 })
export const cursorVisibleAtom = atom(false)
export const cursorActiveAtom = atom(false)
export const cursorHoveringAtom = atom(false)
export const cursorTextAtom = atom("")
export const cursorColorAtom = atom<string | null>(null)
export const cursorBgColorAtom = atom<string | null>(null)
export const cursorOpacityAtom = atom(1)
export const cursorSizeAtom = atom<number | null>(null)
export const clipMaskTargetAtom = atom<string | null>(null)
export const isExclusionAtom = atom(false)
export const cursorClassesAtom = atom("")
export const cursorFilterAtom = atom<string | null>(null)

// Emoji state atoms
export const emojiPositionAtom = atom({ x: 0, y: 0 })
export const emojiOpacityAtom = atom(0)
