"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { getYearWiseImages, getYear } from "@/service/archive"
import SunIcon from "@/components/sunicon-gif"
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

// Year Card Shimmer Component
const YearCardShimmer = () => (
  <div className="border-2 border-orange-400 rounded-xl p-4 relative overflow-hidden">
    <div className="grid grid-cols-2 gap-2 mb-4">
      <ShimmerEffect className="aspect-[4/3] rounded-lg" />
      <ShimmerEffect className="aspect-[4/3] rounded-lg" />
      <ShimmerEffect className="aspect-[4/3] rounded-lg" />
      <ShimmerEffect className="aspect-[4/3] rounded-lg" />
    </div>
    <div className="flex justify-between items-center">
      <ShimmerEffect className="h-8 w-16" />
      <div className="flex items-center">
        <ShimmerEffect className="h-4 w-16" />
        <ShimmerEffect className="h-4 w-4 ml-1 rounded-full" />
      </div>
    </div>
  </div>
)

// Header Shimmer Component
const HeaderShimmer = () => (
  <header className="flex justify-center pt-8 pb-4 relative">
    <ShimmerEffect className="h-10 w-32 rounded-lg" />
  </header>
)

interface YearData {
  year: number
  yearId: string
  images: string[]
}

export default function Archive() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [yearData, setYearData] = useState<YearData[]>([])
  const [error, setError] = useState<string | null>(null)
  const [activeYearId, setActiveYearId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const cardsPerPage = 4

  useEffect(() => {
    const fetchArchiveData = async () => {
      try {
        setIsLoading(true)

        // Get both years and images data
        const [yearsResponse, imagesResponse] = await Promise.all([getYear(), getYearWiseImages()])

        if (yearsResponse.success && imagesResponse.success && yearsResponse.data && imagesResponse.data) {
          // Create a map of year numbers to year IDs
          const yearIdMap = new Map()
          if (yearsResponse.data.years) {
            yearsResponse.data.years.forEach((yearObj: any) => {
              yearIdMap.set(yearObj.year, yearObj._id)
            })
          }

          // Transform the images data with year IDs
          const transformedData: YearData[] = imagesResponse.data.archive.map((item: any) => ({
            year: item.year,
            yearId: yearIdMap.get(item.year) || item.year.toString(),
            images: item.images.filter((_: any, index: number) => index % 2 === 1),
          }))

          setYearData(transformedData.sort((a, b) => b.year - a.year))
        } else {
          setError("Failed to fetch archive data")
        }
      } catch (err) {
        setError("An error occurred while fetching data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchArchiveData()
  }, [])

  // Function to handle redirection when clicking on a year card
  const handleYearClick = (yearData: YearData) => {
    setActiveYearId(yearData.yearId)
    router.push(`/archive/${yearData.year}?yearId=${yearData.yearId}`)
  }

  // Pagination logic for year cards
  const totalPages = Math.ceil(yearData.length / cardsPerPage)
  const paginatedYearData = yearData.slice(
    (currentPage - 1) * cardsPerPage,
    currentPage * cardsPerPage
  )

  if (error) {
    return (
      <div className="min-h-screen bg-[#FFFAEE] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4 font-dm-serif">Error Loading Archive</h2>
          <p className="text-gray-600 font-bilo">{error}</p>
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
        <header className="flex justify-center pt-8 pb-4 relative">
          
          {/* Sun icon for desktop only */}
          <SunIcon size={32} className="absolute top-4 right-4 hidden md:block" />
          {/* Sun icons for mobile only, corners */}
          <div className="absolute top-4 left-4 block md:hidden">
            <SunIcon size={30} />
          </div>
          <div className="absolute top-4 right-4 block md:hidden">
            <SunIcon size={30} />
          </div>
          <h1 className="text-4xl font-dm-serif font-bold text-blue-700 tracking-wider">ARCHIVE</h1>
  
        </header>
        
      )}

      <main className="container mx-auto px-4 py-8 lg:max-w-8xl lg:px-8 relative">

        {/* Fixed top-left sun icon for desktop */}
        <div className="fixed top-4 left-4 hidden md:block z-30 pointer-events-none">
          <SunIcon size={35} />
        </div>

        {/* Sun icons for mobile only, bottom corners */}
        <div className="absolute bottom-4 left-4 block md:hidden z-0">
          <SunIcon size={20} />
        </div>
        <div className="absolute bottom-4 right-4 block md:hidden z-0">
          <SunIcon size={25} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          {/* Desktop sun icons inside grid */}
          <SunIcon size={38} className="absolute top-58 left-5 hidden md:block" />

          {isLoading ? (
            <>
              <YearCardShimmer />
              <YearCardShimmer />
              <YearCardShimmer />
              <YearCardShimmer />
            </>
          ) : (
            <>
              {paginatedYearData.map((data) => (
                <motion.div
                  key={data.year}
                  className={`group border-2 rounded-xl p-4 relative overflow-hidden cursor-pointer transition-colors ${activeYearId === data.yearId ? 'border-red-600' : 'border-orange-400'}`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  onClick={() => handleYearClick(data)}
                  tabIndex={0}
                  role="button"
                  aria-label={`View gallery for year ${data.year}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleYearClick(data)
                    }
                  }}
                >
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {data.images.slice(0, 4).map((imageUrl, index) => (
                      <div key={index} className="aspect-[4/3] rounded-lg overflow-hidden">
                        <Image
                          src={imageUrl || "/placeholder.svg?height=150&width=200"}
                          alt={`Gallery preview image ${index + 1} for year ${data.year}`}
                          width={200}
                          height={150}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/placeholder.svg?height=150&width=200"
                          }}
                        />
                      </div>
                    ))}
                    {/* Fill remaining slots with placeholders if not enough images */}
                    {Array.from({ length: Math.max(0, 4 - data.images.length) }, (_, index) => (
                      <div key={`placeholder-${index}`} className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-200">
                        <Image
                          src="/placeholder.svg?height=150&width=200"
                          alt={`Placeholder image ${index + 1}`}
                          width={200}
                          height={150}
                          className="w-full h-full object-cover opacity-50"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-amber-800 font-dm-serif">{data.year}</h2>
                    <div className={`flex items-center text-sm font-medium font-bilo transition-colors ${activeYearId === data.yearId ? 'text-red-600' : 'text-gray-700'} group-hover:text-red-600 group-focus:text-red-600`}>
                      View All ({data.images.length} images) <ArrowRight size={16} className={`ml-1 transition-colors ${activeYearId === data.yearId ? 'text-red-600' : ''} group-hover:text-red-600 group-focus:text-red-600`} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </>
          )}
          <SunIcon size={35} className="absolute bottom-10 left-0 hidden md:block" />
        </div>
        {/* Pagination Controls */}
        {!isLoading && totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <PaginationItem key={idx + 1}>
                    <PaginationLink
                      isActive={currentPage === idx + 1}
                      onClick={() => setCurrentPage(idx + 1)}
                      className="cursor-pointer"
                    >
                      {idx + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </main>
    </div>
  )
}
