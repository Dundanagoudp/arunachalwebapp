"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { getPoetry } from "@/service/poetryService"

interface Poetry {
  _id: string
  text: string
  author: string
  __v: number
}

export default function Testimonials() {
  const [poetry, setPoetry] = useState<Poetry[]>([])
  const [current, setCurrent] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedTexts, setExpandedTexts] = useState<Set<string>>(new Set())

  // Fetch poetry from API
  useEffect(() => {
    const fetchPoetry = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await getPoetry()
        if (response.success) {
          setPoetry(response.data)
        } else {
          setError(response.error || "Failed to fetch poetry")
        }
      } catch (err) {
        setError("Failed to load poetry")
        console.error("Error fetching poetry:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPoetry()
  }, [])

  const total = poetry.length

  const changeTestimonial = (direction: "prev" | "next") => {
    if (isTransitioning || total === 0) return
    setIsTransitioning(true)

    if (direction === "prev") {
      setCurrent((prev) => (prev === 0 ? total - 1 : prev - 1))
    } else {
      setCurrent((prev) => (prev === total - 1 ? 0 : prev + 1))
    }

    setTimeout(() => setIsTransitioning(false), 500)
  }

  // Function to truncate text to 2 lines
  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + "..."
  }

  // Function to toggle text expansion
  const toggleTextExpansion = (poetryId: string) => {
    setExpandedTexts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(poetryId)) {
        newSet.delete(poetryId)
      } else {
        newSet.add(poetryId)
      }
      return newSet
    })
  }

  // Show loading state
  if (loading) {
    return (
      <div className="relative flex min-h-[80vh] lg:min-h-screen items-center justify-center bg-[#fdf8f0] p-2 overflow-hidden">
        {/* Decorative background patterns */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute z-0 opacity-40 pointer-events-none select-none ${
              i === 0
                ? "bottom-2 left-2 w-10 h-10 md:w-16 md:h-16"
                : i === 1
                  ? "bottom-2 right-2 w-10 h-10 md:w-16 md:h-16"
                  : i === 2
                    ? "top-1/2 left-0 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12"
                    : i === 3
                      ? "top-1/2 right-0 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12"
                      : i === 4
                        ? "top-1/4 left-10 w-8 h-8 md:w-12 md:h-12"
                        : i === 5
                          ? "top-1/4 right-10 w-8 h-8 md:w-12 md:h-12"
                          : i === 6
                            ? "bottom-1/4 left-10 w-8 h-8 md:w-12 md:h-12"
                            : "bottom-1/4 right-10 w-8 h-8 md:w-12 md:h-12"
            }`}
          >
            <Image src="/testimonials/background-pattern.png" alt="Pattern" fill className="object-contain" />
          </div>
        ))}

        <div className="relative mt-8 lg:mt-25 z-10 flex w-full max-w-4xl flex-col items-center justify-center p-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-amber-500" />
            <p className="text-lg text-gray-600">Loading beautiful poetry...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="relative flex min-h-[80vh] lg:min-h-screen items-center justify-center bg-[#fdf8f0] p-2 overflow-hidden">
        {/* Decorative background patterns */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute z-0 opacity-40 pointer-events-none select-none ${
              i === 0
                ? "bottom-2 left-2 w-10 h-10 md:w-16 md:h-16"
                : i === 1
                  ? "bottom-2 right-2 w-10 h-10 md:w-16 md:h-16"
                  : i === 2
                    ? "top-1/2 left-0 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12"
                    : i === 3
                      ? "top-1/2 right-0 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12"
                      : i === 4
                        ? "top-1/4 left-10 w-8 h-8 md:w-12 md:h-12"
                        : i === 5
                          ? "top-1/4 right-10 w-8 h-8 md:w-12 md:h-12"
                          : i === 6
                            ? "bottom-1/4 left-10 w-8 h-8 md:w-12 md:h-12"
                            : "bottom-1/4 right-10 w-8 h-8 md:w-12 md:h-12"
            }`}
          >
            <Image src="/testimonials/background-pattern.png" alt="Pattern" fill className="object-contain" />
          </div>
        ))}

        <div className="relative mt-8 lg:mt-25 z-10 flex w-full max-w-4xl flex-col items-center justify-center p-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <p className="text-lg text-gray-600">Unable to load poetry at the moment.</p>
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  // Show empty state
  if (total === 0) {
    return (
      <div className="relative flex min-h-[80vh] lg:min-h-screen items-center justify-center bg-[#fdf8f0] p-2 overflow-hidden">
        {/* Decorative background patterns */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute z-0 opacity-40 pointer-events-none select-none ${
              i === 0
                ? "bottom-2 left-2 w-10 h-10 md:w-16 md:h-16"
                : i === 1
                  ? "bottom-2 right-2 w-10 h-10 md:w-16 md:h-16"
                  : i === 2
                    ? "top-1/2 left-0 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12"
                    : i === 3
                      ? "top-1/2 right-0 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12"
                      : i === 4
                        ? "top-1/4 left-10 w-8 h-8 md:w-12 md:h-12"
                        : i === 5
                          ? "top-1/4 right-10 w-8 h-8 md:w-12 md:h-12"
                          : i === 6
                            ? "bottom-1/4 left-10 w-8 h-8 md:w-12 md:h-12"
                            : "bottom-1/4 right-10 w-8 h-8 md:w-12 md:h-12"
            }`}
          >
            <Image src="/testimonials/background-pattern.png" alt="Pattern" fill className="object-contain" />
          </div>
        ))}

        <div className="relative mt-8 lg:mt-25 z-10 flex w-full max-w-4xl flex-col items-center justify-center p-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <p className="text-lg text-gray-600">No poetry available yet.</p>
            <p className="text-sm text-gray-500">Check back soon for beautiful verses.</p>
          </div>
        </div>
      </div>
    )
  }

  const currentPoetry = poetry[current]
  const isExpanded = expandedTexts.has(currentPoetry._id)
  const displayText = isExpanded ? currentPoetry.text : truncateText(currentPoetry.text)
  const shouldShowReadMore = currentPoetry.text.length > 150

  return (
    <div className="relative flex min-h-[80vh] lg:min-h-screen items-center justify-center bg-[#fdf8f0] p-2 overflow-hidden">
      {/* Decorative background patterns */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className={`absolute z-0 opacity-40 pointer-events-none select-none ${
            i === 0
              ? "bottom-2 left-2 w-10 h-10 md:w-16 md:h-16"
              : i === 1
                ? "bottom-2 right-2 w-10 h-10 md:w-16 md:h-16"
                : i === 2
                  ? "top-1/2 left-0 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12"
                  : i === 3
                    ? "top-1/2 right-0 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12"
                    : i === 4
                      ? "top-1/4 left-10 w-8 h-8 md:w-12 md:h-12"
                      : i === 5
                        ? "top-1/4 right-10 w-8 h-8 md:w-12 md:h-12"
                        : i === 6
                          ? "bottom-1/4 left-10 w-8 h-8 md:w-12 md:h-12"
                          : "bottom-1/4 right-10 w-8 h-8 md:w-12 md:h-12"
          }`}
        >
          <Image src="/testimonials/background-pattern.png" alt="Pattern" fill className="object-contain" />
        </div>
      ))}

      <div className="relative mt-8 lg:mt-25 z-10 flex w-full max-w-4xl flex-col items-center justify-center p-6">
        {/* Quote container */}
        <div className="relative flex w-full items-center justify-center">
          <Image
            src="/testimonials/Vector3.png"
            alt="Decorative blob shape"
            width={400}
            height={200}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[320px] md:max-w-[400px] lg:max-w-[790px] w-full h-auto opacity-60 object-contain pointer-events-none transition-opacity duration-300"
          />

          <button
            aria-label="Previous poetry"
            onClick={() => changeTestimonial("prev")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-amber-400 rounded-full p-2 shadow hover:bg-amber-500 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>

          <div
            className={`relative z-10 flex flex-col items-center justify-center p-25 text-center w-full transition-opacity duration-500 ${isTransitioning ? "opacity-0" : "opacity-100"}`}
          >
            <span className="absolute -top-8 -left-8 text-8xl font-serif text-[#000000] opacity-70 md:-top-12 md:-left-12 md:text-9xl select-none">
              &ldquo;
            </span>
            <div className="max-w-2xl mx-auto">
              <p className="text-2xl italic text-gray-800 md:text-4xl font-medium leading-snug line-clamp-2">
                {displayText}
              </p>
              {shouldShowReadMore && (
                <button
                  onClick={() => toggleTextExpansion(currentPoetry._id)}
                  className="mt-2 text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors duration-200 underline"
                >
                  {isExpanded ? "Read Less" : "Read More"}
                </button>
              )}
            </div>
            <p className="mt-4 text-lg font-medium text-gray-700">— {currentPoetry.author}</p>
            <span className="absolute -bottom-8 -right-8 text-8xl font-serif text-[#000000] opacity-70 md:-bottom-18 md:-right-25 md:text-9xl select-none">
              &rdquo;
            </span>
          </div>

          <button
            aria-label="Next poetry"
            onClick={() => changeTestimonial("next")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-amber-400 rounded-full p-2 shadow hover:bg-amber-500 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
        </div>

        {/* Books and pen image */}
        <div className="mt-16 transition-opacity duration-500">
          <Image
            src="/testimonials/book.png"
            alt="Stack of books and a pen"
            width={200}
            height={150}
            className="object-contain"
            priority
          />
        </div>

        {/* Poetry counter */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            {current + 1} of {total} poems
          </p>
        </div>
      </div>
    </div>
  )
}