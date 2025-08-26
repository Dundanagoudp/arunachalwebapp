"use client"
import Image from "next/image"
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
import { EffectCoverflow, Pagination, Navigation, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/effect-coverflow"
import "swiper/css/pagination"
import "swiper/css/navigation"
import { useEffect, useRef, useState } from "react"
import { getSpeaker } from "@/service/speaker"

interface Speaker {
  _id?: string
  id?: string
  name: string
  about: string
  image_url: string
  category?: string
}

export default function Speakers() {
  const [speakers, setSpeakers] = useState<Speaker[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigationPrevRef = useRef<HTMLButtonElement>(null)
  const navigationNextRef = useRef<HTMLButtonElement>(null)
  const swiperRef = useRef<any>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    async function fetchSpeakers() {
      setLoading(true)
      setError(null)
      try {
        const res = await getSpeaker()
        if (res.success && res.data) {
          setSpeakers(res.data)
        } else {
          setError(res.error || "Failed to fetch speakers.")
        }
      } catch (err) {
        setError("Failed to fetch speakers.")
      } finally {
        setLoading(false)
      }
    }
    fetchSpeakers()
  }, [])

  // Loading component
  const LoadingDots = () => (
    <div className="flex flex-col items-center justify-center min-h-[300px]">
      <div className="flex space-x-2 mt-10">
        <span className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-3 h-3 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></span>
      </div>
      <div className="mt-4 text-lg text-[#E67E22] font-semibold">Loading speakers...</div>
    </div>
  )

  // Error fallback
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#FFF8E7] to-[#FFFAEE]">
        <div className="text-red-500 text-xl font-bold mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="bg-[#E67E22] text-white px-6 py-2 rounded-full hover:bg-[#d35400] transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-0 md:min-h-screen bg-gradient-to-b from-[#FFF8E7] to-[#FFFAEE] relative overflow-x-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-24 h-24 md:w-32 md:h-32 opacity-30">
        <Image src="/schedule/diamond-pattern.png" alt="Pattern" fill className="object-contain" sizes="(max-width: 768px) 96px, 128px" />
      </div>
      <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 opacity-30">
        <Image src="/schedule/diamond-pattern.png" alt="Pattern" fill className="object-contain" sizes="(max-width: 768px) 96px, 128px" />
      </div>
      {/* Bottom Left Motif */}
      <div className="absolute bottom-0 left-0 w-24 h-24 md:w-32 md:h-32 opacity-30">
        <Image src="/schedule/diamond-pattern.png" alt="Pattern" fill className="object-contain" sizes="(max-width: 768px) 96px, 128px" />
      </div>
      {/* Bottom Right Motif */}
      <div className="absolute bottom-0 right-0 w-24 h-24 md:w-32 md:h-32 opacity-30">
        <Image src="/schedule/diamond-pattern.png" alt="Pattern" fill className="object-contain" sizes="(max-width: 768px) 96px, 128px" />
      </div>
      {/* Center Large Faint Motif */}
      <div className="absolute top-1/2 left-1/2 w-80 h-80 md:w-[32rem] md:h-[32rem] opacity-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none">
        <Image src="/schedule/diamond-pattern.png" alt="Pattern" fill className="object-contain" sizes="(max-width: 768px) 320px, 512px" />
      </div>

      <div className="container mx-auto py-8 md:py-16 px-2 md:px-4 pb-4 md:pb-16 relative z-10">
        {/* Header Section */}
        <header className="text-center mb-8 md:mb-16">
          {/* <p data-aos="fade-up" data-aos-delay="0" data-aos-duration="1000" className="text-[#E67E22] text-xl md:text-3xl uppercase tracking-wider mb-2 font-dm-serif whitespace-nowrap font-normal md:font-semibold">Arunachal Literature Festival</p> */}
          <h1 className="text-[#E67E22] text-2xl md:text-4xl uppercase font-semibold tracking-wide font-dm-serif">SPEAKERS</h1>

        </header>

        {/* Main Content */}
        <div className="relative">
          {loading ? (
            <LoadingDots />
          ) : (
            <div className="space-y-6 md:space-y-12">
              {/* Carousel Section */}
              <div data-aos="fade-up" data-aos-delay="0" data-aos-duration="1200" className="relative px-4 md:px-20">
                {/* Previous Arrow */}
                <button
                  ref={navigationPrevRef}
                  className="absolute left-0 md:left-4 top-1/2 z-20 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/90 backdrop-blur-sm shadow-xl hover:bg-[#E67E22] hover:text-white transition-all duration-300 flex items-center justify-center group border-2 border-[#E67E22]/20 hover:border-[#E67E22] hover:scale-110"
                  aria-label="Previous speaker"
                >
                  <ChevronLeft className="w-6 h-6 md:w-7 md:h-7 transition-transform group-hover:-translate-x-0.5" />
                </button>

                {/* Swiper Carousel */}
                <Swiper
                  effect="coverflow"
                  grabCursor={true}
                  centeredSlides={true}
                  slidesPerView="auto"
                  loop={true}
                  autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }}
                  coverflowEffect={{
                    rotate: 0,
                    stretch: 0,
                    depth: 100,
                    modifier: 2,
                    slideShadows: false,
                  }}
                  pagination={{
                    clickable: true,
                    dynamicBullets: true,
                  }}
                  navigation={{
                    prevEl: navigationPrevRef.current,
                    nextEl: navigationNextRef.current,
                  }}
                  modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
                  className="speaker-carousel w-full py-4"
                  breakpoints={{
                    640: {
                      coverflowEffect: {
                        stretch: 0,
                        depth: 200,
                        modifier: 2.5,
                      },
                    },
                    1024: {
                      coverflowEffect: {
                        stretch: 0,
                        depth: 300,
                        modifier: 3,
                      },
                    },
                  }}
                  onSwiper={(swiper) => {
                    swiperRef.current = swiper
                    setActiveIndex(swiper.realIndex)
                  }}
                  onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                >
                  {speakers.map((speaker, index) => {
                    // Calculate slide index for looped Swiper
                    let slideIndex = index
                    if (swiperRef.current && swiperRef.current.params.loop) {
                      const slidesLength = speakers.length
                      const realIndex = swiperRef.current.realIndex
                      // Swiper clones slides for looping, so we need to match realIndex
                      slideIndex = index
                    }
                    const isActive = activeIndex === index
                    return (
                      <SwiperSlide
                        key={speaker._id || speaker.id || index}
                        className={`!w-[280px] !h-[380px] md:!w-[320px] md:!h-[420px] lg:!w-[360px] lg:!h-[460px] mx-4 transition-opacity duration-300 ${isActive ? 'opacity-100 z-10' : 'opacity-40 z-0'}`}
                      >
                        <div className="relative group h-full w-full">
                          {/* Gradient Border Effect */}
                          <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 rounded-lg opacity-75 group-hover:opacity-100 transition duration-300 blur-sm group-hover:blur-md"></div>

                          {/* Card Container */}
                          <div className="relative bg-white p-1 rounded-lg h-full w-full transition-transform duration-300 group-hover:scale-[1.02]">
                            <div className="w-full h-full overflow-hidden rounded-lg shadow-2xl relative">
                              {/* Speaker Image */}
                              <Image
                                src={speaker.image_url || "/placeholder.svg?height=400&width=300"}
                                alt={speaker.name || "Speaker"}
                                fill
                                className="object-cover transition-transform duration-500 hover:scale-105"
                                priority={index < 3}
                                sizes="(max-width: 768px) 280px, (max-width: 1024px) 320px, 360px"
                              />

                              {/* Speaker Info Overlay */}
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent text-white p-4">
                                <h3 className="font-semibold text-lg mb-1 font-dm-serif">{speaker.name}</h3>
                                <p className="text-sm opacity-90 line-clamp-2 mb-2 font-bilo">{speaker.about}</p>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs bg-[#E67E22] px-2 py-1 rounded-full">
                                    {speaker.category || "Speaker"}
                                  </span>
                                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    )
                  })}
                </Swiper>

                {/* Next Arrow */}
                <button
                  ref={navigationNextRef}
                  className="absolute right-0 md:right-4 top-1/2 z-20 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/90 backdrop-blur-sm shadow-xl hover:bg-[#E67E22] hover:text-white transition-all duration-300 flex items-center justify-center group border-2 border-[#E67E22]/20 hover:border-[#E67E22] hover:scale-110"
                  aria-label="Next speaker"
                >
                  <ChevronRight className="w-6 h-6 md:w-7 md:h-7 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        .speaker-carousel .swiper-pagination {
          bottom: -10px !important;
        }
        
        .speaker-carousel .swiper-pagination-bullet {
          background: #E67E22 !important;
          opacity: 0.5 !important;
          transition: all 0.3s ease !important;
        }
        
        .speaker-carousel .swiper-pagination-bullet-active {
          opacity: 1 !important;
          transform: scale(1.2);
        }
        
        .speaker-carousel .swiper-pagination-bullet:hover {
          opacity: 0.8 !important;
        }
      `}</style>
    </div>
  )
}
