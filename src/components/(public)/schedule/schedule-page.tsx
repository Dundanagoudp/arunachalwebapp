'use client';
import { Download } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import { getPdfs } from "@/service/addPdfServices"
import { getMediaUrl } from "@/utils/mediaUrl"
import PdfViews from "./modules/pdfpreview/pdfviews"

export default function Schedulepage() {
  const [downloading, setDownloading] = useState(false)

  return (
    <div className="min-h-0 md:min-h-screen bg-[#FFFAEE] px-3 py-6 sm:px-6 sm:py-8 md:p-8 relative overflow-hidden">
      <div className="absolute top-2 left-2 md:top-24 md:left-8 pointer-events-none">
        <Image src="/sungif.gif" alt="" width={32} height={32} className="w-7 h-7 sm:w-8 sm:h-8" />
      </div>
      <div className="absolute top-2 right-2 md:top-24 md:right-20 pointer-events-none">
        <Image src="/sungif.gif" alt="" width={32} height={32} className="w-7 h-7 sm:w-8 sm:h-8" />
      </div>
      <div className="absolute bottom-2 left-2 md:bottom-40 md:left-8 pointer-events-none">
        <Image src="/sungif.gif" alt="" width={32} height={32} className="w-7 h-7 sm:w-8 sm:h-8" />
      </div>
      <div className="absolute bottom-2 right-2 md:bottom-20 md:right-24 pointer-events-none">
        <Image src="/sungif.gif" alt="" width={32} height={32} className="w-7 h-7 sm:w-8 sm:h-8" />
      </div>
      <div className="hidden md:block absolute top-40 right-4 pointer-events-none">
        <Image src="/sungif.gif" alt="" width={32} height={32} />
      </div>
      <div className="hidden md:block absolute top-60 left-4 pointer-events-none">
        <Image src="/sungif.gif" alt="" width={35} height={28} />
      </div>
      <div className="hidden md:block absolute bottom-60 right-8 pointer-events-none">
        <Image src="/sungif.gif" alt="" width={36} height={36} />
      </div>

      <div className="max-w-4xl mx-auto w-full min-w-0 relative z-10">
        <header className="mb-4 sm:mb-5 md:mb-6 pt-6 sm:pt-4 md:pt-0">
          <h1 className="text-[#1A3FA9] text-2xl sm:text-3xl md:text-4xl font-bold text-center font-dm-serif tracking-wide">
            SCHEDULE
          </h1>
        </header>

        <div className="flex justify-center mb-4 sm:mb-5 md:mb-6">
          <button
            onClick={async () => {
              try {
                setDownloading(true)
                const result = await getPdfs()
                if (result.success && Array.isArray(result.data) && result.data.length > 0) {
                  const firstPdf = result.data[0]

                  if (firstPdf?.pdf_url) {
                    window.open(getMediaUrl(firstPdf.pdf_url), "_blank")
                  } else {
                    alert("No schedule PDF URL available")
                  }
                } else {
                  alert(result.error || "No schedule PDF found")
                }
              } catch {
                alert("Failed to download schedule")
              } finally {
                setDownloading(false)
              }
            }}
            disabled={downloading}
            className="flex items-center gap-2 text-sm sm:text-base text-[#000000] hover:text-[#D95E1E] transition-colors disabled:opacity-60 font-bilo"
          >
            {downloading ? "Preparing..." : "Download Schedule"}
            <Download className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          </button>
        </div>

        <PdfViews />
      </div>
    </div>
  )
}
