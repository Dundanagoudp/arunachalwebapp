"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, ImageIcon, AlertCircle, Loader2, Download, Eye, Edit, Upload } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import Link from "next/link"
import { getImagesByYear } from "@/service/archive"

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

export default function ViewYearPage() {
  const params = useParams()
  const yearId = params.yearId as string

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [images, setImages] = useState<ArchiveImage[]>([])
  const [yearData, setYearData] = useState<any>(null)
  const [selectedImage, setSelectedImage] = useState<ArchiveImage | null>(null)
  const [imageViewOpen, setImageViewOpen] = useState(false)

  useEffect(() => {
    if (yearId) {
      fetchYearImages()
    }
  }, [yearId])

  const fetchYearImages = async () => {
    try {
      setLoading(true)
      const result = await getImagesByYear(yearId)

      if (result.success && result.data?.archive) {
        setImages(result.data.archive)
        if (result.data.archive.length > 0) {
          setYearData(result.data.archive[0].year_ref)
        }
      } else {
        setError("No images found for this year")
      }
    } catch (error: any) {
      console.error("Error fetching year images:", error)
      setError("Failed to fetch year images")
    } finally {
      setLoading(false)
    }
  }

  const viewImage = (image: ArchiveImage) => {
    setSelectedImage(image)
    setImageViewOpen(true)
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

  // Group images by day
  const groupedByDay = images.reduce(
    (acc, image) => {
      const day = image.dayNumber_ref.dayLabel
      if (!acc[day]) {
        acc[day] = []
      }
      acc[day].push(image)
      return acc
    },
    {} as Record<string, ArchiveImage[]>,
  )

  const totalDays = Object.keys(groupedByDay).length
  const totalImages = images.length

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Loading year data...</p>
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
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/admin/dashboard/archive">Archive</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Year {yearData?.year}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Year {yearData?.year} Archive</h1>
              <p className="text-muted-foreground">View all images and days for this archive year.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href={`/admin/dashboard/archive/edit/${yearId}`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Year
                </Link>
              </Button>
              <Button asChild>
                <Link href={`/admin/dashboard/archive/upload?year=${yearId}`}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Images
                </Link>
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Year</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{yearData?.year}</div>
                <p className="text-xs text-muted-foreground">Archive year</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Days</CardTitle>
                <Calendar className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalDays}</div>
                <p className="text-xs text-muted-foreground">Days with images</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Images</CardTitle>
                <ImageIcon className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalImages}</div>
                <p className="text-xs text-muted-foreground">Images in this year</p>
              </CardContent>
            </Card>
          </div>

          {/* Images by Day */}
          {Object.keys(groupedByDay).length > 0 ? (
            <div className="space-y-6">
              {Object.entries(groupedByDay)
                .sort(([a], [b]) => {
                  const aNum = Number.parseInt(a.replace("Day ", ""))
                  const bNum = Number.parseInt(b.replace("Day ", ""))
                  return aNum - bNum
                })
                .map(([dayLabel, dayImages]) => (
                  <Card key={dayLabel}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CardTitle>{dayLabel}</CardTitle>
                          <Badge variant="outline">{dayImages.length} images</Badge>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/dashboard/archive/upload?day=${dayImages[0]?.dayNumber_ref._id}`}>
                            <Upload className="h-3 w-3 mr-1" />
                            Add More
                          </Link>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {dayImages.map((image) => (
                          <div key={image._id} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-transparent hover:border-blue-500 transition-colors">
                              <img
                                src={image.image_url || "/placeholder.svg"}
                                alt={`${dayLabel} archive`}
                                className="w-full h-full object-cover cursor-pointer"
                                onClick={() => viewImage(image)}
                              />
                            </div>
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="flex gap-1">
                                <Button variant="secondary" size="sm" onClick={() => viewImage(image)}>
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => downloadImage(image.image_url, `${dayLabel}-${image._id}.jpg`)}
                                >
                                  <Download className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <div className="absolute bottom-2 left-2 right-2">
                              <div className="bg-black/50 text-white text-xs p-1 rounded text-center">
                                {new Date(image.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Images Found</h3>
                <p className="text-muted-foreground mb-4">This year doesn't have any images yet.</p>
                <Button asChild>
                  <Link href={`/admin/dashboard/archive/upload?year=${yearId}`}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload First Images
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Image View Dialog */}
        <Dialog open={imageViewOpen} onOpenChange={setImageViewOpen}>
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
              <Button onClick={() => setImageViewOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  )
}
