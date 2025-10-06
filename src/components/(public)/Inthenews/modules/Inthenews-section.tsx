"use client";
import Image from "next/image";
import Link from "next/link"; // Import Link
import { useState, useEffect } from "react";
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
import { getMediaUrl } from "@/utils/mediaUrl";

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
  const [error, setError] = useState<string | null>(null);
  const blogsPerPage = 12;

  useEffect(() => {
    setMounted(true);
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await getBlogs();
        
        if (!response.success || !response.data) {
          throw new Error("Failed to fetch news data");
        }

        // Filter for link type content only and remove duplicates
        const linkContent = response.data.filter(
          (item, index, self) => 
            item.contentType === 'link' && 
            item.link && // Ensure link exists
            self.findIndex(news => news._id === item._id) === index // Remove duplicates
        );

        // Sort by published date (newest first)
        const sortedContent = linkContent.sort((a, b) => {
          const dateA = a.publishedDate ? new Date(a.publishedDate).getTime() : 0;
          const dateB = b.publishedDate ? new Date(b.publishedDate).getTime() : 0;
          return dateB - dateA;
        });

        setPosts(sortedContent);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to load news");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNews();

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

  // Handle link click with validation
  const handleLinkClick = (link: string, title: string) => {
    if (!link) {
      alert("No link available for this news item");
      return;
    }
    
    // Validate URL format
    try {
      new URL(link);
      window.open(link, '_blank', 'noopener,noreferrer');
    } catch (e) {
      alert("Invalid link format");
    }
  };

  if (!mounted) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FFFAEE] flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4 font-dm-serif">Error Loading News</h2>
          <p className="text-gray-600 mb-6 font-bilo">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-[#D96D34] text-white px-6 py-3 rounded-lg hover:bg-[#c05d2b] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFAEE] p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Decorative Sun Icons */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 lg:top-8 lg:left-8 z-0">
        <Image
          src="/sungif.gif"
          alt="Sun"
          width={30}
          height={30}
          className="sm:w-10 sm:h-10 lg:w-12 lg:h-12"
        />
      </div>
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-8 z-0">
        <Image
          src="/sungif.gif"
          alt="Sun"
          width={30}
          height={30}
          className="sm:w-10 sm:h-10 lg:w-12 lg:h-12"
        />
      </div>
      <div className="hidden md:block absolute top-1/2 left-4 lg:left-8 transform -translate-y-1/2 z-0">
        <Image
          src="/sungif.gif"
          alt="Sun"
          width={40}
          height={40}
          className="lg:w-12 lg:h-12"
        />
      </div>
      <div className="hidden md:block absolute top-1/2 right-4 lg:right-8 transform -translate-y-1/2 z-0">
        <Image
          src="/sungif.gif"
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
          <h1 className="text-blue-800 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold font-dm-serif">
            IN THE NEWS
          </h1>
        </div>
      )}

      {/* News Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <>
            {[...Array(6)].map((_, idx) => (
              <BlogCardShimmer key={idx} />
            ))}
          </>
        ) : posts.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-500 text-lg">
              <p>No news articles available at the moment.</p>
              <p className="text-sm mt-2">Check back later for updates!</p>
            </div>
          </div>
        ) : (
          <>
            {currentBlogs.map((news: Blog, idx: number) => (
              <div
                key={news._id || idx}
                className="bg-white rounded-xl overflow-hidden shadow-md transition-shadow duration-300 hover:shadow-xl"
              >
                <div className="p-3 sm:p-4">
                  <div className="relative w-full h-48 sm:h-56 lg:h-64 mb-3 sm:mb-4 overflow-hidden rounded-lg">
                    {news.image_url ? (
                      <Image
                        src={getMediaUrl(news.image_url) || "/file.svg"}
                        alt={news.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 hover:scale-105"
                        onError={(e) => {
                          console.log("Image failed to load:", news.image_url);
                          // Fallback to placeholder if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.src = "/file.svg";
                        }}
                      />
                    ) : (
                      <Image
                        src="/file.svg"
                        alt="No image available"
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 hover:scale-105 opacity-50"
                      />
                    )}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mt-3 sm:mt-4 mb-1 line-clamp-2 font-dm-serif">
                    {news.title}
                  </h3>
                  <div className="flex justify-between items-center mt-4 sm:mt-6">
                    <p className="text-gray-500 text-xs sm:text-sm font-bilo">
                      {news.publishedDate
                        ? new Date(news.publishedDate).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            }
                          )
                        : "No date"}
                    </p>
                    {news.link ? (
                      <button
                        onClick={() => handleLinkClick(news.link!, news.title)}
                        className="text-[#D96D34] font-semibold hover:underline text-sm sm:text-base transition-colors font-bilo"
                      >
                        Read More
                      </button>
                    ) : (
                      <span className="text-gray-400 text-sm sm:text-base cursor-not-allowed font-bilo">
                        No Link
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && posts.length > 0 && totalPages > 1 && (
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

      {/* More Decorative Sun Icons */}
      <div className="relative mt-8 sm:mt-12 lg:mt-16">
        <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 lg:bottom-8 lg:left-8 z-0">
          <Image
            src="/sungif.gif"
            alt="Sun"
            width={30}
            height={30}
            className="sm:w-10 sm:h-10 lg:w-12 lg:h-12"
          />
        </div>
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8 z-0">
          <Image
            src="/sungif.gif"
            alt="Sun"
            width={30}
            height={30}
            className="sm:w-10 sm:h-10 lg:w-12 lg:h-12"
          />
        </div>
        <div className="flex justify-center pt-6 sm:pt-8 lg:pt-10 relative z-10">
          <Image
            src="/sungif.gif"
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
