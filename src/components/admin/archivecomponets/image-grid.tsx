"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { MoreHorizontal, Eye, Download, Edit, Trash2, Upload } from "lucide-react"
import Link from "next/link"
import type { ArchiveImage } from "@/types/archive-types"

interface ImageGridProps {
  images: ArchiveImage[]
  viewMode: "grid" | "list"
  selectedImages: string[]
  onSelectImage: (imageId: string) => void
  onDeleteImage: (imageId: string) => void
}

export function ImageGrid({ images, viewMode, selectedImages, onSelectImage, onDeleteImage }: ImageGridProps) {
  const [selectedImage, setSelectedImage] = useState<ArchiveImage | null>(null)
  const [imageViewOpen, setImageViewOpen] = useState(false)

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

  // Group images by year and day directly
  const groupedImages = images.reduce(
    (acc, image) => {
      const year = image.year_ref.year.toString()
      const day = image.dayNumber_ref.dayLabel

      if (!acc[year]) acc[year] = {}
      if (!acc[year][day]) acc[year][day] = []

      acc[year][day].push(image)
      return acc
    },
    {} as Record<string, Record<string, ArchiveImage[]>>,
  )

  return (
    <>
      <div className="space-y-4 sm:space-y-6">
        {Object.entries(groupedImages).map(([year, days]) => (
          <div key={year} className="border rounded-lg p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3 sm:gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg sm:text-xl font-semibold">Year {year}</h3>
                <Badge variant="outline" className="text-xs sm:text-sm">{Object.keys(days).length} days</Badge>
                <Badge variant="secondary" className="text-xs sm:text-sm">{Object.values(days).flat().length} images</Badge>
              </div>
              <Button variant="outline" size="sm" asChild className="text-xs sm:text-sm w-full sm:w-auto">
                <Link href={`/admin/dashboard/archive/upload?year=${year}`}>
                  <Upload className="h-3 w-3 sm:h-3 sm:w-3 mr-1" />
                  <span className="hidden sm:inline">Add Images</span>
                  <span className="sm:hidden">Add Images</span>
                </Link>
              </Button>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {Object.entries(days).map(([dayLabel, dayImages]) => (
                <div key={dayLabel} className="border rounded-lg p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-3 sm:gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-medium text-sm sm:text-base">{dayLabel}</h4>
                      <Badge variant="outline" className="text-xs sm:text-sm">{dayImages.length} images</Badge>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Button variant="outline" size="sm" asChild className="text-xs sm:text-sm">
                        <Link href={`/admin/dashboard/archive/upload?day=${dayImages[0]?.dayNumber_ref._id}`}>
                          <Upload className="h-3 w-3 mr-1" />
                          <span className="hidden sm:inline">Add More</span>
                          <span className="sm:hidden">Add</span>
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const dayImageIds = dayImages.map((img) => img._id)
                          const allSelected = dayImageIds.every((id) => selectedImages.includes(id))

                          dayImageIds.forEach((id) => {
                            if (allSelected) {
                              if (selectedImages.includes(id)) onSelectImage(id)
                            } else {
                              if (!selectedImages.includes(id)) onSelectImage(id)
                            }
                          })
                        }}
                        className="text-xs sm:text-sm"
                      >
                        {dayImages.every((img) => selectedImages.includes(img._id)) ? "Deselect" : "Select"} Day
                      </Button>
                    </div>
                  </div>

                  <div
                    className={
                      viewMode === "grid" ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4" : "space-y-2"
                    }
                  >
                    {dayImages.map((image) => (
                      <div
                        key={image._id}
                        className={
                          viewMode === "grid" ? "relative group" : "flex items-center gap-3 sm:gap-4 p-2 border rounded-lg"
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
                            <div className="absolute top-1 sm:top-2 left-1 sm:left-2">
                              <Checkbox
                                checked={selectedImages.includes(image._id)}
                                onCheckedChange={() => onSelectImage(image._id)}
                                className="bg-white h-3 w-3 sm:h-4 sm:w-4"
                              />
                            </div>
                            <div className="absolute top-1 sm:top-2 right-1 sm:right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="secondary" size="sm" className="h-6 w-6 sm:h-8 sm:w-8 p-0">
                                    <MoreHorizontal className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="text-xs sm:text-sm">
                                  <DropdownMenuItem onClick={() => viewImage(image)}>
                                    <Eye className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                    <span className="hidden sm:inline">View Full Size</span>
                                    <span className="sm:hidden">View</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => downloadImage(image.image_url, `${dayLabel}-${image._id}.jpg`)}
                                  >
                                    <Download className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                    <span className="hidden sm:inline">Download</span>
                                    <span className="sm:hidden">Download</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                    <span className="hidden sm:inline">Replace Image</span>
                                    <span className="sm:hidden">Replace</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => onDeleteImage(image._id)} className="text-red-600">
                                    <Trash2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                    <span className="hidden sm:inline">Delete</span>
                                    <span className="sm:hidden">Delete</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </>
                        ) : (
                          <>
                            <Checkbox
                              checked={selectedImages.includes(image._id)}
                              onCheckedChange={() => onSelectImage(image._id)}
                              className="h-3 w-3 sm:h-4 sm:w-4"
                            />
                            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-gray-100">
                              <img
                                src={image.image_url || "/placeholder.svg"}
                                alt={`${dayLabel} archive`}
                                className="w-full h-full object-cover cursor-pointer"
                                onClick={() => viewImage(image)}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-xs sm:text-sm">{dayLabel}</p>
                              <p className="text-xs text-muted-foreground">
                                Uploaded: {new Date(image.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 sm:h-8 sm:w-8 p-0">
                                  <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="text-xs sm:text-sm">
                                <DropdownMenuItem onClick={() => viewImage(image)}>
                                  <Eye className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                  <span className="hidden sm:inline">View Full Size</span>
                                  <span className="sm:hidden">View</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => downloadImage(image.image_url, `${dayLabel}-${image._id}.jpg`)}
                                >
                                  <Download className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                  <span className="hidden sm:inline">Download</span>
                                  <span className="sm:hidden">Download</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                  <span className="hidden sm:inline">Replace Image</span>
                                  <span className="sm:hidden">Replace</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onDeleteImage(image._id)} className="text-red-600">
                                  <Trash2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                  <span className="hidden sm:inline">Delete</span>
                                  <span className="sm:hidden">Delete</span>
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
          </div>
        ))}
      </div>

      {/* Image View Dialog */}
      <Dialog open={imageViewOpen} onOpenChange={setImageViewOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-sm sm:text-base">
              {selectedImage?.dayNumber_ref.dayLabel} - Year {selectedImage?.year_ref.year}
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            <img
              src={selectedImage?.image_url || "/placeholder.svg"}
              alt="Archive image"
              className="max-w-full max-h-[60vh] sm:max-h-[70vh] object-contain rounded-lg"
            />
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                selectedImage &&
                downloadImage(
                  selectedImage.image_url,
                  `${selectedImage.dayNumber_ref.dayLabel}-${selectedImage._id}.jpg`,
                )
              }
              className="text-xs sm:text-sm"
            >
              <Download className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Download</span>
              <span className="sm:hidden">Download</span>
            </Button>
            <Button onClick={() => setImageViewOpen(false)} size="sm" className="text-xs sm:text-sm">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
