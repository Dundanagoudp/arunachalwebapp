"use client"
import Image from "next/image"
import Link from "next/link"
import { CalendarDays, MapPin } from "lucide-react"
import { useEffect, useState } from "react"
import { getBanner, getButtonText, getText } from "@/service/homeService"
import { getMediaUrl } from "@/utils/mediaUrl"
export default function HeroSection() {
  const [bannerUrl, setBannerUrl] = useState<string | null>(null)
  const [imageError, setImageError] = useState(false)
  const [buttonLink, setButtonLink] = useState<string | null>(null)
  const [bannerText, setBannerText] = useState<string>("ARUNACHAL LITERATURE FESTIVAL")
  const [bannerSubText, setBannerSubText] = useState<string>("20th-22nd November ")
  const [location, setLocation] = useState<string>("D.K Convention Centre, Itanagar")
  const [bannerLink, setBannerLink] = useState<string>("")

  useEffect(() => {
    async function fetchBanner() {
      const response = await getBanner()
      if (response.success && response.data) {
        // If response.data is an array, use the first banner; otherwise, use the object
        if (Array.isArray(response.data) && response.data.length > 0) {
          console.log(response.data[0].image_url)
          setBannerUrl(response.data[0].image_url)
          setImageError(false) // Reset error state when new banner is fetched
        } else if (response.data.image_url) {
          setBannerUrl(response.data.image_url)
          setImageError(false) // Reset error state when new banner is fetched
        }
      }
    }
    fetchBanner()
  }, [])

  useEffect(() => {
    async function fetchButton() {
      const response = await getButtonText()
      if (response.success && response.data) {
        // If response.data is an array, use the first button; otherwise, use the object
        if (Array.isArray(response.data) && response.data.length > 0) {
          setButtonLink(response.data[0].link || null)
        } else if (response.data.link) {
          setButtonLink(response.data.link)
        }
      }
    }
    fetchButton()
  }, [])

  useEffect(() => {
    async function fetchBannerText() {
      const response = await getText()
      if (response.success && response.data) {
        // If response.data is an array, use the first banner text; otherwise, use the object
        if (Array.isArray(response.data) && response.data.length > 0) {
          const bannerData = response.data[0]
          setBannerText(bannerData.bannerText || "ARUNACHAL LITERATURE FESTIVAL")
          setBannerSubText(bannerData.bannerSubText || "20th-22nd November '25")
          setLocation(bannerData.location || "D.K Convention Centre, Itanagar")
          setBannerLink(bannerData.link || "")
        } else if (response.data) {
          setBannerText(response.data.bannerText || "ARUNACHAL LITERATURE FESTIVAL")
          setBannerSubText(response.data.bannerSubText || "20th-22nd November '25")
          setLocation(response.data.location || "D.K Convention Centre, Itanagar")
          setBannerLink(response.data.link || "")
        }
      }
    }
    fetchBannerText()
  }, [])

  // Function to handle image load errors
  const handleImageError = () => {
    setImageError(true)
  }

  // Function to get the appropriate image source
  const getImageSrc = () => {
    if (imageError || !bannerUrl) {
      return "/herosection.png"  // Use PNG as primary fallback
    }
    const mediaUrl = getMediaUrl(bannerUrl)
    return mediaUrl !== "/placeholder.svg" ? mediaUrl : "/herosection.png"
  }

  return (
    <section className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-screen w-full flex items-center justify-center text-center overflow-hidden">
      {/* Background Image */}
      <Image
        src={getImageSrc()}
        alt="Arunachal Literature Festival Background"



        fill
        sizes="100vw"
        style={{
          objectFit: "cover",
          zIndex: -1,
        }}
        onError={handleImageError}
        priority // Prioritize loading for the hero image
      />

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black opacity-10 z-0"></div>

      {/* Content */}
      <div className="relative z-10 p-4 sm:p-6 md:p-8 lg:p-12 space-y-4 sm:space-y-6 text-[#6A1B1A] animate-fade-in pb-8 lg:pb-12 xl:pb-40">
        <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight font-serif mb-4 sm:mb-6 animate-slide-up ">
          {bannerText.split(' ').map((word, index) => (
            <span key={index}>
              {word}
              {index < bannerText.split(' ').length - 1 && ' '}
              {index === Math.floor(bannerText.split(' ').length / 2) - 1 && <br />}
            </span>
          ))}
        </h1>

        {/* Event Details */}
        <div className="flex flex-col items-center mt-12 sm:mt-20 space-y-2 text-sm sm:text-base md:text-xl text-white animate-slide-up-delay">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            <span className="text-white">{bannerSubText}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            {bannerLink ? (
              <Link 
                href={bannerLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-blue-300 transition-colors duration-300 cursor-pointer"
              >
                {location}
              </Link>
            ) : (
              <span className="text-white">{location}</span>
            )}
          </div>
        </div>

        {/* Button */}
        <div className="mt-6 sm:mt-8 animate-slide-up-button">
          {buttonLink ? (
            <Link
              href={buttonLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block transition-transform duration-300 hover:scale-105 active:scale-95"
            >
              <div className="relative w-[160px] h-[48px] sm:w-[180px] sm:h-[54px] md:w-[250px] md:h-[75px] lg:w-[300px] lg:h-[100px]">
                <Image src="/homefree.png" alt="Free Entry Button" fill style={{ objectFit: "contain" }} sizes="(max-width: 768px) 200px, 300px" />
              </div>
            </Link>
          ) : (
            <div className="inline-block transition-transform duration-300 hover:scale-105 active:scale-95 cursor-default">
              <div className="relative w-[160px] h-[48px] sm:w-[180px] sm:h-[54px] md:w-[250px] md:h-[75px] lg:w-[300px] lg:h-[100px]">
                <Image src="/homefree.png" alt="Free Entry Button" fill style={{ objectFit: "contain" }} sizes="(max-width: 768px) 200px, 300px" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUpDelay {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounceIn {
          from {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }

        .animate-slide-up {
          animation: slideUp 0.8s ease-out;
        }

        .animate-slide-up-delay {
          animation: slideUpDelay 0.8s ease-out 0.3s both;
        }

        .animate-slide-up-button {
          animation: slideUp 1s cubic-bezier(0.23, 1, 0.32, 1) 0.6s both;
        }
      `}</style>
    </section>
  )
}
