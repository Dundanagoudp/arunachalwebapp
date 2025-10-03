"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2, Youtube, Video, Calendar, ExternalLink, Share2, Download } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getVideoById, deleteVideoBlog } from "@/service/videosService"
import type { VideoBlog } from "@/types/videos-types"
import { useToast } from "@/hooks/use-toast"
import { VideoDetailSkeleton } from "@/components/video-skeleton"
import { getVideoUrl, getThumbnailUrl } from "@/utils/mediaUrl"

export default function VideoDetailPage() {
  const params = useParams() as { id?: string }
  const id = params.id ?? ""
  const router = useRouter()
  const { toast } = useToast()
  const [video, setVideo] = useState<VideoBlog | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const fetchVideo = async () => {
      setLoading(true)
      try {
        const result = await getVideoById(id)
        if (result.success && result.data) {
          setVideo(result.data)
        } else {
          toast({ title: "Error", description: "Video not found" })
          router.replace("/admin/dashboard/videos")
        }
      } catch (error) {
        toast({ title: "Error", description: "Failed to fetch video" })
        router.replace("/admin/dashboard/videos")
      } finally {
        setLoading(false)
      }
    }
    fetchVideo()
  }, [id])

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
        description: response.error || "Failed to delete video"
      })
    }
  }

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1]
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1` : null
  }

  const getYouTubeVideoId = (url: string) => {
    return url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1] || ""
  }

  const handleShare = async () => {
    if (navigator.share && video) {
      try {
        await navigator.share({
          title: video.title,
          text: `Check out this video: ${video.title}`,
          url: window.location.href,
        })
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href)
        toast({
          title: "Link copied!",
          description: "Video link copied to clipboard",
        })
      }
    } else if (video) {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied!",
        description: "Video link copied to clipboard",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 pt-6">
        <VideoDetailSkeleton />
      </div>
    )
  }

  if (!video) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <Video className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-700">Video not found</h3>
          <p className="text-muted-foreground mb-6">
            The video you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/admin/dashboard/videos">Back to Videos</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 pt-6 bg-gradient-to-br from-gray-50/50 to-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <Button
          variant="outline"
          size="sm"
          asChild
          className="w-fit bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white"
        >
          <Link href="/admin/dashboard/videos">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Videos
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            {video.videoType === "youtube" ? (
              <div className="bg-red-100 p-2 rounded-lg">
                <Youtube className="h-6 w-6 text-red-600" />
              </div>
            ) : (
              <div className="bg-blue-100 p-2 rounded-lg">
                <Video className="h-6 w-6 text-blue-600" />
              </div>
            )}
            <Badge
              variant={video.videoType === "youtube" ? "destructive" : "default"}
              className="text-sm px-3 py-1"
            >
              {video.videoType === "youtube" ? "YouTube Video" : "Uploaded Video"}
            </Badge>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3">
            {video.title}
          </h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              Added on{" "}
              {new Date(video.addedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleShare} className="bg-white/80 backdrop-blur-sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" asChild className="bg-white/80 backdrop-blur-sm">
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
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Video Player */}
        <div className="lg:col-span-3">
          <Card className="border-0 shadow-xl overflow-hidden bg-black">
            <CardContent className="p-0">
              {video.videoType === "youtube" && video.youtubeUrl && (
                <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow mb-6">
                  <div className="aspect-video w-full max-w-2xl bg-gray-100 rounded-lg overflow-hidden mb-4">
                    <img
                      src={`https://img.youtube.com/vi/${getYouTubeVideoId(video.youtubeUrl)}/hqdefault.jpg`}
                      alt={video.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  </div>
                  <h2 className="text-xl font-semibold mb-2 text-center">{video.title}</h2>
                  <Button
                    asChild
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <a href={video.youtubeUrl} target="_blank" rel="noopener noreferrer">
                      <Youtube className="h-4 w-4 mr-2" />
                      Watch on YouTube
                    </a>
                  </Button>
                </div>
              )}

              {video.videoType === "video" && video.video_url && (
                <div className="aspect-video relative">
                  <video
                    src={getVideoUrl(video.video_url)}
                    poster={getThumbnailUrl(video.imageUrl)}
                    controls
                    className="w-full h-full"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onError={(e) => {
                      console.error("Video playback error:", e);
                      toast({
                        title: "Video Error",
                        description: "There was an issue playing this video. Please try refreshing the page.",
                      });
                    }}
                    onLoadStart={() => console.log("Video loading started")}
                    onCanPlay={() => console.log("Video can play")}
                    preload="metadata"
                    crossOrigin="anonymous"
                  >
                    <source src={getVideoUrl(video.video_url)} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}

              {video.videoType === "video" && !video.video_url && video.imageUrl && (
                <div className="aspect-video relative">
                  <Image
                    src={getThumbnailUrl(video.imageUrl)}
                    alt={video.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Video className="h-16 w-16 mx-auto mb-4 opacity-80" />
                      <p className="text-lg">Video preview only</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Video Information Sidebar */}
        <div className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="bg-blue-100 p-1.5 rounded-lg">
                  <Video className="h-4 w-4 text-blue-600" />
                </div>
                Video Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">Type</span>
                  <Badge variant={video.videoType === "youtube" ? "destructive" : "default"}>
                    {video.videoType === "youtube" ? "YouTube" : "Upload"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">Added</span>
                  <span className="text-sm text-gray-800">{new Date(video.addedAt).toLocaleDateString()}</span>
                </div>

                {video.videoType === "youtube" && video.youtubeUrl && (
                  <div className="p-3 bg-red-50 rounded-lg">
                    <h4 className="text-sm font-medium text-red-800 mb-2">YouTube Link</h4>
                    <Button variant="outline" size="sm" asChild className="w-full justify-start bg-white/80">
                      <a href={video.youtubeUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open in YouTube
                      </a>
                    </Button>
                  </div>
                )}

                {video.videoType === "video" && video.video_url && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">Video File</h4>
                    <Button variant="outline" size="sm" asChild className="w-full justify-start bg-white/80">
                      <a href={getVideoUrl(video.video_url)} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" />
                        Download Original
                      </a>
                    </Button>
                  </div>
                )}

                {video.imageUrl && (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="text-sm font-medium text-green-800 mb-3">Thumbnail</h4>
                    <div className="space-y-3">
                      <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100 border">
                        <Image
                          src={getThumbnailUrl(video.imageUrl)}
                          alt={`${video.title} thumbnail`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 64px, 96px"
                        />
                      </div>
                      <Button variant="outline" size="sm" asChild className="w-full justify-start bg-white/80">
                        <a href={getThumbnailUrl(video.imageUrl)} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Full Size
                        </a>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="bg-purple-100 p-1.5 rounded-lg">
                  <Edit className="h-4 w-4 text-purple-600" />
                </div>
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" asChild className="w-full justify-start bg-white/80 hover:bg-blue-50">
                <Link href={`/admin/dashboard/videos/edit/${video._id}`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Video Details
                </Link>
              </Button>
              <Button
                variant="outline"
                onClick={handleShare}
                className="w-full justify-start bg-white/80 hover:bg-green-50"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Video
              </Button>
              <Button
                variant="outline"
                onClick={handleDelete}
                className="w-full justify-start text-red-600 hover:text-red-700 bg-white/80 hover:bg-red-50 border-red-200"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Video
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
