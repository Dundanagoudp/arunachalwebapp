"use client"

import { ArrowUpRight } from "lucide-react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { getAllEvents } from "@/service/events-apis"
import { useRouter } from "next/navigation"
import AOS from 'aos'
import 'aos/dist/aos.css'

// Types for schedule data
interface ScheduleEvent {
  id: string
  time: string
  event: string
  speaker?: string
}

interface DaySchedule {
  day: string
  date: string
  events: ScheduleEvent[]
}

interface ScheduleData {
  festivalName: string
  year: string
  days: DaySchedule[]
}

// Month names for formatting
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

// Fetch real schedule data from API
const fetchScheduleData = async (): Promise<ScheduleData> => {
  const result = await getAllEvents()
  if (!result.success || !result.data) throw new Error(result.error || "Failed to fetch events")
  const { event, days } = result.data

  // Map days to DaySchedule[]
  const mappedDays = days.map((day) => ({
    day: `Day ${day.dayNumber}`,
    date: `${day.dayNumber} ${months[(event.month || 1) - 1]} ${event.year}`,
    events: (day.times || []).map((t) => ({
      id: t._id,
      time: `${t.startTime}`,
      event: t.title,
      speaker: t.speaker,
    })),
  }))

  return {
    festivalName: event.name,
    year: String(event.year),
    days: mappedDays,
  }
}

export default function Schedule() {
  const router = useRouter()
  const [activeDay, setActiveDay] = useState("Day 1")
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    AOS.init({
      duration: 1200,
      easing: 'ease-in-out',
      once: true,
    })
  }, [])

  useEffect(() => {
    const loadScheduleData = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchScheduleData()
        setScheduleData(data)
      } catch (err) {
        setError("Failed to load schedule data. Please try again later.")
        console.error("Error loading schedule:", err)
      } finally {
        setLoading(false)
      }
    }

    loadScheduleData()
  }, [])

  const handleViewAllClick = () => {
    router.push("/schedule")
  }

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="flex flex-col md:flex-row w-full gap-6 mt-10">
      {/* Day buttons skeleton */}
      <div className="flex flex-row md:flex-col justify-center md:justify-start gap-4 md:gap-6 mb-6 md:mb-0 overflow-x-auto md:overflow-x-visible">
        {[1, 2, 3].map((day) => (
          <div key={day} className="flex items-center gap-[-12px] group relative flex-shrink-0">
            <div className="bg-gray-200 animate-pulse w-24 h-12 rounded-full"></div>
            <div className="bg-gray-200 animate-pulse w-10 h-10 ml-2 rounded-full"></div>
          </div>
        ))}
      </div>

      {/* Schedule table skeleton */}
      <div className="relative flex-1 bg-white rounded-2xl shadow-2xl p-6 md:p-8 overflow-hidden border border-[#e0e0e0] max-w-7xl mx-auto w-full">
        <div className="max-h-[400px] md:max-h-[500px] overflow-y-auto pr-4 relative">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="grid grid-cols-[110px_1fr] gap-4 py-4 border-b last:border-b-0">
              <div className="bg-gray-200 animate-pulse h-6 rounded"></div>
              <div className="bg-gray-200 animate-pulse h-6 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // Error component
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
    <div className="relative min-h-screen bg-[#FFD76B] overflow-hidden flex flex-col items-center pb-20">
      {/* Diamond patterns - 10 positions, like speakers section */}
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

      {/* Top Illustration with matching #fdf8f0 blur effect */}
      <div className="relative w-full h-[240px] md:h-[400px] lg:h-[420px] overflow-hidden flex justify-center items-center">
        <Image
          src="/schedule/mainimage.png"
          alt="Children reading with bamboo"
          width={1200}
          height={420}
          className="z-10 object-cover w-full h-full"
        />
        {/* #fdf8f0 blur overlay at the top */}
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#fdf8f0] via-[#fdf8f0]/80 to-transparent z-20" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center mt-[-100px] w-full max-w-6xl px-4">
        {/* Arc image beside event box */}
        <div className="absolute right-[-180px] top-1/2 -translate-y-1/2 z-0 pointer-events-none hidden md:block">
          <Image
            src="/schedule/arch-pattern.png"
            alt="Arc Pattern"
            width={350}
            height={500}
            className="object-contain opacity-70 select-none"
          />
        </div>

        {/* Header */}
        <div className="text-center mb-4 mt-18">
          <h1 data-aos="fade-up" data-aos-delay="0" data-aos-duration="1000" className="text-[#6A1B1A] text-xl md:text-3xl font-bold tracking-wider mb-2 font-dm-serif uppercase">
            {scheduleData?.festivalName || "ARUNACHAL LITERATURE FESTIVAL"}
          </h1>
          <h2 data-aos="fade-up" data-aos-delay="100" data-aos-duration="1000" className="text-[#6A1B1A] text-2xl md:text-5xl font-bold font-dm-serif uppercase tracking-wide">
            SCHEDULE {scheduleData?.year || "2025"}
          </h2>
        </div>

        {/* View All Button */}
        <div data-aos="fade-up" data-aos-delay="200" data-aos-duration="1200" className="mt-8 flex justify-center">
          <button
            onClick={handleViewAllClick}
            className="group relative flex items-center hover:scale-105 transition-transform duration-300 focus:outline-none cursor-pointer"
          >
            <span className="bg-[#6A1B1A] text-white px-8 py-3 rounded-full text-lg font-medium">View All</span>
            <span className="absolute right-0 left-26 translate-x-1/2 bg-[#6A1B1A] w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:translate-x-6 group-hover:rotate-12">
              <ArrowUpRight className="w-4 h-4 text-white transition-transform duration-300 group-hover:rotate-45" />
            </span>
          </button>
        </div>

        {/* Schedule Section */}
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <ErrorComponent />
        ) : scheduleData ? (
          <div className="flex flex-col md:flex-row w-full gap-6 mt-10">
            {/* Day Buttons Sidebar - Mobile Horizontal Scroll, Desktop Vertical */}
            <div data-aos="fade-right" data-aos-delay="0" data-aos-duration="1200" className="flex flex-row md:flex-col justify-start md:justify-start gap-4 md:gap-6 mb-6 md:mb-0 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
              <div className="flex flex-row md:flex-col gap-4 md:gap-6 min-w-max md:min-w-0">
                {scheduleData.days.map((day) => {
                  const isActive = activeDay === day.day
                  return (
                    <div key={day.day} className="flex items-center gap-[-12px] group relative flex-shrink-0">
                      <button
                        onClick={() => setActiveDay(day.day)}
                        className={
                          isActive
                            ? "flex items-center bg-[#1A3FA9] text-white px-6 py-3 rounded-full text-lg font-semibold shadow-md border-2 border-[#1A3FA9] transition-all focus:outline-none whitespace-nowrap"
                            : "flex items-center bg-transparent text-[#1A3FA9] px-6 py-3 rounded-full text-lg font-semibold shadow-md border-2 border-[#1A3FA9] transition-all focus:outline-none hover:bg-[#e6eaff] whitespace-nowrap"
                        }
                      >
                        {day.day}
                      </button>
                      <button
                        onClick={() => setActiveDay(day.day)}
                        className={
                          (isActive
                            ? "bg-[#1A3FA9] border-[#1A3FA9] shadow-md "
                            : "bg-transparent border-[#1A3FA9] hover:bg-[#e6eaff] ") +
                          " w-10 h-10 ml-2 rounded-full flex items-center justify-center border-2 transition-all duration-300 group-hover:translate-x-2 group-hover:rotate-12 flex-shrink-0"
                        }
                      >
                        <ArrowUpRight
                          className={
                            (isActive ? "text-white " : "text-[#1A3FA9] ") +
                            "w-5 h-5 transition-transform duration-300 group-hover:rotate-45"
                          }
                        />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Schedule Table Card */}
            <div data-aos="fade-up" data-aos-delay="200" data-aos-duration="1200" className="relative flex-1 bg-white rounded-2xl shadow-2xl p-6 md:p-8 overflow-hidden border border-[#e0e0e0] max-w-7xl mx-auto w-full mb-15 z-10">
              <div className="max-h-[400px] md:max-h-[500px] overflow-y-auto pr-4 relative z-10">
                {scheduleData.days
                  .find((day) => day.day === activeDay)
                  ?.events.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-[110px_1fr] gap-4 py-4 border-b last:border-b-0">
                      <div className="text-[#1A3FA9] font-bold text-base md:text-lg">{item.time}</div>
                      <div className="text-[#6A1B1A] font-semibold text-base md:text-lg">
                        {item.event}
                        {item.speaker && (
                          <span className="block text-sm text-gray-600 font-normal mt-1">Speaker: {item.speaker}</span>
                        )}
                      </div>
                    </div>
                  ))}
                {/* Gradient overlay for blur effect at the bottom of the scrollable content */}
                <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white to-transparent pointer-events-none z-20" />
                {/* Gradient overlay for blur effect at the top of the scrollable content */}
                <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-white to-transparent pointer-events-none z-20" />
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* #fdf8f0 blur overlay at the bottom */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#fdf8f0] via-[#fdf8f0]/80 to-transparent z-20" />
    </div>
  )
}
