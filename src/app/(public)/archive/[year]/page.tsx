"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Download, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useParams, useSearchParams } from "next/navigation"
import { getImagesByYear } from "@/service/archive"
import SunIcon from "@/components/sunicon-gif"
import React, { Suspense } from 'react';

// Shimmer effect component
const ShimmerEffect = ({ className }: { className?: string }) => (
  <div className={`relative overflow-hidden rounded-lg border border-gray-200 shadow-sm ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-[shimmer_1.5s_infinite_linear]" style={{ backgroundSize: '200% 100%' }} />
    <div className="invisible">&nbsp;</div>
  </div>
)

// Gallery Image Shimmer Component
const GalleryImageShimmer = () => (
  <div className="aspect-[4/3] w-full h-full">
    <ShimmerEffect className="w-full h-full" />
  </div>
)

// Header Shimmer Component
const HeaderShimmer = () => (
  <header className="container mx-auto px-4 py-6 flex items-center justify-between relative">
    <ShimmerEffect className="h-6 w-16" />
    <ShimmerEffect className="h-8 w-20" />
    <ShimmerEffect className="h-7 w-7" />
  </header>
)

// Title Shimmer Component
const TitleShimmer = () => (
  <div className="text-center mb-8">
    <ShimmerEffect className="h-10 w-48 mx-auto mb-4" />
    <ShimmerEffect className="h-8 w-40 mx-auto" />
  </div>
)

// Modal component for image popup
function ImageModal({
  isOpen,
  onClose,
  imageSrc,
  imageAlt,
  onDownload,
}: {
  isOpen: boolean
  onClose: () => void
  imageSrc: string
  imageAlt: string
  onDownload: () => void
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 transition-all duration-300"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 z-10 bg-white rounded-full p-1 shadow-md"
              onClick={onClose}
              aria-label="Close modal"
            >
              <X size={24} />
            </button>

            <button
              className="absolute top-2 left-2 z-10 bg-transparent hover:bg-gray-100 rounded-full p-2 flex items-center transition-colors"
              onClick={onDownload}
              aria-label="Download image"
            >
              <Download size={20} />
            </button>

            <div className="p-1">
              <Image
                src={imageSrc || "/placeholder.svg"}
                alt={imageAlt}
                width={800}
                height={600}
                className="object-contain max-h-[80vh]"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface ImageData {
  id: string
  url: string
}

interface YearImagesResponse {
  year: number
  images: ImageData[]
}

function GalleryPageContent() {
  const params = useParams();
  const { year } = params as { year: string };
  const searchParams = useSearchParams();
  const yearId = searchParams.get("yearId");

  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [images, setImages] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const imagesPerPage = 12

  useEffect(() => {
    if (!yearId) {
      setError("Year ID is required to view this gallery");
      setIsLoading(false);
      return;
    }
    const fetchYearImages = async () => {
      try {
        setIsLoading(true)
        // Only use the specific year ID API
        const response = await getImagesByYear(yearId)
        if (response.success && response.data) {
          // Handle both possible API response shapes
          let imageUrls: string[] = [];
          if (
            response.data.archive &&
            !Array.isArray(response.data.archive) &&
            typeof response.data.archive === "object" &&
            Array.isArray((response.data.archive as any).images)
          ) {
            // New API shape: { archive: { year, images: [ { id, url } ] } }
            imageUrls = (response.data.archive as any).images.map((img: any) => img.url)
          } else if (
            Array.isArray(response.data.archive) &&
            response.data.archive.length > 0 &&
            (response.data.archive[0] as any).image_url
          ) {
            // Old API shape: { archive: [ { image_url, ... } ] }
            imageUrls = (response.data.archive as any[]).map((img: any) => img.image_url)
          }
          if (imageUrls.length > 0) {
            setImages(imageUrls)
          } else {
            setError(`No images found for year ${year}`)
          }
        } else {
          setError(response.error || "Failed to fetch images")
        }
      } catch (err) {
        setError("An error occurred while fetching images")
        console.error("Gallery fetch error:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchYearImages()
  }, [year, yearId])

  // Calculate pagination
  const totalPages = Math.ceil(images.length / imagesPerPage)
  const startIndex = (currentPage - 1) * imagesPerPage
  const endIndex = startIndex + imagesPerPage
  const currentImages = images.slice(startIndex, endIndex)

  // Function to handle image download
  const handleDownload = async () => {
    if (!selectedImage) return

    try {
      const response = await fetch(selectedImage.src)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.download = `gallery-${year}-image.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Download failed:", error)
      // Fallback method
      const link = document.createElement("a")
      link.href = selectedImage.src
      link.download = `gallery-${year}-image.jpg`
      link.target = "_blank"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  // Function to handle album download
  const handleAlbumDownload = () => {
    alert(`Downloading all ${images.length} images from ${year} album...`)
    // In a real application, this would trigger a zip download of all images
  }

  // Function to generate pagination items
  const generatePaginationItems = () => {
    const items = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          items.push(i)
        }
        items.push("ellipsis")
        items.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        items.push(1)
        items.push("ellipsis")
        for (let i = totalPages - 3; i <= totalPages; i++) {
          items.push(i)
        }
      } else {
        items.push(1)
        items.push("ellipsis")
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          items.push(i)
        }
        items.push("ellipsis")
        items.push(totalPages)
      }
    }

    return items
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FFFAEE] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4 font-dm-serif">Error Loading Gallery</h2>
          <p className="text-gray-600 mb-4 font-bilo">{error}</p>
          <Link href="/archive" className="text-blue-600 hover:underline">
            ← Back to Archive
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFFAEE]">
      {/* Header */}
      {isLoading ? (
        <HeaderShimmer />
      ) : (
        <header className="container mx-auto px-4 py-6 flex items-center justify-between relative">
          <Link
            href="/archive"
            className="flex items-center text-gray-700 hover:text-blue-700"
            aria-label="Back to archive"
          >
            <ArrowLeft size={20} className="mr-1" />
            <span>Back</span>
          </Link>

          <h1 className="text-2xl font-bold text-blue-700 absolute left-1/2 transform -translate-x-1/2 font-dm-serif">{year}</h1>

          <SunIcon size={28} className="" />
        </header>
      )}

      <main className="container mx-auto px-4 py-8 relative">
        <SunIcon size={24} className="absolute top-4 left-4" />
        <SunIcon size={24} className="absolute bottom-4 right-4" />

        {isLoading ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <TitleShimmer />

            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
              initial="hidden"
              animate="show"
            >
              {Array.from({ length: 12 }, (_, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 },
                  }}
                >
                  <GalleryImageShimmer />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h2 className="text-4xl font-bold text-center text-amber-800 mb-2 font-dm-serif">GALLERY {year}</h2>

            <div className="flex justify-center mb-8">
              <button
                className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-700 font-bilo"
                onClick={handleAlbumDownload}
              >
                <span>
                  Download {year} Album ({images.length} images)
                </span>
                <Download size={18} className="ml-2" />
              </button>
            </div>

            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
              initial="hidden"
              animate="show"
            >
              {currentImages.map((src, index) => (
                <motion.div
                  key={index}
                  className="aspect-[4/3] rounded-lg overflow-hidden cursor-pointer"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 },
                  }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  onClick={() => setSelectedImage({ src, alt: `Gallery image ${startIndex + index + 1}` })}
                >
                  <Image
                    src={src || "/placeholder.svg?height=225&width=300"}
                    alt={`Gallery image ${startIndex + index + 1}`}
                    width={300}
                    height={225}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg?height=225&width=300"
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-8"
              >
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>

                    {generatePaginationItems().map((item, index) => (
                      <PaginationItem key={index}>
                        {item === "ellipsis" ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            isActive={currentPage === item}
                            onClick={() => setCurrentPage(item as number)}
                            className="cursor-pointer"
                          >
                            {item}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>

                <div className="text-center mt-4 text-sm text-gray-600 font-bilo">
                  Page {currentPage} of {totalPages} • Showing {startIndex + 1}-{Math.min(endIndex, images.length)} of{" "}
                  {images.length} images
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </main>

      {/* Image Modal */}
      <ImageModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageSrc={selectedImage?.src || ""}
        imageAlt={selectedImage?.alt || ""}
        onDownload={handleDownload}
      />
    </div>
  )
}

export default function GalleryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GalleryPageContent />
    </Suspense>
  );
}
