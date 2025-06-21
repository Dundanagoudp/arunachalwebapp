"use client"
import Image from "next/image"
import Link from "next/link" // Import Link
import { useState, useEffect } from "react"
import { ArrowUpRight } from "lucide-react" // Change to ArrowRight
import { BlogCardSkeleton } from "@/components/blog-card-skeleton" // Import the new skeleton component
import SunIcon from "@/components/archive/sun-icon"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export default function BlogLayout() {
  const [mounted, setMounted] = useState(false)
  const isLoading = false // For demonstration, set to false. In a real app, this would come from data fetching.
  const [currentPage, setCurrentPage] = useState(1)
  const blogsPerPage = 9

  useEffect(() => {
    setMounted(true)
  }, [])

  // Blog data array
  const blogs = [
    {
      image: "/blogs/blog1.png",
      alt: "Arunachal Literature Festival 2022",
      title: "The Rise of Indigenous Literature in Arunachal Pradesh",
      date: "30 October 2023",
      link: "#",
    },
    {
      image: "/blogs/blog2.png",
      alt: "Literary Icons",
      title: "Meet the Literary Icons Gracing This Year's Festival",
      date: "30 October 2023",
      link: "#",
    },
    {
      image: "/blogs/blog3.png",
      alt: "Arunachal Literature Festival 2019",
      title: "5 Must-Attend Sessions at This Year's Festival",
      date: "30 October 2023",
      link: "#",
    },
    {
      image: "/blogs/blog1.png",
      alt: "Arunachal Literature Festival 2022",
      title: "The Rise of Indigenous Literature in Arunachal Pradesh",
      date: "30 October 2023",
      link: "#",
    },
    {
      image: "/blogs/blog2.png",
      alt: "Literary Icons",
      title: "Meet the Literary Icons Gracing This Year's Festival",
      date: "30 October 2023",
      link: "#",
    },
    {
      image: "/blogs/blog3.png",
      alt: "Arunachal Literature Festival 2019",
      title: "5 Must-Attend Sessions at This Year's Festival",
      date: "30 October 2023",
      link: "#",
    },
    {
      image: "/blogs/blog1.png",
      alt: "Arunachal Literature Festival 2022",
      title: "The Rise of Indigenous Literature in Arunachal Pradesh",
      date: "30 October 2023",
      link: "#",
    },
    {
      image: "/blogs/blog2.png",
      alt: "Literary Icons",
      title: "Meet the Literary Icons Gracing This Year's Festival",
      date: "30 October 2023",
      link: "#",
    },
    {
      image: "/blogs/blog3.png",
      alt: "Arunachal Literature Festival 2019",
      title: "5 Must-Attend Sessions at This Year's Festival",
      date: "30 October 2023",
      link: "#",
    },
    {
      image: "/blogs/blog2.png",
      alt: "Literary Icons",
      title: "Meet the Literary Icons Gracing This Year's Festival",
      date: "30 October 2023",
      link: "#",
    },
  ]

  const totalPages = Math.ceil(blogs.length / blogsPerPage)
  const indexOfLastBlog = currentPage * blogsPerPage
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#FFFAEE] p-8 relative overflow-hidden">
      {/* Decorative Sun Icons */}
      <div className="absolute top-10 left-10 z-0">
        <SunIcon size={50} src="/blogs/sun.gif" />
      </div>
      <div className="absolute top-10 right-10 z-0">
        <SunIcon size={50} src="/blogs/sun.gif" />
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 left-65 -ml-0 -0 z-0 lg:-ml-4">
        <SunIcon size={50} src="/blogs/sun.gif" />
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-45 right-0 -mr-4 z-0">
        <SunIcon size={50} src="/blogs/sun.gif" />
      </div>

      {/* Header */}
      <div className="text-center my-16 relative z-10">
        <h1 className="text-blue-900 text-6xl font-bold font-serif">BLOGS</h1>
      </div>

      {/* Search Bar */}
      <div className="max-w-lg mx-auto mb-16 relative z-10 flex flex-col items-center">
        <Input
          type="text"
          placeholder="Search by Blog Name"
          className="w-full pl-4 pr-4 py-7 border-2 border-gray-300 rounded-xl focus:ring-orange-500 focus:border-orange-500 text-lg bg-transparent"
        />
        <div className="mt-6 flex items-center">
          <button className="group relative flex items-center hover:scale-105 transition-transform duration-300 focus:outline-none">
            <span className="bg-[#D96D34] text-white px-6 py-3 pr-12 rounded-full text-lg font-medium">
              Search
            </span>
            <span className="absolute right-0 left-30 translate-x-1/2 bg-[#D96D34] w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:translate-x-6 group-hover:rotate-12">
              <ArrowUpRight className="w-4 h-4 text-white transition-transform duration-300 group-hover:rotate-45" />
            </span>
          </button>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mb-8 relative z-10 text-center">
        <h2 className="text-3xl font-bold text-gray-800">Recent Blogs</h2>
      </div>

      {/* Blog Cards or Skeletons */}
      <div
        className="grid grid-cols-1 gap-8 max-w-[1200px] mx-auto px-4 sm:grid-cols-2 lg:grid-cols-3 sm:px-6 lg:px-8 relative z-10"
      >
        {isLoading ? (
          <>
            <BlogCardSkeleton />
            <BlogCardSkeleton />
            <BlogCardSkeleton />
            <BlogCardSkeleton />
            <BlogCardSkeleton />
            <BlogCardSkeleton />
          </>
        ) : (
          <>
            {currentBlogs.map((blog, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl overflow-hidden shadow-md transition-shadow duration-300 hover:shadow-xl"
              >
                {" "}
                {/* Changed from 500px to 600px */}
                <div className="p-4">
                  <div className="relative w-full h-64 mb-4 overflow-hidden rounded-lg">
                    <Image
                      src={blog.image}
                      alt={blog.alt}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-xl font-bold mt-4 mb-2 h-16">
                    {blog.title}
                  </h3>
                  <div className="flex justify-between items-center mt-6">
                    <p className="text-gray-500 text-sm">{blog.date}</p>
                    <Link
                      href={blog.link}
                      className="text-[#D96D34] font-semibold hover:underline"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-16">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  handlePageChange(currentPage > 1 ? currentPage - 1 : 1)
                }}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === i + 1}
                  onClick={(e) => {
                    e.preventDefault()
                    handlePageChange(i + 1)
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  handlePageChange(
                    currentPage < totalPages ? currentPage + 1 : totalPages
                  )
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* More Decorative Sun Icons */}
      <div className="relative mt-16">
        <div className="absolute bottom-10 left-10 z-0">
          <SunIcon size={50} src="/blogs/sun.gif" />
        </div>
        <div className="absolute bottom-10 right-10 z-0">
          <SunIcon size={50} src="/blogs/sun.gif" />
        </div>
        <div className="flex justify-center pt-10 relative z-10">
          <SunIcon size={40} src="/blogs/sun.gif" />
        </div>
      </div>
    </div>
  )
}
