"use client"

import { useEffect, useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ChevronDown, ChevronUp, FileText, ImageIcon, Loader2, Plus, RefreshCw, Trash2, Upload } from "lucide-react"
import {
  addScheduleDayPreview,
  deleteScheduleDayPreview,
  getScheduleDayPreviews,
  removeScheduleDayImage,
  reorderScheduleDayImages,
  updateScheduleDayPreview,
} from "@/service/scheduleDayPreviewService"
import type { ScheduleDayPreview } from "@/types/scheduleDayPreview-types"
import { getMediaUrl } from "@/utils/mediaUrl"

export default function ScheduleImagesPage() {
  const { toast } = useToast()
  const [days, setDays] = useState<ScheduleDayPreview[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [actionId, setActionId] = useState<string | null>(null)
  const [dayNumber, setDayNumber] = useState("")
  const [label, setLabel] = useState("")
  const [imageFiles, setImageFiles] = useState<Record<string, FileList | null>>({})
  const [pdfFiles, setPdfFiles] = useState<Record<string, File | null>>({})

  const fetchDays = async () => {
    setLoading(true)
    try {
      const result = await getScheduleDayPreviews()
      if (result.success && result.data) {
        setDays(result.data)
      } else {
        toast({ title: "Error", description: result.error || "Failed to fetch schedule days" })
      }
    } catch {
      toast({ title: "Error", description: "Failed to fetch schedule days" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDays()
  }, [])

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault()
    const n = Number(dayNumber)
    if (!Number.isInteger(n) || n < 1) {
      toast({ title: "Error", description: "Enter a valid day number (1, 2, 3…)" })
      return
    }
    setCreating(true)
    try {
      const result = await addScheduleDayPreview({
        dayNumber: n,
        label: label.trim() || undefined,
      })
      if (result.success) {
        toast({ title: "Success", description: result.message })
        setDayNumber("")
        setLabel("")
        fetchDays()
      } else {
        toast({ title: "Error", description: result.error })
      }
    } finally {
      setCreating(false)
    }
  }

  const handleUploadImages = async (day: ScheduleDayPreview) => {
    const files = imageFiles[day._id]
    if (!files || files.length === 0) {
      toast({ title: "Error", description: "Select one or more images first" })
      return
    }
    setActionId(day._id)
    try {
      const formData = new FormData()
      Array.from(files).forEach((file) => formData.append("images", file))
      const result = await updateScheduleDayPreview(day._id, formData)
      if (result.success) {
        toast({ title: "Success", description: "Images uploaded" })
        setImageFiles((prev) => ({ ...prev, [day._id]: null }))
        const input = document.getElementById(`images-${day._id}`) as HTMLInputElement
        if (input) input.value = ""
        fetchDays()
      } else {
        toast({ title: "Error", description: result.error })
      }
    } finally {
      setActionId(null)
    }
  }

  const handleUploadPdf = async (day: ScheduleDayPreview) => {
    const file = pdfFiles[day._id]
    if (!file) {
      toast({ title: "Error", description: "Select a PDF first" })
      return
    }
    setActionId(day._id)
    try {
      const formData = new FormData()
      formData.append("pdf", file)
      const result = await updateScheduleDayPreview(day._id, formData)
      if (result.success) {
        toast({ title: "Success", description: "PDF uploaded" })
        setPdfFiles((prev) => ({ ...prev, [day._id]: null }))
        const input = document.getElementById(`pdf-${day._id}`) as HTMLInputElement
        if (input) input.value = ""
        fetchDays()
      } else {
        toast({ title: "Error", description: result.error })
      }
    } finally {
      setActionId(null)
    }
  }

  const handleRemoveImage = async (dayId: string, imageUrl: string) => {
    setActionId(dayId)
    try {
      const result = await removeScheduleDayImage(dayId, imageUrl)
      if (result.success) {
        toast({ title: "Success", description: result.message })
        fetchDays()
      } else {
        toast({ title: "Error", description: result.error })
      }
    } finally {
      setActionId(null)
    }
  }

  const handleMoveImage = async (day: ScheduleDayPreview, index: number, direction: -1 | 1) => {
    const images = [...(day.images || [])]
    const nextIndex = index + direction
    if (nextIndex < 0 || nextIndex >= images.length) return

    const [moved] = images.splice(index, 1)
    images.splice(nextIndex, 0, moved)

    setDays((prev) => prev.map((item) => (item._id === day._id ? { ...item, images } : item)))
    setActionId(day._id)
    try {
      const result = await reorderScheduleDayImages(day._id, images)
      if (result.success && result.data) {
        setDays((prev) => prev.map((item) => (item._id === day._id ? result.data! : item)))
      } else {
        toast({ title: "Error", description: result.error })
        fetchDays()
      }
    } finally {
      setActionId(null)
    }
  }

  const handleDeleteDay = async (dayId: string) => {
    setActionId(dayId)
    try {
      const result = await deleteScheduleDayPreview(dayId)
      if (result.success) {
        toast({ title: "Success", description: result.message })
        fetchDays()
      } else {
        toast({ title: "Error", description: result.error })
      }
    } finally {
      setActionId(null)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="min-h-[100vh] flex-1 rounded-xl bg-white md:min-h-min p-2 sm:p-4">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Schedule Day Images</h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Upload day-wise preview images for the public schedule PDF viewer
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={fetchDays}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Plus className="h-5 w-5" />
                Add Day
              </CardTitle>
              <CardDescription>Create DAY 1, DAY 2, DAY 3, and so on</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3 items-end">
                <div className="space-y-2 w-full sm:w-32">
                  <Label htmlFor="dayNumber">Day number</Label>
                  <Input
                    id="dayNumber"
                    type="number"
                    min={1}
                    value={dayNumber}
                    onChange={(e) => setDayNumber(e.target.value)}
                    placeholder="1"
                    disabled={creating}
                  />
                </div>
                <div className="space-y-2 w-full sm:flex-1">
                  <Label htmlFor="label">Label (optional)</Label>
                  <Input
                    id="label"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="DAY 1"
                    disabled={creating}
                  />
                </div>
                <Button type="submit" disabled={creating}>
                  {creating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                  Create day
                </Button>
              </form>
            </CardContent>
          </Card>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading days...</span>
            </div>
          ) : days.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No schedule days yet</p>
                <p className="text-sm">Create DAY 1 to start uploading images</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {days.map((day) => (
                <Card key={day._id}>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <CardTitle>{day.label || `DAY ${day.dayNumber}`}</CardTitle>
                        <CardDescription>
                          {day.images?.length || 0} image{(day.images?.length || 0) === 1 ? "" : "s"}
                          {day.downloadUrl ? " · PDF attached" : ""}
                        </CardDescription>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" disabled={actionId === day._id}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete day
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete this day?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This removes the day, all images, and the download PDF. This cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteDay(day._id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {day.images?.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {day.images.map((url, index) => (
                          <div key={url} className="relative group border rounded-lg overflow-hidden bg-muted">
                            <span className="absolute top-2 left-2 z-10 rounded bg-black/70 text-white text-xs px-1.5 py-0.5">
                              {index + 1}
                            </span>
                            <img
                              src={getMediaUrl(url)}
                              alt={`${day.label} preview ${index + 1}`}
                              className="w-full h-36 object-contain bg-white"
                            />
                            <div className="absolute bottom-2 left-2 flex gap-1">
                              <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                className="h-8 w-8 p-0"
                                disabled={actionId === day._id || index === 0}
                                onClick={() => handleMoveImage(day, index, -1)}
                                aria-label="Move image up"
                              >
                                <ChevronUp className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                className="h-8 w-8 p-0"
                                disabled={actionId === day._id || index === day.images.length - 1}
                                onClick={() => handleMoveImage(day, index, 1)}
                                aria-label="Move image down"
                              >
                                <ChevronDown className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              className="absolute top-2 right-2 h-8 w-8 p-0"
                              disabled={actionId === day._id}
                              onClick={() => handleRemoveImage(day._id, url)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No images yet. Upload one or more below.</p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`images-${day._id}`}>Add images</Label>
                        <Input
                          id={`images-${day._id}`}
                          type="file"
                          accept="image/*"
                          multiple
                          disabled={actionId === day._id}
                          onChange={(e) =>
                            setImageFiles((prev) => ({ ...prev, [day._id]: e.target.files }))
                          }
                        />
                        <Button
                          type="button"
                          size="sm"
                          disabled={actionId === day._id}
                          onClick={() => handleUploadImages(day)}
                        >
                          {actionId === day._id ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Upload className="h-4 w-4 mr-2" />
                          )}
                          Upload images
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`pdf-${day._id}`}>Open / Download PDF (optional)</Label>
                        <Input
                          id={`pdf-${day._id}`}
                          type="file"
                          accept=".pdf,application/pdf"
                          disabled={actionId === day._id}
                          onChange={(e) =>
                            setPdfFiles((prev) => ({ ...prev, [day._id]: e.target.files?.[0] || null }))
                          }
                        />
                        {day.downloadUrl && (
                          <a
                            href={getMediaUrl(day.downloadUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm text-muted-foreground underline"
                          >
                            <FileText className="h-4 w-4" />
                            Current PDF
                          </a>
                        )}
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={actionId === day._id}
                          onClick={() => handleUploadPdf(day)}
                        >
                          {actionId === day._id ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Upload className="h-4 w-4 mr-2" />
                          )}
                          Upload PDF
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
