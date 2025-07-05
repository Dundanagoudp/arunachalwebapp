"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export default function SunIcon({ 
  size = 24, 
  className = "", 
  src = "/sungif.gif",
  style
}: { 
  size?: number; 
  className?: string; 
  src?: string;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div
      className={className}
      style={style}
      animate={{ y: [0, -5, 0], scale: [1, 1.05, 1] }}
      transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
    >
      <Image src={src} alt="Sun icon" width={size} height={size} />
    </motion.div>
  )
}
