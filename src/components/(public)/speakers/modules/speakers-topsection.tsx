"use client";

import Image from "next/image"
import SunIcon from "@/components/sunicon-gif";
import dynamic from "next/dynamic";
import DiamondBackground from "./DiamondBackground";


const DiamondPatternBackground = dynamic(() => import("../../../DiamondPatternBackground"), { ssr: false });

export default function Speakerstopsection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#FFFAEE] min-h-0 md:min-h-[40vh] lg:min-h-[60vh]">
      {/* Diamond Pattern Background: hidden on mobile, visible on md+ */}
      <div className="hidden md:block">
        {/* <DiamondPatternBackground /> */}
        <DiamondBackground />
      </div>
      {/* Mobile Diamond Background: only on mobile, 3 small diamonds, not overlapping content */}
      <div className="block md:hidden absolute inset-0 pointer-events-none z-0">
        <DiamondBackground mobileCount={3} />
      </div>
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-0 px-4 py-4 md:py-8 lg:py-10">
        {/* Title */}
        <h1
          className="font-dm-serif text-xl md:text-4xl lg:text-5xl font-bold text-center mb-2 md:mb-8 lg:mb-10 text-[#8B4513]"
        >
          OUR SPEAKERS
        </h1>

        {/* Animated Sun Icon */}
        <div className="mb-2 md:mb-6 lg:mb-8">
          <SunIcon size={90} className="w-16 h-16 md:w-24 md:h-24 lg:w-28 lg:h-28" />
        </div>

        {/* Text content */}
        <div className="text-center max-w-2xl">
          <p className="font-dm-serif text-lg md:text-xl lg:text-2xl font-semibold leading-relaxed text-[#000000]">
            From India&apos;s first light,
            <br />
            something bright is coming
          </p>
        </div>
      </div>
      {/* Separator at bottom: visible only on mobile - make it thinner and less prominent */}
      <div className="block md:hidden w-full absolute bottom-0 left-0">
        <div className="mx-auto w-1/3 h-0.5 bg-[#8B4513] rounded-full opacity-20" />
      </div>
    </section>
  )
}
