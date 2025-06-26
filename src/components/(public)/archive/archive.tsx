"use client"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import SunIcon from "./sun-icon"

// Shimmer effect component
const ShimmerEffect = ({ className }: { className?: string }) => (
  <div className={`relative overflow-hidden ${className}`}>
    <div className="bg-gradient-to-r from-gray-300 via-gray-100 to-gray-300 bg-[length:200%_100%] animate-shimmer rounded h-full w-full"></div>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer rounded h-full w-full"></div>
  </div>
)

// Year Card Shimmer Component
const YearCardShimmer = () => (
  <div className="border-2 border-orange-400 rounded-xl p-4 relative overflow-hidden">
    <div className="grid grid-cols-2 gap-2 mb-4">
      <ShimmerEffect className="aspect-[4/3] rounded-lg" />
      <ShimmerEffect className="aspect-[4/3] rounded-lg" />
      <ShimmerEffect className="aspect-[4/3] rounded-lg" />
      <ShimmerEffect className="aspect-[4/3] rounded-lg" />
    </div>
    <div className="flex justify-between items-center">
      <ShimmerEffect className="h-8 w-16" />
      <div className="flex items-center">
        <ShimmerEffect className="h-4 w-16" />
        <ShimmerEffect className="h-4 w-4 ml-1 rounded-full" />
      </div>
    </div>
  </div>
)

// Header Shimmer Component
const HeaderShimmer = () => (
  <header className="flex justify-center pt-8 pb-4 relative">
    <ShimmerEffect className="h-10 w-32 rounded-lg" />
  </header>
)

export default function Archive() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000) // Show shimmer for 2 seconds

    return () => clearTimeout(timer)
  }, [])

  // Function to handle redirection when clicking on a year card
  const handleYearClick = (year: number) => {
    router.push(`/archive/${year}`)
  }

  return (
    <div className="min-h-screen bg-[#FFFAEE]">
      {/* Header */}
      {isLoading ? (
        <HeaderShimmer />
      ) : (
        <header className="flex justify-center pt-8 pb-4 relative">
          <SunIcon size={32} className="absolute top-4 right-4" />
          <h1 className="text-4xl font-bold text-blue-700 tracking-wider">ARCHIVE</h1>
        </header>
      )}

      <main className="container mx-auto px-4 py-8 lg:-w-64 lg:px-18">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <SunIcon size={38} className="absolute top-58 left-5 " />
          
          {isLoading ? (
            <>
              <YearCardShimmer />
              <YearCardShimmer />
              <YearCardShimmer />
              <YearCardShimmer />
            </>
          ) : (
            <>
              {[2024, 2023, 2022, 2021].map((year) => (
                <motion.div
                  key={year}
                  className="border-2 border-orange-400 rounded-xl p-4 relative overflow-hidden cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  onClick={() => handleYearClick(year)}
                  tabIndex={0}
                  role="button"
                  aria-label={`View gallery for year ${year}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleYearClick(year)
                    }
                  }}
                >
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="aspect-[4/3] rounded-lg overflow-hidden">
                      <Image
                        src="/gallery/gallery1.png"
                        alt={`Gallery preview image 1 for year ${year}`}
                        width={200}
                        height={150}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="aspect-[4/3] rounded-lg overflow-hidden">
                      <Image
                        src="/gallery/gallery2.png"
                        alt={`Gallery preview image 2 for year ${year}`}
                        width={200}
                        height={150}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="aspect-[4/3] rounded-lg overflow-hidden">
                      <Image
                        src="/gallery/gallery3.png"
                        alt={`Gallery preview image 3 for year ${year}`}
                        width={200}
                        height={150}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="aspect-[4/3] rounded-lg overflow-hidden">
                      <Image
                        src="/gallery/gallery4.png"
                        alt={`Gallery preview image 4 for year ${year}`}
                        width={200}
                        height={150}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-amber-800">{year}</h2>
                    <div className="flex items-center text-sm font-medium text-gray-700">
                      View All <ArrowRight size={16} className="ml-1" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </>
          )}
          <SunIcon size={35} className="absolute top-190 left-0 " />
        </div>
      </main>
    </div>
  )
}
