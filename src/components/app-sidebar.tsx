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
    },
    {
      title: "Events",
      url: "/admin/events",
      icon: Calendar,
      items: [
        {
          title: "All Events",
          url: "/admin/events",
        },
        {
          title: "Create Event",
          url: "/admin/events/create",
        },
      ],
    },
    {
      title: "Speakers",
      url: "/admin/speakers",
      icon: Mic,
      items: [
        {
          title: "All Speakers",
          url: "/admin/speakers",
        },
        {
          title: "Add Speaker",
          url: "/admin/speakers/create",
        },
      ],
    },
    {
      title: "Content",
      url: "/admin/content",
      icon: FileText,
      items: [
        {
          title: "News & Blogs",
          url: "/admin/content/blogs",
        },
        {
          title: "Create Content",
          url: "/admin/content/create",
        },
      ],
    },
    {
      title: "Workshops",
      url: "/admin/workshops",
      icon: BookOpen,
      items: [
        {
          title: "All Workshops",
          url: "/admin/workshops",
        },
        {
          title: "Create Workshop",
          url: "/admin/workshops/create",
        },
      ],
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: Users,
      items: [
        {
          title: "All Users",
          url: "/admin/users",
        },
        {
          title: "Add User",
          url: "/admin/users/create",
        },
      ],
    },
    {
      title: "Media",
      url: "/admin/media",
      icon: ImageIcon,
    },
    {
      title: "Archives",
      url: "/admin/archives",
      icon: Archive,
    },
    {
      title: "Analytics",
      url: "/admin/analytics",
      icon: BarChart3,
    },
    {
      title: "Settings",
      url: "/admin/settings",
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
