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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/admin/speaker/table"
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
import { Plus, Edit, Trash2, Loader2, User, Calendar } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { getSpeaker, deleteSpeaker, getEvent } from "@/service/speaker"
import type { Speaker, Event } from "@/types/speaker-types"
import Image from "next/image"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export default function SpeakersPage() {
  const [speakers, setSpeakers] = useState<Speaker[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Delete state
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(speakers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentSpeakers = speakers.slice(startIndex, endIndex)

  // Reset to page 1 if speakers list changes and current page is out of range
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1)
  }, [speakers, totalPages])

  // Generate pagination items (with ellipsis)
  const generatePaginationItems = () => {
    const items = []
    const maxVisiblePages = 5
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) items.push(i)
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) items.push(i)
        items.push('ellipsis')
        items.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        items.push(1)
        items.push('ellipsis')
        for (let i = totalPages - 3; i <= totalPages; i++) items.push(i)
      } else {
        items.push(1)
        items.push('ellipsis')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) items.push(i)
        items.push('ellipsis')
        items.push(totalPages)
      }
    }
    return items
  }

  useEffect(() => {
    fetchSpeakers()
    fetchEvents()
  }, [])

  const fetchSpeakers = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await getSpeaker()

      console.log("API Response:", response) // Debug log

      if (response.success && response.data) {
        setSpeakers(response.data)
      } else {
        setError(response.error || "Failed to fetch speakers")
        setSpeakers([])
      }
    } catch (err) {
      console.error("Fetch speakers error:", err)
      setError("Failed to fetch speakers")
      setSpeakers([])
    } finally {
      setLoading(false)
    }
  }

  const fetchEvents = async () => {
    try {
      const response = await getEvent()
      if (response.success && response.data) {
        setEvents(response.data)
      }
    } catch (err) {
      console.error("Failed to fetch events")
    }
  }

  const handleDelete = async (speakerId: string) => {
    try {
      setDeleteLoading(speakerId)
      const response = await deleteSpeaker(speakerId)
      if (response.success) {
        setSuccess("Speaker deleted successfully!")
        setSpeakers(speakers.filter((speaker) => speaker._id !== speakerId))
        setTimeout(() => setSuccess(""), 3000)
      } else {
        setError(response.error || "Failed to delete speaker")
        setTimeout(() => setError(""), 3000)
      }
    } catch (err) {
      setError("Failed to delete speaker")
      setTimeout(() => setError(""), 3000)
    } finally {
      setDeleteLoading(null)
    }
  }

  const getEventName = (eventId: string) => {
    const event = events.find((e) => e._id === eventId)
    return event ? `${event.name} (${event.year})` : "Unknown Event"
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
                  <BreadcrumbPage>Speakers</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Speakers Management</h1>
              <p className="text-muted-foreground">Manage all speakers for your events.</p>
            </div>
            <Button asChild>
              <Link href="/admin/dashboard/speakers/create">
                <Plus className="mr-2 h-4 w-4" />
                Add Speaker
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

          {/* Speakers Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Speakers</CardTitle>
              <CardDescription>
                {loading ? "Loading speakers..." : `Total ${speakers.length} speakers found`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">Loading speakers...</span>
                </div>
              ) : !Array.isArray(speakers) || speakers.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8">
                  <User className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No speakers found</h3>
                  <p className="text-muted-foreground mb-4">Get started by adding your first speaker.</p>
                  <Button asChild>
                    <Link href="/admin/dashboard/speakers/create">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Speaker
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">Image</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>About</TableHead>
                        <TableHead>Event</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentSpeakers.map((speaker) => (
                        <TableRow key={speaker._id}>
                          <TableCell>
                            {speaker.image_url ? (
                              <Image
                                src={speaker.image_url || "/placeholder.svg"}
                                alt={speaker.name}
                                width={40}
                                height={40}
                                className="rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                <User className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">{speaker.name}</TableCell>
                          <TableCell className="max-w-xs">
                            <p className="truncate">{speaker.about}</p>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm">
                              <Calendar className="h-3 w-3" />
                              {getEventName(speaker.event_ref)}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button asChild variant="outline" size="sm">
                                <Link href={`/admin/dashboard/speakers/${speaker._id}/edit`}>
                                  <Edit className="mr-2 h-3 w-3" />
                                  Edit
                                </Link>
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="destructive" size="sm" disabled={deleteLoading === speaker._id}>
                                    {deleteLoading === speaker._id ? (
                                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                    ) : (
                                      <Trash2 className="mr-2 h-3 w-3" />
                                    )}
                                    Delete
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete the speaker "
                                      {speaker.name}".
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(speaker._id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {/* Pagination UI */}
                  <div className="flex flex-col items-center gap-2 py-4">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                        {generatePaginationItems().map((item, idx) => (
                          <PaginationItem key={idx}>
                            {item === 'ellipsis' ? (
                              <PaginationEllipsis />
                            ) : (
                              <PaginationLink
                                isActive={currentPage === item}
                                onClick={() => setCurrentPage(item as number)}
                                className="cursor-pointer"
                              >
                                {item}
                              </PaginationLink>
                            )}
                          </PaginationItem>
                        ))}
                        <PaginationItem>
                          <PaginationNext
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                    <div className="text-xs text-muted-foreground">
                      Page {currentPage} of {totalPages} • Showing {speakers.length === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, speakers.length)} of {speakers.length} speakers
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
