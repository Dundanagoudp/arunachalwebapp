"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Download, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import SunIcon from "@/components/archive/sun-icon"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

// Shimmer effect component
const ShimmerEffect = ({ className }: { className?: string }) => (
  <div className={`relative overflow-hidden ${className}`}>
    <div className="bg-gradient-to-r from-gray-300 via-gray-100 to-gray-300 bg-[length:200%_100%] animate-shimmer rounded h-full w-full"></div>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer rounded h-full w-full"></div>
  </div>
)

// Gallery Image Shimmer Component
const GalleryImageShimmer = () => (
  <div className="aspect-[4/3] rounded-lg overflow-hidden">
    <ShimmerEffect className="w-full h-full" />
  </div>
)

// Header Shimmer Component
const HeaderShimmer = () => (
  <header className="container mx-auto px-4 py-6 flex items-center justify-between relative">
    <ShimmerEffect className="h-6 w-16" />
    <ShimmerEffect className="h-8 w-20" />
    <ShimmerEffect className="h-7 w-7 rounded-full" />
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
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden"
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

export default function GalleryPage({ params }: { params: { year: string } }) {
  const { year } = params
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const imagesPerPage = 12

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000) // Show shimmer for 2 seconds

    return () => clearTimeout(timer)
  }, [])

  // Create an array of 48 images for the gallery
  const images = Array.from({ length: 48 }, (_, i) => {
    // Alternate between the two sample images
    return i % 2 === 0
      ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Frame%202095585096-X2btxoeKDnI6VIlmtlCzWFN1ELtjwR.png"
      : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Frame%202095585095-tkfzydTnu1GHwrL6TbaTaVVX8Mfudq.png"
  })

  // Calculate pagination
  const totalPages = Math.ceil(images.length / imagesPerPage)
  const startIndex = (currentPage - 1) * imagesPerPage
  const endIndex = startIndex + imagesPerPage
  const currentImages = images.slice(startIndex, endIndex)

  // Function to handle image download
  const handleDownload = async () => {
    if (!selectedImage) return

    try {
      // Create a temporary anchor element
      const link = document.createElement("a")
      link.href = selectedImage.src
      link.download = `gallery-${year}-image.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Download failed:", error)
    }
  }

  // Function to handle album download
  const handleAlbumDownload = () => {
    alert(`Downloading all images from ${year} album...`)
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
        items.push('ellipsis')
        items.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        items.push(1)
        items.push('ellipsis')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          items.push(i)
        }
      } else {
        items.push(1)
        items.push('ellipsis')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          items.push(i)
        }
        items.push('ellipsis')
        items.push(totalPages)
      }
    }

    return items
  }

  return (
    <div className="min-h-screen bg-[#FFFAEE]">
      {/* Header */}
      {isLoading ? (
        <HeaderShimmer />
      ) : (
        <header className="container mx-auto px-4 py-6 flex items-center justify-between relative">
          <Link href="/" className="flex items-center text-gray-700 hover:text-blue-700" aria-label="Back to archive">
            <ArrowLeft size={20} className="mr-1" />
            <span>Back</span>
          </Link>

          <h1 className="text-2xl font-bold text-blue-700 absolute left-1/2 transform -translate-x-1/2">{year}</h1>

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
            <h2 className="text-4xl font-bold text-center text-amber-800 mb-2">GALLERY {year}</h2>

            <div className="flex justify-center mb-8">
              <button className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-700">
                <span>Download {year} Album</span>
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
                  onClick={() => setSelectedImage({ src, alt: `Gallery image ${index + 1}` })}
                >
                  <Image
                    src={src || "/placeholder.svg"}
                    alt={`Gallery image ${index + 1}`}
                    width={300}
                    height={225}
                    className="w-full h-full object-cover"
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
                        {item === 'ellipsis' ? (
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
                
                <div className="text-center mt-4 text-sm text-gray-600">
                  Page {currentPage} of {totalPages} • Showing {startIndex + 1}-{Math.min(endIndex, images.length)} of {images.length} images
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
