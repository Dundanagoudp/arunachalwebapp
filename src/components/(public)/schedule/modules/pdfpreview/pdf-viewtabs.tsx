"use client"

interface PdfViewTabsProps {
  tabs: { id: number; label: string }[]
  activeDay: number
  onChange: (day: number) => void
}

export default function PdfViewTabs({ tabs, activeDay, onChange }: PdfViewTabsProps) {
  if (!tabs.length) return null

  return (
    <div className="mb-4 sm:mb-5 md:mb-6 w-full min-w-0">
      <div className="bg-[#FDB813] rounded-full p-1 flex border border-[#FDB813] shadow-md overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex-1 min-w-[88px] sm:min-w-0 py-2 px-2 sm:px-4 rounded-full font-dm-serif text-sm sm:text-base md:text-lg transition-all font-bold focus:outline-none focus:ring-2 focus:ring-[#D95E1E] focus:z-10 whitespace-nowrap ${
              activeDay === tab.id ? "bg-[#FFFFFF] text-[#D95E1E]" : "text-[#000000]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}
