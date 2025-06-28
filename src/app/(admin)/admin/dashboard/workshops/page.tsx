"use client"

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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  BookOpen,
  Users,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  MoreHorizontal,
  Calendar,
  ExternalLink,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { getWorkshops, deleteWorkshop, getEvents } from "@/service/registrationService"
import type { Workshop } from "@/types/workshop-types"
import type { Event } from "@/types/events-types"
import { useToast } from "@/hooks/use-toast"

export default function WorkshopsManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [workshopToDelete, setWorkshopToDelete] = useState<Workshop | null>(null)
  const [deleting, setDeleting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [workshopsResponse, eventsResponse] = await Promise.all([getWorkshops(), getEvents()])

      if (workshopsResponse.success && workshopsResponse.data) {
        setWorkshops(workshopsResponse.data)
      } else {
        toast({
          title: "Error",
          description: workshopsResponse.error || "Failed to fetch workshops",
        })
      }

      if (eventsResponse.success && eventsResponse.data) {
        setEvents(eventsResponse.data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data",
      })
    } finally {
      setLoading(false)
    }
  }

  const getEventName = (eventRef: string) => {
    const event = events.find((e) => e._id === eventRef)
    return event?.name || "Unknown Event"
  }

  const handleDeleteClick = (workshop: Workshop) => {
    setWorkshopToDelete(workshop)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!workshopToDelete) return

    setDeleting(true)
    try {
      const response = await deleteWorkshop(workshopToDelete._id)
      if (response.success) {
        setWorkshops(workshops.filter((w) => w._id !== workshopToDelete._id))
        toast({
          title: "Success",
          description: "Workshop deleted successfully",
        })
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to delete workshop",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete workshop",
      })
    } finally {
      setDeleting(false)
      setDeleteDialogOpen(false)
      setWorkshopToDelete(null)
    }
  }

  const filteredWorkshops = workshops.filter(
    (workshop) =>
      workshop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workshop.about.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getEventName(workshop.eventRef).toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex items-center justify-center h-screen">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

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
                <BreadcrumbItem>
                  <BreadcrumbPage>Workshops Management</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6 pt-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Workshops Management</h1>
              <p className="text-muted-foreground text-sm md:text-base">
                Manage workshops, registrations, and participant data.
              </p>
            </div>
            <Button asChild className="w-full sm:w-auto" suppressHydrationWarning={true}>
              <Link href="/admin/dashboard/workshops/create">
                <Plus className="mr-2 h-4 w-4" />
                Create Workshop
              </Link>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Workshops</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{workshops.length}</div>
                <p className="text-xs text-muted-foreground">Across all events</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Events</CardTitle>
                <Calendar className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{events.length}</div>
                <p className="text-xs text-muted-foreground">Total events</p>
              </CardContent>
            </Card>
            <Card className="sm:col-span-2 lg:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                <Users className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {workshops.length > 0 ? new Date(workshops[0].createdAt).toLocaleDateString() : "N/A"}
                </div>
                <p className="text-xs text-muted-foreground">Last workshop created</p>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Search Workshops</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="search" className="sr-only">
                    Search workshops
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by name, description, or event..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Workshops List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">All Workshops</CardTitle>
              <CardDescription>
                {filteredWorkshops.length} workshop{filteredWorkshops.length !== 1 ? "s" : ""} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredWorkshops.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">No workshops found</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {searchTerm ? "Try adjusting your search terms." : "Get started by creating a new workshop."}
                    </p>
                    {!searchTerm && (
                      <div className="mt-6">
                        <Button asChild>
                          <Link href="/admin/dashboard/workshops/create" suppressHydrationWarning={true}>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Workshop
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  filteredWorkshops.map((workshop) => (
                    <div
                      key={workshop._id}
                      className="flex flex-col lg:flex-row items-start gap-4 p-4 border rounded-lg"
                    >
                      <div className="w-full lg:w-32 h-32 lg:h-24 bg-muted rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={workshop.imageUrl || "/placeholder.svg"}
                          alt={workshop.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-2 w-full lg:w-auto">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <h3 className="text-lg font-semibold">{workshop.name}</h3>
                          <Badge variant="secondary" className="w-fit">
                            {getEventName(workshop.eventRef)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{workshop.about}</p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Created: {new Date(workshop.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        {workshop.registrationFormUrl && (
                          <div className="flex items-center gap-2 text-sm">
                            <ExternalLink className="h-4 w-4 text-blue-600" />
                            <a
                              href={workshop.registrationFormUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline truncate"
                            >
                              Registration Form
                            </a>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" suppressHydrationWarning={true}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/dashboard/workshops/${workshop._id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/dashboard/workshops/${workshop._id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            {workshop.registrationFormUrl && (
                              <DropdownMenuItem asChild>
                                <a href={workshop.registrationFormUrl} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  Open Form
                                </a>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteClick(workshop)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the workshop "{workshopToDelete?.name}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700"
                disabled={deleting}
                suppressHydrationWarning={true}
              >
                {deleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SidebarInset>
    </SidebarProvider>
  )
}
