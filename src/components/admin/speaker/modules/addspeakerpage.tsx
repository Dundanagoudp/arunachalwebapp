"use client"

import type React from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mic, Save, ArrowLeft, Upload, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { addSpeaker, getEvent } from "@/service/speaker"

interface Event {
  _id: string
  name: string
  description: string
  year: number
  month: number
  startDate: string
  endDate: string
  totalDays: number
}

export default function CreateSpeaker() {
  const [formData, setFormData] = useState({
    name: "",
    about: "",
    event_ref: "",
  })

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(false)
  const [eventsLoading, setEventsLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setEventsLoading(true)
      const response = await getEvent()
       if (response.success) {
        setEvents(response.data ?? [])
      }else {
        setError("Failed to fetch events")
      }
    } catch (err) {
      setError("Failed to fetch events")
    } finally {
      setEventsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!formData.event_ref) {
      setError("Please select an event")
      return
    }

    if (!formData.name.trim() || !formData.about.trim()) {
      setError("Please fill in all required fields")
      return
    }

    try {
      setLoading(true)

      // Create FormData for file upload
      const submitData = new FormData()
      submitData.append("name", formData.name)
      submitData.append("about", formData.about)

      if (selectedFile) {
        submitData.append("image_url", selectedFile)
      }

      const response = await addSpeaker(formData.event_ref, submitData)

      if (response.success) {
        setSuccess("Speaker added successfully!")
        // Reset form
        setFormData({
          name: "",
          about: "",
          event_ref: "",
        })
        setSelectedFile(null)
        // Reset file input
        const fileInput = document.getElementById("image_file") as HTMLInputElement
        if (fileInput) fileInput.value = ""
      } else {
        setError(response.error || "Failed to add speaker")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file")
        return
      }
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB")
        return
      }
      setSelectedFile(file)
      setError("")
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Speaker</h1>
          <p className="text-muted-foreground">Add a new speaker to your events.</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/dashboard/speakers">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Speakers
          </Link>
        </Button>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Speaker Details
          </CardTitle>
          <CardDescription>Fill in the information for the new speaker.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Speaker Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter speaker name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="about">About Speaker *</Label>
              <Textarea
                id="about"
                name="about"
                placeholder="Enter speaker biography and background"
                value={formData.about}
                onChange={handleChange}
                rows={6}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event_ref">Associated Event *</Label>
              {eventsLoading ? (
                <div className="flex items-center gap-2 p-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Loading events...</span>
                </div>
              ) : (
                <select
                  id="event_ref"
                  name="event_ref"
                  value={formData.event_ref}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select an event</option>
                  {events.map((event) => (
                    <option key={event._id} value={event._id}>
                      {event.name} ({event.year})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_file">Profile Image</Label>
              <div className="flex gap-2">
                <Input
                  id="image_file"
                  name="image_file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={loading}
                  className="flex-1"
                />
                <Button type="button" variant="outline" disabled>
                  <Upload className="mr-2 h-4 w-4" />
                  {selectedFile ? selectedFile.name : "No file selected"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Supported formats: JPG, PNG, GIF. Max size: 5MB</p>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding Speaker...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Add Speaker
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" asChild disabled={loading}>
                <Link href="/admin/dashboard/speakers">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
