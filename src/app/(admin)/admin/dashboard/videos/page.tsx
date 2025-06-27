"use client"

import { useState, useEffect } from "react"
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
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Play, Edit, Trash2, Youtube, Video, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getVideoBlog, getRawVideos, getYoutubeVideos, deleteVideoBlog } from "@/service/videosService"
import type { VideoBlog } from "@/types/videos-types"
import { useToast } from "@/hooks/use-toast"

// Helper to extract YouTube video ID
function getYouTubeVideoId(url: string) {
  return url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1] || "";
}

export default function VideosPage() {
  const [allVideos, setAllVideos] = useState<VideoBlog[]>([])
  const [rawVideos, setRawVideos] = useState<VideoBlog[]>([])
  const [youtubeVideos, setYoutubeVideos] = useState<VideoBlog[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

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
            <Button size="sm" variant="outline" onClick={() => handleDelete(video._id)}>
              <Trash2 className="h-3 w-3" />
            </Button>
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
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Loading videos...</p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
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
                  <BreadcrumbPage>Video Management</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

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

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Videos ({allVideos.length})</TabsTrigger>
              <TabsTrigger value="raw">Raw Videos ({rawVideos.length})</TabsTrigger>
              <TabsTrigger value="youtube">YouTube ({youtubeVideos.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allVideos.map((video) => (
                  <VideoCard key={video._id} video={video} />
                ))}
              </div>
              {allVideos.length === 0 && (
                <div className="text-center py-12">
                  <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No videos found</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="raw" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rawVideos.map((video) => (
                  <VideoCard key={video._id} video={video} />
                ))}
              </div>
              {rawVideos.length === 0 && (
                <div className="text-center py-12">
                  <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No raw videos found</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="youtube" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {youtubeVideos.map((video) => (
                  <VideoCard key={video._id} video={video} />
                ))}
              </div>
              {youtubeVideos.length === 0 && (
                <div className="text-center py-12">
                  <Youtube className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No YouTube videos found</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
