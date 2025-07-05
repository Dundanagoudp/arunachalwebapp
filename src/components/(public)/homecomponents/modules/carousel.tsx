"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ChevronRight, ChevronLeft, ArrowUpRight } from "lucide-react"
import { motion } from "framer-motion"
import { CarouselCardSkeleton } from "@/components/skeleton-card"
import SunIcon from "../../archive/sun-icon"
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true) 

  const workshops = [
    {
      name: "Workshop Name",
      image: "/images/speaker.png", // Placeholder, replace with actual image URL
    },
    {
      name: "Workshop Name",
      image: "/images/speaker2.png", // Placeholder, replace with actual image URL
    },
    {
      name: "Workshop Name",
      image: "/images/speaker.png",
    },
    {
      name: "Workshop Name",
      image: "/images/speaker2.png",
    },
    {
      name: "Workshop Name",
      image: "/images/speaker.png",
    },
    {
      name: "Workshop Name",
      image: "/images/speaker2.png",
    },
  ]

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % workshops.length
      scrollToCard(newIndex)
      return newIndex
    })
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex - 1 + workshops.length) % workshops.length
      scrollToCard(newIndex)
      return newIndex
    })
  }

  const scrollToCard = (index: number) => {
    const container = document.querySelector(".carousel-container")
    const cards = document.querySelectorAll(".carousel-card-actual") as NodeListOf<HTMLElement>
    if (container && cards[index]) {
      const card = cards[index]
      const containerRect = container.getBoundingClientRect()
      const cardRect = card.getBoundingClientRect()
      const scrollLeft = container.scrollLeft + (cardRect.left - containerRect.left) - (containerRect.width / 2 - cardRect.width / 2)
      container.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      })
    }
  }

  useEffect(() => {
    AOS.init({
      duration: 1200,
      easing: 'ease-in-out',
      once: true,
    })

    // Simulate loading for 2 seconds
    const loadTimer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    // Auto-slide every 5 seconds
    const slideInterval = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => {
      clearTimeout(loadTimer)
      clearInterval(slideInterval)
    }
  }, [])

  return (
    <main className="min-h-screen bg-[#fdf8f0] relative overflow-hidden">
      {/* Decorative Diamond Elements - Like Footer */}
      <Image
        src="/dimond-white.png"
        alt="Decorative diamond pattern"
        width={100}
        height={100}
        className="absolute top-4 left-4 opacity-50 hidden sm:block pointer-events-none select-none"
      />
      <Image
        src="/dimond-white.png"
        alt="Decorative diamond pattern"
        width={100}
        height={100}
        className="absolute top-4 right-4 opacity-50 hidden sm:block pointer-events-none select-none"
      />
      <Image
        src="/dimond-white.png"
        alt="Decorative diamond pattern"
        width={100}
        height={100}
        className="absolute bottom-4 left-4 opacity-50 hidden sm:block pointer-events-none select-none"
      />
      <Image
        src="/dimond-white.png"
        alt="Decorative diamond pattern"
        width={100}
        height={100}
        className="absolute bottom-4 right-4 opacity-50 hidden sm:block pointer-events-none select-none"
      />
      <Image
        src="/dimond-white.png"
        alt="Decorative diamond pattern"
        width={100}
        height={100}
        className="absolute top-1/2 left-4 -translate-y-1/2 opacity-50 hidden md:block pointer-events-none select-none"
      />
      <Image
        src="/dimond-white.png"
        alt="Decorative diamond pattern"
        width={100}
        height={100}
        className="absolute top-1/2 right-4 -translate-y-1/2 opacity-50 hidden md:block pointer-events-none select-none"
      />
      <Image
        src="/dimond-white.png"
        alt="Decorative diamond pattern"
        width={100}
        height={100}
        className="absolute top-1/4 left-[10%] opacity-50 hidden lg:block pointer-events-none select-none"
      />
      <Image
        src="/dimond-white.png"
        alt="Decorative diamond pattern"
        width={100}
        height={100}
        className="absolute top-1/4 right-[10%] opacity-50 hidden lg:block pointer-events-none select-none"
      />
      <Image
        src="/dimond-white.png"
        alt="Decorative diamond pattern"
        width={100}
        height={100}
        className="absolute bottom-1/4 left-[10%] opacity-50 hidden lg:block pointer-events-none select-none"
      />
      <Image
        src="/dimond-white.png"
        alt="Decorative diamond pattern"
        width={100}
        height={100}
        className="absolute bottom-1/4 right-[10%] opacity-50 hidden lg:block pointer-events-none select-none"
      />

      {/* Decorative Sun Elements - Using placeholder.svg */}
      <div data-aos="fade-right" data-aos-delay="400" data-aos-duration="1200" className="absolute top-24 left-12">
        <SunIcon size={60} src="/sungif.gif" />
      </div>
      <div data-aos="fade-left" data-aos-delay="500" data-aos-duration="1200" className="absolute top-24 right-12">
        <SunIcon size={60} src="/sungif.gif" />
      </div>
      <div data-aos="fade-up" data-aos-delay="600" data-aos-duration="1200" className="absolute bottom-24 left-12">
        <SunIcon size={60} src="/sungif.gif" />
      </div>
      <div data-aos="fade-up" data-aos-delay="700" data-aos-duration="1200" className="absolute bottom-24 right-12">
        <SunIcon size={60} src="/sungif.gif" />
      </div>
      <div data-aos="zoom-in" data-aos-delay="800" data-aos-duration="1200" className="absolute bottom-1/2 left-1/2 transform -translate-x-1/2 translate-y-124">
        <SunIcon size={40} src="/sungif.gif" />
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div data-aos="fade-up" data-aos-delay="0" data-aos-duration="1200" className="flex justify-center items-center gap-4 mb-6">
            <hr className="w-32 border-t-2 border-[#6A1B1A]" />
            <h1 className="text-[#6A1B1A] text-3xl md:text-5xl font-serif italic font-bold">
              "BEYOND MYTHS AND <br /> MOUNTAINS"
            </h1>
            <hr className="w-32 border-t-2 border-[#6A1B1A]" />
          </div>

          <div data-aos="fade-up" data-aos-delay="200" data-aos-duration="1200" className="relative mt-30">
            <Image
              src="/images/circles.png"
              alt="Decorative circles"
              width={250}
              height={250}
              className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-30"
            />
            <div className="relative z-10">
              <h2 className="text-[#4F8049] text-xl md:text-2xl uppercase tracking-wider mb-2">
                ARUNACHAL LITERATURE FESTIVAL
              </h2>
              <h3 className="text-[#4F8049] text-2xl md:text-4xl uppercase font-semibold tracking-wide">
                WORKSHOPS AND EVENTS
              </h3>
            </div>
          </div>

          <div data-aos="fade-up" data-aos-delay="400" data-aos-duration="1200" className="mt-8 flex justify-center">
            <button className="group relative flex items-center hover:scale-105 transition-transform duration-300 focus:outline-none">
              <span className="bg-[#4F8049] text-white px-6 py-3 pr-12 rounded-full text-lg font-medium">
                Contact Us
              </span>
              <span className="absolute right-0 left-36 translate-x-1/2 bg-[#4F8049] w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:translate-x-6 group-hover:rotate-12">
                <ArrowUpRight className="w-4 h-4 text-white transition-transform duration-300 group-hover:rotate-45" />
              </span>
            </button>
          </div>
        </div>

        {/* Workshops Carousel */}
        <div className="relative mt-16 px-4 md:px-0 max-w-6xl mx-auto">
          <div className="flex items-center justify-center">
            <button
              onClick={prevSlide}
              className={`absolute left-[-48px] top-1/2 -translate-y-1/2 z-20 bg-[#e67e22] rounded-full p-3 flex items-center justify-center shadow-lg border-4 border-white md:border-4 md:bg-[#e67e22] md:shadow-lg md:flex md:items-center md:justify-center md:rounded-full md:p-3 md:z-20 md:absolute md:left-[-48px] md:top-1/2 md:-translate-y-1/2 md:block ${isLoading ? 'opacity-50' : 'opacity-100'}`}
              disabled={isLoading}
              style={{ transition: 'transform 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <span className="block md:hidden bg-black bg-opacity-30 rounded-full p-2">
                <ChevronLeft className="h-5 w-5 text-white" />
              </span>
              <span className="hidden md:block">
                <ChevronLeft className="h-5 w-5 text-white" />
              </span>
            </button>

            <div className="carousel-container flex space-x-6 overflow-x-auto w-full justify-start md:justify-center scrollbar-hide pb-4 scroll-smooth">
              {isLoading
                ? workshops.map((_, index) => <CarouselCardSkeleton key={index} />)
                : workshops.map((workshop, index) => (
                    <div
                      key={index}
                      data-aos="fade-up"
                      data-aos-delay={600 + index * 120}
                      data-aos-duration="1000"
                      className="flex flex-col items-center"
                    >
                      <div className="overflow-hidden rounded-lg w-64 h-100 shadow-md">
                        <div className="carousel-card-actual w-full h-full">
                          <Image
                            src={workshop.image || "/placeholder.svg"}
                            alt={workshop.name}
                            width={300}
                            height={400}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <p className="font-medium text-black text-lg mt-4">{workshop.name}</p>
                    </div>
                  ))}
            </div>

            <button
              onClick={nextSlide}
              className={`absolute right-[-48px] top-1/2 -translate-y-1/2 z-20 bg-[#e67e22] rounded-full p-3 flex items-center justify-center shadow-lg border-4 border-white md:border-4 md:bg-[#e67e22] md:shadow-lg md:flex md:items-center md:justify-center md:rounded-full md:p-3 md:z-20 md:absolute md:right-[-48px] md:top-1/2 md:-translate-y-1/2 md:block ${isLoading ? 'opacity-50' : 'opacity-100'}`}
              disabled={isLoading}
              style={{ transition: 'transform 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <span className="block md:hidden bg-black bg-opacity-30 rounded-full p-2">
                <ChevronRight className="h-5 w-5 text-white" />
              </span>
              <span className="hidden md:block">
                <ChevronRight className="h-5 w-5 text-white" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
