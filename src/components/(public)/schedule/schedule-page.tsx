'use client';
import { Download } from "lucide-react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { getAllEvents } from "@/service/events-apis"
import { getPdfs } from "@/service/addPdfServices"
import { getMediaUrl } from "@/utils/mediaUrl"

// Month names for formatting
const months = [
  "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
];

// Fetch real schedule data from API
const fetchScheduleData = async () => {
  const result = await getAllEvents();
  if (!result.success || !result.data) throw new Error(result.error || "Failed to fetch events");
  const { event, days } = result.data;
  
  // Map days to the expected format
  const mappedDays = days.map((day) => 
    (day.times || []).map((t) => ({
      id: t._id,
      time: t.startTime,
      name: t.title,
      speaker: t.speaker,
      description: t.description
    }))
  );
  
  return mappedDays;
};

const tabLabels = ["DAY 1", "DAY 2", "DAY 3"]

function ScheduleSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-2 animate-pulse">
      <div className="max-h-[500px] overflow-y-auto pr-4 relative">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="grid grid-cols-[110px_1fr] gap-4 py-4 border-b last:border-b-0">
            <div className="h-6 w-20 bg-gray-200 rounded-full" />
            <div>
              <div className="h-6 w-3/4 bg-gray-200 rounded-full mb-2" />
              <div className="h-4 w-1/2 bg-gray-100 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Schedulepage() {
  const [activeTab, setActiveTab] = useState(0)
  const [loading, setLoading] = useState(true)
  const [scheduleData, setScheduleData] = useState<any[][]>([])
  const [error, setError] = useState<string | null>(null)
  const [downloading, setDownloading] = useState(false)
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set())

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchScheduleData()
        setScheduleData(data)
      } catch (err) {
        setError("Failed to load schedule data")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const events = scheduleData[activeTab] || []

  // Function to truncate text to approximately one line (around 50 characters)
  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  // Function to toggle description expansion
  const toggleDescription = (eventId: string) => {
    setExpandedDescriptions(prev => {
      const newSet = new Set(prev)
      if (newSet.has(eventId)) {
        newSet.delete(eventId)
      } else {
        newSet.add(eventId)
      }
      return newSet
    })
  }

  return (
    <div className="min-h-0 md:min-h-screen bg-[#FFFAEE] p-8 relative overflow-hidden">
      {/* Decorative sun icons - always visible, but repositioned for mobile */}
      {/* Top left corner */}
      <div className="absolute top-2 left-2 md:top-24 md:left-8">
        <Image src="/sungif.gif" alt="Sun" width={32} height={32} />
      </div>
      {/* Top right corner */}
      <div className="absolute top-2 right-2 md:top-24 md:right-20">
        <Image src="/sungif.gif" alt="Sun" width={32} height={32} />
      </div>
      {/* Bottom left corner */}
      <div className="absolute bottom-2 left-2 md:bottom-40 md:left-8">
        <Image src="/sungif.gif" alt="Sun" width={32} height={32} />
      </div>
      {/* Bottom right corner */}
      <div className="absolute bottom-2 right-2 md:bottom-20 md:right-24">
        <Image src="/sungif.gif" alt="Sun" width={32} height={32} />
      </div>
      {/* Optionally, add a center sun for md+ only */}
      <div className="hidden md:block absolute top-40 right-4">
        <Image src="/sungif.gif" alt="Sun" width={32} height={32} />
      </div>
      <div className="hidden md:block absolute top-60 left-4">
        <Image src="/sungif.gif" alt="Sun" width={35} height={28} />
      </div>
      <div className="hidden md:block absolute bottom-60 right-8">
        <Image src="/sungif.gif" alt="Sun" width={36} height={36} />
      </div>
 

      <div className="max-w-3xl mx-auto">
        <header className="flex items-center justify-center mb-6">
          <h1 className="text-[#1A3FA9] text-4xl font-bold text-center font-dm-serif">SCHEDULE</h1>
        </header>
        <div className="flex justify-center mb-8">
          <button
            onClick={async () => {
              try {
                setDownloading(true)
                const result = await getPdfs()
                if (result.success && Array.isArray(result.data) && result.data.length > 0) {
                  const firstPdf = result.data[0]
                  
                  if (firstPdf?.pdf_url) {
                    console.log(firstPdf.pdf_url)
                    window.open(getMediaUrl(firstPdf.pdf_url), "_blank")
                  } else {
                    alert("No schedule PDF URL available")
                  }
                } else {
                  alert(result.error || "No schedule PDF found")
                }
              } catch (e) {
                alert("Failed to download schedule")
              } finally {
                setDownloading(false)
              }
            }}
            disabled={downloading}
            className="flex items-center gap-2 text-[#000000] hover:text-[#D95E1E] transition-colors disabled:opacity-60"
          >
            {downloading ? "Preparing..." : "Download Schedule"}
            <Download className="w-5 h-5" />
          </button>
        </div>
        {/* Tab Bar */}
        <div className="mb-6">
          <div className="bg-[#FDB813] rounded-full p-1 flex border border-[#FDB813] shadow-md">
            {tabLabels.map((label, idx) => (
              <button
                key={label}
                onClick={() => setActiveTab(idx)}
                className={`flex-1 py-2 px-4 rounded-full font-dm-serif text-lg transition-all font-bold ${
                  activeTab === idx ? "bg-[#FFFFFF] text-[#D95E1E]" : "text-[#6A1B1A]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        {/* Event Card or Skeleton */}
        {loading ? (
          <ScheduleSkeleton />
        ) : error ? (
          <div className="text-red-500 text-center p-4">{error}</div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-2">
            <div className="max-h-[500px] overflow-y-auto pr-4 relative">
              {events.map((event, index) => (
                <div key={event.id} className="grid grid-cols-[110px_1fr] gap-4 py-4 border-b last:border-b-0">
                  <div className="text-[#000000] font-bold text-base md:text-lg font-dm-serif">{event.time}</div>
                  <div className="text-[#000000] font-bilo font-semibold text-base md:text-lg">
                    {event.name}
                    {event.speaker && (
                      <span className="block text-sm text-black font-normal mt-1 font-bilo">
                        Speaker: {event.speaker}
                      </span>
                    )}
                    {event.description && (
                      <div className="mt-2">
                        <span className="block text-sm text-gray-700 font-normal font-bilo text-justify">
                          {expandedDescriptions.has(event.id) 
                            ? event.description 
                            : truncateText(event.description)
                          }
                        </span>
                        {event.description.length > 50 && (
                          <button
                            onClick={() => toggleDescription(event.id)}
                            className="text-xs text-blue-600 hover:text-blue-800 font-bilo mt-1 underline"
                          >
                            {expandedDescriptions.has(event.id) ? "Read Less" : "Read More"}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
