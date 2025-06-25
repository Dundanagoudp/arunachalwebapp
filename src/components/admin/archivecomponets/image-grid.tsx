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
      <div className="space-y-6">
        {Object.entries(groupedImages).map(([year, days]) => (
          <div key={year} className="border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold">Year {year}</h3>
                <Badge variant="outline">{Object.keys(days).length} days</Badge>
                <Badge variant="secondary">{Object.values(days).flat().length} images</Badge>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/dashboard/archive/upload?year=${year}`}>
                  <Upload className="h-3 w-3 mr-1" />
                  Add Images
                </Link>
              </Button>
            </div>

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
                          Add More
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
                          viewMode === "grid" ? "relative group" : "flex items-center gap-4 p-2 border rounded-lg"
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
                                onCheckedChange={() => onSelectImage(image._id)}
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
                                    onClick={() => downloadImage(image.image_url, `${dayLabel}-${image._id}.jpg`)}
                                  >
                                    <Download className="mr-2 h-4 w-4" />
                                    Download
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Replace Image
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => onDeleteImage(image._id)} className="text-red-600">
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
                              onCheckedChange={() => onSelectImage(image._id)}
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
                                <DropdownMenuItem onClick={() => onDeleteImage(image._id)} className="text-red-600">
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
          </div>
        ))}
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
    </>
  )
}
