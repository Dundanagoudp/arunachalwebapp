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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Users, FileText, Mic, BookOpen, TrendingUp, Plus, Eye, BarChart3, Activity } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  // Mock data for dashboard
  const stats = [
    {
      title: "Total Events",
      value: "12",
      change: "+2 from last month",
      icon: Calendar,
      color: "text-blue-600",
      trend: "up",
    },
    {
      title: "Active Users",
      value: "1,234",
      change: "+8% from last week",
      icon: Users,
      color: "text-green-600",
      trend: "up",
    },
    {
      title: "Published Content",
      value: "45",
      change: "+12% from last month",
      icon: FileText,
      color: "text-purple-600",
      trend: "up",
    },
    {
      title: "Total Speakers",
      value: "28",
      change: "5 new this month",
      icon: Mic,
      color: "text-orange-600",
      trend: "up",
    },
  ]

  const recentActivity = [
    {
      id: 1,
      type: "event",
      title: "New event created: Literature Festival 2024",
      time: "2 hours ago",
      user: "Admin User",
    },
    {
      id: 2,
      type: "speaker",
      title: "Speaker added: Dr. Rajesh Kumar",
      time: "4 hours ago",
      user: "Admin User",
    },
    {
      id: 3,
      type: "content",
      title: "Blog published: Traditional Stories Workshop",
      time: "6 hours ago",
      user: "Content Manager",
    },
    {
      id: 4,
      type: "user",
      title: "New user registered: Jane Smith",
      time: "8 hours ago",
      user: "System",
    },
  ]

  const upcomingEvents = [
    {
      id: 1,
      name: "Arunachal Pradesh Literature Festival 2024",
      date: "March 15-17, 2024",
      location: "Itanagar Cultural Center",
      status: "upcoming",
      registrations: 245,
    },
    {
      id: 2,
      name: "Traditional Stories Workshop",
      date: "February 20, 2024",
      location: "Community Hall",
      status: "planning",
      registrations: 89,
    },
  ]

  const topSpeakers = [
    {
      id: 1,
      name: "Dr. Rajesh Kumar",
      sessions: 5,
      rating: 4.9,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Ms. Priya Sharma",
      sessions: 3,
      rating: 4.8,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Prof. Anand Tiwari",
      sessions: 4,
      rating: 4.7,
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

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
                  <BreadcrumbLink href="/admin">Admin Panel</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          {/* Welcome Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Welcome back, Admin!</h1>
              <p className="text-muted-foreground">
                Here's what's happening with your Arunachal Literature platform today.
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild>
                <Link href="/admin/content/create">
                  <Plus className="mr-2 h-4 w-4" />
                  New Content
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/admin/events/create">
                  <Calendar className="mr-2 h-4 w-4" />
                  New Event
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
                    {stat.change}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Recent Activity */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Recent Activity
                    </CardTitle>
                    <CardDescription>Latest actions and updates on your platform</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/admin/content/blogs">View All</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{activity.time}</span>
                          <span>•</span>
                          <span>by {activity.user}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Speakers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5" />
                  Top Speakers
                </CardTitle>
                <CardDescription>Most active speakers this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topSpeakers.map((speaker, index) => (
                    <div key={speaker.id} className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium">
                        {index + 1}
                      </div>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={speaker.avatar || "/placeholder.svg"} alt={speaker.name} />
                        <AvatarFallback>
                          {speaker.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{speaker.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {speaker.sessions} sessions • ⭐ {speaker.rating}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Upcoming Events
                    </CardTitle>
                    <CardDescription>Events scheduled for the next few weeks</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/admin/events">View All</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium">{event.name}</h4>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{event.date}</span>
                          <span>•</span>
                          <span>{event.location}</span>
                          <span>•</span>
                          <span>{event.registrations} registered</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={event.status === "upcoming" ? "default" : "secondary"}>{event.status}</Badge>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <Button variant="outline" className="justify-start" asChild>
                    <Link href="/admin/content/blogs">
                      <FileText className="mr-2 h-4 w-4" />
                      Manage Content
                    </Link>
                  </Button>
                  <Button variant="outline" className="justify-start" asChild>
                    <Link href="/admin/events">
                      <Calendar className="mr-2 h-4 w-4" />
                      Manage Events
                    </Link>
                  </Button>
                  <Button variant="outline" className="justify-start" asChild>
                    <Link href="/admin/speakers">
                      <Mic className="mr-2 h-4 w-4" />
                      Manage Speakers
                    </Link>
                  </Button>
                  <Button variant="outline" className="justify-start" asChild>
                    <Link href="/admin/users">
                      <Users className="mr-2 h-4 w-4" />
                      Manage Users
                    </Link>
                  </Button>
                  <Button variant="outline" className="justify-start" asChild>
                    <Link href="/admin/workshops">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Manage Workshops
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Platform Analytics
              </CardTitle>
              <CardDescription>Overview of platform performance and engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">2.4K</div>
                  <div className="text-sm text-muted-foreground">Page Views</div>
                  <div className="text-xs text-green-600">+12% this week</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">89%</div>
                  <div className="text-sm text-muted-foreground">Event Attendance</div>
                  <div className="text-xs text-green-600">+5% from last event</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">156</div>
                  <div className="text-sm text-muted-foreground">New Registrations</div>
                  <div className="text-xs text-green-600">+23% this month</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">4.8</div>
                  <div className="text-sm text-muted-foreground">Avg. Rating</div>
                  <div className="text-xs text-green-600">+0.2 from last month</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
