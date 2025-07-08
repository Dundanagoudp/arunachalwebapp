"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, X } from "lucide-react"
import { getAllImages } from "@/service/archive"
import type { ArchiveImage } from "@/types/archive-types"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function GallerySection() {
  const [gallery, setGallery] = useState<ArchiveImage[]>([])
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setIsLightboxOpen(true)
  }

  const closeLightbox = () => {
    setIsLightboxOpen(false)
  }

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % gallery.length)
  }, [gallery.length])

  const goToPrev = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + gallery.length) % gallery.length)
  }, [gallery.length])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        goToNext()
      } else if (event.key === "ArrowLeft") {
        goToPrev()
      } else if (event.key === "Escape") {
        closeLightbox()
      }
    },
    [goToNext, goToPrev],
  )

  useEffect(() => {
    if (isLightboxOpen) {
      window.addEventListener("keydown", handleKeyDown)
    } else {
      window.removeEventListener("keydown", handleKeyDown)
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isLightboxOpen, handleKeyDown])

  useEffect(() => {
    // Simulate loading for 1.5 seconds and fetch images
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 1500)
    getAllImages().then((res) => {
      if (res.success && res.data?.archive) {
        // Sort by createdAt descending and take 6 latest
        const sorted = [...res.data.archive].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        setGallery(sorted.slice(0, 6))
      }
    })
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    AOS.init({
      duration: 1200,
      easing: 'ease-in-out',
      once: true,
    })
  }, [])

  const currentImage = gallery[currentIndex]

  return (
    <section className="min-h-0 md:min-h-screen bg-[#FDF8EE] py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6 max-w-7xl mx-auto">
        <div className="relative flex flex-col items-center justify-center text-center space-y-4 mb-12">
          {/* Diamond patterns */}
          <Image
            src="/gallery/diamond-pattern.png"
            alt="Decorative diamond pattern"
            width={72}
            height={72}
            className="absolute top-0 left-1/4 -translate-x-1/2 -translate-y-1/2 hidden md:block "
          />
          <Image
            src="/gallery/diamond-pattern.png"
            alt="Decorative diamond pattern"
            width={72}
            height={72}
            className="absolute top-0 right-1/4 translate-x-1/2 -translate-y-1/2 hidden md:block"
          />
          <Image
            src="/gallery/diamond-pattern.png"
            alt="Decorative diamond pattern"
            width={72}
            height={72}
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block"
          />

          {isLoading ? (
            <>
              {/* Skeleton for header text */}
              <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mx-auto" />
              <div className="h-12 w-80 bg-gray-200 rounded animate-pulse mx-auto" />
              {/* Skeleton for button */}
              <div className="h-12 w-40 bg-gray-200 rounded-full animate-pulse mx-auto mt-4" />
            </>
          ) : (
            <>
              <p data-aos="fade-up" data-aos-delay="0" data-aos-duration="1000" className="text-[#1A3FA9] text-xl md:text-3xl uppercase tracking-wider mb-2 font-dm-serif mt-10">Arunachal Literature Festival</p>
              <h2 data-aos="fade-up" data-aos-delay="100" data-aos-duration="1000" className="text-[#1A3FA9] text-2xl md:text-4xl uppercase font-semibold tracking-wide font-dm-serif">GALLERY</h2>
              <Link href="/archive" data-aos="fade-up" data-aos-delay="200" data-aos-duration="1000" className="group relative flex items-center justify-center mt-4 focus:outline-none">
              <button
            className="group relative flex items-center hover:scale-105 transition-transform duration-300 focus:outline-none cursor-pointer"
          >
            <span className="bg-[#1A3FA9] text-white px-8 py-3 rounded-full text-lg font-medium">View All</span>
            <span className="absolute right-0 left-28 translate-x-1/2 bg-[#1A3FA9] w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:translate-x-6 group-hover:rotate-12">
              <ArrowUpRight className="w-4 h-4 text-white transition-transform duration-300 group-hover:rotate-45" />
            </span>
          </button>
              </Link>
            </>
          )}
        </div>

        {/* Responsive Gallery: Carousel on mobile, grid on md+ */}
        <div>
          {/* Mobile Carousel */}
          <div className="block md:hidden">
            {isLoading ? (
              <div className="flex space-x-4 overflow-x-auto pb-2">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg overflow-hidden shadow-md bg-gray-200 animate-pulse aspect-[3/2] min-w-[80vw] max-w-[90vw] h-48 flex items-center justify-center"
                  />
                ))}
              </div>
            ) : (
              <Swiper
                spaceBetween={16}
                slidesPerView={1}
                pagination={{ clickable: true }}
                modules={[Pagination]}
                className="w-full"
              >
                {gallery.map((image, index) => (
                  <SwiperSlide key={image._id}>
                    <div
                      data-aos="fade-up"
                      data-aos-delay={200 + index * 100}
                      data-aos-duration="1000"
                      className="rounded-lg overflow-hidden shadow-md cursor-pointer hover:opacity-90 transition-opacity aspect-[3/2] flex items-center justify-center bg-white min-w-[80vw] max-w-[90vw] h-48 mx-auto"
                      onClick={() => openLightbox(index)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          openLightbox(index)
                        }
                      }}
                    >
                      <Image
                        src={image.image_url || "/placeholder.svg"}
                        alt={image.originalName || `Gallery Image ${index + 1}`}
                        width={600}
                        height={400}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>

          {/* Desktop/Tablet Grid */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading
              ? Array.from({ length: 6 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg overflow-hidden shadow-md bg-gray-200 animate-pulse aspect-[3/2] flex items-center justify-center"
                  />
                ))
              : gallery.map((image, index) => (
                  <div
                    key={image._id}
                    data-aos="fade-up"
                    data-aos-delay={200 + index * 100}
                    data-aos-duration="1000"
                    className="rounded-lg overflow-hidden shadow-md cursor-pointer hover:opacity-90 transition-opacity aspect-[3/2] flex items-center justify-center bg-white"
                    onClick={() => openLightbox(index)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        openLightbox(index)
                      }
                    }}
                  >
                    <Image
                      src={image.image_url || "/placeholder.svg"}
                      alt={image.originalName || `Gallery Image ${index + 1}`}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ))}
          </div>
        </div>
      </div>

      {/* Integrated Image Lightbox */}
      {!isLoading && (
        <Dialog open={isLightboxOpen} onOpenChange={closeLightbox}>
          <DialogContent className="max-w-4xl w-full h-full flex flex-col items-center justify-center p-4 bg-transparent border-none shadow-none">
            <DialogTitle className="sr-only">Image Lightbox</DialogTitle>
            <Button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-50 bg-white text-black hover:bg-gray-200 rounded-full p-2"
              aria-label="Close lightbox"
            >
              <X className="h-6 w-6" />
            </Button>

            <div className="relative w-full h-full flex items-center justify-center">
              {currentImage && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src={currentImage.image_url || "/placeholder.svg"}
                    alt={currentImage.originalName || "Gallery Image"}
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
              )}
            </div>

            <Button
              onClick={goToPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-white text-black hover:bg-gray-200 rounded-full p-2"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-white text-black hover:bg-gray-200 rounded-full p-2"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </section>
  )
}
