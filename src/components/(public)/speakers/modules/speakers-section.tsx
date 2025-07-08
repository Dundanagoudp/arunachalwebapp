"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { X } from "lucide-react"
import { getSpeaker } from "@/service/speaker"
import type { Speaker } from "@/types/speaker-types"

export default function SpeakersGrid() {
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [speakers, setSpeakers] = useState<Speaker[]>([])
  const [error, setError] = useState<string | null>(null)
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const speakersPerPage = 9 // 3 rows x 3 columns for desktop
  const totalPages = Math.ceil(speakers.length / speakersPerPage)

  useEffect(() => {
    setLoading(true)
    getSpeaker()
      .then((res) => {
        if (res.success && res.data) {
          setSpeakers(res.data)
          setError(null)
        } else {
          setError(res.error || "Failed to fetch speakers")
        }
      })
      .catch(() => setError("Failed to fetch speakers"))
      .finally(() => setLoading(false))
  }, [])

  const indexOfLastSpeaker = currentPage * speakersPerPage
  const indexOfFirstSpeaker = indexOfLastSpeaker - speakersPerPage
  const currentSpeakers = speakers.slice(indexOfFirstSpeaker, indexOfLastSpeaker)

  const handleSpeakerClick = (speaker: Speaker) => {
    setSelectedSpeaker(speaker)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedSpeaker(null)
  }

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "#FFFAEE" }}>
      <div className="container mx-auto px-4 py-6 md:py-8 lg:py-10">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10 lg:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-wider font-dm-serif" style={{ color: "#1A3FA9" }}>
            SPEAKERS
          </h1>
        </div>

        {/* Error State */}
        {error && <div className="text-center text-red-500 mb-8">{error}</div>}

        {/* Speakers Grid - 2 columns on mobile (image only), 3 columns on desktop (full card) */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto mb-6 md:mb-8 lg:mb-10 px-2">
          {loading
            ? Array.from({ length: speakersPerPage }).map((_, idx) => (
                <div key={idx} className="flex flex-col items-center animate-pulse">
                  {/* Skeleton Image */}
                  <div className="relative">
                    <div
                      className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 lg:w-48 lg:h-48 bg-orange-200 p-1"
                      style={{
                        clipPath:
                          "polygon(50% 0%, 80% 10%, 100% 35%, 90% 70%, 80% 90%, 50% 100%, 20% 90%, 10% 70%, 0% 35%, 20% 10%)",
                      }}
                    >
                      <div
                        className="w-full h-full bg-gray-200 p-2 overflow-hidden"
                        style={{
                          clipPath:
                            "polygon(50% 0%, 80% 10%, 100% 35%, 90% 70%, 80% 90%, 50% 100%, 20% 90%, 10% 70%, 0% 35%, 20% 10%)",
                        }}
                      >
                        <div
                          className="w-full h-full bg-gray-300"
                          style={{
                            clipPath:
                              "polygon(50% 0%, 80% 10%, 100% 35%, 90% 70%, 80% 90%, 50% 100%, 20% 90%, 10% 70%, 0% 35%, 20% 10%)",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  {/* Skeleton Text */}
                  <div className="text-center mt-3 md:mt-4 lg:mt-6 w-full">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
                    <div className="h-3 bg-gray-100 rounded w-1/2 mx-auto" />
                  </div>
                </div>
              ))
            : currentSpeakers.map((speaker) => (
                <div
                  key={speaker._id}
                  className="flex flex-col items-center cursor-pointer transition-transform hover:scale-105"
                  onClick={() => handleSpeakerClick(speaker)}
                >
                  {/* Decorative Border */}
                  <div className="relative">
                    <div
                      className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 lg:w-48 lg:h-48 bg-orange-400 p-1"
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
                            src={speaker.image_url || "/images/speaker.png"}
                            alt={speaker.name}
                            fill
                            className="object-cover object-center"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Speaker Info - always visible */}
                  <div className="text-center mt-3 md:mt-4 lg:mt-6">
                    <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-1 md:mb-2 font-dm-serif">{speaker.name}</h3>
                    <p className="text-xs md:text-sm text-gray-600 font-bilo">{speaker.about}</p>
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

      {/* Speaker Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
          <div className="relative" style={{ backgroundColor: "#FFFAEE" }}>
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            {selectedSpeaker && (
              <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
                {/* Speaker Image */}
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    <div
                      className="relative w-48 h-48 md:w-56 md:h-56 bg-orange-400 p-1"
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
                            src={selectedSpeaker.image_url || "/images/speaker.png"}
                            alt={selectedSpeaker.name}
                            fill
                            className="object-cover object-center"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Speaker Details */}
                <div className="text-center">
                  <DialogHeader className="mb-3">
                    <DialogTitle className="text-2xl  font-bold mb-0 font-dm-serif" style={{ color: "#1A3FA9" }} >
                      {selectedSpeaker.name}
                    </DialogTitle>
                  </DialogHeader>
                  <p className="text-lg text-gray-700 leading-relaxed font-bilo">{selectedSpeaker.about}</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
