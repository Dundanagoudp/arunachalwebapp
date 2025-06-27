"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getVideoById } from "@/service/videosService"
import { VideoBlog } from "@/types/videos-types"
import { format } from "date-fns"

export default function PublicVideoDetail() {
  const params = useParams()
  const videoId = params?.id as string
  const [video, setVideo] = useState<VideoBlog | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchVideo() {
      setLoading(true)
      const res = await getVideoById(videoId)
      if (res.success && res.data) setVideo(res.data)
      setLoading(false)
    }
    if (videoId) fetchVideo()
  }, [videoId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  if (!video) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Video not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8ED] px-4 py-12">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-6">
        <div className="mb-4">
          {video.videoType === "youtube" && video.youtubeUrl ? (
            <div className="aspect-video w-full rounded-lg overflow-hidden">
              <iframe
                width="100%"
                height="360"
                src={video.youtubeUrl.replace("watch?v=", "embed/")}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ) : video.videoType === "video" && video.video_url ? (
            <video controls className="w-full rounded-lg" src={video.video_url} />
          ) : (
            <div className="text-center py-8">No video available</div>
          )}
        </div>
        <h1 className="text-2xl font-bold mb-2 text-gray-900">{video.title}</h1>
        <p className="text-sm text-gray-600 mb-1">{format(new Date(video.addedAt), 'MMM d, yyyy')}</p>
      </div>
    </div>
  )
} 