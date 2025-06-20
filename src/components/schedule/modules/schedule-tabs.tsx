"use client"

import { useState } from "react"
import { ScheduleDay } from "./schedule-content"

export function ScheduleTabs({ activeTab, setActiveTab }: { activeTab: ScheduleDay, setActiveTab: (tab: ScheduleDay) => void }) {
  const tabs = [
    { id: 0, label: "DAY 1" },
    { id: 1, label: "DAY 2" },
    { id: 2, label: "DAY 3" },
  ]

  return (
    <div className="mb-6">
      <div className="bg-[#FDB813] rounded-full p-1 flex border border-[#FDB813] shadow-md">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as ScheduleDay)}
            className={`flex-1 py-2 px-4 rounded-full font-dm-serif text-lg transition-all font-bold ${
              activeTab === tab.id ? "bg-[#FFFFFF] text-[#D95E1E]" : "text-[#6A1B1A]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}
