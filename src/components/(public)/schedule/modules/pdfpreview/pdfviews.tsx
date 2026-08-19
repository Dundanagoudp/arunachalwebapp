"use client"

import { useEffect, useState } from "react"
import PdfViewTabs from "./pdf-viewtabs"
import { getScheduleDayPreviews } from "@/service/scheduleDayPreviewService"
import type { ScheduleDayPreview } from "@/types/scheduleDayPreview-types"
import { getMediaUrl } from "@/utils/mediaUrl"

export default function PdfViews() {
  const [days, setDays] = useState<ScheduleDayPreview[]>([])
  const [activeDay, setActiveDay] = useState(0)
  const [modalImageSrc, setModalImageSrc] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDays() {
      const result = await getScheduleDayPreviews()
      if (result.success && result.data) {
        setDays(result.data)
        setActiveDay(0)
      }
      setLoading(false)
    }
    fetchDays()
  }, [])

  const currentDay = days[activeDay]
  const images = (currentDay?.images || []).map((src) => getMediaUrl(src))
  const downloadHref = currentDay?.downloadUrl
    ? getMediaUrl(currentDay.downloadUrl)
    : images[0]

  const tabs = days.map((day, index) => ({
    id: index,
    label: day.label || `DAY ${day.dayNumber}`,
  }))

  if (loading) {
    return (
      <div className="bg-[#FFFAEE] rounded-2xl shadow-lg border border-gray-200 p-4 md:p-6 max-w-4xl mx-auto text-center text-muted-foreground">
        Loading schedule preview...
      </div>
    )
  }

  if (!days.length) {
    return (
      <div className="bg-[#FFFAEE] rounded-2xl shadow-lg border border-gray-200 p-4 md:p-6 max-w-4xl mx-auto text-center text-muted-foreground">
        Schedule preview is not available yet.
      </div>
    )
  }

  return (
    <div className="bg-[#FFFAEE] rounded-2xl shadow-lg border border-gray-200 p-4 md:p-6 max-w-4xl mx-auto">
      <PdfViewTabs activeDay={activeDay} onChange={setActiveDay} tabs={tabs} />

      <div className="mt-4">
        <div className="w-full bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md p-2 h-[420px] sm:h-[520px] md:h-[650px] overflow-y-auto">
          {images.length > 0 ? (
            <div className="space-y-4 h-full overflow-y-auto snap-y snap-mandatory">
              {images.map((src) => (
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
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No images uploaded for this day.
            </div>
          )}
        </div>

        {downloadHref && (
          <div className="mt-3 text-right">
            <a
              href={downloadHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D95E1E] font-semibold underline"
            >
              Open / Download
            </a>
          </div>
        )}
      </div>

      {modalImageSrc && images.length > 0 && (
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
    </div>
  )
}
