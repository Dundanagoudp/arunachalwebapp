"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"

const LoadingProgress = () => {
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Start loading when route changes
    setIsLoading(true)
    setProgress(0)

    // Simulate loading progress
    const timer1 = setTimeout(() => setProgress(33), 100)
    const timer2 = setTimeout(() => setProgress(66), 300)
    const timer3 = setTimeout(() => setProgress(100), 500)
    
    // Hide progress bar after completion
    const timer4 = setTimeout(() => {
      setIsLoading(false)
      setProgress(0)
    }, 700)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
    }
  }, [])

  if (!isLoading) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[100]">
      <Progress 
        value={progress} 
        className="h-1 w-full rounded-none bg-transparent"
        style={{
          background: 'transparent'
        }}
      />
      <style dangerouslySetInnerHTML={{
        __html: `
          .bg-primary {
            background: linear-gradient(90deg, #d97706, #ea580c) !important;
          }
        `
      }} />
    </div>
  )
}

export default LoadingProgress
