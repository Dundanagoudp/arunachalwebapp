"use client"

import { useState } from "react"
import PdfViewTabs, { PdfDay } from "./pdf-viewtabs"

type DaySource =
  | {
      type: "image"
      images: string[]
      download?: string
    }
  | {
      type: "pdf"
      src: string
      download?: string
    }

const daySources: DaySource[] = [
  {
    type: "image",
    images: ["/schedulepdf/day1-agenda.jpg"],
    download: "/schedulepdf/day1-agenda.pdf",
  },
  {
    type: "image",
    images: [
      "/schedulepdf/day2/day2page1.jpg",
      "/schedulepdf/day2/day2page2.jpg",
      "/schedulepdf/day2/day2page3.jpg",
    ],
    download: "/schedulepdf/day2-21st-november-2025.pdf",
  },
  {
    type: "image",
    images: [
      "/schedulepdf/day3/day3page1.jpg",
      "/schedulepdf/day3/day3page2.jpg",
      "/schedulepdf/day3/day3page3.jpg",
    ],
    download: "/schedulepdf/day3-22nd-november-2025.pdf",
  },
]

export default function PdfViews() {
  const [activeDay, setActiveDay] = useState<PdfDay>(0)
  const [modalImageSrc, setModalImageSrc] = useState<string | null>(null)

  const currentSource = daySources[activeDay]
  const isImageDay = currentSource.type === "image"
  const downloadHref =
    currentSource.type === "image"
      ? currentSource.download || currentSource.images[0]
      : currentSource.download || currentSource.src

  return (
    <div className="bg-[#FFFAEE] rounded-2xl shadow-lg border border-gray-200 p-4 md:p-6 max-w-4xl mx-auto">
      <PdfViewTabs activeDay={activeDay} onChange={setActiveDay} />

      <div className="mt-4">
        <div
          className={`w-full bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md ${
            isImageDay
              ? "p-2 h-[420px] sm:h-[520px] md:h-[650px] overflow-y-auto"
              : "h-[420px] sm:h-[520px] md:h-[650px]"
          }`}
        >
          {isImageDay ? (
            <div className="space-y-4 h-full overflow-y-auto snap-y snap-mandatory">
              {currentSource.images.map((src) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setModalImageSrc(src)}
                  className="w-full block snap-start"
                >
                  <img
                    src={src}
                    alt="Schedule preview"
                    className="w-full h-auto object-contain"
                  />
                </button>
              ))}
            </div>
          ) : (
            <iframe
              src={currentSource.src}
              className="w-full h-full"
              style={{ border: "none" }}
            />
          )}
        </div>

        <div className="mt-3 text-right">
          <a
            href={downloadHref}
            target="_blank"
            className="text-[#D95E1E] font-semibold underline"
          >
            Open / Download
          </a>
        </div>
      </div>

      {/* Image modal / lightbox */}
      {modalImageSrc && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setModalImageSrc(null)}
        >
          <div
            className="relative max-w-5xl w-full max-h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setModalImageSrc(null)}
              className="absolute -top-4 right-0 md:-top-5 md:-right-5 rounded-full bg-white text-black border border-black/40 w-9 h-9 flex items-center justify-center text-xl leading-none hover:bg-gray-100 shadow-lg"
              aria-label="Close image preview"
            >
              ×
            </button>
            <div className="max-h-[90vh] w-full overflow-y-auto space-y-4">
              {currentSource.type === "image" &&
                currentSource.images.map((src) => (
                  <img
                    key={src}
                    src={src}
                    alt="Schedule preview enlarged"
                    className="w-full h-auto object-contain rounded-lg shadow-2xl bg-white"
                  />
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
