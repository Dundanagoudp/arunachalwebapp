import Image from "next/image"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import SunIcon from "@/components/sunicon-gif"
import { getWorkshops } from "@/service/registrationService"
import type { Workshop } from "@/types/workshop-types"

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
        </div>
      </div>
    </div>
  )
}

export default function RegistrationSection() {
  const [loading, setLoading] = useState(true)
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [error, setError] = useState<string | null>(null)

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
        console.error("Error fetching workshops:", err)
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

  // Fallback workshops if API fails or returns empty
  const fallbackWorkshops: Workshop[] = [
    {
      _id: "fallback-1",
      eventRef: "fallback-event",
      name: "Screenwriting & Film Studies",
      imageUrl: "/registration/creative.png",
      about: "Learn the art of screenwriting and film analysis",
      registrationFormUrl: "/contactus",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 0
    },
    {
      _id: "fallback-2", 
      eventRef: "fallback-event",
      name: "Comics and Graphic Novels",
      imageUrl: "/registration/books.png", 
      about: "Create compelling visual narratives",
      registrationFormUrl: "/contactus",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 0
    },
    {
      _id: "fallback-3",
      eventRef: "fallback-event", 
      name: "Creative Writing & Literature",
      imageUrl: "/registration/typewriter.png",
      about: "Develop your creative writing skills",
      registrationFormUrl: "/contactus",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 0
    }
  ]

  const displayWorkshops = workshops.length > 0 ? workshops : fallbackWorkshops

  return (
    <div className="min-h-screen bg-[#FFFAEE] relative overflow-hidden">
      {/* Decorative Sun Icons */}
      <div className="absolute top-20 left-10">
        <SunIcon size={40} className="opacity-80" />
      </div>
      <div className="absolute top-32 right-16">
        <SunIcon size={35} className="opacity-70" />
      </div>
      <div className="absolute bottom-40 left-8">
        <SunIcon size={30} className="opacity-60" />
      </div>
      <div className="absolute top-96 right-20">
        <SunIcon size={25} className="opacity-50" />
      </div>

      {loading ? (
        <RegistrationSkeleton />
      ) : (
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-blue-600 mb-6 tracking-wider font-bilo">REGISTRATION</h1>
            <div className="flex items-center justify-center gap-4 mb-8">
              <SunIcon size={50} />
              <h2 className="text-3xl md:text-4xl font-bold text-orange-500 text-center font-dm-serif">
                BEGIN WHERE INDIA WAKES
                <br />
                REGISTER NOW
              </h2>
              <SunIcon size={50} />
            </div>
          </div>
          {/* Workshop Selection */}
          <div className="text-center mb-12">
            <h3 className="text-xl font-semibold text-gray-800 mb-8 font-bilo">Select your Workshop:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {displayWorkshops.map((workshop, index) => (
                <div key={index} className="relative">
                  {/* Workshop Card */}
                  <div
                    className="bg-white border-4 border-[#FFD76B] p-8 h-[420px] flex flex-col items-center justify-start relative overflow-visible rounded-t-full rounded-b-2xl w-full max-w-xs mx-auto"
                  >
                    {/* Workshop Image */}
                    <div className="mb-6 flex-1 flex items-center justify-center w-full">
                      <Image
                        src={workshop.imageUrl || "/registration/creative.png"}
                        alt={workshop.name}
                        width={180}
                        height={180}
                        className="object-contain drop-shadow-lg mt-2"
                      />
                    </div>
                    {/* Workshop Title */}
                    <h4 className="text-lg font-bold text-gray-800 text-center leading-tight font-dm-serif mt-2">
                      {workshop.name.split(" ").map((word, i) => (
                        <span key={i}>
                          {word}
                          {i === 0 && <br />}
                          {i > 0 && i < workshop.name.split(" ").length - 1 && " "}
                        </span>
                      ))}
                    </h4>
                  </div>
                  {/* Select Button */}
                  <div className="flex justify-center mt-6">
                    <button 
                      className="group relative flex items-center hover:scale-105 transition-transform duration-300 focus:outline-none"
                      onClick={() => handleWorkshopSelect(workshop)}
                    >
                      <span className="bg-[#1A3FA9] text-white px-6 py-2 pr-16 rounded-full text-lg font-medium text-center font-bilo">
                        select
                      </span>
                      <span className="absolute right-0 left-30 translate-x-1/2 bg-[#1A3FA9] w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:translate-x-6 group-hover:rotate-12">
                        <ArrowUpRight className="w-4 h-4 text-white transition-transform duration-300 group-hover:rotate-45" />
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
