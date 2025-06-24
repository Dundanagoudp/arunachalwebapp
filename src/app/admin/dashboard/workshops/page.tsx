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
import { BookOpen, Users, Plus, Edit, Trash2, Eye, Search, MoreHorizontal, Calendar, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function WorkshopsManagement() {
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data - replace with actual API calls
  const workshops = [
    {
      id: 1,
      name: "Traditional Storytelling Workshop",
      about: "Learn the ancient art of storytelling from master storytellers of Arunachal Pradesh",
      imageUrl: "/placeholder.svg?height=200&width=300",
      registrationFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLSc...",
      eventRef: "1",
      eventName: "Arunachal Pradesh Literature Festival 2024",
      createdAt: "2024-01-15",
      registrations: 45,
    },
    {
      id: 2,
      name: "Creative Writing Masterclass",
      about: "Enhance your creative writing skills with professional authors and editors",
      imageUrl: "/placeholder.svg?height=200&width=300",
      registrationFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLSd...",
      eventRef: "1",
      eventName: "Arunachal Pradesh Literature Festival 2024",
      createdAt: "2024-01-12",
      registrations: 32,
    },
    {
      id: 3,
      name: "Digital Publishing Workshop",
      about: "Learn modern publishing techniques and digital marketing for authors",
      imageUrl: "/placeholder.svg?height=200&width=300",
      registrationFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLSe...",
      eventRef: "3",
      eventName: "Modern Literature Symposium",
      createdAt: "2024-01-10",
      registrations: 28,
    },
  ]

  const filteredWorkshops = workshops.filter(
    (workshop) =>
      workshop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workshop.about.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workshop.eventName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
                  <BreadcrumbPage>Workshops Management</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Workshops Management</h1>
              <p className="text-muted-foreground">Manage workshops, registrations, and participant data.</p>
            </div>
            <Button asChild>
              <Link href="/admin/workshops/create">
                <Plus className="mr-2 h-4 w-4" />
                Create Workshop
              </Link>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-3">
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
                <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {workshops.reduce((sum, workshop) => sum + workshop.registrations, 0)}
                </div>
                <p className="text-xs text-muted-foreground">All workshops</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Registrations</CardTitle>
                <Users className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(workshops.reduce((sum, workshop) => sum + workshop.registrations, 0) / workshops.length)}
                </div>
                <p className="text-xs text-muted-foreground">Per workshop</p>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <Card>
            <CardHeader>
              <CardTitle>Search Workshops</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="search">Search workshops</Label>
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
              <CardTitle>All Workshops</CardTitle>
              <CardDescription>
                {filteredWorkshops.length} workshop{filteredWorkshops.length !== 1 ? "s" : ""} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredWorkshops.map((workshop) => (
                  <div key={workshop.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="w-32 h-24 bg-muted rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={workshop.imageUrl || "/placeholder.svg"}
                        alt={workshop.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">{workshop.name}</h3>
                        <Badge variant="secondary">{workshop.registrations} registered</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{workshop.about}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{workshop.eventName}</span>
                        </div>
                        <span>Created: {workshop.createdAt}</span>
                      </div>
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
                    </div>
                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Users className="mr-2 h-4 w-4" />
                            View Registrations
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <a href={workshop.registrationFormUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Open Form
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
