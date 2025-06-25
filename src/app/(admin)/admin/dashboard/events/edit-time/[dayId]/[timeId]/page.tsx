"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getEventDays, updateTime } from "@/service/events-apis";
import type { EventDay, EventTime } from "@/types/events-types";

export default function EditTimeSlotPage({ params }: { params: Promise<{ dayId: string, timeId: string }> }) {
  const { dayId, timeId } = React.use(params);
  const router = useRouter();
  const { toast } = useToast();
  const [eventDay, setEventDay] = useState<EventDay | null>(null);
  const [timeSlot, setTimeSlot] = useState<EventTime | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      setIsLoading(true);
      try {
        const result = await getEventDays();
        if (result.success && result.data) {
          const day = result.data.find((d: EventDay) => d._id === dayId);
          if (day) {
            setEventDay(day);
            const slot = day.times?.find((t) => t._id === timeId) || null;
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
              toast({ title: "Error", description: "Time slot not found" });
              router.replace("/admin/dashboard/events");
            }
          } else {
            toast({ title: "Error", description: "Event day not found" });
            router.replace("/admin/dashboard/events");
          }
        } else {
          toast({ title: "Error", description: result.error || "Failed to fetch event days" });
          router.replace("/admin/dashboard/events");
        }
      } catch (error) {
        toast({ title: "Error", description: "Failed to fetch event days" });
        router.replace("/admin/dashboard/events");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayId, timeId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventDay || !timeSlot) return;
    setIsSubmitting(true);
    try {
      const result = await updateTime(eventDay._id, timeSlot._id, formData);
      if (result.success) {
        toast({ title: "Success", description: result.message || "Time slot updated" });
        router.replace("/admin/dashboard/events");
      } else {
        toast({ title: "Error", description: result.error || "Failed to update time slot" });
      }
    } catch (error) {
      toast({ title: "Error", description: "An unexpected error occurred" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!eventDay || !timeSlot) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Edit Time Slot</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex gap-2">
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
                value={formData.title}
                onChange={handleChange}
                required
                disabled={isSubmitting}
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
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Session Type *</Label>
              <Input
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
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
              />
            </div>
            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.replace("/admin/dashboard/events")}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 