"use client"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react"
import SunIcon from "@/components/sunicon-gif"
import { getWorkshops } from "@/service/registrationService"
import type { Workshop } from "@/types/workshop-types"
import { getMediaUrl } from "@/utils/mediaUrl"

// Skeleton shimmer loader for registration cards
function RegistrationSkeleton() {
  return (
    <div className="min-h-screen bg-[#FFFAEE] relative overflow-hidden">
      {/* Decorative Sun Icon Placeholders */}
      <div className="absolute top-20 left-10">
        <div className="rounded-full bg-gray-200 animate-pulse" style={{ width: 40, height: 40 }} />
      </div>
      <div className="absolute top-32 right-16">
        <div className="rounded-full bg-gray-200 animate-pulse" style={{ width: 35, height: 35 }} />
      </div>
      <div className="absolute bottom-40 left-8">
        <div className="rounded-full bg-gray-200 animate-pulse" style={{ width: 30, height: 30 }} />
      </div>
      <div className="absolute top-96 right-20">
        <div className="rounded-full bg-gray-200 animate-pulse" style={{ width: 25, height: 25 }} />
      </div>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="h-8 w-40 mx-auto mb-6 rounded bg-gray-200 animate-pulse" />
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse" />
            <div className="h-10 w-64 rounded bg-gray-200 animate-pulse" />
            <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse" />
          </div>
        </div>
        <div className="text-center mb-12">
          <div className="h-6 w-48 mx-auto mb-8 rounded bg-gray-200 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto justify-center">
            {[1, 2, 3].map((_, idx) => (
              <div key={idx} className="bg-gray-200 border-4 border-gray-200 animate-pulse p-8 h-[420px] flex flex-col items-center justify-start relative overflow-visible rounded-t-full rounded-b-2xl w-full max-w-xs mx-auto">
                <div className="mb-6 flex-1 flex items-center justify-center w-full">
                  <div className="w-[180px] h-[180px] rounded-full bg-gray-300 animate-pulse" />
                </div>
                <div className="h-6 w-32 rounded bg-gray-300 animate-pulse mt-2" />
                {/* Skeleton Select Button */}
                <div className="flex justify-center mt-6 w-full">
                  <div className="h-12 w-32 rounded-full bg-gray-300 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
          
          {/* Skeleton Pagination Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="h-10 w-20 rounded-full bg-gray-200 animate-pulse" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            </div>
            <div className="h-10 w-16 rounded-full bg-gray-200 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Error view for registration section
function RegistrationErrorView({ error }: { error: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFAEE]">
      <div className="bg-white border border-red-200 rounded-xl p-8 max-w-lg w-full text-center shadow">
        <h2 className="text-2xl font-bold text-red-600 mb-4 font-dm-serif">Registration Error</h2>
        <p className="text-gray-700 font-bilo">{error}</p>
      </div>
    </div>
  );
}

export default function RegistrationSection() {
  const [loading, setLoading] = useState(true)
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const workshopsPerPage = 3

  useEffect(() => {

    const fetchWorkshops = async () => {
      try {
        setLoading(true)
        const response = await getWorkshops()
        if (response.success && response.data) {
          setWorkshops(response.data)
        } else {
          setError(response.error || "Failed to fetch workshops")
        }
      } catch (err) {
        setError("Failed to fetch workshops")
      } finally {
        setLoading(false)
      }
    }

    fetchWorkshops()
  }, [])

  const handleWorkshopSelect = (workshop: Workshop) => {
    if (workshop.registrationFormUrl) {
      // Open registration form in new tab
      window.open(workshop.registrationFormUrl, '_blank', 'noopener,noreferrer')
    } else {
      // Fallback to contact page if no form URL
      window.open('/contactus', '_blank', 'noopener,noreferrer')
    }
  }

  // Pagination logic
  const totalPages = Math.ceil(workshops.length / workshopsPerPage)
  const startIndex = (currentPage - 1) * workshopsPerPage
  const endIndex = startIndex + workshopsPerPage
  const currentWorkshops = workshops.slice(startIndex, endIndex)

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages))
  }

  // Reset to first page when workshops change
  useEffect(() => {
    setCurrentPage(1)
  }, [workshops])

  return (
    <div className="min-h-screen bg-[#FFFAEE] relative overflow-hidden">
      {/* Decorative Sun Icons - mobile and desktop responsive */}
      {/* Mobile: sun icons in all corners and sides, evenly spaced */}
      <div className="absolute top-4 left-4 block md:hidden">
        <SunIcon size={24} className="opacity-80" />
      </div>
      <div className="absolute top-4 right-4 block md:hidden">
        <SunIcon size={24} className="opacity-80" />
      </div>
      <div className="absolute bottom-4 left-4 block md:hidden">
        <SunIcon size={24} className="opacity-80" />
      </div>
      <div className="absolute bottom-4 right-4 block md:hidden">
        <SunIcon size={24} className="opacity-80" />
      </div>
      {/* Optionally, mid-left and mid-right */}
      <div className="absolute top-1/2 left-2 -translate-y-1/2 block md:hidden">
        <SunIcon size={20} className="opacity-70" />
      </div>
      <div className="absolute top-1/2 right-2 -translate-y-1/2 block md:hidden">
        <SunIcon size={20} className="opacity-70" />
      </div>
      {/* Desktop: original sun icons */}
      <div className="absolute top-20 left-10 hidden md:block">
        <SunIcon size={40} className="opacity-80" />
      </div>
      <div className="absolute top-32 right-16 hidden md:block">
        <SunIcon size={35} className="opacity-70" />
      </div>
      <div className="absolute bottom-40 left-8 hidden md:block">
        <SunIcon size={30} className="opacity-60" />
      </div>
      <div className="absolute top-96 right-20 hidden md:block">
        <SunIcon size={25} className="opacity-50" />
      </div>

      {loading ? (
        <RegistrationSkeleton />
      ) : error ? (
        <RegistrationErrorView error={error} />
      ) : workshops.length === 0 ? (
        <RegistrationErrorView error="No workshops available at the moment. Please check back later." />
      ) : (
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-8">
            {/* Heading for mobile: two lines, smaller */}
            <h1 className="font-dm-serif font-bold text-blue-600 mb-6 tracking-wider text-xl md:text-2xl">REGISTRATION</h1>
            {/* Remove sun icon between heading and subheading on mobile */}
            {/* Mobile: two lines, smaller text, centered, spaced */}
            <div className="block md:hidden text-center">
              <div className="text-orange-500 text-lg font-bold font-dm-serif leading-tight mb-1">BEGIN WHERE INDIA WAKES</div>
              <div className="text-orange-500 text-lg font-bold font-dm-serif leading-tight">REGISTER NOW</div>
            </div>
            {/* Desktop: original heading and sun icons */}
            <div className="hidden md:flex items-center justify-center gap-4 mb-8">
              <SunIcon size={50} />
              <h2 className="text-2xl md:text-4xl font-bold text-orange-500 text-center font-dm-serif">
                BEGIN WHERE INDIA WAKES
                <br />
                REGISTER NOW
              </h2>
              <SunIcon size={50} />
            </div>
          </div>
          {/* Workshop Selection */}
          <div className="text-center mb-12">
            <h3 className="text-xl font-semibold text-gray-800 mb-8 font-dm-serif">Select your Workshop:</h3>
            <div className={`grid gap-8 max-w-6xl mx-auto ${
              currentWorkshops.length === 1 
                ? 'grid-cols-1 justify-center' 
                : currentWorkshops.length === 2 
                  ? 'grid-cols-1 md:grid-cols-2 justify-center' 
                  : 'grid-cols-1 md:grid-cols-3'
            }`}>
              {currentWorkshops.map((workshop: Workshop, index: number) => (
                <div key={workshop._id ?? index} className="relative">
                  {/* Workshop Card */}
                  <div
                    className={`bg-white border-4 border-[#FFD76B] p-8 flex flex-col items-center justify-start relative overflow-visible rounded-t-full rounded-b-2xl w-full max-w-xs mx-auto ${
                      currentWorkshops.length === 1 
                        ? 'h-[450px]' 
                        : 'h-[420px]'
                    }`}
                  >
                    {/* Workshop Image */}
                    <div className="mb-6 flex-1 flex items-center justify-center w-full">
                      <Image
                        src={getMediaUrl(workshop.imageUrl) || "/registration/creative.png"}
                        alt={workshop.name}
                        width={currentWorkshops.length === 1 ? 200 : 180}
                        height={currentWorkshops.length === 1 ? 200 : 180}
                        className="object-contain drop-shadow-lg mt-2"
                      />
                    </div>
                    {/* Workshop Title */}
                    <h4 className="text-lg font-bold text-gray-800 text-center leading-tight font-dm-serif mt-2 line-clamp-2">
                      {workshop.name}
                    </h4>
                  </div>
                  {/* Select Button */}
                  <div className="flex justify-center mt-6">
                    <button 
                      className="group relative flex items-center hover:scale-105 transition-transform duration-300 focus:outline-none"
                      onClick={() => handleWorkshopSelect(workshop)}
                    >
                      <span className="bg-[#1A3FA9] text-white px-8 py-2 rounded-full text-lg font-medium text-center font-bilo">
                        Select
                      </span>
                      <span className="absolute right-0 left-23 translate-x-1/2 bg-[#1A3FA9] w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:translate-x-6 group-hover:rotate-12">
                        <ArrowUpRight className="w-4 h-4 text-white transition-transform duration-300 group-hover:rotate-45" />
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination Controls - Only show if there are more than 3 workshops */}
            {workshops.length > workshopsPerPage && totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    currentPage === 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-[#1A3FA9] text-white hover:bg-[#0F2A7A] hover:scale-105'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-full text-sm font-medium transition-all duration-300 ${
                        currentPage === page
                          ? 'bg-[#1A3FA9] text-white'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    currentPage === totalPages
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-[#1A3FA9] text-white hover:bg-[#0F2A7A] hover:scale-105'
                  }`}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
