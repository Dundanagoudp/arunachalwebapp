import Image from "next/image"
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useEffect } from 'react'

export default function FestivalInfo() {
  useEffect(() => {
    AOS.init({
      duration: 1200,
      easing: 'ease-in-out',
      once: true,
    })
  }, [])

  return (
    <div className="relative bg-[#fdf8f0] flex items-center justify-center py-8 sm:py-12 lg:py-8 lg:min-h-150 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="relative z-10 max-w-4xl mx-auto text-center lg:text-left">
        <h1 data-aos="fade-up" data-aos-delay="0" data-aos-duration="1200" data-aos-easing="ease-in-out" className="text-3xl sm:text-4xl md:text-3xl font-bold text-[#1A3FA9] mb-6 md:mb-5 tracking-tight leading-tight font-serif text-center">
          WELCOME TO THE HAPPIEST FESTIVAL OF INDIA
        </h1>
        <p data-aos="fade-up" data-aos-delay="300" data-aos-duration="1200" data-aos-easing="ease-in-out" className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-7xl mx-auto text-center">
          Termed as 'The Happiest Festival in India', Arunachal Literature Festival, the annual celebration of our rich
          literary traditions, diverse cultures, and vibrant storytelling, has been bringing in meaningful voices to
          spark discussions on relevant topics concerning the country in general and Arunachal in particular. Started
          with the vision of encouraging our local authors and poets in the field of literature and to give them a
          platform, the festival has, over the years, brought together writers, poets, scholars, and enthusiasts from
          across the region and beyond. It has served as a platform for creative exchange, offering workshops, panel
          discussions, book launches, and cultural performances that highlight the unique heritage of the state.
        </p>
      </div>

      {/* Bamboo Image - Top Left (Hidden on mobile/tablet, visible on large screens) */}
      <div data-aos="fade-right" data-aos-delay="600" data-aos-duration="1200" data-aos-easing="ease-in-out" className="absolute top-0 left-0 p-4 sm:p-8 lg:p-12 hidden lg:block">
        <Image
          src="/welcome/image1.png"
          alt="Bamboo illustration"
          width={160}
          height={160}
          className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-contain"
          priority
        />
      </div>

      {/* Hornbill Image - Bottom Left (Hidden on mobile/tablet, visible on large screens) */}
      <div data-aos="fade-up" data-aos-delay="900" data-aos-duration="1200" data-aos-easing="ease-in-out" className="absolute bottom-0 left-0 p-4 sm:p-8 lg:p-12 hidden lg:block">
        <Image
          src="/welcome/image2.png"
          alt="Hornbill illustration"
          width={160}
          height={160}
          className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-contain"
          priority
        />
      </div>

      {/* Bull Image - Right Middle (Hidden on mobile/tablet, visible on large screens) */}
      <div data-aos="fade-left" data-aos-delay="1200" data-aos-duration="1200" data-aos-easing="ease-in-out" className="absolute top-1/2 right-0 -translate-y-1/2 p-4 sm:p-8 lg:p-12 hidden lg:block">
        <Image
          src="/welcome/image3.png"
          alt="Bull illustration"
          width={160}
          height={160}
          className="w-24 h-24 sm:w-32 sm:h-32 lg:w-60 lg:h-[180px] object-contain"
          priority
        />
      </div>
    </div>
  )
}
