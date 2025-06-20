import React, { useEffect, useState } from "react"

export type ScheduleDay = 0 | 1 | 2

const scheduleData = [
  [ // Day 1
    { time: "11:00 AM", name: "Event Name 1", description: "" },
    { time: "12:00 PM", name: "Event Name 2", description: "" },
    { time: "01:00 PM", name: "Event Name 3", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  ],
  [ // Day 2
    { time: "11:00 AM", name: "Event Name 4", description: "" },
    { time: "12:00 PM", name: "Event Name 5", description: "" },
    { time: "01:00 PM", name: "Event Name 6", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  ],
  [ // Day 3
    { time: "11:00 AM", name: "Event Name 7", description: "" },
    { time: "12:00 PM", name: "Event Name 8", description: "" },
    { time: "01:00 PM", name: "Event Name 9", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  ],
]

function ScheduleSkeleton() {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm animate-pulse">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="py-4 flex gap-4 items-start mb-4 last:mb-0 bg-white rounded-xl shadow-md border border-gray-200"
        >
          <div className="w-24 h-6 bg-gray-200 rounded-full" />
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
  const events = scheduleData[activeDay]

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [activeDay])

  if (loading) return <ScheduleSkeleton />

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      {events.map((event, index) => (
        <div
          key={index}
          className={`py-4 flex gap-4 items-start mb-4 last:mb-0 bg-white rounded-xl shadow-md border border-gray-200`}
        >
          <div className="w-24 font-medium text-gray-700 font-dm-serif text-lg">{event.time}</div>
          <div className="flex-1">
            <div className="font-bilo text-base text-[#6A1B1A]">{event.name}</div>
            {event.description && <div className="text-sm text-gray-500 mt-1 font-bilo">{event.description}</div>}
          </div>
        </div>
      ))}
    </div>
  )
}
