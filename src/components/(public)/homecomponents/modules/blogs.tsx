"use client"
import Image from "next/image"
import Link from "next/link" // Import Link
import { ArrowRight, ArrowUpRight } from "lucide-react" 
import { BlogCardSkeleton } from "@/components/blog-card-skeleton" 
import SunIcon from "../../archive/sun-icon"
import { useEffect, useState } from "react"
import { getBlogs } from "@/service/newsAndBlogs"
import type { Blog } from "@/types/newAndBlogTypes"
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function Blogs() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    AOS.init({
      duration: 1200,
      easing: 'ease-in-out',
      once: true,
    })
  }, [])

  useEffect(() => {
    async function fetchBlogs() {
      setIsLoading(true)
      const res = await getBlogs()
      if (res.success && Array.isArray(res.data)) {
        // Sort by publishedDate descending, fallback to original order if not present
        const sorted = [...res.data].sort((a, b) => {
          const dateA = a.publishedDate ? new Date(a.publishedDate).getTime() : 0
          const dateB = b.publishedDate ? new Date(b.publishedDate).getTime() : 0
          return dateB - dateA
        })
        setBlogs(sorted.slice(0, 3))
      }
      setIsLoading(false)
    }
    fetchBlogs()
  }, [])

  return (
    <div className="min-h-screen bg-[#FDF6E9] p-8 relative overflow-hidden">
      {/* Decorative Sun Icons */}
      <div data-aos="fade-right" data-aos-delay="0" data-aos-duration="1000" className="absolute top-10 left-10 z-0">
        <SunIcon size={50} src="/sungif.gif" />
      </div>
      <div data-aos="fade-left" data-aos-delay="0" data-aos-duration="1000" className="absolute top-10 right-10 z-0">
        <SunIcon size={50} src="/sungif.gif" />
      </div>
      <div data-aos="fade-right" data-aos-delay="200" data-aos-duration="1000" className="absolute top-1/2 -translate-y-1/2 left-65 -ml-0 -0 z-0 lg:-ml-4">
        <SunIcon size={50} src="/sungif.gif" />
      </div>
      <div data-aos="fade-left" data-aos-delay="200" data-aos-duration="1000" className="absolute top-1/2 -translate-y-1/2 right-45 right-0 -mr-4 z-0">
        <SunIcon size={50} src="/sungif.gif" />
      </div>

      {/* Header */}
      <div className="text-center mt-16 mb-12 relative z-10">
        <h1 data-aos="fade-up" data-aos-delay="0" data-aos-duration="1000" className="text-[#4F8049] text-xl md:text-4xl font-medium font-dm-serif uppercase tracking-wide mb-2">
          ARUNACHAL LITERATURE FESTIVAL
        </h1>
        <div className="flex justify-center items-center gap-6">
          <div className="w-4 h-4 rounded-full bg-[#4F8049]"></div>
          <h2 data-aos="fade-up" data-aos-delay="100" data-aos-duration="1000" className="text-[#4F8049] text-2xl md:text-4xl lg:text-5xl font-bold font-dm-serif uppercase tracking-wide">
            BLOGS AND MEDIA
          </h2>
          <div className="w-4 h-4 rounded-full bg-[#4F8049]"></div>
        </div>
      </div>

      {/* View All Button */}
      <div data-aos="fade-up" data-aos-delay="200" data-aos-duration="1000" className="mt-0 flex justify-center mb-12 relative z-10">
        <Link href="/blogsContent" passHref>
          <button className="group relative flex items-center hover:scale-105 transition-transform duration-300 focus:outline-none">
            <span className="bg-[#4F8049] text-white px-8 py-3 rounded-full text-lg font-medium">
              View All
            </span>
            <span className="absolute right-0 left-28 translate-x-1/2 bg-[#4F8049] w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:translate-x-6 group-hover:rotate-12">
              <ArrowUpRight className="w-4 h-4 text-white transition-transform duration-300 group-hover:rotate-45" />
            </span>
          </button>
        </Link>
      </div>

      {/* Blog Cards or Skeletons */}
      <div
        className="grid gap-6 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}
      >
        {isLoading ? (
          <>
            <BlogCardSkeleton />
            <BlogCardSkeleton />
            <BlogCardSkeleton />
          </>
        ) : blogs.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">No blogs found.</div>
        ) : (
          <>
            {blogs.map((blog, idx) => (
              <div
                key={blog._id}
                data-aos="fade-up"
                data-aos-delay={300 + idx * 120}
                data-aos-duration="1000"
                className="bg-white rounded-xl overflow-hidden shadow-md lg:h-[450px] group"
              >
                <div className="p-2">
                  <div className="relative w-full h-72 mb-4 flex-shrink-0 overflow-hidden rounded-xl">
                    <Image
                      src={blog.image_url || "/blogs/blog1.png"}
                      alt={blog.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold mt-4 mb-2 font-dm-serif">{blog.title}</h3>
                  {blog.contents && (
                    <p className="text-gray-700 text-base mb-2 line-clamp-3 font-bilo">
                      {blog.contents.length > 40 ? blog.contents.slice(0, 40) + '...' : blog.contents}
                    </p>
                  )}
                  <div className="flex justify-between items-center mt-9">
                    <p className="text-gray-500">{blog.publishedDate ? new Date(blog.publishedDate).toLocaleDateString() : ""}</p>
                    {blog.contentType === 'link' && blog.link ? (
                      <a
                        href={blog.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#4F8049] font-semibold hover:underline text-sm sm:text-base"
                      >
                        Read More
                      </a>
                    ) : blog._id ? (
                      <Link
                        href={`/blogsContent/blog/${blog._id}`}
                        className="text-[#4F8049] font-semibold hover:underline text-sm sm:text-base"
                      >
                        Read More
                      </Link>
                    ) : (
                      <span className="px-4 py-2 bg-gray-300 text-gray-500 rounded-full font-medium cursor-not-allowed" title="Blog ID or link missing">Read More</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* More Decorative Sun Icons */}
      <div className="relative mt-16">
        <div className="absolute bottom-10 left-10 z-0">
          <SunIcon size={50} src="/sungif.gif" />
        </div>
        <div className="absolute bottom-10 right-10 z-0">
          <SunIcon size={50} src="/sungif.gif" />
        </div>
        <div className="flex justify-center pt-10 relative z-10">
          <SunIcon size={40} src="/sungif.gif" />
        </div>
      </div>
    </div>
  )
}
