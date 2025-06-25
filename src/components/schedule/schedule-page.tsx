import { Download } from "lucide-react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { getAllEvents } from "@/service/events-apis"

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
      speaker: t.speaker
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
        {/* Gradient overlays for blur effect */}
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white to-transparent pointer-events-none z-20" />
        <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-white to-transparent pointer-events-none z-20" />
      </div>
    </div>
  )
}

export default function Schedulepage() {
  const [activeTab, setActiveTab] = useState(0)
  const [loading, setLoading] = useState(true)
  const [scheduleData, setScheduleData] = useState<any[][]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchScheduleData()
        setScheduleData(data)
      } catch (err) {
        setError("Failed to load schedule data")
        console.error("Error loading schedule:", err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const events = scheduleData[activeTab] || []

  return (
    <div className="min-h-screen bg-[#FFFAEE] p-8 relative overflow-hidden">
      {/* Decorative sun icons */}
      <div className="absolute top-24 right-20">
        <Image src="/blogs/sun.gif" alt="Sun" width={40} height={24} />
      </div>
      <div className="absolute top-40 right-4">
        <Image src="/blogs/sun.gif" alt="Sun" width={32} height={32} />
      </div>
      <div className="absolute bottom-40 left-8">
        <Image src="/blogs/sun.gif" alt="Sun" width={40} height={40} />
      </div>
      <div className="absolute bottom-20 right-24">
        <Image src="/blogs/sun.gif" alt="Sun" width={45} height={24} />
      </div>
      <div className="absolute top-60 left-4">
        <Image src="/blogs/sun.gif" alt="Sun" width={35} height={28} />
      </div>
      <div className="absolute bottom-60 right-8">
        <Image src="/blogs/sun.gif" alt="Sun" width={36} height={36} />
      </div>
 

      <div className="max-w-3xl mx-auto">
        <header className="flex items-center justify-center mb-6">
          <h1 className="text-[#1A3FA9] text-4xl font-bold text-center font-dm-serif">SCHEDULE</h1>
        </header>
        <div className="flex justify-center mb-8">
          <button className="flex items-center gap-2 text-[#000000] hover:text-[#D95E1E] transition-colors">
            Download Schedule
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
                      <span className="block text-sm text-gray-600 font-normal mt-1 font-bilo">
                        Speaker: {event.speaker}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {/* Gradient overlays for blur effect */}
              <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white to-transparent pointer-events-none z-20" />
              <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-white to-transparent pointer-events-none z-20" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
