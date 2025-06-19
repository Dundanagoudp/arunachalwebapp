"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowUpRight } from "lucide-react"

export default function Speakers() {
  const speakersData = [
    {
      id: "1",
      name: "Speaker Name",
      about: "About",
      image: "/images/speaker.png",
      isLarge: false,
    },
    {
      id: "2",
      name: "Speaker Name",
      about: "About",
      image: "/images/speaker2.png",
      isLarge: true,
    },
    {
      id: "3",
      name: "Speaker Name",
      about: "About",
      image: "/images/speaker.png",
      isLarge: false,
    },
       {
      id: "2",
      name: "Speaker Name",
      about: "About",
      image: "/images/speaker2.png",
      isLarge: true,
    },
    {
      id: "3",
      name: "Speaker Name",
      about: "About",
      image: "/images/speaker.png",
      isLarge: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8E7] to-[#FFFAEE] relative overflow-hidden">
      {/* Top-left diamond pattern */}
      <div className="absolute top-0 left-0 w-24 h-24 md:w-32 md:h-32 lg:w-30 lg:h-30 z-0">
        <Image src="/schedule/diamond-pattern.png" alt="Diamond Pattern" fill style={{ objectFit: "contain" }} />
      </div>
      {/* Top-right diamond pattern */}
      <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 lg:w-30 lg:h-30 z-0">
        <Image src="/schedule/diamond-pattern.png" alt="Diamond Pattern" fill style={{ objectFit: "contain" }} />
      </div>

      <div className="container mx-auto py-16 px-4 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-16">
          <p className="text-sm md:text-base text-gray-600 tracking-[0.3em] mb-4 font-medium">
            ARUNACHAL LITERATURE FESTIVAL
          </p>
          <div className="flex items-center gap-6 mb-8">
            <div className="w-3 h-3 bg-[#E67E22] rounded-full" />
            <h1 className="text-5xl md:text-7xl font-bold text-[#E67E22] font-serif tracking-wide">SPEAKERS</h1>
            <div className="w-3 h-3 bg-[#E67E22] rounded-full" />
          </div>
         <div className="mt-8 flex justify-center mb-8">
          <button className="group relative flex items-center hover:scale-105 transition-transform duration-300 focus:outline-none">
            <span className="bg-[#E67E22] text-white px-6 py-3 pr-12 rounded-full text-lg font-medium">
              View All
            </span>
            <span className="absolute right-0 left-30 translate-x-1/2 bg-[#E67E22] w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:translate-x-6 group-hover:rotate-12">
              <ArrowUpRight className="w-4 h-4 text-white transition-transform duration-300 group-hover:rotate-45" />
            </span>
          </button>
        </div>
        </div>

        {/* Speakers Grid - Staggered Layout */}
        <div className="flex flex-col lg:flex-row items-end justify-center gap-8 lg:gap-12 mt-20">
          {/* Left Speaker */}
          <div className="relative flex flex-col items-center order-2 lg:order-1">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 rounded-lg opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse"></div>
              <div className="relative bg-white p-1 rounded-lg">
                <div className="w-[220px] h-[300px] md:w-[260px] md:h-[340px] overflow-hidden rounded-lg shadow-2xl transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src={speakersData[0].image || "/placeholder.svg"}
                    alt={speakersData[0].name}
                    width={400} 
                    height={500} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent text-white p-4">
                    <p className="font-semibold text-lg mb-1">{speakersData[0].name}</p>
                    <p className="text-sm opacity-90">{speakersData[0].about}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Speaker (Large and elevated) */}
          <div className="relative flex flex-col items-center order-1 lg:order-2 lg:-mt-24">
            <div className="relative group">
              <div className="absolute -inset-3 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 rounded-lg opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse"></div>
              <div className="relative bg-white p-1 rounded-lg">
                <div className="w-[280px] h-[380px] md:w-[320px] md:h-[420px] overflow-hidden rounded-lg shadow-2xl transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src={speakersData[1].image || "/placeholder.svg"}
                    alt={speakersData[1].name}
                    width={400} 
                    height={500}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent text-white p-4">
                    <p className="font-semibold text-xl mb-1">{speakersData[1].name}</p>
                    <p className="text-base opacity-90">{speakersData[1].about}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Speaker */}
          <div className="relative flex flex-col items-center order-3">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 rounded-lg opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse"></div>
              <div className="relative bg-white p-1 rounded-lg">
                <div className="w-[220px] h-[300px] md:w-[260px] md:h-[340px] overflow-hidden rounded-lg shadow-2xl transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src={speakersData[2].image || "/placeholder.svg"}
                    alt={speakersData[2].name}
                    width={400} 
                    height={500} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent text-white p-4">
                    <p className="font-semibold text-lg mb-1">{speakersData[2].name}</p>
                    <p className="text-sm opacity-90">{speakersData[2].about}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
