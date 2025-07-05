"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import type { Blog } from "@/types/newAndBlogTypes"
import { getBlogOnly, getBlogs } from "@/service/newsAndBlogs"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  Eye,
  Search,
  Tag,
  User,
  Share2,
  Heart,
  MessageCircle,
} from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useRouter } from "next/navigation"

// Loading skeleton for the blog content
const BlogContentSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#FFFAEE] to-white">
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-64 w-full rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton className="h-12 w-full rounded-xl" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-16 w-16 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
)

function BlogErrorView({ error }: { error: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFAEE] to-white flex items-center justify-center p-4">
      <Card className="p-8 max-w-md w-full text-center shadow-lg">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Eye className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Button onClick={() => window.location.reload()} className="bg-[#D96D34] hover:bg-[#c05d2b]">
          Try Again
        </Button>
      </Card>
    </div>
  )
}

export default function BlogById() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [content, setContent] = useState<Blog | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const params = useParams()
  const id = Array.isArray(params.id) ? params.id[0] : params.id

  // Filter blogs based on search query and exclude current blog
  const filteredBlogs = useMemo(() => {
    const filtered = blogs.filter(blog => blog._id !== id) // Exclude current blog
    
    if (!searchQuery.trim()) return filtered

    return filtered.filter(
      (blog) =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.contents?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.author?.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [blogs, searchQuery, id])

  const handleAllBlogs = () => {
    router.push("/blogsContent")
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)
    // Simulate search delay
    setTimeout(() => setIsSearching(false), 500)
  }

  const handleBlogClick = (blogId: string) => {
    if (blogId && blogId !== id) {
      router.push(`/blogsContent/blog/${blogId}`)
    }
  }

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setIsLoading(true)
        setError(null)

        if (!id) {
          throw new Error("Blog ID is missing")
        }

        // Fetch blog content and related blogs in parallel
        const [blogResponse, blogsResponse] = await Promise.all([
          getBlogOnly(id), 
          getBlogs()
        ])

        if (!blogResponse.data) {
          throw new Error("Failed to fetch blog content")
        }

        setContent(blogResponse.data)
        
        // Filter blogs to only show blog type content and exclude current blog
        const allBlogs = blogsResponse.data ?? []
        const filteredBlogs = allBlogs.filter(
          (blog) => blog.contentType === "blog" && blog._id !== id
        )
        setBlogs(filteredBlogs)
      } catch (err) {
        console.error(err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlog()
  }, [id])

  if (isLoading) {
    return <BlogContentSkeleton />
  }

  if (error) {
    return <BlogErrorView error={error} />
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFFAEE] to-white flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full text-center shadow-lg">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-gray-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Blog Not Found</h2>
          <p className="text-gray-600 mb-6">The requested blog post could not be found.</p>
          <Button onClick={handleAllBlogs} className="bg-[#D96D34] hover:bg-[#c05d2b]">
            Browse All Blogs
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFAEE] to-white">
      {/* Header with Breadcrumb */}
      <div className="w-full px-4 md:px-8 pt-4 pb-2 bg-[#FFFAEE]">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/blogsContent">Blogs</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{content.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article className="space-y-8">
              {/* Featured Image */}
              {content.image_url && (
                <div className="relative group overflow-hidden rounded-2xl shadow-lg">
                  <Image
                    src={content.image_url || "/placeholder.svg"}
                    alt={content.title}
                    width={1080}
                    height={600}
                    className="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="inline-flex items-center gap-2 bg-[#D96D34]/90 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                      <Eye className="w-4 h-4" />
                      Featured Article
                    </span>
                  </div>
                </div>
              )}

              {/* Article Header */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-sm text-[#D96D34] font-medium">
                  <BookOpen className="w-4 h-4" />
                  <span>Blog Post</span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                  {content.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/placeholder.svg" alt={content.author || "Author"} />
                      <AvatarFallback className="bg-[#D96D34] text-white text-xs">
                        {(content.author || "A").charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{content.author || "Anonymous"}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {content.publishedDate
                        ? new Date(content.publishedDate).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Unknown date"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Article Content */}
              <Card className="p-6 lg:p-8 shadow-sm border-0 bg-white/70 backdrop-blur-sm">
                <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
                  <p className="text-lg">
                    {content.contents}
                  </p>
                </div>
              </Card>


            </article>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Search Bar */}
            <Card className="p-4 shadow-sm border-0 bg-white/70 backdrop-blur-sm">
              <form onSubmit={handleSearch} className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search blogs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-3 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D96D34] focus:border-transparent"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#D96D34] hover:bg-[#c05d2b] text-white py-3 rounded-lg transition-colors"
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Searching...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4" />
                      Search
                    </div>
                  )}
                </Button>
              </form>
            </Card>

            {/* Latest Blogs */}
            <Card className="p-6 shadow-sm border-0 bg-white/70 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-6">
                <Clock className="w-5 h-5 text-[#D96D34]" />
                <h2 className="text-xl font-bold text-gray-900">
                  {searchQuery ? `Search Results (${filteredBlogs.length})` : "Latest Posts"}
                </h2>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredBlogs.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {searchQuery ? "No blogs found matching your search." : "No other blogs available."}
                  </div>
                ) : (
                  filteredBlogs
                    .sort(
                      (a, b) =>
                        new Date(b.publishedDate?.toLocaleString() ?? "").getTime() -
                        new Date(a.publishedDate?.toLocaleString() ?? "").getTime(),
                    )
                    .slice(0, searchQuery ? 10 : 5)
                    .map((blog) => (
                      <div
                        key={blog._id}
                        onClick={() => handleBlogClick(blog._id)}
                        className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group border border-transparent hover:border-gray-200"
                      >
                        <div className="flex-shrink-0 relative overflow-hidden rounded-lg w-16 h-16">
                          <Image
                            src={blog.image_url || "/placeholder.svg"}
                            alt={blog.title}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                            <Calendar className="w-3 h-3" />
                            {blog.publishedDate
                              ? new Date(blog.publishedDate).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })
                              : "Unknown"}
                          </p>
                          <h3 className="text-sm font-medium text-gray-900 leading-tight line-clamp-2 group-hover:text-[#D96D34] transition-colors">
                            {blog.title}
                          </h3>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                            <User className="w-3 h-3" />
                            <span>{blog.author || "Anonymous"}</span>
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>

              {!searchQuery && (
                <Button
                  onClick={handleAllBlogs}
                  variant="ghost"
                  className="w-full mt-4 text-[#D96D34] hover:text-[#c05d2b] hover:bg-[#D96D34]/10 transition-colors"
                >
                  View all articles
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
