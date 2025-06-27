"use client"

import { useState, useEffect } from "react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { VideoSkeleton } from "./modules/video-skeleton"
import { VideoCard } from "./modules/video-card"
import { getYoutubeVideos, getRawVideos } from "@/service/videosService"
import { VideoBlog } from "@/types/videos-types"
import { Dialog } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

export default function Videosection() {
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState<'youtube' | 'uploaded'>("youtube")
  const [youtubeVideos, setYoutubeVideos] = useState<VideoBlog[]>([])
  const [uploadedVideos, setUploadedVideos] = useState<VideoBlog[]>([])
  const [selectedVideo, setSelectedVideo] = useState<VideoBlog | null>(null)
  const { toast } = useToast()
  const videosPerPage = 12
  const videos = activeTab === 'youtube' ? youtubeVideos : uploadedVideos
  const totalPages = Math.ceil(videos.length / videosPerPage)

  useEffect(() => {
    setLoading(true)
    const fetchVideos = async () => {
      try {
        if (activeTab === 'youtube') {
          const res = await getYoutubeVideos()
          if (res.success && res.data) setYoutubeVideos(res.data)
          else toast({ title: "Error", description: res.error || "Failed to fetch YouTube videos" })
        } else {
          const res = await getRawVideos()
          if (res.success && res.data) setUploadedVideos(res.data)
          else toast({ title: "Error", description: res.error || "Failed to fetch uploaded videos" })
        }
      } catch (e) {
        toast({ title: "Error", description: "Failed to fetch videos" })
      } finally {
        setLoading(false)
      }
    }
    fetchVideos()
  }, [activeTab, toast])

  const getCurrentVideos = () => {
    const startIndex = (currentPage - 1) * videosPerPage
    const endIndex = startIndex + videosPerPage
    return videos.slice(startIndex, endIndex)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }

  // Modal close handler
  const closeModal = () => setSelectedVideo(null)

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFF8ED" }}>
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Videos</h1>
          <p className="text-sm sm:text-base text-gray-600">Discover amazing content from creators around the world</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            className={`px-4 py-2 rounded-t-lg font-semibold border-b-2 transition-colors ${activeTab === 'youtube' ? 'border-orange-500 text-orange-600 bg-orange-50' : 'border-transparent text-gray-600 bg-transparent'}`}
            onClick={() => { setActiveTab('youtube'); setCurrentPage(1); }}
          >
            YouTube Videos
          </button>
          <button
            className={`px-4 py-2 rounded-t-lg font-semibold border-b-2 transition-colors ${activeTab === 'uploaded' ? 'border-orange-500 text-orange-600 bg-orange-50' : 'border-transparent text-gray-600 bg-transparent'}`}
            onClick={() => { setActiveTab('uploaded'); setCurrentPage(1); }}
          >
            Uploaded Videos
          </button>
        </div>

        {/* Video Grid - Fully Responsive */}
        <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {loading
            ? Array.from({ length: videosPerPage }).map((_, index) => <VideoSkeleton key={index} />)
            : getCurrentVideos().map((video) => (
                <div key={video._id} className="relative group">
                  <VideoCard
                    title={video.title}
                    channelName={video.videoType === 'youtube' ? 'YouTube' : 'Uploaded'}
                    views={''}
                    uploadTime={video.addedAt}
                    duration={''}
                    thumbnailUrl={video.imageUrl || "/gallery/gallery2.png"}
                    channelAvatar={video.imageUrl || "/gallery/gallery2.png"}
                    onClick={() => setSelectedVideo(video)}
                  />
                </div>
              ))}
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage > 1) {
                        handlePageChange(currentPage - 1)
                      }
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            handlePageChange(page)
                          }}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )
                  }
                  return null
                })}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage < totalPages) {
                        handlePageChange(currentPage + 1)
                      }
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
      {/* Video Modal */}
      {selectedVideo && (
        <Dialog open={!!selectedVideo} onOpenChange={closeModal}>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-4 relative">
              <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={closeModal}>&times;</button>
              {selectedVideo.videoType === 'youtube' && selectedVideo.youtubeUrl ? (
                <div className="aspect-video w-full">
                  <iframe
                    width="100%"
                    height="360"
                    src={selectedVideo.youtubeUrl.replace("watch?v=","embed/")}
                    title={selectedVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : selectedVideo.video_url ? (
                <video controls className="w-full rounded" src={selectedVideo.video_url} />
              ) : (
                <div className="text-center py-8">No video available</div>
              )}
              <div className="mt-4">
                <h2 className="text-lg font-bold mb-2">{selectedVideo.title}</h2>
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  )
}
