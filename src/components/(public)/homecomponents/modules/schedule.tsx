"use client"

import { ArrowUpRight } from "lucide-react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { getAllEvents } from "@/service/events-apis"
import { getScheduleDayPreviews } from "@/service/scheduleDayPreviewService"
import type { ScheduleDayPreview } from "@/types/scheduleDayPreview-types"
import { getMediaUrl } from "@/utils/mediaUrl"
import { useRouter } from "next/navigation"
import AOS from "aos"
import "aos/dist/aos.css"

const DEFAULT_DAY_LABELS = ["Day 1", "Day 2", "Day 3"]

function ImageViewerSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-1">
      <div className="h-[220px] w-full rounded-lg bg-gray-200 sm:h-[280px] md:h-[320px]" />
      <div className="h-4 w-2/3 rounded bg-gray-100 mx-auto" />
    </div>
  )
}

export default function Schedule() {
  const router = useRouter()
  const [activeDayIndex, setActiveDayIndex] = useState(0)
  const [previewDays, setPreviewDays] = useState<ScheduleDayPreview[]>([])
  const [festivalName, setFestivalName] = useState("ARUNACHAL LITERATURE FESTIVAL")
  const [festivalYear, setFestivalYear] = useState("2025")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalImageSrc, setModalImageSrc] = useState<string | null>(null)

  useEffect(() => {
    AOS.init({
      duration: 1200,
      easing: "ease-in-out",
      once: true,
    })
  }, [])

  useEffect(() => {
    let cancelled = false

    const loadScheduleData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [eventsResult, previewsResult] = await Promise.all([
          getAllEvents(),
          getScheduleDayPreviews(),
        ])

        if (cancelled) return

        if (eventsResult.success && eventsResult.data?.event) {
          const { event } = eventsResult.data
          setFestivalName(event.name || "ARUNACHAL LITERATURE FESTIVAL")
          setFestivalYear(String(event.year || "2025"))
        }

        if (previewsResult.success && previewsResult.data?.length) {
          setPreviewDays(previewsResult.data)
          setActiveDayIndex(0)
        }
      } catch {
        if (!cancelled) setError("Failed to load schedule data. Please try again later.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadScheduleData()
    return () => {
      cancelled = true
    }
  }, [])

  const dayLabels =
    previewDays.length > 0
      ? previewDays.map((day) => day.label || `Day ${day.dayNumber}`)
      : DEFAULT_DAY_LABELS

  const safeDayIndex = Math.min(activeDayIndex, Math.max(dayLabels.length - 1, 0))
  const currentPreview = previewDays[safeDayIndex]
  const images = (currentPreview?.images || []).map((src) => getMediaUrl(src))
  const downloadHref = currentPreview?.downloadUrl ? getMediaUrl(currentPreview.downloadUrl) : images[0]

  const handleViewAllClick = () => {
    router.push("/schedule")
  }

  const LoadingSkeleton = () => (
    <div className="flex flex-col md:flex-row w-full gap-4 sm:gap-5 md:gap-6 mt-6 sm:mt-8 md:mt-10">
      <div className="flex flex-row md:flex-col justify-start md:justify-start gap-3 sm:gap-4 md:gap-6 mb-2 md:mb-0 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 -mx-1 px-1 scrollbar-hide">
        {[1, 2, 3].map((day) => (
          <div key={day} className="flex items-center gap-[-12px] group relative flex-shrink-0">
            <div className="bg-gray-200 animate-pulse w-20 h-10 sm:w-24 sm:h-12 rounded-full" />
            <div className="bg-gray-200 animate-pulse w-8 h-8 sm:w-10 sm:h-10 ml-2 rounded-full" />
          </div>
        ))}
      </div>

      <div className="relative flex-1 bg-white rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-4 md:p-8 overflow-hidden border border-[#e0e0e0] max-w-7xl mx-auto w-full">
        <div className="max-h-[320px] sm:max-h-[380px] md:max-h-[500px] overflow-y-auto pr-2 md:pr-4 relative">
          <ImageViewerSkeleton />
        </div>
      </div>
    </div>
  )

  const ErrorComponent = () => (
    <div className="flex flex-col md:flex-row w-full gap-6 mt-10">
      <div className="relative flex-1 bg-white rounded-2xl shadow-2xl p-6 md:p-8 overflow-hidden border border-[#e0e0e0] max-w-7xl mx-auto w-full">
        <div className="text-center py-8">
          <div className="text-red-500 text-lg mb-4">⚠️</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#1A3FA9] text-white px-6 py-2 rounded-full hover:bg-[#1A3FA9]/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="relative min-h-0 md:min-h-screen bg-[#FFD76B] overflow-hidden flex flex-col items-center pb-12 sm:pb-16 md:pb-20">
      <div className="absolute top-2 left-2 w-10 h-10 md:w-16 md:h-16 z-0 opacity-80 pointer-events-none">
        <Image src="/schedule/diamond-pattern.png" alt="Diamond Pattern" fill className="object-contain" sizes="(max-width: 768px) 40px, 64px" />
      </div>
      <div className="absolute top-2 right-2 w-10 h-10 md:w-16 md:h-16 z-0 opacity-80 pointer-events-none">
        <Image src="/schedule/diamond-pattern.png" alt="Diamond Pattern" fill className="object-contain" sizes="(max-width: 768px) 40px, 64px" />
      </div>
      <div className="absolute bottom-2 left-2 w-10 h-10 md:w-16 md:h-16 z-0 opacity-80 pointer-events-none">
        <Image src="/schedule/diamond-pattern.png" alt="Diamond Pattern" fill className="object-contain" sizes="(max-width: 768px) 40px, 64px" />
      </div>
      <div className="absolute bottom-2 right-2 w-10 h-10 md:w-16 md:h-16 z-0 opacity-80 pointer-events-none">
        <Image src="/schedule/diamond-pattern.png" alt="Diamond Pattern" fill className="object-contain" sizes="(max-width: 768px) 40px, 64px" />
      </div>
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 z-0 opacity-60 pointer-events-none">
        <Image src="/schedule/diamond-pattern.png" alt="Diamond Pattern" fill className="object-contain" sizes="(max-width: 768px) 32px, 48px" />
      </div>
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 z-0 opacity-60 pointer-events-none">
        <Image src="/schedule/diamond-pattern.png" alt="Diamond Pattern" fill className="object-contain" sizes="(max-width: 768px) 32px, 48px" />
      </div>
      <div className="absolute top-1/4 left-10 w-8 h-8 md:w-12 md:h-12 z-0 opacity-70 pointer-events-none">
        <Image src="/schedule/diamond-pattern.png" alt="Diamond Pattern" fill className="object-contain" sizes="(max-width: 768px) 32px, 48px" />
      </div>
      <div className="absolute top-1/4 right-10 w-8 h-8 md:w-12 md:h-12 z-0 opacity-70 pointer-events-none">
        <Image src="/schedule/diamond-pattern.png" alt="Diamond Pattern" fill className="object-contain" sizes="(max-width: 768px) 32px, 48px" />
      </div>
      <div className="absolute bottom-1/4 left-10 w-8 h-8 md:w-12 md:h-12 z-0 opacity-70 pointer-events-none">
        <Image src="/schedule/diamond-pattern.png" alt="Diamond Pattern" fill className="object-contain" sizes="(max-width: 768px) 32px, 48px" />
      </div>
      <div className="absolute bottom-1/4 right-10 w-8 h-8 md:w-12 md:h-12 z-0 opacity-70 pointer-events-none">
        <Image src="/schedule/diamond-pattern.png" alt="Diamond Pattern" fill className="object-contain" sizes="(max-width: 768px) 32px, 48px" />
      </div>

      <div className="relative w-full h-[240px] md:h-[400px] lg:h-[420px] overflow-hidden flex justify-center items-center">
        <Image
          src="/schedule/mainimage.png"
          alt="Children reading with bamboo"
          width={1200}
          height={420}
          className="z-10 object-cover w-full h-full"
        />
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#fdf8f0] via-[#fdf8f0]/80 to-transparent z-20" />
      </div>

      <div className="relative z-10 flex flex-col items-center mt-[-56px] sm:mt-[-72px] md:mt-[-100px] w-full max-w-6xl px-3 sm:px-4">
        <div className="absolute right-[-180px] top-1/2 -translate-y-1/2 z-0 pointer-events-none hidden md:block">
          <Image
            src="/schedule/arch-pattern.png"
            alt="Arc Pattern"
            width={350}
            height={500}
            className="object-contain opacity-70 select-none"
          />
        </div>

        <div className="text-center mb-3 sm:mb-4 mt-10 sm:mt-14 md:mt-18">
          <h1
            data-aos="fade-up"
            data-aos-delay="0"
            data-aos-duration="1000"
            className="text-[#6A1B1A] text-base sm:text-xl md:text-3xl font-bold tracking-wider mb-1 sm:mb-2 font-dm-serif uppercase px-2"
          >
            {festivalName}
          </h1>
          <h2
            data-aos="fade-up"
            data-aos-delay="100"
            data-aos-duration="1000"
            className="text-[#6A1B1A] text-xl sm:text-2xl md:text-5xl font-bold font-dm-serif uppercase tracking-wide"
          >
            SCHEDULE {festivalYear}
          </h2>
        </div>

        <div data-aos="fade-up" data-aos-delay="200" data-aos-duration="1200" className="mt-5 sm:mt-6 md:mt-8 flex justify-center">
          <button
            onClick={handleViewAllClick}
            className="group relative flex items-center hover:scale-105 transition-transform duration-300 focus:outline-none cursor-pointer"
          >
            <span className="bg-[#6A1B1A] text-white px-5 py-2.5 sm:px-8 sm:py-3 rounded-full text-base sm:text-lg font-medium">View All</span>
            <span className="absolute right-0 left-22 sm:left-26 translate-x-1/2 bg-[#6A1B1A] w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:translate-x-6 group-hover:rotate-12">
              <ArrowUpRight className="w-4 h-4 text-white transition-transform duration-300 group-hover:rotate-45" />
            </span>
          </button>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <ErrorComponent />
        ) : (
          <div className="flex flex-col md:flex-row w-full gap-4 sm:gap-5 md:gap-6 mt-6 sm:mt-8 md:mt-10">
            <div
              data-aos="fade-right"
              data-aos-delay="0"
              data-aos-duration="1200"
              className="flex flex-row md:flex-col justify-start md:justify-start gap-3 sm:gap-4 md:gap-6 mb-2 md:mb-0 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 -mx-1 px-1 w-full md:w-auto scrollbar-hide"
            >
              <div className="flex flex-row md:flex-col gap-3 sm:gap-4 md:gap-6 min-w-max md:min-w-0">
                {dayLabels.map((label, index) => {
                  const isActive = safeDayIndex === index
                  return (
                    <div key={`${label}-${index}`} className="flex items-center gap-[-12px] group relative flex-shrink-0">
                      <button
                        onClick={() => setActiveDayIndex(index)}
                        className={
                          isActive
                            ? "flex items-center bg-[#1A3FA9] text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full text-base sm:text-lg font-semibold shadow-md border-2 border-[#1A3FA9] transition-all focus:outline-none whitespace-nowrap"
                            : "flex items-center bg-transparent text-[#1A3FA9] px-4 py-2 sm:px-6 sm:py-3 rounded-full text-base sm:text-lg font-semibold shadow-md border-2 border-[#1A3FA9] transition-all focus:outline-none hover:bg-[#e6eaff] whitespace-nowrap"
                        }
                      >
                        {label}
                      </button>
                      <button
                        onClick={() => setActiveDayIndex(index)}
                        className={
                          (isActive
                            ? "bg-[#1A3FA9] border-[#1A3FA9] shadow-md "
                            : "bg-transparent border-[#1A3FA9] hover:bg-[#e6eaff] ") +
                          " w-8 h-8 sm:w-10 sm:h-10 ml-1.5 sm:ml-2 rounded-full flex items-center justify-center border-2 transition-all duration-300 group-hover:translate-x-2 group-hover:rotate-12 flex-shrink-0"
                        }
                      >
                        <ArrowUpRight
                          className={
                            (isActive ? "text-white " : "text-[#1A3FA9] ") +
                            "w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:rotate-45"
                          }
                        />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>

            <div
              data-aos="fade-up"
              data-aos-delay="200"
              data-aos-duration="1200"
              className="relative flex-1 bg-white rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-4 md:p-6 overflow-hidden border border-[#e0e0e0] max-w-7xl mx-auto w-full mb-8 md:mb-15 z-10 min-w-0"
            >
              <div className="max-h-[320px] sm:max-h-[380px] md:max-h-[500px] overflow-y-auto overflow-x-hidden pr-1 sm:pr-2 md:pr-4 relative z-10 snap-y snap-mandatory">
                {images.length > 0 ? (
                  <div className="space-y-3 sm:space-y-4">
                    {images.map((src) => (
                      <button
                        key={src}
                        type="button"
                        onClick={() => setModalImageSrc(src)}
                        className="w-full block snap-start focus:outline-none focus:ring-2 focus:ring-[#1A3FA9]/30 rounded-lg"
                      >
                        <img src={src} alt="Schedule preview" className="w-full h-auto object-contain rounded-lg" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-[220px] sm:h-[280px] md:h-[360px] items-center justify-center text-center text-gray-500 font-bilo px-4 text-sm sm:text-base">
                    No schedule images uploaded for this day yet.
                  </div>
                )}
              </div>

              {downloadHref && images.length > 0 && (
                <div className="mt-3 text-right relative z-10">
                  <a
                    href={downloadHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#D95E1E] font-semibold underline text-sm md:text-base"
                  >
                    Open / Download
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#fdf8f0] via-[#fdf8f0]/80 to-transparent z-20" />

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
    </div>
  )
}
