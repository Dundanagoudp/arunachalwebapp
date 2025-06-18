import Image from "next/image"
import Link from "next/link"
import { CalendarDays, MapPin } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative h-[50vh] md:h-[80vh] lg:h-screen w-full flex items-center justify-center text-center overflow-hidden">
      {/* Background Image */}
      <Image
        src="/herosection.png"
        alt="Arunachal Literature Festival Background"
        fill
        sizes="100vw"
        style={{
          objectFit: "cover",
          zIndex: -1,
        }}
        priority // Prioritize loading for the hero image
      />

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black opacity-10 z-0"></div>

      {/* Content */}
      <div className="relative z-10 p-4 md:p-8 lg:p-12 space-y-6 text-[#6A1B1A]">
        <h1 className="text-3xl md:text-6xl lg:text-6xl font-bold tracking-tight leading-tight font-serif mb-6">
          ARUNACHAL <br /> LITERATURE FESTIVAL
        </h1>

        {/* Event Details */}
        <div className="flex flex-col items-center mt-25 space-y-2 text-base md:text-xl text-white">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-white" />
            <span className="text-white">20th-22nd November '25</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-white" />
            <span className="text-white">D.K Convention Centre, Itanagar</span>
          </div>
        </div>

        {/* Button */}
        <Link
          href="https://arunanchalliteraturefestival.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block"
        >
          <div className="relative w-[200px] h-[60px] md:w-[300px] md:h-[100px]">
            <Image src="/herosectionbuttton.png" alt="Free Entry Button" fill style={{ objectFit: "contain" }} />
          </div>
        </Link>
      </div>
    </section>
  )
}
