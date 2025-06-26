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

export default function ArchiveManagement() {
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
          <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
            {/* Skeleton for grouped years/days/images */}
            {[1, 2].map((yearIdx) => (
              <div key={yearIdx} className="border rounded-lg p-6 mb-6">
                <div className="flex items-center gap-2 mb-6">
                  <Skeleton className="h-6 w-32" /> {/* Year title */}
                  <Skeleton className="h-5 w-16" /> {/* Days badge */}
                  <Skeleton className="h-5 w-20" /> {/* Images badge */}
                </div>
                <div className="space-y-6">
                  {[1, 2].map((dayIdx) => (
                    <div key={dayIdx} className="border rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Skeleton className="h-5 w-24" /> {/* Day label */}
                        <Skeleton className="h-5 w-16" /> {/* Images badge */}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {[1, 2].map((imgIdx) => (
                          <Skeleton key={imgIdx} className="aspect-square w-full h-32" />
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
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/admin/dashboard">Admin Panel</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Archive Management</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Archive Management</h1>
              <p className="text-muted-foreground">Manage your archive collection by years, days, and images.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={refreshData} disabled={refreshing}>
                <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button asChild>
                <Link href="/admin/dashboard/archive/add-year">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Year
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/admin/dashboard/archive/upload">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Images
                </Link>
              </Button>
            </div>
          </div>

          {/* Success Message */}
          {successMessage && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
            </Alert>
          )}

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
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
              <div className="flex justify-center items-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Prev
                </Button>
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <Button
                    key={idx + 1}
                    variant={currentPage === idx + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(idx + 1)}
                  >
                    {idx + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Archive className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Archive Data Found</h3>
                <p className="text-muted-foreground mb-4">
                  {images.length === 0
                    ? "Start by adding a year and uploading some images to your archive."
                    : "No images match your current filters. Try adjusting your search criteria."}
                </p>
                {images.length === 0 && (
                  <Button asChild>
                    <Link href="/admin/dashboard/archive/add-year">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Your First Year
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Image</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this image? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={deleteLoading}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete} disabled={deleteLoading}>
                {deleteLoading ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Bulk Delete Dialog */}
        <Dialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Selected Images</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {selectedImages.length} selected images? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setBulkDeleteDialogOpen(false)} disabled={deleteLoading}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleBulkDelete} disabled={deleteLoading}>
                {deleteLoading ? "Deleting..." : `Delete ${selectedImages.length} Images`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Year Confirmation Dialog */}
        <Dialog open={deleteYearDialogOpen} onOpenChange={setDeleteYearDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Year</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this year and all its images? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteYearDialogOpen(false)} disabled={deleteYearLoading}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDeleteYear} disabled={deleteYearLoading}>
                {deleteYearLoading ? "Deleting..." : "Delete Year"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  )
}
