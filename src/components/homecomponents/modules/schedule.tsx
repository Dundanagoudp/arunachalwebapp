"use client"

import { ArrowRight, ArrowUpRight } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function Schedule() {
  const [activeDay, setActiveDay] = useState("Day 1")

  const scheduleData = {
    "Day 1": [
      { time: "11:00 AM", event: "Event Name" },
      { time: "11:00 AM", event: "Event Name" },
      { time: "11:00 AM", event: "Jorem ipsum dolor sit amet, consectetur adipiscing elit." },
      { time: "11:00 AM", event: "Event Name" },
      { time: "11:00 AM", event: "Event Name" },
      { time: "12:00 PM", event: "Another Event" },
      { time: "01:00 PM", event: "Lunch Break" },
      { time: "02:00 PM", event: "Panel Discussion" },
      { time: "03:00 PM", event: "Workshop Session" },
      { time: "04:00 PM", event: "Closing Remarks" },
    ],
    "Day 2": [
      { time: "10:00 AM", event: "Day 2 Opening" },
      { time: "11:00 AM", event: "Keynote Speech" },
      { time: "12:00 PM", event: "Networking Session" },
      { time: "01:00 PM", event: "Lunch" },
      { time: "02:00 PM", event: "Breakout Sessions" },
    ],
    "Day 3": [
      { time: "09:00 AM", event: "Day 3 Welcome" },
      { time: "10:00 AM", event: "Special Guest Talk" },
      { time: "11:00 AM", event: "Book Signing" },
      { time: "12:00 PM", event: "Closing Ceremony" },
    ],
  }

  return (
    <div
      className="relative min-h-screen bg-[#FFD76B] overflow-hidden flex flex-col items-center pb-20"
      style={{
        backgroundImage: `url('/schedule/diamond-pattern.png'), url('/schedule/diamond-pattern.png'), url('/schedule/arch-pattern.png')`,
        backgroundPosition: '4% 8%, 96% 16%, 98% 100%',
        backgroundRepeat: 'no-repeat, no-repeat, no-repeat',
        backgroundSize: '60px 60px, 60px 60px, 250px 500px',
      }}
    >
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
      <div className="relative z-10 flex flex-col items-center mt-[-100px] w-full max-w-4xl px-4">
        {/* Header */}
        <div className="text-center mb-4 mt-18">
          <h1 className="text-[#6A1B1A] text-2xl md:text-3xl lg:text-3xl font-bold tracking-wider mb-2 font-serif">
            ARUNACHAL LITERATURE FESTIVAL
          </h1>
          <h2 className="text-[#6A1B1A] text-xl md:text-2xl lg:text-4xl font-bold font-serif">SCHEDULE 2025</h2>
        </div>

        {/* View All Button */}
        <div className="mt-8 flex justify-center">
          <button className="group relative flex items-center hover:scale-105 transition-transform duration-300 focus:outline-none">
            <span className="bg-[#6A1B1A] text-white px-6 py-3 pr-12 rounded-full text-lg font-medium">
              View All
            </span>
            <span className="absolute right-0 left-36 translate-x-1/2 bg-[#6A1B1A] w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:translate-x-6 group-hover:rotate-12">
              <ArrowUpRight className="w-4 h-4 text-white transition-transform duration-300 group-hover:rotate-45" />
            </span>
          </button>
        </div>

        {/* Schedule Section */}
        <div className="flex flex-col md:flex-row w-full gap-6 mt-10">
          {/* Day Buttons Sidebar */}
          <div className="flex flex-row md:flex-col justify-center md:justify-start gap-4 md:gap-6 mb-6 md:mb-0">
            {Object.keys(scheduleData).map((day, idx) => (
              <Button
                key={day}
                onClick={() => setActiveDay(day)}
                className={cn(
                  "px-6 py-3 rounded-full text-lg font-semibold shadow-md flex items-center gap-2 transition-all border-2",
                  activeDay === day
                    ? "bg-[#1A3FA9] text-white border-[#1A3FA9] scale-105"
                    : "bg-white text-[#1A3FA9] border-[#1A3FA9] hover:bg-[#e6eaff] hover:scale-105",
                )}
              >
                {day}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            ))}
          </div>

          {/* Schedule Table Card */}
          <div className="relative flex-1 bg-white rounded-2xl shadow-2xl p-6 md:p-8 overflow-hidden border border-[#e0e0e0]">
            <div className="max-h-[400px] md:max-h-[500px] overflow-y-auto pr-4 relative">
              {scheduleData[activeDay as keyof typeof scheduleData].map((item, index) => (
                <div key={index} className="grid grid-cols-[110px_1fr] gap-4 py-4 border-b last:border-b-0">
                  <div className="text-[#1A3FA9] font-bold text-base md:text-lg">{item.time}</div>
                  <div className="text-[#6A1B1A] font-semibold text-base md:text-lg">{item.event}</div>
                </div>
              ))}
              {/* Gradient overlay for blur effect at the bottom of the scrollable content */}
              <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white to-transparent pointer-events-none z-20" />
              {/* Gradient overlay for blur effect at the top of the scrollable content */}
              <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-white to-transparent pointer-events-none z-20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}