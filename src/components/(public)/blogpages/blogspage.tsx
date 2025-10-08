"use client";
import Image from "next/image";
import Link from "next/link"; // Import Link
import { useState, useEffect } from "react";
import { ArrowUpRight } from "lucide-react"; // Change to ArrowRight
import { BlogCardSkeleton } from "@/components/blog-card-skeleton"; // Import the new skeleton component
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
import SunIcon from "@/components/sunicon-gif";
import { Blog } from "@/types/newAndBlogTypes";
import { getBlogs } from "@/service/newsAndBlogs";
import { getMediaUrl } from "@/utils/mediaUrl"
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
  <div className="max-w-2xl mx-auto mb-8 sm:mb-12 lg:mb-16 relative z-10 flex flex-col items-center px-4">
    <div className="w-full flex flex-col sm:flex-row gap-4 items-center">
      <ShimmerEffect className="flex-1 w-full h-12 sm:h-14 lg:h-16 rounded-xl" />
    </div>
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

export default function BlogsLayout() {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Changed to true for demonstration
  const [currentPage, setCurrentPage] = useState(1);
  const [content, setContent] = useState<Blog[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [pendingSearchTerm, setPendingSearchTerm] = useState<string>("");
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const blogsPerPage = 9;

  useEffect(() => {
    setMounted(true);
    const fetchBlogs = async () => {
      try {
        const response = await getBlogs();

        if (!response.data) {
          throw new Error("Failed to fetch blogs");
        }
        
        // Filter to only show blog type content and remove duplicates
        const allBlogs = response.data;
        const uniqueBlogs = allBlogs.filter(
          (item, index, self) => 
            item.contentType === "blog" && 
            self.findIndex(blog => blog._id === item._id) === index
        );
        
        setContent(uniqueBlogs);
        setFilteredBlogs(uniqueBlogs);
        
        // Extract unique years from blogs
        const years = uniqueBlogs
          .map(blog => {
            const date = new Date(blog.publishedDate || 0);
            return date.getFullYear();
          })
          .filter(year => year > 1900) // Filter out invalid dates
          .filter((year, index, self) => self.indexOf(year) === index) // Remove duplicates
          .sort((a, b) => b - a); // Sort in descending order (newest first)
        
        setAvailableYears(years);
      } catch (error) {
        // Error handled silently
      }
    };

    fetchBlogs();
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Show shimmer for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let results = content.filter((blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply year filter
    if (selectedYear !== "all") {
      const year = parseInt(selectedYear);
      results = results.filter(blog => {
        const blogYear = new Date(blog.publishedDate || 0).getFullYear();
        return blogYear === year;
      });
    }

    // Sort by published date (newest first) by default
    results = results.sort((a, b) => {
      const dateA = new Date(a.publishedDate || 0);
      const dateB = new Date(b.publishedDate || 0);
      return dateB.getTime() - dateA.getTime();
    });

    setFilteredBlogs(results);
  }, [searchTerm, content, selectedYear]);

  // Auto-show all blogs when input is cleared
  useEffect(() => {
    if (pendingSearchTerm === "") {
      setSearchTerm("");
      setCurrentPage(1);
    }
  }, [pendingSearchTerm]);

  const truncateText = (text: string, wordLimit: number) => {
    const words = text.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return text;
  };

  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleYearChange = (value: string) => {
    setSelectedYear(value);
    setCurrentPage(1); // Reset to first page when year filter changes
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FFFAEE] p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Decorative Sun Icons - Responsive positioning */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 lg:top-10 lg:left-10 z-0">
        <SunIcon
          size={30}
          className="sm:w-10 sm:h-10 lg:w-12 lg:h-12"
          src="/sungif.gif"
        />
      </div>
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-10 lg:right-10 z-0">
        <SunIcon
          size={30}
          className="sm:w-10 sm:h-10 lg:w-12 lg:h-12"
          src="/sungif.gif"
        />
      </div>
      <div className="hidden md:block absolute top-1/2 -translate-y-1/2 left-4 lg:left-10 z-0">
        <SunIcon size={40} className="lg:w-12 lg:h-12" src="/sungif.gif" />
      </div>
      <div className="hidden md:block absolute top-1/2 -translate-y-1/2 right-4 lg:right-10 z-0">
        <SunIcon size={40} className="lg:w-12 lg:h-12" src="/sungif.gif" />
      </div>
      {/* Header */}
      {isLoading ? (
        <HeaderShimmer />
      ) : (
        <div className="text-center my-8 sm:my-12 lg:my-16 relative z-10">
          <h1 className="text-blue-900 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-dm-serif">
            BLOGS
          </h1>
        </div>
      )}

      {/* Search Bar */}
      {isLoading ? (
        <SearchBarShimmer />
      ) : (
        <div className="max-w-2xl mx-auto mb-8 sm:mb-12 lg:mb-16 relative z-10 flex flex-col items-center px-4">
          <div className="w-full flex flex-col sm:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="flex-1 w-full">
              <Input
                type="text"
                placeholder="Search by Blog Name"
                value={pendingSearchTerm}
                onChange={(e) => setPendingSearchTerm(e.target.value)}
                className="w-full pl-4 pr-4 py-4 sm:py-6 lg:py-7 border-2 border-gray-300 rounded-xl focus:ring-orange-500 focus:border-orange-500 text-base sm:text-lg bg-transparent"
              />
            </div>
          </div>
          
          <div className="mt-4 sm:mt-6 flex items-center">
            <button
              className="group relative flex items-center hover:scale-105 transition-transform duration-300 focus:outline-none"
              onClick={() => {
                setSearchTerm(pendingSearchTerm);
                setCurrentPage(1);
              }}
            >
              <span className="bg-[#D96D34] text-white px-8 py-2 rounded-full text-lg font-medium text-center font-bilo">
                Search
              </span>
                      <span className="absolute right-0 left-25 translate-x-1/2 bg-[#D96D34] w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:translate-x-6 group-hover:rotate-12">
                        <ArrowUpRight className="w-4 h-4 text-white transition-transform duration-300 group-hover:rotate-45" />
                      </span>
            </button>
          </div>
        </div>
      )}

      {/* Year Filter Tabs */}
      {isLoading ? (
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8 relative z-10">
          <div className="flex justify-center">
            <ShimmerEffect className="h-12 w-96 rounded-xl" />
          </div>
        </div>
      ) : (
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8 relative z-10">
          <div className="flex justify-center">
            {/* Year Filter Tabs */}
            <div className="rounded-lg px-4 sm:px-6 py-4 flex items-center space-x-4 sm:space-x-6 overflow-x-auto scrollbar-hide" style={{ backgroundColor: '#FFF8ED', minWidth: '280px', maxWidth: '100%' }}>
              {/* All Years Tab */}
              <button
                onClick={() => handleYearChange("all")}
                className="relative group transition-all duration-200 whitespace-nowrap flex-shrink-0 px-2 md:px-3"
              >
                <span className={`text-lg font-medium transition-colors duration-200 ${
                  selectedYear === "all"
                    ? "text-white"
                    : "text-gray-600 group-hover:text-gray-800"
                }`} style={selectedYear === "all" ? { color: 'var(--tab-color)' } : {}}>
                  All Years
                </span>
                {selectedYear === "all" && (
                  <div className="absolute -bottom-4 left-0 right-0 h-1 rounded-full" style={{ backgroundColor: 'var(--tab-color)' }}></div>
                )}
                {selectedYear !== "all" && (
                  <div className="absolute -bottom-4 left-0 right-0 h-px bg-gray-400"></div>
                )}
              </button>
              
              {/* Year Tabs */}
              {availableYears.map((year) => (
                <button
                  key={year}
                  onClick={() => handleYearChange(year.toString())}
                  className="relative group transition-all duration-200 whitespace-nowrap flex-shrink-0 px-2 md:px-3"
                >
                  <span className={`text-lg font-medium transition-colors duration-200 ${
                    selectedYear === year.toString()
                      ? "text-white"
                      : "text-gray-600 group-hover:text-gray-800"
                  }`} style={selectedYear === year.toString() ? { color: 'var(--tab-color)' } : {}}>
                    {year}
                  </span>
                  {selectedYear === year.toString() && (
                    <div className="absolute -bottom-4 left-0 right-0 h-1 rounded-full" style={{ backgroundColor: 'var(--tab-color)' }}></div>
                  )}
                  {selectedYear !== year.toString() && (
                    <div className="absolute -bottom-4 left-0 right-0 h-px bg-gray-400"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Section Title */}
      {isLoading ? (
        <SectionTitleShimmer />
      ) : (
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8 relative z-10 text-center">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 font-dm-serif">
            Latest Blogs
          </h2>
        </div>
      )}

      {/* Blog Cards or Shimmer Skeletons */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
        {isLoading ? (
          <>
            <BlogCardShimmer />
            <BlogCardShimmer />
            <BlogCardShimmer />
            <BlogCardShimmer />
            <BlogCardShimmer />
            <BlogCardShimmer />
            <BlogCardShimmer />
            <BlogCardShimmer />
            <BlogCardShimmer />
          </>
        ) : (
          <>
            {currentBlogs.map((blog, idx) => (
              <Link
                key={blog._id || idx}
                href={`/blogsContent/blog/${blog._id}`}
                className="bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl hover:scale-105 h-full flex flex-col cursor-pointer"
              >
                <div className="p-3 sm:p-4 flex flex-col flex-1">
                  <div className="relative w-full h-48 sm:h-56 lg:h-64 mb-3 sm:mb-4 overflow-hidden rounded-lg">
                    <Image
                      src={getMediaUrl(blog.image_url) || "/placeholder.svg"}
                      alt={blog.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        console.log("Image failed to load:", blog.image_url)
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg"
                      }}
                    />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mt-3 sm:mt-4 mb-1 line-clamp-1 font-dm-serif">
                    {blog.title.length > 40 ? blog.title.substring(0, 40) + "..." : blog.title}
                  </h3>
                  <p className="text-gray-500 text-xs sm:text-sm flex-1 line-clamp-2 mb-0 font-bilo">
                    {blog.contents && blog.contents.length > 120 ? blog.contents.substring(0, 120) + "..." : blog.contents || ""}
                  </p>

                  <div className="flex justify-between items-center mt-2 sm:mt-2">
                    <span className="px-3 py-1 bg-[#4F8049] text-white text-xs sm:text-sm font-medium rounded-full">
                      {blog.publishedDate ? new Date(blog.publishedDate).getFullYear() : new Date().getFullYear()}
                    </span>
                    <span className="text-[#D96D34] font-semibold text-sm sm:text-base font-bilo">
                      Read More
                    </span>
                  </div>
                </div>
              </Link>
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
                    className="text-sm sm:text-base min-w-[2rem] sm:min-w-[2.5rem] font-bilo"
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

      {/* More Decorative Sun Icons - Responsive */}
      <div className="relative mt-8 sm:mt-12 lg:mt-16">
        <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 lg:bottom-10 lg:left-10 z-0">
          <SunIcon
            size={30}
            className="sm:w-10 sm:h-10 lg:w-12 lg:h-12"
            src="/sungif.gif"
          />
        </div>
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-10 lg:right-10 z-0">
          <SunIcon
            size={30}
            className="sm:w-10 sm:h-10 lg:w-12 lg:h-12"
            src="/sungif.gif"
          />
        </div>
        <div className="flex justify-center pt-6 sm:pt-8 lg:pt-10 relative z-10">
          <SunIcon
            size={30}
            className="sm:w-10 sm:h-10 lg:w-12 lg:h-12"
            src="/sungif.gif"
          />
        </div>
      </div>
    </div>
  );
}
