"use client";

import Image from "next/image"
import SunIcon from "@/components/sunicon-gif";
import dynamic from "next/dynamic";

const DiamondPatternBackground = dynamic(() => import("../../DiamondPatternBackground"), { ssr: false });

export default function Speakerstopsection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#fdf8f0] min-h-[60vh] md:min-h-screen">
      {/* Diamond Pattern Background: hidden on mobile, visible on md+ */}
      <div className="hidden md:block">
        <DiamondPatternBackground />
      </div>
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[60vh] px-4 py-4 md:py-16">
        {/* Title */}
        <h1
          className="font-dm-serif text-2xl md:text-5xl lg:text-6xl font-bold text-center mb-3 md:mb-16 lg:mb-20 text-[#8B4513]"
        >
          OUR SPEAKERS
        </h1>

        {/* Animated Sun Icon */}
        <div className="mb-2 md:mb-12 lg:mb-16">
          <SunIcon size={130} className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32" />
        </div>

        {/* Text content */}
        <div className="text-center max-w-2xl">
          <p className="font-bilo text-sm md:text-2xl lg:text-3xl font-semibold leading-relaxed text-[#000000]">
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
