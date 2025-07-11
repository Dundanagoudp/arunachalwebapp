"use client"

import { useState, useEffect } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Play, Edit, Trash2, Youtube, Video, Loader2, TrendingUp, Search } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getVideoBlog, getRawVideos, getYoutubeVideos, deleteVideoBlog } from "@/service/videosService"
import type { VideoBlog } from "@/types/videos-types"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import { useDeletePermission } from "@/hooks/use-delete-permission"
import { ContactAdminModal } from "@/components/ui/contact-admin-modal"

// Helper to extract YouTube video ID
function getYouTubeVideoId(url: string) {
  return url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1] || "";
}

export default function VideosPage() {
  const { isAdmin } = useDeletePermission()
  const [allVideos, setAllVideos] = useState<VideoBlog[]>([])
  const [rawVideos, setRawVideos] = useState<VideoBlog[]>([])
  const [youtubeVideos, setYoutubeVideos] = useState<VideoBlog[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [currentTab, setCurrentTab] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const videosPerPage = 6

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    setLoading(true)
    try {
      const [allResponse, rawResponse, youtubeResponse] = await Promise.all([
        getVideoBlog(),
        getRawVideos(),
        getYoutubeVideos(),
      ])

      if (allResponse.success) setAllVideos(allResponse.data || [])
      if (rawResponse.success) setRawVideos(rawResponse.data || [])
      if (youtubeResponse.success) setYoutubeVideos(youtubeResponse.data || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch videos",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (videoId: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return

    const response = await deleteVideoBlog(videoId)
    if (response.success) {
      toast({
        title: "Success",
        description: "Video deleted successfully",
      })
      fetchAllData()
    } else {
      toast({
        title: "Error",
        description: response.error || "Failed to delete video",
      })
    }
  }

  // Helper to get video counts
  const getVideoCount = (type: "all" | "raw" | "youtube") => {
    if (type === "all") return allVideos.length
    if (type === "raw") return rawVideos.length
    if (type === "youtube") return youtubeVideos.length
    return 0
  }

  // Filter videos by search query
  const filterVideos = (videos: VideoBlog[]) => {
    if (!searchQuery.trim()) return videos
    return videos.filter((video) =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  // Get videos for current tab
  const getVideosForTab = () => {
    if (currentTab === "all") return allVideos
    if (currentTab === "raw") return rawVideos
    if (currentTab === "youtube") return youtubeVideos
    return []
  }

  // Paginated videos for current tab
  const paginatedVideos = () => {
    const videos = getVideosForTab()
    const start = (currentPage - 1) * videosPerPage
    return videos.slice(start, start + videosPerPage)
  }

  // Total pages for current tab
  const totalPages = Math.ceil(getVideosForTab().length / videosPerPage)

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setCurrentTab(tab)
    setCurrentPage(1)
  }

  // Helper to render pagination bar
  const renderPagination = () => {
    if (totalPages <= 1) return null
    const pageNumbers = []
    for (let i = 1; i <= totalPages; i++) {
      // Show first, last, current, and neighbors; ellipsis for gaps
      if (
        i === 1 ||
        i === totalPages ||
        Math.abs(i - currentPage) <= 1
      ) {
        pageNumbers.push(i)
      } else if (
        (i === currentPage - 2 && currentPage > 3) ||
        (i === currentPage + 2 && currentPage < totalPages - 2)
      ) {
        pageNumbers.push('ellipsis')
      }
    }
    let lastWasEllipsis = false
    return (
      <Pagination className="mt-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={e => {
                e.preventDefault()
                if (currentPage > 1) setCurrentPage(currentPage - 1)
              }}
              aria-disabled={currentPage === 1}
              tabIndex={currentPage === 1 ? -1 : 0}
            />
          </PaginationItem>
          {pageNumbers.map((num, idx) => {
            if (num === 'ellipsis') {
              if (lastWasEllipsis) return null
              lastWasEllipsis = true
              return (
                <PaginationItem key={`ellipsis-${idx}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              )
            } else {
              lastWasEllipsis = false
              return (
                <PaginationItem key={num}>
                  <PaginationLink
                    href="#"
                    isActive={num === currentPage}
                    onClick={e => {
                      e.preventDefault()
                      setCurrentPage(num as number)
                    }}
                  >
                    {num}
                  </PaginationLink>
                </PaginationItem>
              )
            }
          })}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={e => {
                e.preventDefault()
                if (currentPage < totalPages) setCurrentPage(currentPage + 1)
              }}
              aria-disabled={currentPage === totalPages}
              tabIndex={currentPage === totalPages ? -1 : 0}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
  }

  const VideoCard = ({ video }: { video: VideoBlog }) => (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {video.videoType === "youtube" ? (
              <Youtube className="h-4 w-4 text-red-500" />
            ) : (
              <Video className="h-4 w-4 text-blue-500" />
            )}
            <Badge variant={video.videoType === "youtube" ? "destructive" : "default"}>{video.videoType}</Badge>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="sm" variant="outline" asChild>
              <Link href={`/admin/dashboard/videos/edit/${video._id}`}>
                <Edit className="h-3 w-3" />
              </Link>
            </Button>
            {isAdmin ? (
              <Button size="sm" variant="outline" onClick={() => handleDelete(video._id)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            ) : (
              <ContactAdminModal
                title="Delete Video Access Denied"
                description="You don't have permission to delete videos. Please contact the administrator for assistance."
              >
                <Button size="sm" variant="outline">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </ContactAdminModal>
            )}
          </div>
        </div>
        <CardTitle className="text-lg line-clamp-2">{video.title}</CardTitle>
        <CardDescription>Added on {new Date(video.addedAt).toLocaleDateString()}</CardDescription>
        
      </CardHeader>
      <CardContent>
        {video.videoType === "youtube" && video.youtubeUrl && (
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-3 overflow-hidden">
            <img
              src={`https://img.youtube.com/vi/${getYouTubeVideoId(video.youtubeUrl)}/hqdefault.jpg`}
              alt={video.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
              }}
            />
          </div>
        )}
        {video.videoType === "video" && video.imageUrl && (
          <div className="aspect-video relative rounded-lg overflow-hidden mb-3">
            <Image src={video.imageUrl || "/placeholder.svg"} alt={video.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <Play className="h-8 w-8 text-white" />
            </div>
          </div>
        )}
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1 bg-transparent" asChild>
            <Link href={`/admin/dashboard/videos/${video._id}`}>
              <Play className="h-3 w-3 mr-1" />
              View
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading videos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Video Blog Management</h1>
          <p className="text-gray-600 mt-1">Manage your video content</p>
        </div>
        <Button asChild>
          <Link href="/admin/dashboard/videos/add">
            <Plus className="h-4 w-4 mr-2" />
            Add Video
          </Link>
        </Button>
      </div>

      {/* Dashboard Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Total Videos</CardTitle>
            <Video className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{getVideoCount("all")}</div>
            <p className="text-xs text-blue-600">All video content</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Raw Videos</CardTitle>
            <Video className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{getVideoCount("raw")}</div>
            <p className="text-xs text-green-600">Uploaded files</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-red-50 to-red-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700">YouTube Videos</CardTitle>
            <Youtube className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">{getVideoCount("youtube")}</div>
            <p className="text-xs text-red-600">YouTube links</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Recent</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {allVideos.filter((v) => new Date(v.addedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
            </div>
            <p className="text-xs text-purple-600">Added this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <CardTitle className="text-xl">Video Library</CardTitle>
              <CardDescription>Browse and manage your video collection</CardDescription>
            </div>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/80 backdrop-blur-sm border-gray-200"
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="all" className="w-full" onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Videos ({allVideos.length})</TabsTrigger>
          <TabsTrigger value="raw">Raw Videos ({rawVideos.length})</TabsTrigger>
          <TabsTrigger value="youtube">YouTube ({youtubeVideos.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentTab === "all" && paginatedVideos().map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
          {currentTab === "all" && allVideos.length > videosPerPage && (
            <div className="flex justify-center">{renderPagination()}</div>
          )}
          {allVideos.length === 0 && (
            <div className="text-center py-12">
              <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No videos found</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="raw" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentTab === "raw" && paginatedVideos().map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
          {currentTab === "raw" && rawVideos.length > videosPerPage && (
            <div className="flex justify-center">{renderPagination()}</div>
          )}
          {rawVideos.length === 0 && (
            <div className="text-center py-12">
              <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No raw videos found</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="youtube" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentTab === "youtube" && paginatedVideos().map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
          {currentTab === "youtube" && youtubeVideos.length > videosPerPage && (
            <div className="flex justify-center">{renderPagination()}</div>
          )}
          {youtubeVideos.length === 0 && (
            <div className="text-center py-12">
              <Youtube className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No YouTube videos found</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}