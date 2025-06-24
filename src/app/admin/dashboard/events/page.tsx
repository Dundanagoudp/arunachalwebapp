"use client"

import { useState, useEffect } from "react"
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
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Calendar, Plus, Edit, Trash2, Eye, Search, MoreHorizontal, Clock, Users, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { getAllEvents, deleteEvent, updateEventDay } from "@/service/events-apis"
import type { EventWithDays, EventDay } from "@/types/events-types"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

export default function EventsPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [events, setEvents] = useState<EventWithDays | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [editSheetOpen, setEditSheetOpen] = useState(false)
  const [editDay, setEditDay] = useState<EventDay | null>(null)
  const [editForm, setEditForm] = useState({ name: "", description: "" })
  const [editLoading, setEditLoading] = useState(false)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    setIsLoading(true)
    try {
      const result = await getAllEvents()
      if (result.success && result.data) {
        setEvents(result.data)
        console.log("Events loaded:", result.data)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to fetch events"
        })
      }
    } catch (error) {
      console.error("Error fetching events:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return

    setIsDeleting(eventId)
    try {
      const result = await deleteEvent(eventId)
      if (result.success) {
        toast({
          title: "Success",
          description: result.message || "Event deleted successfully",
        })
        fetchEvents()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete event"
        })
      }
    } catch (error) {
      console.error("Error deleting event:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred"
      })
    } finally {
      setIsDeleting(null)
    }
  }

  const filteredDays =
    events?.days?.filter(
      (day: EventDay) =>
        day.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        day.description.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || []

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getTotalTimes = (days: EventDay[]) => {
    return days.reduce((total, day) => total + (day.times?.length || 0), 0)
  }

  // Open edit sheet for a day
  const openEditSheet = (day: EventDay) => {
    setEditDay(day)
    setEditForm({ name: day.name, description: day.description })
    setEditSheetOpen(true)
  }

  // Handle edit form change
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditForm((prev) => ({ ...prev, [name]: value }))
  }

  // Handle edit form submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editDay) return
    setEditLoading(true)
    try {
      const result = await updateEventDay(editDay._id, editForm)
      if (result.success) {
        toast({ title: "Success", description: result.message || "Event Day updated" })
        setEditSheetOpen(false)
        fetchEvents()
      } else {
        toast({ title: "Error", description: result.error || "Failed to update event day" })
      }
    } catch (error) {
      toast({ title: "Error", description: "An unexpected error occurred" })
    } finally {
      setEditLoading(false)
    }
  }

  if (isLoading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Loading events...</p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

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
                <BreadcrumbItem>
                  <BreadcrumbPage>Events Management</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Events Management</h1>
              <p className="text-muted-foreground">Manage all events, schedules, and registrations.</p>
            </div>
            <div className="flex gap-2">
              <Button asChild>
                <Link href="/admin/dashboard/events/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Event
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/admin/dashboard/events/add-time">
                  <Clock className="mr-2 h-4 w-4" />
                  Add Time Slot
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Event</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{events?.event ? "1" : "0"}</div>
                <p className="text-xs text-muted-foreground">Active event</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Days</CardTitle>
                <Clock className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{events?.event?.totalDays || 0}</div>
                <p className="text-xs text-muted-foreground">Event duration</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Event Days</CardTitle>
                <Users className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{events?.days?.length || 0}</div>
                <p className="text-xs text-muted-foreground">Configured days</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                <Calendar className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getTotalTimes(events?.days || [])}</div>
                <p className="text-xs text-muted-foreground">Scheduled sessions</p>
              </CardContent>
            </Card>
          </div>

          {/* Current Event Details */}
          {events?.event && (
            <Card>
              <CardHeader>
                <CardTitle>Current Event Details</CardTitle>
                <CardDescription>Information about the active event</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">{events.event.name}</h3>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{events.event.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {formatDate(events.event.startDate)} - {formatDate(events.event.endDate)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{events.event.totalDays} days</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>Year: {events.event.year}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>Month: {events.event.month}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" disabled={isDeleting === events.event._id}>
                            {isDeleting === events.event._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <MoreHorizontal className="h-4 w-4" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/dashboard/events/${events.event._id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/dashboard/events/edit/${events.event._id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Event
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/admin/dashboard/events/add-time">
                              <Clock className="mr-2 h-4 w-4" />
                              Add Time Slot
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteEvent(events.event._id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Event
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Search */}
          <Card>
            <CardHeader>
              <CardTitle>Search Event Days</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="search">Search event days</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by day name or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Event Days List */}
          <Card>
            <CardHeader>
              <CardTitle>Event Days & Sessions</CardTitle>
              <CardDescription>
                {filteredDays.length} day{filteredDays.length !== 1 ? "s" : ""} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredDays.map((day) => (
                  <div key={day._id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold">
                          Day {day.dayNumber}: {day.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{day.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Created: {new Date(day.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Badge variant="outline">{day.times?.length || 0} sessions</Badge>
                        <Dialog open={editSheetOpen && editDay?._id === day._id} onOpenChange={setEditSheetOpen}>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => openEditSheet(day)}>
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Event Day</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleEditSubmit} className="space-y-4 mt-4">
                              <div>
                                <Label htmlFor="edit-name">Name</Label>
                                <Input
                                  id="edit-name"
                                  name="name"
                                  value={editForm.name}
                                  onChange={handleEditFormChange}
                                  required
                                  disabled={editLoading}
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit-description">Description</Label>
                                <Input
                                  id="edit-description"
                                  name="description"
                                  value={editForm.description}
                                  onChange={handleEditFormChange}
                                  required
                                  disabled={editLoading}
                                />
                              </div>
                              <DialogFooter>
                                <Button type="submit" disabled={editLoading}>
                                  {editLoading ? "Saving..." : "Save Changes"}
                                </Button>
                                <DialogClose asChild>
                                  <Button type="button" variant="outline">Cancel</Button>
                                </DialogClose>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>

                    {day.times && day.times.length > 0 && (
                      <div className="space-y-2 mt-4">
                        <h4 className="font-medium text-sm">Sessions:</h4>
                        <div className="grid gap-2 md:grid-cols-2">
                          {day.times.map((time) => (
                            <div key={time._id} className="bg-muted p-3 rounded-md">
                              <div className="flex items-center justify-between">
                                <h5 className="font-medium">{time.title}</h5>
                                <Badge variant="secondary">{time.type}</Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">{time.description}</p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                <span>
                                  🕐 {time.startTime} - {time.endTime}
                                </span>
                                <span>👤 {time.speaker}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {(!day.times || day.times.length === 0) && (
                      <div className="text-center py-4 text-muted-foreground">
                        <Clock className="h-6 w-6 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No sessions scheduled for this day</p>
                        <Button variant="outline" size="sm" className="mt-2" asChild>
                          <Link href="/admin/dashboard/events/add-time">Add Time Slot</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                ))}

                {filteredDays.length === 0 && !events?.event && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No Events Found</h3>
                    <p className="mb-4">Create your first event to get started.</p>
                    <Button asChild>
                      <Link href="/admin/dashboard/events/create">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Event
                      </Link>
                    </Button>
                  </div>
                )}

                {filteredDays.length === 0 && events?.event && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No event days match your search criteria.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
