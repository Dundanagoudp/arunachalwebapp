"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  BookOpen, 
  Users, 
  FileText, 
  Calendar, 
  TrendingUp, 
  Plus,
  Edit,
  Trash2,
  Eye
} from "lucide-react"
import Link from "next/link"
import { UserSidebar } from "@/components/user-dashboard/user-sidebar"

export default function AdminDashboard() {
  // Mock data - replace with actual data from your backend
  const stats = [
    {
      title: "Total Blogs",
      value: "24",
      description: "+12% from last month",
      icon: FileText,
      color: "text-blue-600"
    },
    {
      title: "Active Users",
      value: "1,234",
      description: "+8% from last week",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Events",
      value: "5",
      description: "2 upcoming events",
      icon: Calendar,
      color: "text-orange-600"
    }
  ]

  const recentBlogs = [
    {
      id: 1,
      title: "Arunachal Pradesh Literature Festival 2024",
      status: "published",
      date: "2024-01-15",
      views: 1234
    },
    {
      id: 2,
      title: "Traditional Stories from the Hills",
      status: "draft",
      date: "2024-01-14",
      views: 0
    },
    {
      id: 3,
      title: "Modern Literature in Arunachal",
      status: "published",
      date: "2024-01-13",
      views: 856
    }
  ]

  const recentCourses = [
    {
      id: 1,
      title: "Introduction to Arunachal Literature",
      students: 45,
      status: "active"
    },
    {
      id: 2,
      title: "Traditional Storytelling Techniques",
      students: 32,
      status: "active"
    },
    {
      id: 3,
      title: "Modern Writing Workshop",
      students: 28,
      status: "draft"
    }
  ]

  return (
    <SidebarProvider>
      <UserSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/admin">
                    User Panel
                  </BreadcrumbLink>
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
          {/* <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">User Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back! Here's what's happening with your Arunachal Literature platform.
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild>
                <Link href="/admin/blogs/create">
                  <Plus className="mr-2 h-4 w-4" />
                  New Blog
                </Link>
              </Button>
            </div>
          </div> */}

          {/* Stats Cards */}
          {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div> */}

          {/* Content Management Section */}
     

          {/* Quick Actions */}
          {/* <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common administrative tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                  <Link href="/admin/blogs">
                    <FileText className="h-6 w-6" />
                    Manage Blogs
                  </Link>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                  <Link href="/admin/users">
                    <Users className="h-6 w-6" />
                    Manage Users
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card> */}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
