"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2, Youtube, Video, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getVideoById, deleteVideoBlog } from "@/service/videosService"
import type { VideoBlog } from "@/types/videos-types"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
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

export default function VideoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [video, setVideo] = useState<VideoBlog | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchVideo = async () => {
      const resolvedParams = await params
      const response = await getVideoById(resolvedParams.id)
      if (response.success && response.data) {
        setVideo(response.data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch video details",
        })
        router.push("/admin/dashboard/videos")
      }
      setLoading(false)
    }

    fetchVideo()
  }, [params, router, toast])

  const handleDelete = async () => {
    if (!video || !confirm("Are you sure you want to delete this video?")) return

    const response = await deleteVideoBlog(video._id)
    if (response.success) {
      toast({
        title: "Success",
        description: "Video deleted successfully",
      })
      router.push("/admin/dashboard/videos")
    } else {
      toast({
        title: "Error",
        description: response.error || "Failed to delete video",
      })
    }
  }

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1]
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null
  }

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="text-lg">Loading video details...</div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  if (!video) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <p className="text-gray-600 mb-4">Video not found</p>
              <Button asChild className="mt-4">
                <Link href="/admin/dashboard/videos">Back to Videos</Link>
              </Button>
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
        <header className="flex h-16 items-center gap-2 px-4 border-b bg-white">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/admin/dashboard">Admin Panel</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/dashboard/videos">Video Management</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Video Details</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          <div className="max-w-5xl mx-auto w-full">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Video Section */}
              <div className="flex-1">
                <Card className="mb-6">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      {video.videoType === "youtube" ? (
                        <Youtube className="h-5 w-5 text-red-500" />
                      ) : (
                        <Video className="h-5 w-5 text-blue-500" />
                      )}
                      <Badge variant={video.videoType === "youtube" ? "destructive" : "default"}>
                        {video.videoType}
                      </Badge>
                    </div>
                    <CardTitle className="mt-2 text-2xl">{video.title}</CardTitle>
                    <CardDescription>
                      Added on{" "}
                      {new Date(video.addedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    {video.videoType === "youtube" && video.youtubeUrl && (
                      <div className="aspect-video">
                        {getYouTubeEmbedUrl(video.youtubeUrl) ? (
                          <iframe
                            src={getYouTubeEmbedUrl(video.youtubeUrl)!}
                            title={video.title}
                            className="w-full h-full rounded-b-lg"
                            allowFullScreen
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 rounded-b-lg flex items-center justify-center">
                            <Youtube className="h-12 w-12 text-red-500 mx-auto mb-4" />
                            <p className="text-gray-600">Invalid YouTube URL</p>
                          </div>
                        )}
                      </div>
                    )}
                    {video.videoType === "video" && video.video_url && (
                      <div className="aspect-video">
                        <video src={video.video_url} poster={video.imageUrl} controls className="w-full h-full rounded-b-lg">
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    )}
                    {video.videoType === "video" && !video.video_url && video.imageUrl && (
                      <div className="aspect-video relative">
                        <Image
                          src={video.imageUrl || "/placeholder.svg"}
                          alt={video.title}
                          fill
                          className="object-cover rounded-b-lg"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              {/* Info Panel */}
              <div className="w-full md:w-80">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Video Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      Added on{" "}
                      {new Date(video.addedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Type</h3>
                      <Badge variant={video.videoType === "youtube" ? "destructive" : "default"}>
                        {video.videoType === "youtube" ? "YouTube Video" : "Uploaded Video"}
                      </Badge>
                    </div>
                    {video.videoType === "youtube" && video.youtubeUrl && (
                      <div>
                        <h3 className="font-semibold mb-2">YouTube URL</h3>
                        <a
                          href={video.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline text-sm break-all"
                        >
                          {video.youtubeUrl}
                        </a>
                      </div>
                    )}
                    {video.videoType === "video" && video.video_url && (
                      <div>
                        <h3 className="font-semibold mb-2">Video URL</h3>
                        <a
                          href={video.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline text-sm break-all"
                        >
                          View Original
                        </a>
                      </div>
                    )}
                    {video.imageUrl && (
                      <div>
                        <h3 className="font-semibold mb-2">Thumbnail</h3>
                        <a
                          href={video.imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline text-sm break-all"
                        >
                          View Thumbnail
                        </a>
                      </div>
                    )}
                    <div className="flex gap-2 pt-4">
                      <Button variant="outline" asChild>
                        <Link href={`/admin/dashboard/videos/edit/${video._id}`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </Button>
                      <Button variant="destructive" onClick={handleDelete}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                    <Button variant="secondary" asChild className="w-full mt-2">
                      <Link href="/admin/dashboard/videos">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Videos
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
