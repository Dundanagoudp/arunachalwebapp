"use client"

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Archive,
  Calendar,
  ImageIcon,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  MoreHorizontal,
  Upload,
  FolderOpen,
  Clock,
  Download,
  Grid3X3,
  List,
  Filter,
  RefreshCw,
} from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"

interface ArchiveYear {
  _id: string
  year: number
  month: number
  createdAt: string
  updatedAt: string
}

interface ArchiveDay {
  _id: string
  year_ref: string
  dayLabel: string
  createdAt: string
  updatedAt: string
}

interface ArchiveImage {
  _id: string
  year_ref: {
    _id: string
    year: number
  }
  dayNumber_ref: {
    _id: string
    dayLabel: string
  }
  image_url: string
  createdAt: string
  updatedAt: string
}

export default function ArchiveManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [yearFilter, setYearFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false)
  const [imageViewDialogOpen, setImageViewDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [selectedImage, setSelectedImage] = useState<ArchiveImage | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [years, setYears] = useState<ArchiveYear[]>([])
  const [images, setImages] = useState<ArchiveImage[]>([])
  const [expandedYear, setExpandedYear] = useState<string | null>(null)

  // Fetch data from your backend
  useEffect(() => {
    fetchArchiveData()
  }, [])

  const fetchArchiveData = async () => {
    try {
      setLoading(true)
      const imagesResponse = await fetch("/api/archive/getImages")
      const imagesData = await imagesResponse.json()

      if (imagesData.archive) {
        setImages(imagesData.archive)

        // Extract unique years from images
        const uniqueYears = imagesData.archive.reduce((acc: ArchiveYear[], img: ArchiveImage) => {
          const existingYear = acc.find((y) => y._id === img.year_ref._id)
          if (!existingYear) {
            acc.push({
              _id: img.year_ref._id,
              year: img.year_ref.year,
              month: 1,
              createdAt: img.createdAt,
              updatedAt: img.updatedAt,
            })
          }
          return acc
        }, [])

        setYears(uniqueYears.sort((a: ArchiveYear, b: ArchiveYear) => b.year - a.year))
      }
    } catch (error) {
      console.error("Error fetching archive data:", error)
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    setRefreshing(true)
    await fetchArchiveData()
    setRefreshing(false)
  }

  const filteredImages = images.filter((image) => {
    const matchesSearch =
      image.dayNumber_ref.dayLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.year_ref.year.toString().includes(searchTerm)
    const matchesYear = yearFilter === "all" || image.year_ref.year.toString() === yearFilter
    return matchesSearch && matchesYear
  })

  const groupedByYear = filteredImages.reduce(
    (acc, image) => {
      const year = image.year_ref.year.toString()
      if (!acc[year]) {
        acc[year] = {}
      }
      const day = image.dayNumber_ref.dayLabel
      if (!acc[year][day]) {
        acc[year][day] = []
      }
      acc[year][day].push(image)
      return acc
    },
    {} as Record<string, Record<string, ArchiveImage[]>>,
  )

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

  const handleDeleteYear = async (yearId: string) => {
    try {
      const response = await fetch(`/api/archive/deleteyear/${yearId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.ok) {
        await fetchArchiveData()
        console.log("Year deleted successfully")
      }
    } catch (error) {
      console.error("Error deleting year:", error)
    }
  }

  const handleDeleteImage = async (imageId: string) => {
    try {
      const response = await fetch(`/api/archive/deleteImages/image/${imageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.ok) {
        await fetchArchiveData()
        console.log("Image deleted successfully")
      }
    } catch (error) {
      console.error("Error deleting image:", error)
    }
  }

  const handleBulkDelete = async () => {
    try {
      const deletePromises = selectedImages.map((imageId) =>
        fetch(`/api/archive/deleteImages/image/${imageId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }),
      )

      await Promise.all(deletePromises)
      await fetchArchiveData()
      setSelectedImages([])
      setBulkDeleteDialogOpen(false)
      console.log("Bulk delete completed")
    } catch (error) {
      console.error("Error in bulk delete:", error)
    }
  }

  const handleDelete = (item: any, type: "year" | "image") => {
    setSelectedItem({ ...item, type })
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (selectedItem.type === "year") {
      await handleDeleteYear(selectedItem._id)
    } else if (selectedItem.type === "image") {
      await handleDeleteImage(selectedItem._id)
    }
    setDeleteDialogOpen(false)
    setSelectedItem(null)
  }

  const viewImage = (image: ArchiveImage) => {
    setSelectedImage(image)
    setImageViewDialogOpen(true)
  }

  const downloadImage = (imageUrl: string, fileName: string) => {
    const link = document.createElement("a")
    link.href = imageUrl
    link.download = fileName
    link.target = "_blank"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const uniqueYears = [...new Set(images.map((img) => img.year_ref.year.toString()))]

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
              <p className="mt-4">Loading archive data...</p>
            </div>
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

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Years</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{uniqueYears.length}</div>
                <p className="text-xs text-muted-foreground">Archive years</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Images</CardTitle>
                <ImageIcon className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{images.length}</div>
                <p className="text-xs text-muted-foreground">Archived images</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Days</CardTitle>
                <Clock className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {[...new Set(images.map((img) => img.dayNumber_ref._id))].length}
                </div>
                <p className="text-xs text-muted-foreground">Archive days</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Latest Year</CardTitle>
                <Archive className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {uniqueYears.length > 0 ? Math.max(...uniqueYears.map(Number)) : 0}
                </div>
                <p className="text-xs text-muted-foreground">Most recent</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Selected</CardTitle>
                <Filter className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{selectedImages.length}</div>
                <p className="text-xs text-muted-foreground">Images selected</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Controls */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters & Controls
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                  >
                    {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
                  </Button>
                  {selectedImages.length > 0 && (
                    <Button variant="destructive" size="sm" onClick={() => setBulkDeleteDialogOpen(true)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Selected ({selectedImages.length})
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor="search">Search archive</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by year or day..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="All Years" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      {uniqueYears.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="selectAll"
                    checked={selectedImages.length === filteredImages.length && filteredImages.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                  <Label htmlFor="selectAll" className="text-sm">
                    Select All ({filteredImages.length})
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Archive Content */}
          <div className="space-y-6">
            {Object.entries(groupedByYear).map(([year, days]) => (
              <Card key={year}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedYear(expandedYear === year ? null : year)}
                      >
                        <FolderOpen className="h-4 w-4 mr-2" />
                        Year {year}
                      </Button>
                      <Badge variant="outline">{Object.keys(days).length} days</Badge>
                      <Badge variant="secondary">{Object.values(days).flat().length} images</Badge>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Year Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/dashboard/archive/year/${year}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Year
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/dashboard/archive/upload?year=${year}`}>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Images
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete({ _id: year, year }, "year")}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Year
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                {(expandedYear === year || expandedYear === null) && (
                  <CardContent>
                    <div className="space-y-6">
                      {Object.entries(days).map(([dayLabel, dayImages]) => (
                        <div key={dayLabel} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{dayLabel}</h4>
                              <Badge variant="outline">{dayImages.length} images</Badge>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/admin/dashboard/archive/upload?day=${dayImages[0]?.dayNumber_ref._id}`}>
                                  <Upload className="h-3 w-3 mr-1" />
                                  Add Images
                                </Link>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const dayImageIds = dayImages.map((img) => img._id)
                                  setSelectedImages((prev) => {
                                    const allSelected = dayImageIds.every((id) => prev.includes(id))
                                    if (allSelected) {
                                      return prev.filter((id) => !dayImageIds.includes(id))
                                    } else {
                                      return [...new Set([...prev, ...dayImageIds])]
                                    }
                                  })
                                }}
                              >
                                {dayImages.every((img) => selectedImages.includes(img._id)) ? "Deselect" : "Select"} Day
                              </Button>
                            </div>
                          </div>

                          <div
                            className={
                              viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4" : "space-y-2"
                            }
                          >
                            {dayImages.map((image) => (
                              <div
                                key={image._id}
                                className={
                                  viewMode === "grid"
                                    ? "relative group"
                                    : "flex items-center gap-4 p-2 border rounded-lg"
                                }
                              >
                                {viewMode === "grid" ? (
                                  <>
                                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-transparent hover:border-blue-500 transition-colors">
                                      <img
                                        src={image.image_url || "/placeholder.svg"}
                                        alt={`${dayLabel} archive`}
                                        className="w-full h-full object-cover cursor-pointer"
                                        onClick={() => viewImage(image)}
                                      />
                                    </div>
                                    <div className="absolute top-2 left-2">
                                      <Checkbox
                                        checked={selectedImages.includes(image._id)}
                                        onCheckedChange={() => handleSelectImage(image._id)}
                                        className="bg-white"
                                      />
                                    </div>
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="secondary" size="sm">
                                            <MoreHorizontal className="h-3 w-3" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuItem onClick={() => viewImage(image)}>
                                            <Eye className="mr-2 h-4 w-4" />
                                            View Full Size
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                            onClick={() =>
                                              downloadImage(image.image_url, `${dayLabel}-${image._id}.jpg`)
                                            }
                                          >
                                            <Download className="mr-2 h-4 w-4" />
                                            Download
                                          </DropdownMenuItem>
                                          <DropdownMenuItem>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Replace Image
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                            onClick={() => handleDelete(image, "image")}
                                            className="text-red-600"
                                          >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <Checkbox
                                      checked={selectedImages.includes(image._id)}
                                      onCheckedChange={() => handleSelectImage(image._id)}
                                    />
                                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                                      <img
                                        src={image.image_url || "/placeholder.svg"}
                                        alt={`${dayLabel} archive`}
                                        className="w-full h-full object-cover cursor-pointer"
                                        onClick={() => viewImage(image)}
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-medium">{dayLabel}</p>
                                      <p className="text-sm text-muted-foreground">
                                        Uploaded: {new Date(image.createdAt).toLocaleDateString()}
                                      </p>
                                    </div>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => viewImage(image)}>
                                          <Eye className="mr-2 h-4 w-4" />
                                          View Full Size
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() => downloadImage(image.image_url, `${dayLabel}-${image._id}.jpg`)}
                                        >
                                          <Download className="mr-2 h-4 w-4" />
                                          Download
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                          <Edit className="mr-2 h-4 w-4" />
                                          Replace Image
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() => handleDelete(image, "image")}
                                          className="text-red-600"
                                        >
                                          <Trash2 className="mr-2 h-4 w-4" />
                                          Delete
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          {Object.keys(groupedByYear).length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Archive className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Archive Data Found</h3>
                <p className="text-muted-foreground mb-4">
                  Start by adding a year and uploading some images to your archive.
                </p>
                <Button asChild>
                  <Link href="/admin/dashboard/archive/add-year">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Year
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete {selectedItem?.type === "year" ? "Year" : "Image"}</DialogTitle>
              <DialogDescription>
                {selectedItem?.type === "year"
                  ? `Are you sure you want to delete year ${selectedItem?.year}? This will permanently delete all associated days and images.`
                  : "Are you sure you want to delete this image? This action cannot be undone."}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
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
              <Button variant="outline" onClick={() => setBulkDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleBulkDelete}>
                Delete {selectedImages.length} Images
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Image View Dialog */}
        <Dialog open={imageViewDialogOpen} onOpenChange={setImageViewDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {selectedImage?.dayNumber_ref.dayLabel} - Year {selectedImage?.year_ref.year}
              </DialogTitle>
            </DialogHeader>
            <div className="flex justify-center">
              <img
                src={selectedImage?.image_url || "/placeholder.svg"}
                alt="Archive image"
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() =>
                  selectedImage &&
                  downloadImage(
                    selectedImage.image_url,
                    `${selectedImage.dayNumber_ref.dayLabel}-${selectedImage._id}.jpg`,
                  )
                }
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button onClick={() => setImageViewDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  )
}
