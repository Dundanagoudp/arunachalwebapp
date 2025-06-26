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

// Mock video data
const mockVideos = [
  {
    id: 1,
    title: "How to Build a Modern Web Application with Next.js 15",
    channelName: "Tech Academy",
    views: "125K views",
    uploadTime: "2 days ago",
    duration: "15:42",
    thumbnailUrl: "/gallery/gallery2.png",
    channelAvatar: "/gallery/gallery2.png",
  },
  {
    id: 2,
    title: "React Server Components Explained - Complete Guide",
    channelName: "Code Masters",
    views: "89K views",
    uploadTime: "1 week ago",
    duration: "22:15",
    thumbnailUrl: "/gallery/gallery2.png",
    channelAvatar: "/gallery/gallery2.png",
  },
  {
    id: 3,
    title: "TypeScript Tips and Tricks for Better Code",
    channelName: "Dev Tutorials",
    views: "67K views",
    uploadTime: "3 days ago",
    duration: "18:30",
    thumbnailUrl: "/gallery/gallery2.png",
    channelAvatar: "/gallery/gallery2.png",
  },
  {
    id: 4,
    title: "CSS Grid vs Flexbox - When to Use What",
    channelName: "Design Pro",
    views: "234K views",
    uploadTime: "5 days ago",
    duration: "12:45",
    thumbnailUrl: "/gallery/gallery2.png",
    channelAvatar: "/gallery/gallery2.png",
  },
  {
    id: 5,
    title: "Building Responsive Layouts with Tailwind CSS",
    channelName: "Frontend Focus",
    views: "156K views",
    uploadTime: "1 week ago",
    duration: "25:18",
    thumbnailUrl: "/gallery/gallery2.png",
    channelAvatar: "/gallery/gallery2.png",
  },
  {
    id: 6,
    title: "JavaScript ES2024 New Features Overview",
    channelName: "JS Weekly",
    views: "98K views",
    uploadTime: "4 days ago",
    duration: "19:22",
    thumbnailUrl: "/gallery/gallery2.png",
    channelAvatar: "/gallery/gallery2.png",
  },
  {
    id: 7,
    title: "Database Design Best Practices for Developers",
    channelName: "Backend Basics",
    views: "178K views",
    uploadTime: "6 days ago",
    duration: "28:45",
    thumbnailUrl: "/gallery/gallery2.png",
    channelAvatar: "/gallery/gallery2.png",
  },
  {
    id: 8,
    title: "API Security: Protecting Your Endpoints",
    channelName: "Security First",
    views: "145K views",
    uploadTime: "1 week ago",
    duration: "21:33",
    thumbnailUrl: "/gallery/gallery2.png",
    channelAvatar: "/gallery/gallery2.png",
  },
  {
    id: 9,
    title: "Docker for Beginners - Complete Tutorial",
    channelName: "DevOps Guide",
    views: "267K views",
    uploadTime: "2 weeks ago",
    duration: "35:12",
    thumbnailUrl: "/gallery/gallery2.png",
    channelAvatar: "/gallery/gallery2.png",
  },
  {
    id: 10,
    title: "Git Workflow Strategies for Team Development",
    channelName: "Team Dev",
    views: "123K views",
    uploadTime: "1 week ago",
    duration: "16:28",
    thumbnailUrl: "/gallery/gallery2.png",
    channelAvatar: "/gallery/gallery2.png",
  },
  {
    id: 11,
    title: "Performance Optimization in React Applications",
    channelName: "React Pro",
    views: "189K views",
    uploadTime: "3 days ago",
    duration: "24:15",
    thumbnailUrl: "/gallery/gallery2.png",
    channelAvatar: "/gallery/gallery2.png",
  },
  {
    id: 12,
    title: "Building a REST API with Node.js and Express",
    channelName: "Node Academy",
    views: "201K views",
    uploadTime: "5 days ago",
    duration: "32:45",
    thumbnailUrl: "/gallery/gallery2.png",
    channelAvatar: "/gallery/gallery2.png",
  },
]

export default function Videosection() {
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const videosPerPage = 12
  const totalPages = Math.ceil(mockVideos.length / videosPerPage)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const getCurrentVideos = () => {
    const startIndex = (currentPage - 1) * videosPerPage
    const endIndex = startIndex + videosPerPage
    return mockVideos.slice(startIndex, endIndex)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setLoading(true)
    // Simulate loading when changing pages
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFF8ED" }}>
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Videos</h1>
          <p className="text-sm sm:text-base text-gray-600">Discover amazing content from creators around the world</p>
        </div>

        {/* Video Grid - Fully Responsive */}
        <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {loading
            ? Array.from({ length: 12 }).map((_, index) => <VideoSkeleton key={index} />)
            : getCurrentVideos().map((video) => (
                <VideoCard
                  key={video.id}
                  title={video.title}
                  channelName={video.channelName}
                  views={video.views}
                  uploadTime={video.uploadTime}
                  duration={video.duration}
                  thumbnailUrl={video.thumbnailUrl}
                  channelAvatar={video.channelAvatar}
                />
              ))}
        </div>

        {/* Pagination */}
        {!loading && (
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
    </div>
  )
}
