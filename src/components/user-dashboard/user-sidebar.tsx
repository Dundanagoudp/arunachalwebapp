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

// user-specific data
const userData = {
  user: {
    name: "user User",
    email: "user@arunachalliterature.com",
    avatar: "/avatars/user.jpg",
  },
  teams: [
    {
      name: "Arunachal Literature",
      logo: BookOpen,
      plan: "user",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/user/dashboard",
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
          url: "/user/blogs",
        },
        {
          title: "Courses",
          url: "/user/courses",
        },
        {
          title: "Events",
          url: "/user/events",
        },
        {
          title: "Speakers",
          url: "/user/speakers",
        },
        {
          title: "Gallery",
          url: "/user/gallery",
        },
        {
          title: "Testimonials",
          url: "/user/testimonials",
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
          url: "/user/users",
        },
        {
          title: "User Roles",
          url: "/user/users/roles",
        },
        {
          title: "User Permissions",
          url: "/user/users/permissions",
        },
        {
          title: "User Activity",
          url: "/user/users/activity",
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
          url: "/user/analytics",
        },
        {
          title: "Blog Analytics",
          url: "/user/analytics/blogs",
        },
        {
          title: "Course Analytics",
          url: "/user/analytics/courses",
        },
        {
          title: "User Analytics",
          url: "/user/analytics/users",
        },
        {
          title: "Traffic Sources",
          url: "/user/analytics/traffic",
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
          url: "/user/settings/general",
        },
        {
          title: "Appearance",
          url: "/user/settings/appearance",
        },
        {
          title: "Email",
          url: "/user/settings/email",
        },
        {
          title: "Security",
          url: "/user/settings/security",
        },
        {
          title: "Backup",
          url: "/user/settings/backup",
        },
        {
          title: "API Keys",
          url: "/user/settings/api",
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
      url: "/user/database",
      icon: Database,
    },
    {
      name: "File Storage",
      url: "/user/storage",
      icon: FileVideo,
    },
  ],
}

export function UserSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={userData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={userData.navMain} />
        <NavProjects projects={userData.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
