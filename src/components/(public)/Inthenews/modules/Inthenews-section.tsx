"use client";
import Image from "next/image";
import Link from "next/link"; // Import Link
import { useState, useEffect } from "react";
import { ArrowUpRight } from "lucide-react"; 
import { BlogCardSkeleton } from "@/components/blog-card-skeleton"; 
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Blog } from "@/types/newAndBlogTypes";
import { getBlogs } from "@/service/newsAndBlogs";

// Shimmer effect component
const ShimmerEffect = ({ className }: { className?: string }) => (
  <div className={`relative overflow-hidden ${className}`}>
    <div className="bg-gradient-to-r from-gray-300 via-gray-100 to-gray-300 bg-[length:200%_100%] animate-shimmer rounded h-full w-full"></div>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer rounded h-full w-full"></div>
  </div>
);

// Blog Card Shimmer Component
const BlogCardShimmer = () => (
  <div className="bg-white rounded-xl overflow-hidden shadow-md">
    <div className="p-3 sm:p-4">
      {/* Image Placeholder with Shimmer */}
      <div className="relative w-full h-48 sm:h-56 lg:h-64 mb-3 sm:mb-4 overflow-hidden rounded-lg">
        <ShimmerEffect className="w-full h-full" />
      </div>
      {/* Title with Shimmer */}
      <div className="space-y-3 mb-4">
        <ShimmerEffect className="h-6 sm:h-7 w-4/5" />
        <ShimmerEffect className="h-6 sm:h-7 w-3/5" />
      </div>
      {/* Date and Read More with Shimmer */}
      <div className="flex justify-between items-center mt-4 sm:mt-6">
        <ShimmerEffect className="h-4 sm:h-5 w-1/3" />
        <ShimmerEffect className="h-4 sm:h-5 w-1/4" />
      </div>
    </div>
  </div>
);

// Header Shimmer Component
const HeaderShimmer = () => (
  <div className="text-center my-8 sm:my-12 lg:my-16 relative z-10">
    <ShimmerEffect className="h-12 sm:h-16 lg:h-20 w-32 sm:w-48 lg:w-56 mx-auto rounded-xl" />
  </div>
);

// Search Bar Shimmer Component
const SearchBarShimmer = () => (
  <div className="max-w-lg mx-auto mb-8 sm:mb-12 lg:mb-16 relative z-10 flex flex-col items-center px-4">
    <ShimmerEffect className="w-full h-12 sm:h-14 lg:h-16 rounded-xl mb-4 sm:mb-6" />
    <div className="mt-4 sm:mt-6 flex items-center">
      <ShimmerEffect className="h-10 sm:h-12 lg:h-14 w-24 sm:w-32 lg:w-36 rounded-full" />
    </div>
  </div>
);

// Section Title Shimmer Component
const SectionTitleShimmer = () => (
  <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8 relative z-10 text-center">
    <ShimmerEffect className="h-6 sm:h-8 lg:h-10 w-40 sm:w-56 lg:w-64 mx-auto rounded-xl" />
  </div>
);

export default function Inthenews() {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState<Blog[]>([]);
  const blogsPerPage = 12;

  useEffect(() => {
    setMounted(true);
    const fetchBlogs = async () => {
      try {
        const response = await getBlogs();
        if (!response.data) {
          throw new Error("Failed to fetch blogs");
        }
        const data =  response.data.filter(item => item.contentType === 'link');
        setPosts(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBlogs();

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Show shimmer for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  const totalPages = Math.ceil(posts.length / blogsPerPage);
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = posts.slice(indexOfFirstBlog, indexOfLastBlog);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FFFAEE] p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Decorative Sun Icons */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 lg:top-8 lg:left-8 z-0">
        <Image
          src="/blogs/sun.gif"
          alt="Sun"
          width={30}
          height={30}
          className="sm:w-10 sm:h-10 lg:w-12 lg:h-12"
        />
      </div>
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-8 z-0">
        <Image
          src="/blogs/sun.gif"
          alt="Sun"
          width={30}
          height={30}
          className="sm:w-10 sm:h-10 lg:w-12 lg:h-12"
        />
      </div>
      <div className="hidden md:block absolute top-1/2 left-4 lg:left-8 transform -translate-y-1/2 z-0">
        <Image
          src="/blogs/sun.gif"
          alt="Sun"
          width={40}
          height={40}
          className="lg:w-12 lg:h-12"
        />
      </div>
      <div className="hidden md:block absolute top-1/2 right-4 lg:right-8 transform -translate-y-1/2 z-0">
        <Image
          src="/blogs/sun.gif"
          alt="Sun"
          width={40}
          height={40}
          className="lg:w-12 lg:h-12"
        />
      </div>

      {/* Header */}
      {isLoading ? (
        <HeaderShimmer />
      ) : (
        <div className="text-center my-8 sm:my-12 lg:my-16 relative z-10">
          <h1 className="text-blue-900 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-serif">
            IN THE NEWS
          </h1>
        </div>
      )}

      {/* Section Title */}
      {isLoading ? (
        <SectionTitleShimmer />
      ) : (
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8 relative z-10 text-center">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
            Recent News
          </h2>
        </div>
      )}

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <>
            {[...Array(4)].map((_, idx) => (
              <BlogCardShimmer key={idx} />
            ))}
          </>
        ) : (
          <>
            {currentBlogs.map((blog: Blog, idx: number) => (
              <div
                key={idx}
                className="bg-white rounded-xl overflow-hidden shadow-md transition-shadow duration-300 hover:shadow-xl"
              >
                <div className="p-3 sm:p-4">
                  <div className="relative w-full h-48 sm:h-56 lg:h-64 mb-3 sm:mb-4 overflow-hidden rounded-lg">
                    <Image
                      src={blog.image_url || ""}
                      alt={blog.title}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mt-3 sm:mt-4 mb-2 min-h-[3rem] sm:min-h-[4rem] lg:min-h-[5rem] line-clamp-2">
                    {blog.title}
                  </h3>
                  <div className="flex justify-between items-center mt-4 sm:mt-6">
                    <p className="text-gray-500 text-xs sm:text-sm">
                      {blog.publishedDate
                        ? new Date(blog.publishedDate).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            }
                          )
                        : ""}
                    </p>
                    <Link
                      href={blog.link || ""}
                      className="text-[#D96D34] font-semibold hover:underline text-sm sm:text-base"
                      target="_blank"
                      rel="noopener noreferrer"
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
      {!isLoading && (
        <div className="mt-8 sm:mt-12 lg:mt-16 px-4">
          <Pagination>
            <PaginationContent className="flex flex-wrap justify-center gap-1 sm:gap-2">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage > 1 ? currentPage - 1 : 1);
                  }}
                  className="text-sm sm:text-base"
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === i + 1}
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(i + 1);
                    }}
                    className="text-sm sm:text-base min-w-[2rem] sm:min-w-[2.5rem]"
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(
                      currentPage < totalPages ? currentPage + 1 : totalPages
                    );
                  }}
                  className="text-sm sm:text-base"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* More Decorative Sun Icons */}
      <div className="relative mt-8 sm:mt-12 lg:mt-16">
        <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 lg:bottom-8 lg:left-8 z-0">
          <Image
            src="/blogs/sun.gif"
            alt="Sun"
            width={30}
            height={30}
            className="sm:w-10 sm:h-10 lg:w-12 lg:h-12"
          />
        </div>
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8 z-0">
          <Image
            src="/blogs/sun.gif"
            alt="Sun"
            width={30}
            height={30}
            className="sm:w-10 sm:h-10 lg:w-12 lg:h-12"
          />
        </div>
        <div className="flex justify-center pt-6 sm:pt-8 lg:pt-10 relative z-10">
          <Image
            src="/blogs/sun.gif"
            alt="Sun"
            width={30}
            height={30}
            className="sm:w-10 sm:h-10 lg:w-12 lg:h-12"
          />
        </div>
      </div>
    </div>
  );
}
