"use client"

import type React from "react"

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, X, ImageIcon, CheckCircle, AlertCircle, FileImage } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

interface ArchiveYear {
  _id: string
  year: number
  month: number
}

interface ArchiveDay {
  _id: string
  year_ref: string
  dayLabel: string
}

export default function UploadImages() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [years, setYears] = useState<ArchiveYear[]>([])
  const [days, setDays] = useState<ArchiveDay[]>([])
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [formData, setFormData] = useState({
    yearId: searchParams.get("year") || "",
    dayId: searchParams.get("day") || "",
  })

  useEffect(() => {
    fetchYears()
  }, [])

  useEffect(() => {
    if (formData.yearId) {
      fetchDays(formData.yearId)
    }
  }, [formData.yearId])

  const fetchYears = async () => {
    try {
      const response = await fetch("/api/archive/getImages")
      const data = await response.json()

      if (data.archive) {
        const uniqueYears = data.archive.reduce((acc: ArchiveYear[], img: any) => {
          const existingYear = acc.find((y) => y._id === img.year_ref._id)
          if (!existingYear) {
            acc.push({
              _id: img.year_ref._id,
              year: img.year_ref.year,
              month: 1,
            })
          }
          return acc
        }, [])
setYears(uniqueYears.sort((a: ArchiveYear, b: ArchiveYear) => b.year - a.year))      }
    } catch (error) {
      console.error("Error fetching years:", error)
    }
  }

  const fetchDays = async (yearId: string) => {
    try {
      const response = await fetch("/api/archive/getImages")
      const data = await response.json()

      if (data.archive) {
        const daysForYear = data.archive
          .filter((img: any) => img.year_ref._id === yearId)
          .map((img: any) => img.dayNumber_ref)
          .filter((day: any, index: number, self: any[]) => index === self.findIndex((d) => d._id === day._id))
          .sort((a: any, b: any) => {
            const aNum = Number.parseInt(a.dayLabel.replace("Day ", ""))
            const bNum = Number.parseInt(b.dayLabel.replace("Day ", ""))
            return aNum - bNum
          })
        setDays(daysForYear)
      }
    } catch (error) {
      console.error("Error fetching days:", error)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"))
      setSelectedFiles((prev) => [...prev, ...files])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter((file) => file.type.startsWith("image/"))
    setSelectedFiles((prev) => [...prev, ...files])
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.yearId || !formData.dayId || selectedFiles.length === 0) {
      setError("Please select year, day, and at least one image")
      return
    }

    setLoading(true)
    setError("")
    setSuccess(false)
    setUploadProgress(0)

    try {
      const uploadData = new FormData()
      selectedFiles.forEach((file) => {
        uploadData.append("image_url", file)
      })

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 200)

      const response = await fetch(`/api/archive/uploadImages/${formData.dayId}/year/${formData.yearId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: uploadData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        console.log("Images uploaded successfully:", data)
        setTimeout(() => {
          router.push("/admin/dashboard/archive")
        }, 2000)
      } else {
        throw new Error(data.message || "Failed to upload images")
      }
    } catch (error: any) {
      console.error("Error uploading images:", error)
      setError(error.message || "Failed to upload images. Please try again.")
      setUploadProgress(0)
    } finally {
      setLoading(false)
    }
  }

  const selectedYear = years.find((y) => y._id === formData.yearId)
  const selectedDay = days.find((d) => d._id === formData.dayId)
  const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0)

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
                  <BreadcrumbPage>Upload Images</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Upload Images</h1>
              <p className="text-muted-foreground">Upload images to a specific day in your archive.</p>
            </div>
          </div>

          <div className="max-w-4xl">
            {success && (
              <Alert className="mb-6">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Images uploaded successfully! You will be redirected to the archive page shortly.
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Select Destination</CardTitle>
                  <CardDescription>Choose the year and day where you want to upload images.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="year">Year *</Label>
                      <Select
                        value={formData.yearId}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, yearId: value, dayId: "" }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem key={year._id} value={year._id}>
                              {year.year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="day">Day *</Label>
                      <Select
                        value={formData.dayId}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, dayId: value }))}
                        disabled={!formData.yearId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                        <SelectContent>
                          {days.map((day) => (
                            <SelectItem key={day._id} value={day._id}>
                              {day.dayLabel}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {selectedYear && selectedDay && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-800">
                        <strong>Upload Destination:</strong> {selectedDay.dayLabel} of Year {selectedYear.year}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Upload Images
                  </CardTitle>
                  <CardDescription>Select multiple images to upload to the archive.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="images">Images *</Label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        dragActive
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <div className="space-y-2">
                        <p className="text-lg font-medium">Drag and drop images here</p>
                        <p className="text-sm text-gray-600">or click to select files</p>
                        <Input
                          id="images"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById("images")?.click()}
                        >
                          <FileImage className="mr-2 h-4 w-4" />
                          Select Images
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-4">Supported formats: JPG, PNG, GIF, WebP</p>
                    </div>
                  </div>

                  {selectedFiles.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Selected Images ({selectedFiles.length})</Label>
                        <div className="text-sm text-muted-foreground">Total size: {formatFileSize(totalSize)}</div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="relative border rounded-lg p-3">
                            <div className="flex items-center gap-3">
                              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                <img
                                  src={URL.createObjectURL(file) || "/placeholder.svg"}
                                  alt={file.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{file.name}</p>
                                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                                <p className="text-xs text-muted-foreground">{file.type.split("/")[1].toUpperCase()}</p>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="flex-shrink-0"
                                onClick={() => removeFile(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {loading && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Uploading images...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="w-full" />
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading || selectedFiles.length === 0 || success}>
                  {loading
                    ? "Uploading..."
                    : success
                      ? "Uploaded Successfully!"
                      : `Upload ${selectedFiles.length} Image${selectedFiles.length !== 1 ? "s" : ""}`}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
                  Cancel
                </Button>
                {selectedFiles.length > 0 && !loading && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedFiles([])}
                    className="text-red-600 hover:text-red-700"
                  >
                    Clear All
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
