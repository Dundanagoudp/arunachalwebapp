"use client"

import Image from "next/image"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const testimonials = [
  {
    quote: "The poetry of the earth is never dead.",
    author: "John Keats",
    image: "/testimonials/book.png",
  },
  {
    quote: "Words are, in my not-so-humble opinion, our most inexhaustible source of magic.",
    author: "J.K. Rowling",
    image: "/testimonials/book.png",
  },
  {
    quote: "A room without books is like a body without a soul.",
    author: "Cicero",
    image: "/testimonials/book.png",
  },
]

export default function Testimonials() {
  const [current, setCurrent] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const total = testimonials.length

  const changeTestimonial = (direction: "prev" | "next") => {
    if (isTransitioning) return
    setIsTransitioning(true)

    if (direction === "prev") {
      setCurrent((prev) => (prev === 0 ? total - 1 : prev - 1))
    } else {
      setCurrent((prev) => (prev === total - 1 ? 0 : prev + 1))
    }

    setTimeout(() => setIsTransitioning(false), 500)
  }

  const { quote, author, image } = testimonials[current]

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
            aria-label="Previous testimonial"
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
            <p className="text-2xl italic text-gray-800 md:text-4xl font-medium leading-snug">{quote}</p>
            <p className="mt-4 text-lg font-medium text-gray-700">— {author}</p>
            <span className="absolute -bottom-8 -right-8 text-8xl font-serif text-[#000000] opacity-70 md:-bottom-18 md:-right-25 md:text-9xl select-none">
              &rdquo;
            </span>
          </div>

          <button
            aria-label="Next testimonial"
            onClick={() => changeTestimonial("next")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-amber-400 rounded-full p-2 shadow hover:bg-amber-500 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
        </div>

        {/* Books and pen image */}
        <div className="mt-16 transition-opacity duration-500">
          <Image
            src={image || "/placeholder.svg"}
            alt="Stack of books and a pen"
            width={200}
            height={150}
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  )
}