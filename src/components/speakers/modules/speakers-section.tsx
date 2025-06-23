"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface Speaker {
  id: number
  name: string
  about: string
  image: string
}

const speakers: Speaker[] = [
  {
    id: 1,
    name: "Dr. Rajesh Kumar",
    about: "Technology Innovation Expert",
    image: "/images/speaker.png",
  },
  {
    id: 2,
    name: "Prof. Michael Chen",
    about: "Digital Transformation Leader",
    image: "/images/speaker2.png",
  },
  {
    id: 3,
    name: "Dr. Priya Sharma",
    about: "Research & Development Head",
    image: "/images/speaker.png",
  },
  {
    id: 4,
    name: "Dr. Rajesh Kumar",
    about: "Technology Innovation Expert",
    image: "/images/speaker2.png",
  },
  {
    id: 5,
    name: "Prof. Michael Chen",
    about: "Digital Transformation Leader",
    image: "/images/speaker.png",
  },
  {
    id: 6,
    name: "Dr. Priya Sharma",
    about: "Research & Development Head",
    image: "/images/speaker2.png",
  },
  {
    id: 7,
    name: "Dr. Rajesh Kumar",
    about: "Technology Innovation Expert",
    image: "/images/speaker.png",
  },
  {
    id: 8,
    name: "Prof. Michael Chen",
    about: "Digital Transformation Leader",
    image: "/images/speaker2.png",
  },
  {
    id: 9,
    name: "Dr. Priya Sharma",
    about: "Research & Development Head",
    image: "/images/speaker.png",
  },
  {
    id: 10,
    name: "Dr. Rajesh Kumar",
    about: "Technology Innovation Expert",
    image: "/images/speaker.png",
  },
  {
    id: 11,
    name: "Prof. Michael Chen",
    about: "Digital Transformation Leader",
    image: "/images/speaker2.png",
  },
  {
    id: 12,
    name: "Dr. Priya Sharma",
    about: "Research & Development Head",
    image: "/images/speaker.png",
  },
]

export default function SpeakersGrid() {
  const [currentPage, setCurrentPage] = useState(1)
  const speakersPerPage = 6
  const totalPages = Math.ceil(speakers.length / speakersPerPage)

  const indexOfLastSpeaker = currentPage * speakersPerPage
  const indexOfFirstSpeaker = indexOfLastSpeaker - speakersPerPage
  const currentSpeakers = speakers.slice(indexOfFirstSpeaker, indexOfLastSpeaker)

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "#FFFAEE" }}>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-wider" style={{ color: "#1A3FA9" }}>
            SPEAKERS
          </h1>
        </div>

        {/* Speakers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto mb-16">
          {currentSpeakers.map((speaker, index) => (
            <div key={speaker.id} className="flex flex-col items-center">
              {/* Decorative Border with Shimmer Effect */}
              <div className="relative">
                <div
                  className="relative w-48 h-48 bg-orange-400 p-1"
                  style={{
                    clipPath:
                      "polygon(50% 0%, 80% 10%, 100% 35%, 90% 70%, 80% 90%, 50% 100%, 20% 90%, 10% 70%, 0% 35%, 20% 10%)",
                  }}
                >
                  <div
                    className="w-full h-full bg-white p-2 overflow-hidden"
                    style={{
                      clipPath:
                        "polygon(50% 0%, 80% 10%, 100% 35%, 90% 70%, 80% 90%, 50% 100%, 20% 90%, 10% 70%, 0% 35%, 20% 10%)",
                    }}
                  >
                    <div
                      className="w-full h-full relative overflow-hidden"
                      style={{
                        clipPath:
                          "polygon(50% 0%, 80% 10%, 100% 35%, 90% 70%, 80% 90%, 50% 100%, 20% 90%, 10% 70%, 0% 35%, 20% 10%)",
                      }}
                    >
                      <Image
                        src={speaker.image || "/placeholder.svg"}
                        alt={speaker.name}
                        fill
                        className="object-cover object-center"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Speaker Info */}
              <div className="text-center mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{speaker.name}</h3>
                <p className="text-sm text-gray-600">{speaker.about}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage > 1) setCurrentPage(currentPage - 1)
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage(page)
                    }}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                  }}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  )
}
