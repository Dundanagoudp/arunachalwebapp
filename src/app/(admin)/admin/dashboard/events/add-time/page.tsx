"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Save, ArrowLeft, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { getEventDays, addTimeToEventDay } from "@/service/events-apis"
import type { EventDay, AddTimeData } from "@/types/events-types"
import { TimeSlotPageSkeleton } from "@/components/admin/events/form-skeleton"

export default function AddTimeSlotPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [eventDays, setEventDays] = useState<EventDay[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    eventDay_ref: "",
    startTime: "",
    endTime: "",
    title: "",
    description: "",
    type: "event",
    speaker: "",
  })

  useEffect(() => {
    fetchEventDays()
  }, [])

  const fetchEventDays = async () => {
    setIsLoading(true)
    try {
      const result = await getEventDays()
      if (result.success && result.data) {
        setEventDays(result.data)
        console.log("Event days loaded:", result.data)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to fetch event days"
        })
      }
    } catch (error) {
      console.error("Error fetching event days:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.eventDay_ref) {
      toast({
        title: "Error",
        description: "Please select an event day"
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Find the selected event day to get the event ID
      const selectedDay = eventDays.find((day) => day._id === formData.eventDay_ref)
      if (!selectedDay) {
        throw new Error("Selected event day not found")
      }

      const timeData: AddTimeData = {
        eventId: selectedDay.event_ref,
        eventDay_ref: formData.eventDay_ref,
        startTime: formData.startTime,
        endTime: formData.endTime,
        title: formData.title,
        description: formData.description,
        type: formData.type,
        speaker: formData.speaker,
      }

      // Debug: log the data being sent
      console.log("[AddTimeSlot] Sending timeData:", timeData)

      const result = await addTimeToEventDay(timeData)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message || "Time slot added successfully",
        })

        // Redirect to events page after successful creation
        router.push("/admin/dashboard/events")
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to add time slot"
        })
      }
    } catch (error) {
      // Debug: log backend error message
      const err = error as any;
      if (err && err.response && err.response.data) {
        console.error("[AddTimeSlot] Backend error:", err.response.data)
      } else {
        console.error("Error adding time slot:", error)
      }
      toast({
        title: "Error",
        description: "An unexpected error occurred"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const selectedDay = eventDays.find((day) => day._id === formData.eventDay_ref)

  if (isLoading) {
    return (
      <TimeSlotPageSkeleton />
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Time Slot</h1>
          <p className="text-muted-foreground">Add a new session to an event day.</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/dashboard/events">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Link>
        </Button>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Time Slot Details
          </CardTitle>
          <CardDescription>Fill in the information for the new time slot.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="eventDay_ref">Event Day *</Label>
                <Select
                  value={formData.eventDay_ref}
                  onValueChange={(value) => handleSelectChange("eventDay_ref", value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an event day" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventDays.map((day) => (
                      <SelectItem key={day._id} value={day._id}>
                        Day {day.dayNumber}: {day.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Session Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleSelectChange("type", value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="break">Break</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time *</Label>
                <Input
                  id="startTime"
                  name="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time *</Label>
                <Input
                  id="endTime"
                  name="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Session Title *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g., Opening Ceremony"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="speaker">Speaker/Host</Label>
                <Input
                  id="speaker"
                  name="speaker"
                  placeholder="e.g., John Doe"
                  value={formData.speaker}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Brief description of the session..."
                value={formData.description}
                onChange={handleChange}
                rows={4}
                disabled={isSubmitting}
              />
            </div>

            {selectedDay && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Selected Event Day:</h4>
                <p className="text-sm text-muted-foreground">
                  Day {selectedDay.dayNumber}: {selectedDay.name}
                </p>
                <p className="text-sm text-muted-foreground">{selectedDay.description}</p>
              </div>
            )}

            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding Time Slot...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Add Time Slot
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/dashboard/events">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
