"use client"

import { useEffect, useState } from "react"
import PdfViewTabs from "./pdf-viewtabs"
import { getScheduleDayPreviews } from "@/service/scheduleDayPreviewService"
import type { ScheduleDayPreview } from "@/types/scheduleDayPreview-types"
import { getMediaUrl } from "@/utils/mediaUrl"

const DEFAULT_TABS = [
  { id: 0, label: "DAY 1" },
  { id: 1, label: "DAY 2" },
  { id: 2, label: "DAY 3" },
]

function ImageViewerSkeleton() {
  return (
    <div className="h-full animate-pulse space-y-4 p-1 sm:p-2">
      <div className="h-[220px] w-full rounded-lg bg-gray-200 sm:h-[320px] md:h-[480px]" />
      <div className="h-4 w-2/3 rounded bg-gray-100 mx-auto" />
    </div>
  )
}

export default function PdfViews() {
  const [days, setDays] = useState<ScheduleDayPreview[]>([])
  const [activeDay, setActiveDay] = useState(0)
  const [modalImageSrc, setModalImageSrc] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function fetchDays() {
      try {
        const result = await getScheduleDayPreviews()
        if (!cancelled && result.success && result.data?.length) {
          setDays(result.data)
          setActiveDay(0)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchDays()
    return () => {
      cancelled = true
    }
  }, [])

  const tabs =
    days.length > 0
      ? days.map((day, index) => ({
          id: index,
          label: day.label || `DAY ${day.dayNumber}`,
        }))
      : DEFAULT_TABS

  const safeActiveDay = Math.min(activeDay, Math.max(tabs.length - 1, 0))
  const currentDay = days[safeActiveDay]
  const images = (currentDay?.images || []).map((src) => getMediaUrl(src))
  const downloadHref = currentDay?.downloadUrl
    ? getMediaUrl(currentDay.downloadUrl)
    : images[0]

  return (
    <>
      <PdfViewTabs activeDay={safeActiveDay} onChange={setActiveDay} tabs={tabs} />

      <div className="mt-3 sm:mt-4 w-full min-w-0">
        <div className="w-full bg-white border border-gray-200 rounded-lg sm:rounded-xl overflow-hidden shadow-md p-1.5 sm:p-2 h-[320px] sm:h-[480px] md:h-[650px] overflow-y-auto overflow-x-hidden">
          {loading ? (
            <ImageViewerSkeleton />
          ) : images.length > 0 ? (
            <div className="space-y-3 sm:space-y-4 h-full overflow-y-auto snap-y snap-mandatory">
              {images.map((src) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setModalImageSrc(src)}
                  className="w-full block snap-start focus:outline-none focus:ring-2 focus:ring-[#1A3FA9]/30 rounded-md sm:rounded-lg"
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
            <div className="h-full flex items-center justify-center text-muted-foreground font-bilo text-sm sm:text-base px-4 text-center">
              No schedule images uploaded for this day yet.
            </div>
          )}
        </div>

        {!loading && downloadHref && (
          <div className="mt-2 sm:mt-3 text-right">
            <a
              href={downloadHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D95E1E] font-semibold underline text-sm sm:text-base"
            >
              Open / Download
            </a>
          </div>
        )}
      </div>

      {modalImageSrc && images.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-4"
          onClick={() => setModalImageSrc(null)}
        >
          <div
            className="relative max-w-5xl w-full max-h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setModalImageSrc(null)}
              className="absolute top-0 right-0 md:-top-5 md:-right-5 rounded-full bg-white text-black border border-black/40 w-9 h-9 flex items-center justify-center text-xl leading-none hover:bg-gray-100 shadow-lg z-10"
              aria-label="Close image preview"
            >
              ×
            </button>
            <div className="max-h-[85vh] sm:max-h-[90vh] w-full overflow-y-auto space-y-3 sm:space-y-4 pt-10 md:pt-0">
              {images.map((src) => (
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
    </>
  )
}
