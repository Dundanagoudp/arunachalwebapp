'use client';
import { Download, Search } from "lucide-react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { getAllEvents } from "@/service/events-apis"
import { getPdfs } from "@/service/addPdfServices"
import { getMediaUrl } from "@/utils/mediaUrl"
import PdfViews from "./modules/pdfpreview/pdfviews"

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
      startTime: t.startTime,
      endTime: t.endTime,
      name: t.title,
      speaker: t.speaker,
      description: t.description
    }))
  );
  
  return mappedDays;
};

const tabLabels = ["DAY 1", "DAY 2", "DAY 3"]

const formatTime = (time?: string) => {
  if (!time) return "";
  const date = new Date(time);
  if (!isNaN(date.getTime())) {
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }
  return time;
};

const formatTimeRange = (start?: string, end?: string) => {
  const startTime = formatTime(start);
  const endTime = formatTime(end);
  if (startTime && endTime) return `${startTime} - ${endTime}`;
  return startTime || endTime || "";
};

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
  const [showPdfSchedule, setShowPdfSchedule] = useState(false)
  const [loading, setLoading] = useState(true)
  const [scheduleData, setScheduleData] = useState<any[][]>([])
  const [error, setError] = useState<string | null>(null)
  const [downloading, setDownloading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

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

  const filteredEvents = (events || []).filter((event) => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return true

    const name = (event.name || "").toLowerCase()
    const speaker = (event.speaker || "").toLowerCase()
    const description = (event.description || "").toLowerCase()

    return (
      name.includes(query) ||
      speaker.includes(query) ||
      description.includes(query)
    )
  })

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
        {/* Top header: title centered overall. Search visible only when PDF preview is hidden. */}
        <header className="mb-6 flex flex-col gap-3 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center">
          {/* Left spacer to keep title visually centered between blank + search */}
          <div className="hidden md:block" />

          <h1 className="text-[#1A3FA9] text-4xl font-bold text-center font-dm-serif">
            SCHEDULE
          </h1>

          {!showPdfSchedule && (
            <div className="w-full flex justify-center md:justify-end mt-1 md:mt-0 px-4 md:px-0">
              <div className="relative w-full max-w-md">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  placeholder="Search by session, speaker, or topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="schedule-search-input w-full pl-10 pr-4 py-2 text-sm md:text-base"
                />
              </div>
            </div>
          )}
        </header>

        <div className="flex justify-center mb-4">
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

        {/* Toggle button for PDF schedule preview */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowPdfSchedule((prev) => !prev)}
            className="text-[#D95E1E] font-bilo font-semibold underline"
          >
            {showPdfSchedule ? "Hide PDF Schedule Preview" : "View PDF Schedule (PDF)"}
          </button>
        </div>

        {/* PDF schedule preview (3-day tabs) */}
        {showPdfSchedule && (
          <div className="mb-8">
            <PdfViews />
          </div>
        )}
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
              {filteredEvents.length === 0 ? (
                <div className="py-8 text-center text-sm text-gray-500 font-bilo">
                  No sessions found. Try a different search.
                </div>
              ) : (
                filteredEvents.map((event) => (
                  <div key={event.id} className="grid grid-cols-[110px_1fr] gap-4 py-4 border-b last:border-b-0">
                    <div className="text-[#000000] font-bold text-base md:text-lg font-dm-serif">
                      {formatTimeRange(event.startTime, event.endTime)}
                    </div>
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
                            {event.description}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
