// "use client"

// import Image from "next/image"
// import { ArrowUpRight } from "lucide-react"
// import { Swiper, SwiperSlide } from "swiper/react"
// import { Navigation, Pagination, EffectCoverflow } from "swiper/modules"
// import "swiper/css"
// import "swiper/css/navigation"
// import "swiper/css/pagination"
// import "swiper/css/effect-coverflow"

// export default function Speakers() {
//   // Example data with many speakers (can be 5-56 items)
//   const speakersData = Array.from({ length: 56 }, (_, i) => ({
//     id: `${i + 1}`,
//     name: `Speaker ${i + 1}`,
//     about: `About speaker ${i + 1}`,
//     image: i % 2 === 0 ? "/images/speaker.png" : "/images/speaker2.png",
//     isLarge: i % 4 === 1, // Make every 4th speaker large (for desktop view)
//   }))

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-[#FFF8E7] to-[#FFFAEE] relative overflow-hidden">
//       {/* Decorative diamond patterns - 10 positions */}
//       <div className="absolute top-2 left-2 w-10 h-10 md:w-16 md:h-16 z-0 opacity-80">
//         <Image src="/schedule/diamond-pattern.png" alt="Diamond Pattern" fill style={{ objectFit: "contain" }} />
//       </div>
//       <div className="absolute top-2 right-2 w-10 h-10 md:w-16 md:h-16 z-0 opacity-80">
//         <Image src="/schedule/diamond-pattern.png" alt="Diamond Pattern" fill style={{ objectFit: "contain" }} />
//       </div>
//       <div className="absolute bottom-2 left-2 w-10 h-10 md:w-16 md:h-16 z-0 opacity-80">
//         <Image src="/schedule/diamond-pattern.png" alt="Diamond Pattern" fill style={{ objectFit: "contain" }} />
//       </div>
//       <div className="absolute bottom-2 right-2 w-10 h-10 md:w-16 md:h-16 z-0 opacity-80">
//         <Image src="/schedule/diamond-pattern.png" alt="Diamond Pattern" fill style={{ objectFit: "contain" }} />
//       </div>
//       <div className="absolute top-1/2 left-0 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 z-0 opacity-60">
//         <Image src="/schedule/diamond-pattern.png" alt="Diamond Pattern" fill style={{ objectFit: "contain" }} />
//       </div>
//       <div className="absolute top-1/2 right-0 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 z-0 opacity-60">
//         <Image src="/schedule/diamond-pattern.png" alt="Diamond Pattern" fill style={{ objectFit: "contain" }} />
//       </div>
//       <div className="absolute top-1/4 left-10 w-8 h-8 md:w-12 md:h-12 z-0 opacity-70">
//         <Image src="/schedule/diamond-pattern.png" alt="Diamond Pattern" fill style={{ objectFit: "contain" }} />
//       </div>
//       <div className="absolute top-1/4 right-10 w-8 h-8 md:w-12 md:h-12 z-0 opacity-70">
//         <Image src="/schedule/diamond-pattern.png" alt="Diamond Pattern" fill style={{ objectFit: "contain" }} />
//       </div>
//       <div className="absolute bottom-1/4 left-10 w-8 h-8 md:w-12 md:h-12 z-0 opacity-70">
//         <Image src="/schedule/diamond-pattern.png" alt="Diamond Pattern" fill style={{ objectFit: "contain" }} />
//       </div>
//       <div className="absolute bottom-1/4 right-10 w-8 h-8 md:w-12 md:h-12 z-0 opacity-70">
//         <Image src="/schedule/diamond-pattern.png" alt="Diamond Pattern" fill style={{ objectFit: "contain" }} />
//       </div>

//       <div className="container mx-auto py-16 px-4 relative z-10">
//         {/* Header Section */}
//         <div className="flex flex-col items-center text-center mb-16">
//           <p className="text-5xl md:text-2xl font-bold text-[#E67E22] font-serif tracking-wide">
//             ARUNACHAL LITERATURE FESTIVAL
//           </p>
//           <div className="flex items-center gap-6 mb-8">
//             <div className="w-3 h-3 bg-[#E67E22] rounded-full" />
//             <h1 className="text-5xl md:text-7xl font-bold text-[#E67E22] font-serif tracking-wide">SPEAKERS</h1>
//             <div className="w-3 h-3 bg-[#E67E22] rounded-full" />
//           </div>
//           <div className="mt-8 flex justify-center mb-2">
//             <button className="group relative flex items-center hover:scale-105 transition-transform duration-300 focus:outline-none">
//               <span className="bg-[#E67E22] text-white px-6 py-3 pr-12 rounded-full text-lg font-medium">
//                 View All
//               </span>
//               <span className="absolute right-0 left-30 translate-x-1/2 bg-[#E67E22] w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:translate-x-6 group-hover:rotate-12">
//                 <ArrowUpRight className="w-4 h-4 text-white transition-transform duration-300 group-hover:rotate-45" />
//               </span>
//             </button>
//           </div>
//         </div>

//         {/* Desktop & Mobile/Tablet Layout - Swiper Carousel */}
//         <div className="mt-12 px-4">
//           <Swiper
//             effect={"coverflow"}
//             grabCursor={true}
//             centeredSlides={true}
//             slidesPerView={1}
//             spaceBetween={20}
//             loop={true}
//             coverflowEffect={{
//               rotate: 0,
//               stretch: 0,
//               depth: 100,
//               modifier: 2.5,
//               slideShadows: true,
//             }}
//             pagination={{ 
//               clickable: true,
//               dynamicBullets: true 
//             }}
//             navigation={speakersData.length > 3}
//             modules={[EffectCoverflow, Pagination, Navigation]}
//             breakpoints={{
//               640: {
//                 slidesPerView: 2,
//               },
//               1024: {
//                 slidesPerView: 3,
//               },
//             }}
//             className="speakersSwiper"
//           >
//             {speakersData.map((speaker, idx) => (
//               <SwiperSlide 
//                 key={speaker.id} 
//                 // SwiperSlide does not accept a function for className, so use CSS for .swiper-slide-active
//                 className="transition-all duration-300 flex justify-center items-end base-speaker-slide"
//               >
//                 <div className="relative group h-full">
//                   <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 rounded-lg opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse"></div>
//                   <div className="relative bg-white p-1 rounded-lg h-full">
//                     <div className="w-full h-full overflow-hidden rounded-lg shadow-2xl transition-transform duration-300 group-hover:scale-105">
//                       <Image
//                         src={speaker.image}
//                         alt={speaker.name}
//                         width={400}
//                         height={500}
//                         className="w-full h-full object-cover"
//                       />
//                       <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent text-white p-4">
//                         <p className="font-semibold text-lg mb-1">{speaker.name}</p>
//                         <p className="text-sm opacity-90">{speaker.about}</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         </div>
//       </div>
//     </div>
//   )
// }

"use client"

import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, EffectCoverflow } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/effect-coverflow"

export default function Speakers() {
  // Example data with many speakers (can be 5-56 items)
  const speakersData = Array.from({ length: 56 }, (_, i) => ({
    id: `${i + 1}`,
    name: `Speaker ${i + 1}`,
    about: `About speaker ${i + 1}`,
    image: i % 2 === 0 ? "/images/speaker.png" : "/images/speaker2.png",
    isLarge: i % 4 === 1, // Make every 4th speaker large (for desktop view)
  }))

  // For desktop view, we'll show 3 speakers at a time (left, center, right)
  const desktopSpeakers = [
    speakersData[0] || { id: "1", name: "Speaker", about: "About", image: "/placeholder.svg", isLarge: false },
    speakersData[1] || { id: "2", name: "Speaker", about: "About", image: "/placeholder.svg", isLarge: true },
    speakersData[2] || { id: "3", name: "Speaker", about: "About", image: "/placeholder.svg", isLarge: false },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8E7] to-[#FFFAEE] relative overflow-hidden">
    {/* Decorative diamond patterns - 10 positions */}
    <div className="absolute top-2 left-2 w-10 h-10 md:w-16 md:h-16 z-0 opacity-80">
      <Image src="/schedule/diamond-pattern.png" alt="Diamond Pattern" fill style={{ objectFit: "contain" }} />
    </div>
    <div className="absolute top-2 right-2 w-10 h-10 md:w-16 md:h-16 z-0 opacity-80">
      <Image src="/schedule/diamond-pattern.png" alt="Diamond Pattern" fill style={{ objectFit: "contain" }} />
    </div>
    <div className="absolute bottom-2 left-2 w-10 h-10 md:w-16 md:h-16 z-0 opacity-80">
      <Image src="/schedule/diamond-pattern.png" alt="Diamond Pattern" fill style={{ objectFit: "contain" }} />
    </div>
    <div className="absolute bottom-2 right-2 w-10 h-10 md:w-16 md:h-16 z-0 opacity-80">
      <Image src="/schedule/diamond-pattern.png" alt="Diamond Pattern" fill style={{ objectFit: "contain" }} />
    </div>
    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 z-0 opacity-60">
      <Image src="/schedule/diamond-pattern.png" alt="Diamond Pattern" fill style={{ objectFit: "contain" }} />
    </div>
    <div className="absolute top-1/2 right-0 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 z-0 opacity-60">
      <Image src="/schedule/diamond-pattern.png" alt="Diamond Pattern" fill style={{ objectFit: "contain" }} />
    </div>
    <div className="absolute top-1/4 left-10 w-8 h-8 md:w-12 md:h-12 z-0 opacity-70">
      <Image src="/schedule/diamond-pattern.png" alt="Diamond Pattern" fill style={{ objectFit: "contain" }} />
    </div>
    <div className="absolute top-1/4 right-10 w-8 h-8 md:w-12 md:h-12 z-0 opacity-70">
      <Image src="/schedule/diamond-pattern.png" alt="Diamond Pattern" fill style={{ objectFit: "contain" }} />
    </div>
    <div className="absolute bottom-1/4 left-10 w-8 h-8 md:w-12 md:h-12 z-0 opacity-70">
      <Image src="/schedule/diamond-pattern.png" alt="Diamond Pattern" fill style={{ objectFit: "contain" }} />
    </div>
    <div className="absolute bottom-1/4 right-10 w-8 h-8 md:w-12 md:h-12 z-0 opacity-70">
      <Image src="/schedule/diamond-pattern.png" alt="Diamond Pattern" fill style={{ objectFit: "contain" }} />
    </div>

      <div className="container mx-auto py-16 px-4 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-16">
          <p className="text-5xl md:text-2xl font-bold text-[#E67E22] font-serif tracking-wide">
            ARUNACHAL LITERATURE FESTIVAL
          </p>
          <div className="flex items-center gap-6 mb-8">
            <div className="w-3 h-3 bg-[#E67E22] rounded-full" />
            <h1 className="text-5xl md:text-7xl font-bold text-[#E67E22] font-serif tracking-wide">SPEAKERS</h1>
            <div className="w-3 h-3 bg-[#E67E22] rounded-full" />
          </div>
          <div className="mt-8 flex justify-center mb-2">
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

        {/* Desktop Layout - Shows 3 speakers at a time */}
        <div className="hidden lg:flex flex-col lg:flex-row items-end justify-center gap-8 lg:gap-12 mt-20">
          {desktopSpeakers.map((speaker, index) => (
            <div 
              key={speaker.id} 
              className={`relative flex flex-col items-center ${
                index === 1 ? 'order-1 lg:order-2 lg:-mt-24' : 
                index === 0 ? 'order-2 lg:order-1' : 'order-3'
              }`}
            >
              <div className={`relative group ${index === 1 ? 'mt-12 mb-15' : ''}`}>
                <div className={`absolute ${
                  index === 1 ? '-inset-3' : '-inset-2'
                } bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 rounded-lg opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse`}></div>
                <div className="relative bg-white p-1 rounded-lg">
                  <div className={`${
                    speaker.isLarge ? 'w-[280px] h-[380px] md:w-[320px] md:h-[420px]' : 'w-[220px] h-[300px] md:w-[260px] md:h-[340px]'
                  } overflow-hidden rounded-lg shadow-2xl transition-transform duration-300 group-hover:scale-105`}>
                    <Image
                      src={speaker.image}
                      alt={speaker.name}
                      width={400}
                      height={500}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent text-white p-4">
                      <p className={`font-semibold ${speaker.isLarge ? 'text-xl' : 'text-lg'} mb-1`}>{speaker.name}</p>
                      <p className={`${speaker.isLarge ? 'text-base' : 'text-sm'} opacity-90`}>{speaker.about}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile & Tablet Layout - Swiper Carousel */}
        <div className="lg:hidden mt-12 px-4">
          <Swiper
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={"auto"}
            spaceBetween={20}
            loop={true}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 2.5,
              slideShadows: true,
            }}
            pagination={{ 
              clickable: true,
              dynamicBullets: true 
            }}
            navigation={speakersData.length > 3}
            modules={[EffectCoverflow, Pagination, Navigation]}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 3,
              },
            }}
            className="speakersSwiper"
          >
            {speakersData.map((speaker) => (
              <SwiperSlide 
                key={speaker.id} 
                className="!w-[280px] !h-[380px] md:!w-[240px] md:!h-[340px]"
              >
                <div className="relative group h-full">
                  <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 rounded-lg opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse"></div>
                  <div className="relative bg-white p-1 rounded-lg h-full">
                    <div className="w-full h-full overflow-hidden rounded-lg shadow-2xl transition-transform duration-300 group-hover:scale-105">
                      <Image
                        src={speaker.image}
                        alt={speaker.name}
                        width={400}
                        height={500}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent text-white p-4">
                        <p className="font-semibold text-lg mb-1">{speaker.name}</p>
                        <p className="text-sm opacity-90">{speaker.about}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  )
} 