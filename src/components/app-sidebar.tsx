"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  FileText,
  Users,
  Calendar,
  BarChart3,
  Home,
  Plus,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  MessageSquare,
  Image,
  Video,
  FileVideo,
  Award,
  Globe,
  Newspaper,
  BookMarked,
  GraduationCap,
  Users2,
  Shield,
  Database,
  Activity,
  TrendingUp,
  Bell,
  Mail,
  HelpCircle,
  Info,
  ExternalLink,
  Download,
  Upload,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  MoreHorizontal,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  Heart,
  Share,
  Copy,
  Link as LinkIcon,
  Lock,
  Unlock,
  EyeOff,
  Key,
  LogOut,
  User,
  UserPlus,
  UserMinus,
  UserX,
  UserCog,
  UserSearch,
} from "lucide-react"

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
      title: "Content Management",
      url: "#",
      icon: FileText,
      items: [
        {
          title: "Blogs",
          url: "/admin/blogs",
        },
        {
          title: "Courses",
          url: "/admin/courses",
        },
        {
          title: "Events",
          url: "/admin/events",
        },
        {
          title: "Speakers",
          url: "/admin/speakers",
        },
        {
          title: "Gallery",
          url: "/admin/gallery",
        },
        {
          title: "Testimonials",
          url: "/admin/testimonials",
        },
      ],
    },
    {
      title: "User Management",
      url: "#",
      icon: Users,
      items: [
        {
          title: "All Users",
          url: "/admin/users",
        },
        {
          title: "User Roles",
          url: "/admin/users/roles",
        },
        {
          title: "User Permissions",
          url: "/admin/users/permissions",
        },
        {
          title: "User Activity",
          url: "/admin/users/activity",
        },
      ],
    },
    {
      title: "Analytics",
      url: "#",
      icon: BarChart3,
      items: [
        {
          title: "Overview",
          url: "/admin/analytics",
        },
        {
          title: "Blog Analytics",
          url: "/admin/analytics/blogs",
        },
        {
          title: "Course Analytics",
          url: "/admin/analytics/courses",
        },
        {
          title: "User Analytics",
          url: "/admin/analytics/users",
        },
        {
          title: "Traffic Sources",
          url: "/admin/analytics/traffic",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/admin/settings/general",
        },
        {
          title: "Appearance",
          url: "/admin/settings/appearance",
        },
        {
          title: "Email",
          url: "/admin/settings/email",
        },
        {
          title: "Security",
          url: "/admin/settings/security",
        },
        {
          title: "Backup",
          url: "/admin/settings/backup",
        },
        {
          title: "API Keys",
          url: "/admin/settings/api",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Website Frontend",
      url: "/",
      icon: Globe,
    },
    {
      name: "Content Database",
      url: "/admin/database",
      icon: Database,
    },
    {
      name: "File Storage",
      url: "/admin/storage",
      icon: FileVideo,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <NavUser user={adminData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
