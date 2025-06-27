"use client"

import type React from "react"

import { useState } from "react"
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
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Upload, Youtube, Loader2 } from "lucide-react"
import Link from "next/link"
import { addVideoBlog } from "@/service/videosService"
import { useToast } from "@/hooks/use-toast"

export default function AddVideoPage() {
  const [loading, setLoading] = useState(false)
  const [videoType, setVideoType] = useState<"youtube" | "video">("youtube")
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [youtubeData, setYoutubeData] = useState<any>(null)
  const [fetchingYoutube, setFetchingYoutube] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Function to extract YouTube video ID
  const getYouTubeVideoId = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1]
    return videoId
  }

  // Function to fetch YouTube video data
  const fetchYouTubeData = async (url: string) => {
    const videoId = getYouTubeVideoId(url)
    if (!videoId) {
      setYoutubeData(null)
      return
    }

    setFetchingYoutube(true)
    try {
      // You can use YouTube Data API here, but for now we'll create a basic structure
      // In a real implementation, you'd call YouTube API to get video details
      const videoData = {
        id: videoId,
        title: `YouTube Video (${videoId})`,
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
        watchUrl: url
      }
      setYoutubeData(videoData)
    } catch (error) {
      console.error("Error fetching YouTube data:", error)
      setYoutubeData(null)
    } finally {
      setFetchingYoutube(false)
    }
  }

  // Handle YouTube URL change
  const handleYoutubeUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setYoutubeUrl(url)
    
    // Fetch YouTube data when URL is valid
    if (url.trim() && getYouTubeVideoId(url)) {
      fetchYouTubeData(url)
    } else {
      setYoutubeData(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const title = formData.get("title") as string

    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title",
      })
      setLoading(false)
      return
    }

    try {
      const data: any = {
        title,
        videoType,
      }

      if (videoType === "youtube") {
        const youtubeUrl = formData.get("youtubeUrl") as string
        if (!youtubeUrl.trim()) {
          toast({
            title: "Error",
            description: "Please enter a YouTube URL",
          })
          setLoading(false)
          return
        }
        data.youtubeUrl = youtubeUrl
      } else {
        const video = formData.get("video") as File
        const thumbnail = formData.get("thumbnail") as File

        if (!video || video.size === 0) {
          toast({
            title: "Error",
            description: "Please select a video file",
          })
          setLoading(false)
          return
        }

        data.video = video
        if (thumbnail && thumbnail.size > 0) {
          data.thumbnail = thumbnail
        }
      }

      const response = await addVideoBlog(data)

      if (response.success) {
        toast({
          title: "Success",
          description: "Video added successfully",
        })
        router.push("/admin/dashboard/videos")
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to add video",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
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
                  <BreadcrumbLink href="/admin/dashboard/videos">Video Management</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Add Video</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/dashboard/videos">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Add New Video</h1>
              <p className="text-gray-600 mt-1">Upload a video file or add a YouTube link</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Video Details</CardTitle>
              <CardDescription>Choose between uploading a video file or adding a YouTube video</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input id="title" name="title" placeholder="Enter video title" required />
                </div>

                <Tabs value={videoType} onValueChange={(value) => setVideoType(value as "youtube" | "video")}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="youtube" className="flex items-center gap-2">
                      <Youtube className="h-4 w-4" />
                      YouTube
                    </TabsTrigger>
                    <TabsTrigger value="video" className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Upload File
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="youtube" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="youtubeUrl">YouTube URL *</Label>
                      <Input
                        id="youtubeUrl"
                        name="youtubeUrl"
                        type="url"
                        placeholder="https://www.youtube.com/watch?v=..."
                        required={videoType === "youtube"}
                        value={youtubeUrl}
                        onChange={handleYoutubeUrlChange}
                      />
                      <p className="text-sm text-gray-600">Enter the full YouTube URL including https://</p>
                      
                      {/* YouTube Video Preview */}
                      {fetchingYoutube && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            <p className="text-sm text-blue-700">Fetching video details...</p>
                          </div>
                        </div>
                      )}
                      
                      {youtubeData && !fetchingYoutube && (
                        <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm font-medium text-gray-700 mb-3">Video Preview:</p>
                          <div className="space-y-3">
                            {/* Thumbnail */}
                            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                              <img 
                                src={youtubeData.thumbnail} 
                                alt="YouTube thumbnail"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = `https://img.youtube.com/vi/${youtubeData.id}/hqdefault.jpg`
                                }}
                              />
                            </div>
                            
                            {/* Video Info */}
                            <div className="space-y-2">
                              <p className="text-sm font-medium">{youtubeData.title}</p>
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <span>Video ID: {youtubeData.id}</span>
                                <span>•</span>
                                <a 
                                  href={youtubeData.watchUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  Open in YouTube
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="video" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="video">Video File *</Label>
                      <Input id="video" name="video" type="file" accept="video/*" required={videoType === "video"} />
                      <p className="text-sm text-gray-600">Supported formats: MP4, AVI, MOV, etc.</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="thumbnail">Thumbnail (Optional)</Label>
                      <Input id="thumbnail" name="thumbnail" type="file" accept="image/*" />
                      <p className="text-sm text-gray-600">Upload a custom thumbnail image</p>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Adding Video...
                      </>
                    ) : (
                      "Add Video"
                    )}
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link href="/admin/dashboard/videos">Cancel</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
