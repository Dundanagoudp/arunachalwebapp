"use client"

import { ScheduleDay } from "./schedule-content"

export function ScheduleTabs({ activeTab, setActiveTab }: { activeTab: ScheduleDay, setActiveTab: (tab: ScheduleDay) => void }) {
  const tabs = [
    { id: 0, label: "DAY 1" },
    { id: 1, label: "DAY 2" },
    { id: 2, label: "DAY 3" },
  ]

  return (
    <div className="mb-6">
      <div className="bg-[#FDB813] rounded-full p-1 flex flex-col sm:flex-row border border-[#FDB813] shadow-md gap-2 sm:gap-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as ScheduleDay)}
            className={`flex-1 py-2 px-4 rounded-full font-dm-serif text-base sm:text-lg transition-all font-bold focus:outline-none focus:ring-2 focus:ring-[#D95E1E] focus:z-10 ${
              activeTab === tab.id ? "bg-[#FFFFFF] text-[#D95E1E]" : "text-[#000000]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}
