"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar as CalendarIcon,
  Save,
  ArrowLeft,
  Loader2,
  ChevronDownIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { addEvent } from "@/service/events-apis";
import { CreateEventData, months } from "@/types/events-types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

export default function CreateEventPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [openEndDate, setOpenEndDate] = React.useState(false);
  const [formData, setFormData] = useState<CreateEventData>({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });
  const getMonthName = (monthNumber: number) => {
    return months[monthNumber - 1] || "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Form data before submission:", formData);

    try {
      // Convert dates to ISO format
      const eventData: CreateEventData = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
      };

      console.log("Creating event with data:", eventData);

      const result = await addEvent(eventData);

      if (result.success) {
        toast({
          title: "Success",
          description: result.message || "Event created successfully",
        });

        // Redirect to events page after successful creation
        router.push("/admin/dashboard/events");
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create event",
        });
      }
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "year") {
      const currentYear = new Date().getFullYear();
      const inputYear = Number.parseInt(value) || 0;

      // Only update if the year is current or future
      if (inputYear >= currentYear) {
        setFormData((prev) => ({
          ...prev,
          [name]: inputYear,
        }));
      }
    } else if (name === "month") {
      setFormData((prev) => ({
        ...prev,
        [name]: Number.parseInt(value) || 1,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Create New Event
          </h1>
          <p className="text-muted-foreground">
            Add a new event to your literature platform.
          </p>
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
            <CalendarIcon className="h-5 w-5" />
            Event Details
          </CardTitle>
          <CardDescription>
            Fill in the information for your new event.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Event Name *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., ARUNACHAL LITERATURE FESTIVAL events"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year *</Label>
                <Input
                  id="year"
                  name="year"
                  type="number"
                  value={formData.year}
                  onChange={handleChange}
                  min={new Date().getFullYear()}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="e.g., One-day coding workshop"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="month">Month *</Label>
                <select
                  id="month"
                  name="month"
                  value={formData.month}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(0, i).toLocaleString("default", {
                        month: "long",
                      })}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="startDate" // Match the original ID
                      className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 justify-between font-normal"
                      disabled={isLoading}
                    >
                      {formData.startDate
                        ? new Date(formData.startDate).toLocaleDateString()
                        : "Select date"}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        formData.startDate
                          ? new Date(formData.startDate)
                          : undefined
                      }
                      onSelect={(date: Date | undefined) => {
                        if (date) {
                          // Update formData just like handleChange would
                          const localDateString =
                            date.toLocaleDateString("en-CA");
                          setFormData({
                            ...formData,
                            startDate: localDateString,
                          });
                        }
                        setOpen(false);
                      }}
                      required={true} // If needed
                      disabled={isLoading} // If needed
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>

                <Popover open={openEndDate} onOpenChange={setOpenEndDate}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="endDate" // Keep original ID
                      className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 justify-between font-normal"
                      disabled={isLoading}
                    >
                      {formData.endDate
                        ? new Date(formData.endDate).toLocaleDateString()
                        : "Select date"}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        formData.endDate
                          ? new Date(formData.endDate)
                          : undefined
                      }
                      onSelect={(date) => {
                        if (date) {
                          // Update formData to match YYYY-MM-DD format (same as input[type="date"])
                        const localDateString =
                            date.toLocaleDateString("en-CA");
                          setFormData({
                            ...formData,
                            endDate: localDateString,
                          });
                        }
                        setOpenEndDate(false);
                      }}
                      required // If needed
                      disabled={isLoading} // If needed
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Event...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create Event
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
  );
}
