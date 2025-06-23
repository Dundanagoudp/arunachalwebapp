"use client";

import Image from "next/image"
import SunIcon from "@/components/sunicon-gif";
import dynamic from "next/dynamic";

const DiamondPatternBackground = dynamic(() => import("./DiamondPatternBackground"), { ssr: false });

export default function Speakerstopsection() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden" style={{ backgroundColor: "#fdf8f0" }}>
      <DiamondPatternBackground />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16">
        {/* Title */}
        <h1
          className="font-dm-serif text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-12 md:mb-16 lg:mb-20 text-[#8B4513]"
        >
          OUR SPEAKERS
        </h1>

        {/* Animated Sun Icon */}
        <div className="mb-8 md:mb-12 lg:mb-16">
          <SunIcon size={120} className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32" />
        </div>

        {/* Text content */}
        <div className="text-center max-w-2xl">
          <p className="font-bilo text-xl md:text-2xl lg:text-3xl font-semibold leading-relaxed text-[#2D2D2D]">
            From India&apos;s first light,
            <br />
            something bright is coming
          </p>
        </div>
      </div>
    </section>
  )
}
