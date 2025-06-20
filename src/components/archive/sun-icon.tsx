"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export default function SunIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -5, 0], scale: [1, 1.05, 1] }}
      transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
    >
      <Image src="/images/sun.gif" alt="Sun icon" width={size} height={size} />
    </motion.div>
  )
}
