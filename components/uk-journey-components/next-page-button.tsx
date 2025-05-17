"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function NextPageButton() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="absolute bottom-8 left-8 z-10" // Changed from right-8 to left-8
    >
      <Link href="/uk-journey/next-chapter" passHref>
        <motion.button
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-full shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <span>Next Page</span>
          <motion.div animate={{ x: isHovered ? 5 : 0 }} transition={{ duration: 0.2 }}>
            <ArrowRight className="h-5 w-5" />
          </motion.div>

          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 rounded-full bg-white opacity-0"
            animate={{ opacity: isHovered ? 0.2 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      </Link>
    </motion.div>
  )
}
