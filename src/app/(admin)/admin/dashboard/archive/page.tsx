"use client"

import { useState, useEffect } from "react"
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
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Upload, RefreshCw, Archive, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { getAllImages, deleteUploadedImage, deleteYear } from "@/service/archive"
import { ArchiveStats } from "@/components/admin/archivecomponets/archive-stats"
import { ArchiveFilters } from "@/components/admin/archivecomponets/archive-filters"
import { ImageGrid } from "@/components/admin/archivecomponets/image-grid"
import type { ArchiveImage } from "@/types/archive-types"
import { Skeleton } from "@/components/ui/skeleton"
import { useDeletePermission } from "@/hooks/use-delete-permission"
import { ContactAdminModal } from "@/components/ui/contact-admin-modal"

export default function ArchiveManagement() {
  const { isAdmin } = useDeletePermission()
  const [images, setImages] = useState<ArchiveImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [yearFilter, setYearFilter] = useState("all")
  const [dayFilter, setDayFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false)
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [deleteYearDialogOpen, setDeleteYearDialogOpen] = useState(false)
  const [deleteYearLoading, setDeleteYearLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const imagesPerPage = 8

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      setLoading(true)
      setError("")
      const result = await getAllImages()

      if (result.success && result.data?.archive) {
        setImages(result.data.archive)
      } else {
        setError(result.error || "Failed to fetch images")
      }
    } catch (error: any) {
      console.error("Error fetching images:", error)
      setError("Failed to fetch archive data")
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    setRefreshing(true)
    await fetchImages()
    setRefreshing(false)
  }

  // Calculate stats directly
  const uniqueYears = [...new Set(images.map((img) => img.year_ref.year))].sort((a, b) => b - a)
  const uniqueDays = [...new Set(images.map((img) => `${img.year_ref._id}-${img.dayNumber_ref._id}`))]
  const stats = {
    totalYears: uniqueYears.length,
    totalDays: uniqueDays.length,
    totalImages: images.length,
    latestYear: uniqueYears[0] || 0,
  }

  // Filter images directly
  const filteredImages = images.filter((image) => {
    const matchesSearch =
      !searchTerm ||
      image.dayNumber_ref.dayLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.year_ref.year.toString().includes(searchTerm)

    const matchesYear = yearFilter === "all" || image.year_ref.year.toString() === yearFilter

    const matchesDay = dayFilter === "all" || image.dayNumber_ref._id === dayFilter

    return matchesSearch && matchesYear && matchesDay
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredImages.length / imagesPerPage)
  const paginatedImages = filteredImages.slice(
    (currentPage - 1) * imagesPerPage,
    currentPage * imagesPerPage
  )

  // Reset to page 1 if filters change and current page is out of range
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1)
  }, [searchTerm, yearFilter, dayFilter, totalPages])

  const handleSelectImage = (imageId: string) => {
    setSelectedImages((prev) => (prev.includes(imageId) ? prev.filter((id) => id !== imageId) : [...prev, imageId]))
  }

  const handleSelectAll = () => {
    if (selectedImages.length === filteredImages.length) {
      setSelectedImages([])
    } else {
      setSelectedImages(filteredImages.map((img) => img._id))
    }
  }

  const handleDeleteImage = (imageId: string) => {
    setSelectedImageId(imageId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedImageId) return

    setDeleteLoading(true)
    try {
      const result = await deleteUploadedImage(selectedImageId)
      if (result.success) {
        setSuccessMessage("Image deleted successfully")
        await fetchImages()
        setSelectedImages((prev) => prev.filter((id) => id !== selectedImageId))
      } else {
        throw new Error(result.error || "Failed to delete image")
      }
    } catch (error: any) {
      console.error("Error deleting image:", error)
      setError(error.message || "Failed to delete image")
    } finally {
      setDeleteLoading(false)
      setDeleteDialogOpen(false)
      setSelectedImageId(null)
    }
  }

  const handleBulkDelete = async () => {
    setDeleteLoading(true)
    try {
      const deletePromises = selectedImages.map((imageId) => deleteUploadedImage(imageId))
      const results = await Promise.all(deletePromises)

      const successCount = results.filter((r) => r.success).length
      setSuccessMessage(`Successfully deleted ${successCount} images`)

      await fetchImages()
      setSelectedImages([])
    } catch (error: any) {
      console.error("Error in bulk delete:", error)
      setError("Failed to delete some images")
    } finally {
      setDeleteLoading(false)
      setBulkDeleteDialogOpen(false)
    }
  }

  const handleDeleteYear = () => {
    setDeleteYearDialogOpen(true)
  }

  const confirmDeleteYear = async () => {
    if (yearFilter === "all") return
    setDeleteYearLoading(true)
    setError("")
    try {
      // Find the yearId from images (since we only have year number in yearFilter)
      const yearImage = images.find(img => img.year_ref.year.toString() === yearFilter)
      const yearId = yearImage?.year_ref._id
      if (!yearId) throw new Error("Year ID not found")
      const result = await deleteYear(yearId)
      if (result.success) {
        setSuccessMessage("Year deleted successfully")
        setYearFilter("all")
        await fetchImages()
      } else {
        throw new Error(result.error || "Failed to delete year")
      }
    } catch (error: any) {
      setError(error.message || "Failed to delete year")
    } finally {
      setDeleteYearLoading(false)
      setDeleteYearDialogOpen(false)
    }
  }

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-1 flex-col gap-4 p-2 sm:gap-6 sm:p-4 md:p-6 pt-0">
            {/* Skeleton for grouped years/days/images */}
            {[1, 2].map((yearIdx) => (
              <div key={yearIdx} className="border rounded-lg p-3 sm:p-6 mb-4 sm:mb-6">
                <div className="flex items-center gap-2 mb-4 sm:mb-6">
                  <Skeleton className="h-5 w-24 sm:h-6 sm:w-32" /> {/* Year title */}
                  <Skeleton className="h-4 w-12 sm:h-5 sm:w-16" /> {/* Days badge */}
                  <Skeleton className="h-4 w-16 sm:h-5 sm:w-20" /> {/* Images badge */}
                </div>
                <div className="space-y-4 sm:space-y-6">
                  {[1, 2].map((dayIdx) => (
                    <div key={dayIdx} className="border rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                      <div className="flex items-center gap-2 mb-3 sm:mb-4">
                        <Skeleton className="h-4 w-20 sm:h-5 sm:w-24" /> {/* Day label */}
                        <Skeleton className="h-4 w-12 sm:h-5 sm:w-16" /> {/* Images badge */}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
                        {[1, 2].map((imgIdx) => (
                          <Skeleton key={imgIdx} className="aspect-square w-full h-20 sm:h-32" />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
          <div className="flex items-center gap-2 px-2 sm:px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/admin/dashboard">Admin Panel</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-sm sm:text-base">Archive Management</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-2 sm:gap-6 sm:p-4 md:p-6 pt-0">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:gap-2 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">Archive Management</h1>
              <p className="text-muted-foreground text-xs sm:text-sm md:text-base">Manage your archive collection by years, days, and images.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={refreshData} disabled={refreshing} className="text-xs sm:text-sm flex-1 sm:flex-none">
                  <RefreshCw className={`mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 ${refreshing ? "animate-spin" : ""}`} />
                  <span className="hidden sm:inline">Refresh</span>
                  <span className="sm:hidden">↻</span>
                </Button>
                <Button asChild size="sm" className="text-xs sm:text-sm flex-1 sm:flex-none">
                  <Link href="/admin/dashboard/archive/add-year">
                    <Plus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Add Year</span>
                    <span className="sm:hidden">Add</span>
                  </Link>
                </Button>
              </div>
              <Button variant="outline" asChild size="sm" className="text-xs sm:text-sm">
                <Link href="/admin/dashboard/archive/upload">
                  <Upload className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Upload Images</span>
                  <span className="sm:hidden">Upload</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Success Message */}
          {successMessage && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 text-sm">{successMessage}</AlertDescription>
            </Alert>
          )}

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          )}

          {/* Stats */}
          <ArchiveStats
            totalYears={stats.totalYears}
            totalDays={stats.totalDays}
            totalImages={stats.totalImages}
            latestYear={stats.latestYear}
            selectedCount={selectedImages.length}
          />

          {/* Filters */}
          <ArchiveFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            yearFilter={yearFilter}
            onYearFilterChange={setYearFilter}
            dayFilter={dayFilter}
            onDayFilterChange={setDayFilter}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            selectedCount={selectedImages.length}
            totalCount={filteredImages.length}
            onSelectAll={handleSelectAll}
            onBulkDelete={() => setBulkDeleteDialogOpen(true)}
            onDeleteYear={yearFilter !== "all" ? handleDeleteYear : undefined}
          />

          {/* Content */}
          {paginatedImages.length > 0 ? (
            <>
              <ImageGrid
                images={paginatedImages}
                viewMode={viewMode}
                selectedImages={selectedImages}
                onSelectImage={handleSelectImage}
                onDeleteImage={handleDeleteImage}
              />
              {/* Pagination Controls */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-2 mt-4 sm:mt-6">
                <div className="flex gap-1 sm:gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="text-xs sm:text-sm"
                  >
                    Prev
                  </Button>
                  <div className="flex gap-1 sm:gap-2 flex-wrap justify-center">
                    {Array.from({ length: totalPages }).map((_, idx) => (
                      <Button
                        key={idx + 1}
                        variant={currentPage === idx + 1 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(idx + 1)}
                        className="text-xs sm:text-sm min-w-[2rem] sm:min-w-[2.5rem]"
                      >
                        {idx + 1}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="text-xs sm:text-sm"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="text-center py-8 sm:py-12">
                <Archive className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-medium mb-2">No Archive Data Found</h3>
                <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                  {images.length === 0
                    ? "Start by adding a year and uploading some images to your archive."
                    : "No images match your current filters. Try adjusting your search criteria."}
                </p>
                {images.length === 0 && (
                  <Button asChild size="sm" className="text-xs sm:text-sm">
                    <Link href="/admin/dashboard/archive/add-year">
                      <Plus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Add Your First Year</span>
                      <span className="sm:hidden">Add Year</span>
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg">Delete Image</DialogTitle>
              <DialogDescription className="text-sm">
                Are you sure you want to delete this image? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={deleteLoading} size="sm">
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete} disabled={deleteLoading} size="sm">
                {deleteLoading ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Bulk Delete Dialog */}
        <Dialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg">Delete Selected Images</DialogTitle>
              <DialogDescription className="text-sm">
                Are you sure you want to delete {selectedImages.length} selected images? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setBulkDeleteDialogOpen(false)} disabled={deleteLoading} size="sm">
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleBulkDelete} disabled={deleteLoading} size="sm">
                {deleteLoading ? "Deleting..." : `Delete ${selectedImages.length} Images`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Year Confirmation Dialog */}
        <Dialog open={deleteYearDialogOpen} onOpenChange={setDeleteYearDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg">Delete Year</DialogTitle>
              <DialogDescription className="text-sm">
                Are you sure you want to delete this year and all its images? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setDeleteYearDialogOpen(false)} disabled={deleteYearLoading} size="sm">
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDeleteYear} disabled={deleteYearLoading} size="sm">
                {deleteYearLoading ? "Deleting..." : "Delete Year"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  )
}
