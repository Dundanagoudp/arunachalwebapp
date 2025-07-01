"use client"

import { useState, Suspense, lazy } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
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
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/admin/dashboard">Admin Panel</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/admin/dashboard/events">Events</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>PDF Management</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

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
      </SidebarInset>
    </SidebarProvider>
  )
}
