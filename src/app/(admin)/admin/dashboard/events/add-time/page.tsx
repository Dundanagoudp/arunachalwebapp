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

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
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
                  <BreadcrumbLink href="/admin/dashboard/events">Events</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Add Time Slot</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

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
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p>Loading event days...</p>
                  </div>
                </div>
              ) : eventDays.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No Event Days Found</h3>
                  <p className="text-muted-foreground mb-4">
                    You need to create an event first before adding time slots.
                  </p>
                  <Button asChild>
                    <Link href="/admin/dashboard/events/create">Create Event</Link>
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="eventDay_ref">Select Event Day *</Label>
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
                    {selectedDay && (
                      <p className="text-sm text-muted-foreground">
                        Selected: {selectedDay.description} (Created:{" "}
                        {new Date(selectedDay.createdAt).toLocaleDateString()})
                      </p>
                    )}
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

                  <div className="space-y-2">
                    <Label htmlFor="title">Session Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="e.g., Keynote Speech 2"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="e.g., Opening keynote by industry leader"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="type">Session Type *</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) => handleSelectChange("type", value)}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select session type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="event">Event</SelectItem>
                          <SelectItem value="workshop">Workshop</SelectItem>
                          <SelectItem value="keynote">Keynote</SelectItem>
                          <SelectItem value="panel">Panel Discussion</SelectItem>
                          <SelectItem value="break">Break</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="speaker">Speaker *</Label>
                      <Input
                        id="speaker"
                        name="speaker"
                        placeholder="e.g., kushal"
                        value={formData.speaker}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
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
                    <Button type="button" variant="outline" asChild disabled={isSubmitting}>
                      <Link href="/admin/dashboard/events">Cancel</Link>
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
