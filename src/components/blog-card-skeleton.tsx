"use client";

export function BlogCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md animate-pulse">
      <div className="p-4">
        {/* Image Placeholder */}
        <div className="relative h-56 w-full bg-gray-200 rounded-t-xl"></div>
        {/* Title Placeholder */}
        <div className="h-6 bg-gray-200 rounded w-3/4 mt-4 mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
        {/* Date and Read More Placeholder */}
        <div className="flex justify-between items-center mt-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/6"></div>
        </div>
      </div>
    </div>
  )
}
