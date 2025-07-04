"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getEventDays, updateTime, getAllEvents } from "@/service/events-apis";
import type { EventDay, EventTime } from "@/types/events-types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EditTimeSlotPage() {
  const params = useParams() as { dayId?: string; timeId?: string };
  const dayId = params.dayId ?? "";
  const timeId = params.timeId ?? "";
  const router = useRouter();
  const { toast } = useToast();
  const [eventDay, setEventDay] = useState<EventDay | null>(null);
  const [timeSlot, setTimeSlot] = useState<EventTime | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    startTime: "",
    endTime: "",
    title: "",
    description: "",
    type: "event",
    speaker: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!dayId || !timeId) {
        setError("Invalid day or time ID");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        console.log("Fetching events for dayId:", dayId, "timeId:", timeId);
        const result = await getAllEvents();

        if (result.success && result.data) {
          const day = result.data.days?.find((d: EventDay) => d._id === dayId);
          console.log("Found day:", day);

          if (day) {
            setEventDay(day);
            console.log("Looking for timeId:", timeId);
            console.log("Available time slots:", day.times);
            console.log(
              "Time slot IDs:",
              day.times?.map((t) => t._id)
            );

            const slot = day.times?.find((t) => t._id === timeId) || null;
            console.log("Found time slot:", slot);

            if (slot) {
              setTimeSlot(slot);
              setFormData({
                startTime: slot.startTime,
                endTime: slot.endTime,
                title: slot.title,
                description: slot.description,
                type: slot.type,
                speaker: slot.speaker,
              });
            } else {
              setError(
                `Time slot not found. Looking for ID: ${timeId}. Available IDs: ${
                  day.times?.map((t) => t._id).join(", ") || "none"
                }`
              );
              toast({
                title: "Error",
                description: "Time slot not found",
              });
            }
          } else {
            setError("Event day not found");
            toast({
              title: "Error",
              description: "Event day not found",
            });
          }
        } else {
          setError(result.error || "Failed to fetch events");
          toast({
            title: "Error",
            description: result.error || "Failed to fetch events",
          });
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Failed to fetch events");
        toast({
          title: "Error",
          description: "Failed to fetch events",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dayId, timeId, toast]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventDay || !timeSlot) {
      toast({
        title: "Error",
        description: "Missing event day or time slot data",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Updating time slot:", {
        dayId: eventDay._id,
        timeId: timeSlot._id,
        formData,
      });
      const result = await updateTime(eventDay._id, timeSlot._id, formData);

      if (result.success) {
        toast({
          title: "Success",
          description: result.message || "Time slot updated successfully",
        });
        router.replace("/admin/dashboard/events");
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update time slot",
        });
      }
    } catch (error) {
      console.error("Error updating time slot:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.replace("/admin/dashboard/events");
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p>Loading time slot details...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle className="text-red-600">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={handleCancel} variant="outline">
                Back to Events
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (!eventDay || !timeSlot) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>Not Found</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                The requested time slot could not be found.
              </p>
              <Button onClick={handleCancel} variant="outline">
                Back to Events
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="w-full max-w-4xl mx-auto">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Edit Time Slot</CardTitle>
            <p className="text-muted-foreground">
              Day {eventDay.dayNumber}: {eventDay.name}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    className="w-full"
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
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Session Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  placeholder="Enter session title"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  placeholder="Enter session description"
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="type">Session Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, type: value }))
                    }
                    disabled={isSubmitting}
                    required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="event">Event</SelectItem>
                    
                      <SelectItem value="break">Break</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="speaker">Speaker *</Label>

                  <Input
                    id="speaker"
                    name="speaker"
                    value={formData.speaker}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    placeholder="Enter speaker name"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Time Slot</h1>
          <p className="text-muted-foreground">
            {eventDay
              ? `Day ${eventDay.dayNumber}: ${eventDay.name}`
              : "Loading..."}
          </p>
        </div>
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
}
