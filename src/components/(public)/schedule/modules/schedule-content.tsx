import React, { useEffect, useState } from "react"
import { getAllEvents } from "@/service/events-apis"

export type ScheduleDay = 0 | 1 | 2

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
      time: t.startTime,
      name: t.title,
      speaker: t.speaker,
      description: t.description
    }))
  );
  
  return mappedDays;
};

function ScheduleSkeleton() {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm animate-pulse">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="py-4 flex flex-col sm:flex-row gap-4 items-start mb-4 last:mb-0 bg-white rounded-xl shadow-md border border-gray-200"
        >
          <div className="w-24 h-6 bg-gray-200 rounded-full mb-2 sm:mb-0" />
          <div className="flex-1">
            <div className="h-5 w-1/2 bg-gray-200 rounded-full mb-2" />
            <div className="h-4 w-1/3 bg-gray-100 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function ScheduleContent({ activeDay }: { activeDay: ScheduleDay }) {
  const [loading, setLoading] = useState(true)
  const [scheduleData, setScheduleData] = useState<any[][]>([])
  const [error, setError] = useState<string | null>(null)
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

  const events = scheduleData[activeDay] || []

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

  if (loading) return <ScheduleSkeleton />
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      {events.map((event, index) => (
        <div
          key={index}
          className="py-4 flex flex-col sm:flex-row gap-4 items-start mb-4 last:mb-0 bg-white rounded-xl shadow-md border border-gray-200"
        >
          <div className="w-24 font-medium text-[#000000] font-dm-serif text-base sm:text-lg mb-2 sm:mb-0">{event.time}</div>
          <div className="flex-1">
            <div className="font-bilo text-base text-[#000000]">{event.name}</div>
            {event.speaker && <div className="text-sm text-black mt-1 font-bilo">Speaker: {event.speaker}</div>}
            {event.description && (
              <div className="mt-2">
                <div className="text-sm text-gray-700 font-bilo text-justify">
                  {expandedDescriptions.has(event.time + event.name) 
                    ? event.description 
                    : truncateText(event.description)
                  }
                </div>
                {event.description.length > 50 && (
                  <button
                    onClick={() => toggleDescription(event.time + event.name)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-bilo mt-1 underline"
                  >
                    {expandedDescriptions.has(event.time + event.name) ? "Read Less" : "Read More"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
