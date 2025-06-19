"use client"

import { ArrowRight, ArrowUpRight } from "lucide-react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Types for schedule data
interface ScheduleEvent {
  id: string;
  time: string;
  event: string;
  description?: string;
  speaker?: string;
  location?: string;
  duration?: string;
  type?: 'keynote' | 'panel' | 'workshop' | 'break' | 'networking';
}

interface DaySchedule {
  day: string;
  date: string;
  events: ScheduleEvent[];
}

interface ScheduleData {
  festivalName: string;
  year: string;
  days: DaySchedule[];
}

// Mock API function - replace with actual API call
const fetchScheduleData = async (): Promise<ScheduleData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock data - replace this with actual API call
  return {
    festivalName: "ARUNACHAL LITERATURE FESTIVAL",
    year: "2025",
    days: [
      {
        day: "Day 1",
        date: "20th November",
        events: [
          { id: "1", time: "09:00 AM", event: "Registration & Welcome Coffee", type: "break" },
          { id: "2", time: "10:00 AM", event: "Opening Ceremony", type: "keynote", speaker: "Chief Guest" },
          { id: "3", time: "11:00 AM", event: "Keynote Address: Preserving Indigenous Literature", type: "keynote", speaker: "Dr. A. K. Mishra" },
          { id: "4", time: "12:00 PM", event: "Panel Discussion: Digital Age of Literature", type: "panel", speaker: "Multiple Speakers" },
          { id: "5", time: "01:00 PM", event: "Lunch Break", type: "break" },
          { id: "6", time: "02:00 PM", event: "Workshop: Creative Writing in Tribal Languages", type: "workshop", speaker: "Prof. R. Singh" },
          { id: "7", time: "03:30 PM", event: "Book Launch: 'Voices of Arunachal'", type: "keynote", speaker: "Author Panel" },
          { id: "8", time: "04:30 PM", event: "Networking Session", type: "networking" },
          { id: "9", time: "05:30 PM", event: "Cultural Performance", type: "keynote" },
        ]
      },
      {
        day: "Day 2",
        date: "21st November",
        events: [
          { id: "10", time: "09:00 AM", event: "Morning Session: Poetry Reading", type: "workshop", speaker: "Poetry Circle" },
          { id: "11", time: "10:30 AM", event: "Workshop: Storytelling Techniques", type: "workshop", speaker: "Ms. P. Devi" },
          { id: "12", time: "12:00 PM", event: "Lunch Break", type: "break" },
          { id: "13", time: "01:30 PM", event: "Panel: Publishing in Regional Languages", type: "panel", speaker: "Publishers Panel" },
          { id: "14", time: "03:00 PM", event: "Interactive Session: Youth Literature", type: "workshop", speaker: "Young Authors" },
          { id: "15", time: "04:30 PM", event: "Book Signing Event", type: "networking" },
          { id: "16", time: "06:00 PM", event: "Evening Cultural Program", type: "keynote" },
        ]
      },
      {
        day: "Day 3",
        date: "22nd November",
        events: [
          { id: "17", time: "09:00 AM", event: "Final Day Opening", type: "keynote" },
          { id: "18", time: "10:00 AM", event: "Special Guest Talk: Future of Literature", type: "keynote", speaker: "Dr. S. Kumar" },
          { id: "19", time: "11:30 AM", event: "Workshop: Digital Publishing", type: "workshop", speaker: "Tech Experts" },
          { id: "20", time: "01:00 PM", event: "Lunch & Networking", type: "break" },
          { id: "21", time: "02:30 PM", event: "Award Ceremony", type: "keynote" },
          { id: "22", time: "04:00 PM", event: "Closing Ceremony", type: "keynote" },
          { id: "23", time: "05:00 PM", event: "Farewell Tea", type: "networking" },
        ]
      }
    ]
  };
};

export default function Schedule() {
  const [activeDay, setActiveDay] = useState("Day 1")
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="flex flex-col md:flex-row w-full gap-6 mt-10">
      {/* Day buttons skeleton */}
      <div className="flex flex-row md:flex-col justify-center md:justify-start gap-4 md:gap-6 mb-6 md:mb-0">
        {[1, 2, 3].map((day) => (
          <div key={day} className="flex items-center gap-[-12px] group relative">
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
<div
  className="relative min-h-screen bg-[#FFD76B] overflow-hidden flex flex-col items-center pb-20"
  style={{
    backgroundImage: `
      url('/schedule/diamond-pattern.png'), 
      url('/schedule/diamond-pattern.png'), 
      url('/schedule/diamond-pattern.png'), 
      url('/schedule/diamond-pattern.png'), 
      url('/schedule/arch-pattern.png')
    `,
    backgroundPosition: `
      4% 8%,      /* top-left */
      96% 8%,     /* top-right */
      4% 92%,     /* bottom-left */
      96% 92%,    /* bottom-right */
      90% 80%     /* arch pattern */
    `,
    backgroundRepeat: "no-repeat, no-repeat, no-repeat, no-repeat, no-repeat",
    backgroundSize: `
      60px 60px, 
      60px 60px, 
      60px 60px, 
      60px 60px, 
      400px 650px
    `,
  }}
>

      {/* Diamond patterns - 10 positions, like speakers section */}
      <div className="absolute top-2 left-2 w-10 h-10 md:w-16 md:h-16 z-0 opacity-80 pointer-events-none">
        <Image src="/schedule/diamond-pattern.png" alt="Diamond Pattern" fill style={{ objectFit: "contain" }} />
      </div>
      <div className="absolute top-2 right-2 w-10 h-10 md:w-16 md:h-16 z-0 opacity-80 pointer-events-none">
        <Image src="/schedule/diamond-pattern.png" alt="Diamond Pattern" fill style={{ objectFit: "contain" }} />
      </div>
      <div className="absolute bottom-2 left-2 w-10 h-10 md:w-16 md:h-16 z-0 opacity-80 pointer-events-none">
        <Image src="/schedule/diamond-pattern.png" alt="Diamond Pattern" fill style={{ objectFit: "contain" }} />
      </div>
      <div className="absolute bottom-2 right-2 w-10 h-10 md:w-16 md:h-16 z-0 opacity-80 pointer-events-none">
        <Image src="/schedule/diamond-pattern.png" alt="Diamond Pattern" fill style={{ objectFit: "contain" }} />
      </div>
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 z-0 opacity-60 pointer-events-none">
        <Image src="/schedule/diamond-pattern.png" alt="Diamond Pattern" fill style={{ objectFit: "contain" }} />
      </div>
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 z-0 opacity-60 pointer-events-none">
        <Image src="/schedule/diamond-pattern.png" alt="Diamond Pattern" fill style={{ objectFit: "contain" }} />
      </div>
      <div className="absolute top-1/4 left-10 w-8 h-8 md:w-12 md:h-12 z-0 opacity-70 pointer-events-none">
        <Image src="/schedule/diamond-pattern.png" alt="Diamond Pattern" fill style={{ objectFit: "contain" }} />
      </div>
      <div className="absolute top-1/4 right-10 w-8 h-8 md:w-12 md:h-12 z-0 opacity-70 pointer-events-none">
        <Image src="/schedule/diamond-pattern.png" alt="Diamond Pattern" fill style={{ objectFit: "contain" }} />
      </div>
      <div className="absolute bottom-1/4 left-10 w-8 h-8 md:w-12 md:h-12 z-0 opacity-70 pointer-events-none">
        <Image src="/schedule/diamond-pattern.png" alt="Diamond Pattern" fill style={{ objectFit: "contain" }} />
      </div>
      <div className="absolute bottom-1/4 right-10 w-8 h-8 md:w-12 md:h-12 z-0 opacity-70 pointer-events-none">
        <Image src="/schedule/diamond-pattern.png" alt="Diamond Pattern" fill style={{ objectFit: "contain" }} />
      </div>

      {/* Top Illustration with matching #fdf8f0 blur effect */}
      <div className="relative w-full h-[320px] md:h-[400px] lg:h-[420px] overflow-hidden flex justify-center items-center">
        <Image
          src="/schedule/main-illustration.png"
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
        {/* Header */}
        <div className="text-center mb-4 mt-18">
          <h1 className="text-[#6A1B1A] text-2xl md:text-3xl lg:text-3xl font-bold tracking-wider mb-2 font-serif">
            {scheduleData?.festivalName || "ARUNACHAL LITERATURE FESTIVAL"}
          </h1>
          <h2 className="text-[#6A1B1A] text-xl md:text-2xl lg:text-4xl font-bold font-serif">
            SCHEDULE {scheduleData?.year || "2025"}
          </h2>
        </div>

        {/* View All Button */}
        <div className="mt-8 flex justify-center">
          <button className="group relative flex items-center hover:scale-105 transition-transform duration-300 focus:outline-none">
            <span className="bg-[#6A1B1A] text-white px-6 py-3 pr-12 rounded-full text-lg font-medium">
              View All
            </span>
            <span className="absolute right-0 left-30 translate-x-1/2 bg-[#6A1B1A] w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:translate-x-6 group-hover:rotate-12">
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
            {/* Day Buttons Sidebar */}
            <div className="flex flex-row md:flex-col justify-center md:justify-start gap-4 md:gap-6 mb-6 md:mb-0">
              {scheduleData.days.map((day) => {
                const isActive = activeDay === day.day;
                return (
                  <div key={day.day} className="flex items-center gap-[-12px] group relative">
                    <button
                      onClick={() => setActiveDay(day.day)}
                      className={
                        isActive
                          ? "flex items-center bg-[#1A3FA9] text-white px-6 py-3 rounded-full text-lg font-semibold shadow-md border-2 border-[#1A3FA9] transition-all focus:outline-none"
                          : "flex items-center bg-transparent text-[#1A3FA9] px-6 py-3 rounded-full text-lg font-semibold shadow-md border-2 border-[#1A3FA9] transition-all focus:outline-none hover:bg-[#e6eaff]"
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
                        " w-10 h-10 ml-2 rounded-full flex items-center justify-center border-2 transition-all duration-300 group-hover:translate-x-2 group-hover:rotate-12"
                      }
                    >
                      <ArrowUpRight className={
                        (isActive ? "text-white " : "text-[#1A3FA9] ") +
                        "w-5 h-5 transition-transform duration-300 group-hover:rotate-45"
                      } />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Schedule Table Card */}
            <div className="relative flex-1 bg-white rounded-2xl shadow-2xl p-6 md:p-8 overflow-hidden border border-[#e0e0e0] max-w-7xl mx-auto w-full mb-15">
              <div className="max-h-[400px] md:max-h-[500px] overflow-y-auto pr-4 relative">
                {scheduleData.days
                  .find(day => day.day === activeDay)
                  ?.events.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-[110px_1fr] gap-4 py-4 border-b last:border-b-0">
                      <div className="text-[#1A3FA9] font-bold text-base md:text-lg">{item.time}</div>
                      <div className="text-[#6A1B1A] font-semibold text-base md:text-lg">
                        {item.event}
                        {item.speaker && (
                          <span className="block text-sm text-gray-600 font-normal mt-1">
                            Speaker: {item.speaker}
                          </span>
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