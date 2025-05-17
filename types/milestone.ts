export interface Milestone {
  id: number
  title: string
  date: string
  position: {
    x: number
    y: number
  }
  description: string
  quote: string
  image?: string
  audio?: string
  weatherEffect?: "rain" | "snow" | null
  tags?: string[]
}
