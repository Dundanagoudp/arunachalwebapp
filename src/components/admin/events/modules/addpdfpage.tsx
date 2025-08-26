"use client"

import { useState, Suspense, lazy } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { PdfUploadForm } from "@/components/admin/events/pdf-modules/pdf-upload-form"
const PdfList = lazy(() => import("@/components/admin/events/pdf-modules/pdf-list").then(mod => ({ default: mod.PdfList })))
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, FileText } from "lucide-react"

export default function AddPdf() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleUploadSuccess = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="min-h-[100vh] flex-1 rounded-xl bg-white md:min-h-min p-2 sm:p-4">
        <div className="mx-auto max-w-6xl space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">PDF Management</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Upload, manage, and organize your event brochure PDF files</p>
          </div>

          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload" className="flex items-center gap-2 text-xs sm:text-base">
                <Upload className="h-4 w-4" />
                Upload PDF
              </TabsTrigger>
              <TabsTrigger value="manage" className="flex items-center gap-2 text-xs sm:text-base">
                <FileText className="h-4 w-4" />
                Manage PDFs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-6">
              <div className="flex justify-center">
                <PdfUploadForm onSuccess={handleUploadSuccess} />
              </div>
            </TabsContent>

            <TabsContent value="manage" className="space-y-6">
              <Suspense fallback={<div className="flex justify-center py-8"><span>Loading PDFs...</span></div>}>
                <PdfList refreshTrigger={refreshTrigger} />
              </Suspense>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
