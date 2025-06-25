"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Save, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getEventDays, addTimeToEventDay } from "@/service/events-apis"
import type { EventDay, AddTimeData } from "@/types/events-types"

// Helper to get current local ISO string for datetime-local input
function getNowISOString() {
  const now = new Date();
  const tzOffset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - tzOffset).toISOString().slice(0, 16);
}

export default function AddTimeSlot() {
  const { toast } = useToast()
  const [eventDays, setEventDays] = useState<EventDay[]>([])
  const [isLoading, setIsLoading] = useState(false)
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
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to fetch event days",
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
    // Prevent selecting past times
    if (formData.startTime && new Date(formData.startTime) < new Date()) {
      toast({
        title: "Error",
        description: "Start Time cannot be in the past.",
      });
      return;
    }
    if (formData.endTime && new Date(formData.endTime) < new Date()) {
      toast({
        title: "Error",
        description: "End Time cannot be in the past.",
      });
      return;
    }

    if (!formData.eventDay_ref) {
      toast({
        title: "Error",
        description: "Please select an event day",
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
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
        title: formData.title,
        description: formData.description,
        type: formData.type,
        speaker: formData.speaker,
      }

      console.log("Adding time slot with data:", timeData)

      const result = await addTimeToEventDay(timeData)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message || "Time slot added successfully",
        })

        // Reset form
        setFormData({
          eventDay_ref: "",
          startTime: "",
          endTime: "",
          title: "",
          description: "",
          type: "event",
          speaker: "",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to add time slot",
        })
      }
    } catch (error) {
      console.error("Error adding time slot:", error)
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

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Add Time Slot
        </CardTitle>
        <CardDescription>Add a new session to an event day.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="eventDay_ref">Select Event Day *</Label>
            <Select
              value={formData.eventDay_ref}
              onValueChange={(value) => handleSelectChange("eventDay_ref", value)}
              disabled={isLoading || isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder={isLoading ? "Loading event days..." : "Select an event day"} />
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

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time *</Label>
              <Input
                id="startTime"
                name="startTime"
                type="datetime-local"
                value={formData.startTime}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                min={getNowISOString()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time *</Label>
              <Input
                id="endTime"
                name="endTime"
                type="datetime-local"
                value={formData.endTime}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                min={getNowISOString()}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Session Title *</Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter session title"
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
              placeholder="Enter session description"
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
                placeholder="Enter speaker name"
                value={formData.speaker}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting || isLoading}>
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
        </form>
      </CardContent>
    </Card>
  )
}
