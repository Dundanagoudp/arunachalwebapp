"use client"

import * as React from "react"
import {
  BookOpen,
  FileText,
  Users,
  Calendar,
  BarChart3,
  Home,
  Globe,
  Link as LinkIcon,
  Archive,
  ImageIcon,
  Settings,
  Mic,
} from "lucide-react"
import { toast } from "sonner"
import { logoutUser } from "@/service/authService"
import { setCookie } from "@/lib/cookies"
import { useRouter } from "next/navigation"
import { useCallback } from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// Admin-specific data
const adminData = {
  user: {
    name: "Admin User",
    email: "admin@arunachalliterature.com",
    avatar: "/avatars/admin.jpg",
  },
  teams: [
    {
      name: "Arunachal Literature",
      logo: BookOpen,
      plan: "Admin",
    },
  ],
   navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: Home,
      isActive: true,
      item:[
        {
          title: "Main",
          url: "/admin/dashboard",
        },
      ]
    },
    {
      title: "Events",
      url: "/admin/dashboard/events",
      icon: Calendar,
      items: [
        {
          title: "All Events",
          url: "/admin/dashboard/events",
        },
        {
          title: "Create Event",
          url: "/admin/dashboard/events/create",
        },
        {
          title: "Add Time Slot",
          url: "/admin/dashboard/events/add-time",
        }
      ],
    },
    {
      title: "Speakers",
      url: "/admin/dashboard/speakers",
      icon: Mic,
      items: [
        {
          title: "All Speakers",
          url: "/admin/dashboard/speakers",
        },
        {
          title: "Add Speaker",
          url: "/admin/dashboard/speakers/create",
        },
      ],
    },
    {
      title: "Content",
      url: "/admin/dashboard/content",
      icon: FileText,
      items: [
        {
          title: "News & Blogs",
          url: "/admin/dashboard/content/blogs",
        },
        {
          title: "Create Content",
          url: "/admin/dashboard/content/create",
        },
      ],
    },
    {
      title: "Workshops",
      url: "/admin/dashboard/workshops",
      icon: BookOpen,
      items: [
        {
          title: "All Workshops",
          url: "/admin/dashboard/workshops",
        },
        {
          title: "Create Workshop",
          url: "/admin/dashboard/workshops/create",
        },
      ],
    },
    {
      title: "Users",
      url: "/admin/dashboard/users",
      icon: Users,
      items: [
        {
          title: "All Users",
          url: "/admin/dashboard/users",
        },
        {
          title: "Add User",
          url: "/admin/dashboard/users/create",
        },
      ],
    },
    {
      title: "Media",
      url: "/admin/dashboard/media",
      icon: ImageIcon,
    },
    {
      title: "Archives",
      url: "/admin/dashboard/archive",
      icon: Archive,
      items: [
        {
          title: "All Archives",
          url: "/admin/dashboard/archive",
        },
        {
          title: "Add Archive",
          url: "/admin/dashboard/archive/add-year",
        },
        {
          title: "Upload Image",
          url: "/admin/dashboard/archive/upload",
        },
      ]
      
    },
    {
      title: "Analytics",
      url: "/admin/dashboard/analytics",
      icon: BarChart3,
    },
    {
      title: "Settings",
      url: "/admin/dashboard/settings",
      icon: Settings,
    },
  ],
  projects: [
    {
      name: "Website Frontend",
      url: "/",
      icon: Globe,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  const handleLogout = useCallback(async () => {
    try {
      await logoutUser({ message: "", success: true })
      setCookie("userRole", "", { days: -1 })
      setCookie("token", "", { days: -1 })
      toast.success("Logged out successfully")
      router.replace("/login")
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message || "Logout failed")
    }
  }, [router])
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={adminData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={adminData.navMain} />
        <NavProjects projects={adminData.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={adminData.user} onLogout={handleLogout} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
