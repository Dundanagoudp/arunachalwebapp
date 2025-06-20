import { Download } from "lucide-react"
import { useState, useEffect } from "react"
import Image from "next/image"

const scheduleData = [
  [ // Day 1
    { id: "1", time: "09:00 AM", name: "Registration & Welcome Coffee" },
    { id: "2", time: "10:00 AM", name: "Opening Ceremony", speaker: "Chief Guest" },
    { id: "3", time: "11:00 AM", name: "Keynote Address: Preserving Indigenous Literature", speaker: "Dr. A. K. Mishra" },
    { id: "4", time: "12:00 PM", name: "Panel Discussion: Digital Age of Literature", speaker: "Multiple Speakers" },
    { id: "5", time: "01:00 PM", name: "Lunch Break" },
    { id: "6", time: "02:00 PM", name: "Workshop: Creative Writing in Tribal Languages", speaker: "Prof. R. Singh" },
    { id: "7", time: "03:30 PM", name: "Book Launch: 'Voices of Arunachal'", speaker: "Author Panel" },
    { id: "8", time: "04:30 PM", name: "Networking Session" },
    { id: "9", time: "05:30 PM", name: "Cultural Performance" },
  ],
  [ // Day 2
    { id: "10", time: "09:00 AM", name: "Morning Session: Poetry Reading", speaker: "Poetry Circle" },
    { id: "11", time: "10:30 AM", name: "Workshop: Storytelling Techniques", speaker: "Ms. P. Devi" },
    { id: "12", time: "12:00 PM", name: "Lunch Break" },
    { id: "13", time: "01:30 PM", name: "Panel: Publishing in Regional Languages", speaker: "Publishers Panel" },
    { id: "14", time: "03:00 PM", name: "Interactive Session: Youth Literature", speaker: "Young Authors" },
    { id: "15", time: "04:30 PM", name: "Book Signing Event" },
    { id: "16", time: "06:00 PM", name: "Evening Cultural Program" },
  ],
  [ // Day 3
    { id: "17", time: "09:00 AM", name: "Final Day Opening" },
    { id: "18", time: "10:00 AM", name: "Special Guest Talk: Future of Literature", speaker: "Dr. S. Kumar" },
    { id: "19", time: "11:30 AM", name: "Workshop: Digital Publishing", speaker: "Tech Experts" },
    { id: "20", time: "01:00 PM", name: "Lunch & Networking" },
    { id: "21", time: "02:30 PM", name: "Award Ceremony" },
    { id: "22", time: "04:00 PM", name: "Closing Ceremony" },
    { id: "23", time: "05:00 PM", name: "Farewell Tea" },
  ],
]

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
  const events = scheduleData[activeTab]

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [activeTab])

  return (
    <div className="min-h-screen bg-[#FFFAEE] p-8 relative overflow-hidden">
      {/* Decorative sun icons */}
      <div className="absolute top-24 right-20">
        <Image src="/blogs/sun.gif" alt="Sun" width={24} height={24} />
      </div>
      <div className="absolute top-40 right-4">
        <Image src="/blogs/sun.gif" alt="Sun" width={32} height={32} />
      </div>
      <div className="absolute bottom-40 left-8">
        <Image src="/blogs/sun.gif" alt="Sun" width={40} height={40} />
      </div>
      <div className="absolute bottom-20 right-24">
        <Image src="/blogs/sun.gif" alt="Sun" width={24} height={24} />
      </div>
      <div className="absolute top-60 left-4">
        <Image src="/blogs/sun.gif" alt="Sun" width={28} height={28} />
      </div>
      <div className="absolute bottom-60 right-8">
        <Image src="/blogs/sun.gif" alt="Sun" width={36} height={36} />
      </div>
      <div className="absolute bottom-1/4 left-1/4">
        <Image src="/blogs/sun.gif" alt="Sun" width={20} height={20} />
      </div>

      <div className="max-w-3xl mx-auto">
        <header className="flex items-center justify-center mb-6">
          <h1 className="text-[#1A3FA9] text-4xl font-bold text-center font-dm-serif">SCHEDULE</h1>
        </header>
        <div className="flex justify-center mb-8">
          <button className="flex items-center gap-2 text-[#1A3FA9] hover:text-[#D95E1E] transition-colors">
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
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-2">
            <div className="max-h-[500px] overflow-y-auto pr-4 relative">
              {events.map((event, index) => (
                <div key={event.id} className="grid grid-cols-[110px_1fr] gap-4 py-4 border-b last:border-b-0">
                  <div className="text-[#1A3FA9] font-bold text-base md:text-lg font-dm-serif">{event.time}</div>
                  <div className="text-[#6A1B1A] font-bilo font-semibold text-base md:text-lg">
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
