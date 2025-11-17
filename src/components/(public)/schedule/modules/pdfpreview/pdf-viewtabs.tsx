"use client"

export type PdfDay = 0 | 1 | 2

interface PdfViewTabsProps {
  activeDay: PdfDay
  onChange: (day: PdfDay) => void
}

const tabs: { id: PdfDay; label: string }[] = [
  { id: 0, label: "DAY 1" },
  { id: 1, label: "DAY 2" },
  { id: 2, label: "DAY 3" },
]

export default function PdfViewTabs({ activeDay, onChange }: PdfViewTabsProps) {
  return (
    <div className="mb-6">
      <div className="bg-[#FDB813] rounded-full p-1 flex border border-[#FDB813] shadow-md">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex-1 py-2 px-4 rounded-full font-dm-serif text-base sm:text-lg transition-all font-bold focus:outline-none focus:ring-2 focus:ring-[#D95E1E] focus:z-10 ${
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


