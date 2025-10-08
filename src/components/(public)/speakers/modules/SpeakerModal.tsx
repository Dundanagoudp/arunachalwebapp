"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Speaker } from "@/types/speaker-types"
import { getMediaUrl } from "@/utils/mediaUrl"

interface SpeakerModalProps {
  isOpen: boolean
  onClose: () => void
  speaker: Speaker | null
}

export default function SpeakerModal({ isOpen, onClose, speaker }: SpeakerModalProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 speaker-modal-scrollbar">
        <div className="relative" style={{ backgroundColor: "#FFFAEE" }}>
          {speaker && (
            <div className="p-6 md:p-8 flex flex-col items-center justify-center min-h-[400px]">
              {/* Speaker Image */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div
                    className="relative w-40 h-40 md:w-48 md:h-48 bg-orange-400 p-1"
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
                          src={getMediaUrl(speaker.image_url) || "/images/speaker.png"}
                          alt={speaker.name}
                          fill
                          className="object-cover object-center"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Speaker Details */}
              <div className="text-center max-w-lg w-full">
                <DialogHeader className="mb-4">
                  <DialogTitle className="text-xl md:text-2xl font-bold mb-0 font-dm-serif text-center" style={{ color: "#1A3FA9" }}>
                    {speaker.name}
                  </DialogTitle>
                </DialogHeader>
                <div className="text-sm md:text-base text-gray-700 leading-relaxed font-bilo text-justify">
                  {speaker.about && speaker.about.length > 200 ? (
                    <div>
                      <p className="whitespace-pre-line text-justify">
                        {isExpanded ? speaker.about : `${speaker.about.substring(0, 200)}...`}
                      </p>
                      <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="mt-2 text-blue-600 hover:text-blue-800 font-medium text-sm underline"
                      >
                        {isExpanded ? "Read Less" : "Read More"}
                      </button>
                    </div>
                  ) : (
                    <p className="whitespace-pre-line text-justify">{speaker.about}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
